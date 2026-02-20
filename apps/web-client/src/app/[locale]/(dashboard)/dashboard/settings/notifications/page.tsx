import { createClient } from '@/lib/supabase/server'
import { asBoolean, isRecord } from '@/lib/type-guards'
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

  const prefs = isRecord(profile?.notification_preferences) ? profile.notification_preferences : {}

  return (
    <div className="w-full">
      <NotificationsClient
        initial={{
          // Topics
          project_updates: asBoolean(prefs.project_updates, false),
          product_updates: asBoolean(prefs.product_updates, false),
          leaderboard: asBoolean(prefs.leaderboard, false),
          marketing: asBoolean(prefs.marketing, false),
          // Channels
          email: asBoolean(prefs.email, true),
          push: asBoolean(prefs.push, false),
          monthly_report: asBoolean(prefs.monthly_report, true),
        }}
      />
    </div>
  )
}
