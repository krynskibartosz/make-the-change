import { getMenu } from '@/app/[locale]/admin/cms/_features/cms.service'
import { isMockDataSource } from '@/lib/mock/data-source'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { createClient } from '@/lib/supabase/server'
import { asString, isRecord } from '@/lib/type-guards'

export type HeaderUser = {
  id: string
  email: string
  avatarUrl: string | null
} | null

export type HeaderData = {
  user: HeaderUser
  menuData: Awaited<ReturnType<typeof getMenu>>
}

/**
 * Fetches all data needed by the Header component.
 * Centralised to avoid duplicating this logic across 4+ layouts.
 */
export async function getHeaderData(locale?: string): Promise<HeaderData> {
  if (isMockDataSource) {
    const viewer = await getCurrentViewer()
    const menuData = await getMenu('main-header', locale)

    return {
      user: viewer
        ? {
            id: viewer.viewerId,
            email: viewer.email,
            avatarUrl: viewer.avatarUrl,
          }
        : null,
      menuData,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [menuData, profileData] = await Promise.all([
    getMenu('main-header', locale),
    user
      ? supabase.from('profiles').select('avatar_url, metadata').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
  ])

  const headerProfile = profileData.data

  const headerMetadata = isRecord(headerProfile?.metadata) ? headerProfile.metadata : null
  const metadataAvatarUrl = headerMetadata ? asString(headerMetadata.avatar_url) : ''
  const headerAvatarUrl =
    metadataAvatarUrl.length > 0
      ? metadataAvatarUrl
      : typeof headerProfile?.avatar_url === 'string'
        ? headerProfile.avatar_url
        : null

  return {
    user: user ? { id: user.id, email: user.email || '', avatarUrl: headerAvatarUrl } : null,
    menuData,
  }
}
