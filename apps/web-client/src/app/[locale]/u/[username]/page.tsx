
import { redirect } from 'next/navigation'

export default async function PublicProfilePageRedirect({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  // Redirect to the canonical public profile page
  redirect(`/profile/${username}`)
}
