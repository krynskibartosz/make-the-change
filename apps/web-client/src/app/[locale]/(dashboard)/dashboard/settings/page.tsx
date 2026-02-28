import { defaultLocale, isLocale, type Locale } from '@make-the-change/core/i18n'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { parseThemeConfig } from '@/lib/theme-config'
import { asBoolean, asString, isRecord } from '@/lib/type-guards'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'language_code, timezone, metadata, notification_preferences, social_links, theme_config',
    )
    .eq('id', user.id)
    .single()

  const metadata = isRecord(profile?.metadata) ? profile.metadata : {}
  const publicProfile = asBoolean(metadata.is_public_profile, false)
  const notificationPrefs = isRecord(profile?.notification_preferences)
    ? profile.notification_preferences
    : {}
  const socialLinks = isRecord(profile?.social_links) ? profile.social_links : {}
  const requestedLanguage = profile?.language_code || defaultLocale
  const languageCode: Locale = isLocale(requestedLanguage) ? requestedLanguage : defaultLocale

  // Fetch marketing consent
  let marketingConsent = false

  try {
    const adminSupabase = createAdminClient()
    const { data: consents } = await adminSupabase
      .schema('identity')
      .from('user_consents')
      .select('granted')
      .eq('user_id', user.id)
      .eq('consent_type', 'marketing')
      .order('decision_at', { ascending: false })
      .limit(1)

    marketingConsent = consents?.[0]?.granted ?? false
  } catch (error) {
    console.error('Failed to fetch marketing consent', error)
  }

  return (
    <SettingsClient
      initial={{
        languageCode,
        timezone: profile?.timezone || 'Europe/Paris',
        publicProfile,
        marketingConsent,
        notificationPrefs: {
          email: asBoolean(notificationPrefs.email, true),
          push: asBoolean(notificationPrefs.push, false),
          monthly_report: asBoolean(notificationPrefs.monthly_report, true),
        },
        socialLinks: {
          linkedin: asString(socialLinks.linkedin),
          instagram: asString(socialLinks.instagram),
          twitter: asString(socialLinks.twitter),
        },
        themeConfig: parseThemeConfig(profile?.theme_config),
      }}
    />
  )
}
