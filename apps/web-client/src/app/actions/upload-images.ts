'use server'

import { z } from 'zod'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'

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
  if (!allowedTypes.has(file.type)) return 'Type de fichier non supporte'
  if (file.size > maxSize) return 'Fichier trop volumineux (max 10MB)'
  return null
}

function buildPath(entityId: string, folder: string | undefined, fileName: string) {
  const cleanName = fileName.replaceAll(/[^\d.A-Za-z-]/g, '_').toLowerCase()
  const safeFileName = `${Date.now()}-${cleanName}`
  return folder ? `${entityId}/${folder}/${safeFileName}` : `${entityId}/${safeFileName}`
}

async function requireUser() {
  if (isMockDataSource) {
    const session = await getMockViewerSession()

    if (!session) {
      throw new Error('Unauthorized')
    }

    return {
      user: {
        id: session.viewerId,
      },
      supabase: null,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized')
  }

  return { user, supabase }
}

function buildMockUrl(entityId: string, folder: string | undefined, fileName: string) {
  const seed = `${entityId}-${folder || 'asset'}-${fileName}`.replace(/[^a-zA-Z0-9-]/g, '-')

  if (folder === 'avatar') {
    return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(seed)}`
  }

  return `https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80&sig=${encodeURIComponent(
    seed,
  )}`
}

export async function uploadImages(formData: FormData): Promise<UploadResult> {
  try {
    const { supabase } = await requireUser()

    const bucket = String(formData.get('bucket') || '')
    const entityId = String(formData.get('entityId') || '')
    const folderValue = formData.get('folder')
    const folder =
      typeof folderValue === 'string' && folderValue.length > 0 ? folderValue : undefined

    const parsed = uploadSchema.safeParse({ bucket, entityId, folder })
    if (!parsed.success) {
      return { success: false, error: 'Parametres invalides' }
    }

    const files = formData.getAll('files').filter((f): f is File => f instanceof File)
    if (files.length === 0) {
      return { success: false, error: 'Aucun fichier recu' }
    }

    for (const file of files) {
      const error = validateFile(file)
      if (error) return { success: false, error }
    }

    if (isMockDataSource || !supabase) {
      return {
        success: true,
        urls: files.map((file) => buildMockUrl(parsed.data.entityId, parsed.data.folder, file.name)),
        paths: files.map((file) => buildPath(parsed.data.entityId, parsed.data.folder, file.name)),
      }
    }

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
      throw error
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Upload failed' }
  }
}

export async function deleteImage(input: { bucket: string; filePath: string }) {
  try {
    const { supabase } = await requireUser()

    const parsed = deleteSchema.safeParse(input)
    if (!parsed.success) {
      return { success: false, error: 'Parametres invalides' }
    }

    if (isMockDataSource || !supabase) {
      return { success: true }
    }

    const { error } = await supabase.storage.from(parsed.data.bucket).remove([parsed.data.filePath])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Delete failed' }
  }
}
