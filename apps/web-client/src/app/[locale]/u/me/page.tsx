
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function MyPublicProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Redirect to the canonical public profile page
  redirect(`/profile/${user.id}`)
}
