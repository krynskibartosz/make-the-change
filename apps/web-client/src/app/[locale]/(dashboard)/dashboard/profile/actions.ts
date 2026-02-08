'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { profileSchema, passwordSchema, type ProfileFormValues, type PasswordFormValues } from './schemas'

export type ProfileState = {
  error?: string
  success?: string
}

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024

export async function updateProfile(
  data: ProfileFormValues,
): Promise<ProfileState> {
  const result = profileSchema.safeParse(data)
  
  if (!result.success) {
    return { error: 'Données invalides: ' + result.error.errors.map(e => e.message).join(', ') }
  }

  const { firstName, lastName, phone, address, city, postalCode, country, bio } = result.data

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const db = await import('@make-the-change/core/db').then((m) => m.db)
  const { profiles } = await import('@make-the-change/core/schema')
  const { eq } = await import('drizzle-orm')

  try {
    await db
      .update(profiles)
      .set({
        first_name: firstName,
        last_name: lastName,
        phone,
        address_street: address,
        address_city: city,
        address_postal_code: postalCode,
        address_country_code: country,
        bio,
        updated_at: new Date(),
      })
      .where(eq(profiles.id, user.id))

    revalidatePath('/dashboard/profile')
    return { success: 'Profil mis à jour avec succès' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update profile' }
  }
}

export async function updateProfileMedia(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const avatarFile = formData.get('avatar') as File | null
  const coverFile = formData.get('cover') as File | null

  if (
    (avatarFile && avatarFile.size > MAX_UPLOAD_SIZE) ||
    (coverFile && coverFile.size > MAX_UPLOAD_SIZE)
  ) {
    return { error: 'Image trop lourde (max 2MB)' }
  }

  const uploaded: Record<string, string> = {}

  const uploadFile = async (file: File, type: 'avatar' | 'cover') => {
    const fileExt = file.name.split('.').pop() || 'jpg'
    const filePath = `${user.id}/${type}-${Date.now()}.${fileExt}`
    const { error } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, { upsert: true, contentType: file.type })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage.from('profiles').getPublicUrl(filePath)
    return data.publicUrl
  }

  try {
    if (avatarFile && avatarFile.size > 0) {
      uploaded.avatar_url = await uploadFile(avatarFile, 'avatar')
    }

    if (coverFile && coverFile.size > 0) {
      uploaded.cover_url = await uploadFile(coverFile, 'cover')
    }

    if (Object.keys(uploaded).length === 0) {
      return { error: 'Aucune image a televerser' }
    }

    const db = await import('@make-the-change/core/db').then((m) => m.db)
    const { profiles } = await import('@make-the-change/core/schema')
    const { eq } = await import('drizzle-orm')

    const currentProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    })

    const currentMetadata = (currentProfile?.metadata || {}) as Record<string, unknown>

    await db
      .update(profiles)
      .set({
        metadata: {
          ...currentMetadata,
          ...uploaded,
        },
        updated_at: new Date(),
      })
      .where(eq(profiles.id, user.id))

    revalidatePath('/dashboard/profile')
    return { success: 'Profil visuel mis a jour' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Echec du televersement' }
  }
}

export async function updateProfileImages(
  images: { avatarUrl?: string; coverUrl?: string }
): Promise<ProfileState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  try {
    const db = await import('@make-the-change/core/db').then((m) => m.db)
    const { profiles } = await import('@make-the-change/core/schema')
    const { eq } = await import('drizzle-orm')

    const currentProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, user.id),
    })

    const currentMetadata = (currentProfile?.metadata || {}) as Record<string, unknown>
    const newMetadata = { ...currentMetadata }

    if (images.avatarUrl) newMetadata.avatar_url = images.avatarUrl
    if (images.coverUrl) newMetadata.cover_url = images.coverUrl

    await db
      .update(profiles)
      .set({
        metadata: newMetadata,
        updated_at: new Date(),
      })
      .where(eq(profiles.id, user.id))

    revalidatePath('/dashboard/profile')
    return { success: 'Image mise à jour' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Echec de la mise à jour' }
  }
}

export async function updatePassword(
  data: PasswordFormValues
): Promise<ProfileState> {
  const result = passwordSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const { newPassword } = result.data

  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Mot de passe mis à jour avec succès' }
}
