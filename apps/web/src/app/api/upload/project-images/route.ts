import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { requireAdminOrResponse } from '@/app/api/admin/_utils'

// Configuration avec service role pour l'upload côté serveur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key') // Fallback for build

export async function POST(request: NextRequest) {
  try {
    const authResponse = await requireAdminOrResponse()
    if (authResponse) return authResponse

    const formData = await request.formData()

    // Support pour upload single ou multiple
    const singleFile = formData.get('file') as File
    const multipleFiles = formData.getAll('files') as File[]
    const projectId = formData.get('projectId') as string

    if (!singleFile && (!multipleFiles || multipleFiles.length === 0)) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 })
    }

    // Déterminer si c'est un upload single ou multiple
    const files = singleFile ? [singleFile] : multipleFiles

    if (files.length === 0 || !projectId) {
      return NextResponse.json({ error: 'File(s) and projectId are required' }, { status: 400 })
    }

    // Validation des fichiers
    const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
      if (!allowedTypes.has(file.type)) {
        return NextResponse.json(
          { error: `Type de fichier non supporté: ${file.name}` },
          { status: 400 },
        )
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `Fichier trop volumineux: ${file.name} (max 10MB)` },
          { status: 400 },
        )
      }
    }

    // Récupérer les images actuelles du projet
    const { data: project, error: fetchError } = await supabaseAdmin
      .schema('investment')
      .from('projects')
      .select('gallery_image_urls')
      .eq('id', projectId)
      .single()

    if (fetchError) {
      console.error('Erreur récupération projet:', fetchError)
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }

    const currentImages = project.gallery_image_urls || []
    const newImageUrls: string[] = []
    const uploadedPaths: string[] = []

    // Upload de tous les fichiers
    try {
      for (const file of files) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}-${file.name.replaceAll(/[^\d.A-Za-z-]/g, '_')}`
        const filePath = `${projectId}/gallery/${fileName}`

        const { error } = await supabaseAdmin.storage.from('projects').upload(filePath, file, {
          cacheControl: '31536000', // 1 an
          upsert: true,
        })

        if (error) {
          console.error('Supabase upload error:', error)
          throw new Error(`Échec de l'upload pour ${file.name}`)
        }

        // Générer l'URL publique
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('projects')
          .getPublicUrl(filePath)

        const imageUrl = publicUrlData.publicUrl
        newImageUrls.push(imageUrl)
        uploadedPaths.push(filePath)
      }

      // Ajouter les nouvelles images à la liste
      const updatedImages = [...currentImages, ...newImageUrls]

      // Mettre à jour le projet avec les nouvelles images
      const { error: updateError } = await supabaseAdmin
        .schema('investment')
        .from('projects')
        .update({ gallery_image_urls: updatedImages })
        .eq('id', projectId)
        .select('gallery_image_urls')
        .single()

      if (updateError) {
        console.error('Erreur mise à jour projet:', updateError)
        // Si on ne peut pas mettre à jour la DB, on supprime les fichiers uploadés
        await supabaseAdmin.storage.from('projects').remove(uploadedPaths)
        return NextResponse.json({ error: 'Échec de la mise à jour du projet' }, { status: 500 })
      }

      // Revalidate paths
      revalidatePath('/admin/projects')
      revalidatePath(`/admin/projects/${projectId}`)

      return NextResponse.json({
        success: true,
        url: newImageUrls[0],
        urls: newImageUrls,
        images: updatedImages,
        count: files.length,
      })
    } catch (uploadError) {
      // Nettoyer les fichiers partiellement uploadés
      if (uploadedPaths.length > 0) {
        await supabaseAdmin.storage.from('projects').remove(uploadedPaths)
      }
      throw uploadError
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erreur interne du serveur',
      },
      { status: 500 },
    )
  }
}
