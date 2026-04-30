import { getCurrentProfile } from '@/lib/mock/mock-session-server'
import AuthenticatedProfile from './_features/authenticated-profile'
import GuestProfile from './_features/guest-profile'

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  if (profile) {
    return <AuthenticatedProfile profile={profile} />
  }

  return <GuestProfile />
}
