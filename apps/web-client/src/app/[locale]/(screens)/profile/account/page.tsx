import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentProfile, getCurrentViewer } from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'
import { AccountClient } from './_features/account-client'

export default async function AccountPage() {
  if (isMockDataSource) {
    const [viewer, profile] = await Promise.all([getCurrentViewer(), getCurrentProfile()])

    if (!viewer || !profile) return null

    return (
      <AccountClient
        firstName={profile.firstName ?? ''}
        lastName={profile.lastName ?? ''}
        username={profile.username ?? ''}
        email={viewer.email ?? ''}
      />
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, username')
    .eq('id', user.id)
    .single()

  return (
    <AccountClient
      firstName={profile?.first_name ?? ''}
      lastName={profile?.last_name ?? ''}
      username={profile?.username ?? ''}
      email={user.email ?? ''}
    />
  )
}
