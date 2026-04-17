'use server'

import { revalidatePath } from 'next/cache'
import { isMockDataSource } from '@/lib/mock/data-source'
import {
  getCurrentMockUserPreferences,
  setMockUserPreferences,
} from '@/lib/mock/mock-user-preferences-server'
import { createClient } from '@/lib/supabase/server'
import { isRecord } from '@/lib/type-guards'

export type NotificationState = {
  error?: string
  success?: string
}

export async function updateNotifications(
  _prevState: NotificationState,
  formData: FormData,
): Promise<NotificationState> {
  if (isMockDataSource) {
    const preferences = await getCurrentMockUserPreferences()
    if (!preferences) return { error: 'Not authenticated' }

    await setMockUserPreferences({
      ...preferences,
      notificationPreferences: {
        ...preferences.notificationPreferences,
        project_updates: formData.get('project_updates') === 'on',
        product_updates: formData.get('product_updates') === 'on',
        leaderboard: formData.get('leaderboard') === 'on',
        marketing: formData.get('marketing') === 'on',
        email: formData.get('notify_email') === 'on',
        push: formData.get('notify_push') === 'on',
        monthly_report: formData.get('notify_monthly') === 'on',
      },
    })

    revalidatePath('/dashboard/settings/notifications')
    return { success: 'Préférences mises à jour' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Fetch current preferences first to merge
  const { data: profile } = await supabase
    .from('profiles')
    .select('notification_preferences')
    .eq('id', user.id)
    .single()

  const currentPrefs = isRecord(profile?.notification_preferences)
    ? profile.notification_preferences
    : {}

  const newPrefs = {
    ...currentPrefs,
    // Topics
    project_updates: formData.get('project_updates') === 'on',
    product_updates: formData.get('product_updates') === 'on',
    leaderboard: formData.get('leaderboard') === 'on',
    marketing: formData.get('marketing') === 'on',
    // Channels
    email: formData.get('notify_email') === 'on',
    push: formData.get('notify_push') === 'on',
    monthly_report: formData.get('notify_monthly') === 'on',
  }

  const { error } = await supabase
    .from('profiles')
    .update({ notification_preferences: newPrefs })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings/notifications')
  return { success: 'Préférences mises à jour' }
}
