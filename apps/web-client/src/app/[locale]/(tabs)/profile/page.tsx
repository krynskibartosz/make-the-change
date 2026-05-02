import type { Metadata } from 'next'
import { getCurrentProfile } from '@/lib/mock/mock-session-server'
import AuthenticatedProfile from './_features/authenticated-profile'
import GuestProfile from './_features/guest-profile'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Profil | Make the Change' }
}

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  if (profile) {
    return <AuthenticatedProfile profile={profile} />
  }

  return <GuestProfile />
}
