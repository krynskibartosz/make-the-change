'use server'

import { revalidatePath } from 'next/cache'
import { createDefaultMockProfileOverrides } from '@/lib/mock/mock-profile-overrides'
import {
  getMockProfileOverrides,
  setMockProfileOverrides,
} from '@/lib/mock/mock-profile-overrides-server'
import { isMockDataSource } from '@/lib/mock/data-source'
import {
  getMockViewerSession,
  setMockViewerSession,
} from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'
import { isRecord } from '@/lib/type-guards'
import {
  type PasswordFormValues,
  type ProfileFormValues,
  passwordSchema,
  profileSchema,
} from './schemas'

export type ProfileState = {
  error?: string
  success?: string
}

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024

const getFormDataFile = (formData: FormData, key: string): File | null => {
  const value = formData.get(key)
  return value instanceof File ? value : null
}

const revalidateMockProfileSurfaces = (viewerId: string) => {
  revalidatePath('/', 'layout')
  revalidatePath('/menu')
  revalidatePath('/aventure')
  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard/settings')
  revalidatePath(`/profile/${viewerId}`)
}

const buildMockImageUrl = (
  viewerId: string,
  type: 'avatar' | 'cover',
  fileName: string,
) => {
  const sanitizedSeed = `${viewerId}-${type}-${fileName}`.replace(/[^a-zA-Z0-9-]/g, '-')

  if (type === 'avatar') {
    return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(sanitizedSeed)}`
  }

  return `https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80&sig=${encodeURIComponent(
    sanitizedSeed,
  )}`
}

export async function updateProfile(data: ProfileFormValues): Promise<ProfileState> {
  const result = profileSchema.safeParse(data)

  if (!result.success) {
    return { error: 'Donnees invalides: ' + result.error.errors.map((e) => e.message).join(', ') }
  }

  const firstName = result.data.firstName
  const lastName = result.data.lastName
  const phone = result.data.phone ?? ''
  const address = result.data.address ?? ''
  const city = result.data.city ?? ''
  const postalCode = result.data.postalCode ?? ''
  const country = result.data.country ?? ''
  const bio = result.data.bio ?? ''

  if (isMockDataSource) {
    const session = await getMockViewerSession()
    if (!session) {
      return { error: 'Not authenticated' }
    }

    const currentOverrides =
      (await getMockProfileOverrides(session.viewerId)) ??
      createDefaultMockProfileOverrides(session.viewerId)

    const nextDisplayName =
      [firstName, lastName].filter(Boolean).join(' ').trim() || session.displayName

    await setMockViewerSession({
      ...session,
      displayName: nextDisplayName,
    })

    await setMockProfileOverrides({
      ...currentOverrides,
      firstName,
      lastName,
      phone,
      bio,
      addressStreet: address,
      addressCity: city,
      addressPostalCode: postalCode,
      addressCountry: country,
    })

    revalidateMockProfileSurfaces(session.viewerId)
    return { success: 'Profil mis a jour avec succes' }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: firstName,
      last_name: lastName,
      phone,
      address_street: address,
      address_city: city,
      address_postal_code: postalCode,
      address_country_code: country,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  try {
    revalidatePath('/dashboard/profile')
    return { success: 'Profil mis a jour avec succes' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update profile' }
  }
}

export async function updateProfileMedia(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  if (isMockDataSource) {
    const session = await getMockViewerSession()
    if (!session) {
      return { error: 'Not authenticated' }
    }

    const avatarFile = getFormDataFile(formData, 'avatar')
    const coverFile = getFormDataFile(formData, 'cover')

    if (
      (avatarFile && avatarFile.size > MAX_UPLOAD_SIZE) ||
      (coverFile && coverFile.size > MAX_UPLOAD_SIZE)
    ) {
      return { error: 'Image trop lourde (max 2MB)' }
    }

    const nextImages: { avatarUrl?: string; coverUrl?: string } = {}

    if (avatarFile && avatarFile.size > 0) {
      nextImages.avatarUrl = buildMockImageUrl(session.viewerId, 'avatar', avatarFile.name)
    }

    if (coverFile && coverFile.size > 0) {
      nextImages.coverUrl = buildMockImageUrl(session.viewerId, 'cover', coverFile.name)
    }

    if (!nextImages.avatarUrl && !nextImages.coverUrl) {
      return { error: 'Aucune image a televerser' }
    }

    return updateProfileImages(nextImages)
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const avatarFile = getFormDataFile(formData, 'avatar')
  const coverFile = getFormDataFile(formData, 'cover')

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

    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const currentMetadata = isRecord(currentProfile?.metadata) ? currentProfile.metadata : {}

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        metadata: {
          ...currentMetadata,
          ...uploaded,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) throw new Error(updateError.message)

    revalidatePath('/dashboard/profile')
    return { success: 'Profil visuel mis a jour' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Echec du televersement' }
  }
}

export async function updateProfileImages(images: {
  avatarUrl?: string
  coverUrl?: string
}): Promise<ProfileState> {
  if (isMockDataSource) {
    const session = await getMockViewerSession()
    if (!session) {
      return { error: 'Not authenticated' }
    }

    const currentOverrides =
      (await getMockProfileOverrides(session.viewerId)) ??
      createDefaultMockProfileOverrides(session.viewerId)

    await setMockViewerSession({
      ...session,
      avatarUrl: images.avatarUrl || session.avatarUrl || null,
    })

    await setMockProfileOverrides({
      ...currentOverrides,
      avatarUrl: images.avatarUrl || currentOverrides.avatarUrl,
      coverUrl: images.coverUrl || currentOverrides.coverUrl,
    })

    revalidateMockProfileSurfaces(session.viewerId)
    return { success: 'Image mise a jour' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  try {
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('metadata')
      .eq('id', user.id)
      .single()

    const currentMetadata = isRecord(currentProfile?.metadata) ? currentProfile.metadata : {}
    const newMetadata = { ...currentMetadata }

    if (images.avatarUrl) newMetadata.avatar_url = images.avatarUrl
    if (images.coverUrl) newMetadata.cover_url = images.coverUrl

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        metadata: newMetadata,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) throw new Error(updateError.message)

    revalidatePath('/dashboard/profile')
    return { success: 'Image mise a jour' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Echec de la mise a jour' }
  }
}

export async function updatePassword(data: PasswordFormValues): Promise<ProfileState> {
  const result = passwordSchema.safeParse(data)

  if (!result.success) {
    return { error: result.error.errors[0]?.message ?? 'Donnees invalides' }
  }

  if (isMockDataSource) {
    return { success: 'Mot de passe mis a jour avec succes' }
  }

  const { newPassword } = result.data

  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Mot de passe mis a jour avec succes' }
}
