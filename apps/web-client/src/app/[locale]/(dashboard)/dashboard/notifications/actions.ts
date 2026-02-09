'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type NotificationState = {
  error?: string
  success?: string
}

export async function updateNotifications(
  _prevState: NotificationState,
  formData: FormData,
): Promise<NotificationState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const prefs = {
    project_updates: formData.get('project_updates') === 'on',
    product_updates: formData.get('product_updates') === 'on',
    leaderboard: formData.get('leaderboard') === 'on',
    marketing: formData.get('marketing') === 'on',
  }

  const { error } = await (supabase
    .from('profiles') as any)
    .update({ notification_preferences: prefs })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/notifications')
  return { success: 'Préférences mises à jour' }
}
