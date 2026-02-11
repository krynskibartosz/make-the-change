import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('language_code, timezone, metadata, notification_preferences, social_links, theme_config')
    .eq('id', user.id)
    .single()

  const metadata = (profile?.metadata || {}) as Record<string, unknown>
  const publicProfile = Boolean(metadata.is_public_profile)
  const notificationPrefs = (profile?.notification_preferences || {}) as Record<string, boolean>
  const socialLinks = (profile?.social_links || {}) as Record<string, string>

  // Fetch marketing consent
  const adminSupabase = createAdminClient()
  const { data: consents } = await adminSupabase
    .schema('identity')
    .from('user_consents')
    .select('granted')
    .eq('user_id', user.id)
    .eq('consent_type', 'marketing')
    .order('decision_at', { ascending: false })
    .limit(1)

  const marketingConsent = consents?.[0]?.granted ?? false

  return (
    <SettingsClient
      initial={{
        languageCode: profile?.language_code || 'fr',
        timezone: profile?.timezone || 'Europe/Paris',
        publicProfile,
        marketingConsent,
        notificationPrefs: {
          email: notificationPrefs.email ?? true,
          push: notificationPrefs.push ?? false,
          monthly_report: notificationPrefs.monthly_report ?? true
        },
        socialLinks: {
          linkedin: socialLinks.linkedin || '',
          instagram: socialLinks.instagram || '',
          twitter: socialLinks.twitter || ''
        },
        themeConfig: profile?.theme_config || null
      }}
    />
  )
}
