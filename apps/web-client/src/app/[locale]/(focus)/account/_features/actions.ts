'use server'

import { revalidatePath } from 'next/cache'
import { isMockDataSource } from '@/lib/mock/data-source'
import { createDefaultMockProfileOverrides } from '@/lib/mock/mock-profile-overrides'
import { getMockProfileOverrides, setMockProfileOverrides } from '@/lib/mock/mock-profile-overrides-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'

export type AccountState = {
  error?: string
  success?: string
}

export async function updateAccount(formData: FormData): Promise<AccountState> {
  const firstName = String(formData.get('firstName') ?? '').trim()
  const lastName = String(formData.get('lastName') ?? '').trim()

  if (isMockDataSource) {
    const session = await getMockViewerSession()
    if (!session) return { error: 'Non authentifié' }

    const existing =
      (await getMockProfileOverrides(session.viewerId)) ??
      createDefaultMockProfileOverrides(session.viewerId)

    await setMockProfileOverrides({
      ...existing,
      firstName,
      lastName,
    })

    revalidatePath('/account')
    revalidatePath('/dashboard/settings')
    return { success: 'Profil mis à jour' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Non authentifié' }

  const { error } = await supabase
    .from('profiles')
    .update({ first_name: firstName, last_name: lastName })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/account')
  revalidatePath('/dashboard/settings')
  return { success: 'Profil mis à jour' }
}
