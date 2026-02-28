
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const normalizeProfileHandle = (value: string) =>
  value.trim().replace(/^@+/, '').toLowerCase()

export default async function PublicProfilePageRedirect({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const normalizedUsername = normalizeProfileHandle(username)

  if (!normalizedUsername) {
    notFound()
  }

  if (UUID_REGEX.test(normalizedUsername)) {
    redirect(`/profile/${normalizedUsername}`)
  }

  const supabase = await createClient()
  const { data: candidates } = await supabase
    .from('public_user_profiles')
    .select('id, display_name')
    .limit(100)

  const matches = (Array.isArray(candidates) ? candidates : [])
    .map((candidate) => {
      if (!isRecord(candidate)) {
        return null
      }

      const id = asString(candidate.id)
      const displayName = asString(candidate.display_name)

      if (!id || !displayName) {
        return null
      }

      return {
        id,
        normalizedDisplayName: normalizeProfileHandle(displayName),
      }
    })
    .filter(
      (candidate): candidate is { id: string; normalizedDisplayName: string } => candidate !== null,
    )
    .filter((candidate) => candidate.normalizedDisplayName === normalizedUsername)

  const matchedProfile = matches[0]

  if (matches.length === 1 && matchedProfile) {
    redirect(`/profile/${matchedProfile.id}`)
  }

  notFound()
}
