
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProjectUpdate(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Authentification
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Non authentifié')
  }

  // 2. Extraction des données
  const file = formData.get('image') as File
  const content = formData.get('content') as string
  const updateType = formData.get('type') as string
  const projectId = formData.get('projectId') as string
  const title = formData.get('title') as string || 'Nouvelle update'

  if (!content || !updateType || !projectId) {
    throw new Error('Champs manquants')
  }

  let publicUrl: string | null = null

  // 3. Upload Image (Supabase Storage) - Optionnel
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    // Convert File to ArrayBuffer for Supabase Upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('project-updates')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Erreur upload: ${uploadError.message}`)
    }

    // 4. Get Public URL
    const { data } = supabase.storage
      .from('project-updates')
      .getPublicUrl(fileName)
      
    publicUrl = data.publicUrl
  }

  // 5. Insert Project Update (DB)
  // Le trigger 'on_project_update_created' s'occupera de créer le post social
  const { error: dbError } = await supabase
    .from('project_updates')
    .insert({
      project_id: projectId,
      created_by: user.id,
      title: title,
      content: content,
      type: updateType,
      images: publicUrl ? [publicUrl] : [],
      published_at: new Date().toISOString(),
    })

  if (dbError) {
    throw new Error(`Erreur DB: ${dbError.message}`)
  }

  // 6. Revalidate & Redirect
  revalidatePath('/partner/studio')
  redirect('/partner/studio') // Utilisation de redirect hors du try/catch si possible, mais ici c'est une SA
}
