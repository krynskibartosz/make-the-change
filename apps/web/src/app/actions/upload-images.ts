'use server'

import { z } from 'zod'

import { requireAdmin } from '@/lib/auth-guards'
import { createAdminClient } from '@/lib/supabase/server'

const bucketSchema = z.enum(['projects', 'products', 'producers', 'users', 'categories'])

const uploadSchema = z.object({
  bucket: bucketSchema,
  entityId: z.string().min(1),
  folder: z.string().optional(),
})

const deleteSchema = z.object({
  bucket: bucketSchema,
  filePath: z.string().min(1),
})

const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const maxSize = 10 * 1024 * 1024

type UploadResult = {
  success: boolean
  urls?: string[]
  error?: string
  paths?: string[]
}

function validateFile(file: File): string | null {
  if (!allowedTypes.has(file.type)) return 'Type de fichier non supporté'
  if (file.size > maxSize) return 'Fichier trop volumineux (max 10MB)'
  return null
}

function buildPath(entityId: string, folder: string | undefined, fileName: string) {
  const cleanName = fileName.replaceAll(/[^\d.A-Za-z-]/g, '_').toLowerCase()
  const safeFileName = `${Date.now()}-${cleanName}`
  return folder ? `${entityId}/${folder}/${safeFileName}` : `${entityId}/${safeFileName}`
}

export async function uploadImages(formData: FormData): Promise<UploadResult> {
  await requireAdmin()
  const bucket = String(formData.get('bucket') || '')
  const entityId = String(formData.get('entityId') || '')
  const folderValue = formData.get('folder')
  const folder = typeof folderValue === 'string' && folderValue.length > 0 ? folderValue : undefined

  const parsed = uploadSchema.safeParse({ bucket, entityId, folder })
  if (!parsed.success) {
    return { success: false, error: 'Paramètres invalides' }
  }

  const files = formData.getAll('files').filter((f): f is File => f instanceof File)
  if (files.length === 0) {
    return { success: false, error: 'Aucun fichier reçu' }
  }

  for (const file of files) {
    const error = validateFile(file)
    if (error) return { success: false, error }
  }

  const supabase = await createAdminClient()
  const urls: string[] = []
  const paths: string[] = []

  try {
    for (const file of files) {
      const filePath = buildPath(parsed.data.entityId, parsed.data.folder, file.name)
      const { error } = await supabase.storage
        .from(parsed.data.bucket)
        .upload(filePath, file, { cacheControl: '31536000', upsert: true })

      if (error) throw new Error(error.message)

      const { data } = supabase.storage.from(parsed.data.bucket).getPublicUrl(filePath)
      urls.push(data.publicUrl)
      paths.push(filePath)
    }

    return { success: true, urls, paths }
  } catch (error) {
    if (paths.length > 0) {
      await supabase.storage.from(parsed.data.bucket).remove(paths)
    }
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed' }
  }
}

export async function deleteImage(input: { bucket: string; filePath: string }) {
  await requireAdmin()
  const parsed = deleteSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Paramètres invalides' }
  }

  const supabase = await createAdminClient()
  const { error } = await supabase.storage.from(parsed.data.bucket).remove([parsed.data.filePath])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
