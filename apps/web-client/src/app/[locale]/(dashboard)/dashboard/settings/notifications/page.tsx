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

  const prefs = (profile?.notification_preferences || {}) as Record<string, boolean>

  return (
    <div className="w-full">
      <NotificationsClient
        initial={{
          // Topics
          project_updates: prefs.project_updates ?? false,
          product_updates: prefs.product_updates ?? false,
          leaderboard: prefs.leaderboard ?? false,
          marketing: prefs.marketing ?? false,
          // Channels
          email: prefs.email ?? true,
          push: prefs.push ?? false,
          monthly_report: prefs.monthly_report ?? true,
        }}
      />
    </div>
  )
}
