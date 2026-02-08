import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { DashboardPageContainer } from '@/components/layout/dashboard-page-container'
import { SettingsClient } from './settings-client'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('language_code, timezone, metadata')
    .eq('id', user.id)
    .single()

  const metadata = (profile?.metadata || {}) as Record<string, unknown>
  const publicProfile = Boolean(metadata.is_public_profile)

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
    <DashboardPageContainer>
      <SettingsClient
        initial={{
          languageCode: profile?.language_code || 'fr',
          timezone: profile?.timezone || 'Europe/Paris',
          publicProfile,
          marketingConsent,
        }}
      />
    </DashboardPageContainer>
  )
}
