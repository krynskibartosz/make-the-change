import { createClient } from '@/lib/supabase/server'
import { NotificationsClient } from './notifications-client'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('notification_preferences')
    .eq('id', user.id)
    .single()

  const prefs = (profile?.notification_preferences || {}) as Record<string, unknown>

  return (
    <NotificationsClient
      initial={{
        project_updates: Boolean(prefs.project_updates),
        product_updates: Boolean(prefs.product_updates),
        leaderboard: Boolean(prefs.leaderboard),
        marketing: Boolean(prefs.marketing),
      }}
    />
  )
}
