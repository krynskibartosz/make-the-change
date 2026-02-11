'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type SettingsState = {
  error?: string
  success?: string
}

export async function updateSettings(
  _prevState: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const languageCode = (formData.get('languageCode') as string) || 'fr'
  const timezone = (formData.get('timezone') as string) || 'Europe/Paris'
  const publicProfile = formData.get('publicProfile') === 'on'

  // Social links
  const socialLinks = {
    linkedin: formData.get('social_linkedin') as string || '',
    instagram: formData.get('social_instagram') as string || '',
    twitter: formData.get('social_twitter') as string || '',
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('metadata')
    .eq('id', user.id)
    .single()

  const metadata = (currentProfile?.metadata || {}) as Record<string, unknown>
  const nextMetadata = {
    ...metadata,
    is_public_profile: publicProfile,
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      language_code: languageCode,
      timezone,
      metadata: nextMetadata,
      social_links: socialLinks,
      // Removed notification_preferences update from here as it is handled in a separate tab
    })
    .eq('id', user.id)

  if (error) return { error: error.message }

  // Update marketing consent
  const marketingConsent = formData.get('marketingConsent') === 'on'
  try {
    const adminSupabase = createAdminClient()
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || 'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await adminSupabase.schema('identity').from('user_consents').insert({
      user_id: user.id,
      consent_type: 'marketing',
      consent_version: '1.0',
      granted: marketingConsent,
      ip,
      user_agent: userAgent,
    })
  } catch (e) {
    console.error('Failed to update marketing consent', e)
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard/profile')

  return { success: 'Paramètres mis à jour' }
}
