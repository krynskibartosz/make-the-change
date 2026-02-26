import type { ContributorScope, FeedScope, FeedSort } from '@make-the-change/core/shared'
import { getTranslations } from 'next-intl/server'
import { Feed } from '@/components/social/feed'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { CommunityFeedControls } from './_features/community-feed-controls'
import { CommunityLeaderboardCard } from './_features/community-leaderboard-card'
import { CommunityLeftSidebar } from './_features/community-left-sidebar'

const FEED_SORT_VALUES: FeedSort[] = ['best', 'newest', 'oldest']
const FEED_SCOPE_VALUES: FeedScope[] = ['all', 'my_guilds']
const CONTRIBUTOR_SCOPE_VALUES: ContributorScope[] = ['all', 'citizens', 'companies']

type CommunityPageProps = {
  searchParams: Promise<{
    sort?: string
    scope?: string
    contributors?: string
  }>
}

const parseFeedSort = (value: string | undefined): FeedSort =>
  FEED_SORT_VALUES.includes(value as FeedSort) ? (value as FeedSort) : 'newest'

const parseFeedScope = (value: string | undefined): FeedScope =>
  FEED_SCOPE_VALUES.includes(value as FeedScope) ? (value as FeedScope) : 'all'

const parseContributorScope = (value: string | undefined): ContributorScope =>
  CONTRIBUTOR_SCOPE_VALUES.includes(value as ContributorScope) ? (value as ContributorScope) : 'all'

export async function generateMetadata() {
  const t = await getTranslations('navigation')
  return {
    title: `${t('community')} | Make the Change`,
  }
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const t = await getTranslations('navigation')
  const tCommunity = await getTranslations('community')

  const params = await searchParams
  const sort = parseFeedSort(params.sort)
  const scope = parseFeedScope(params.scope)
  const contributorScope = parseContributorScope(params.contributors)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile: {
    avatar_url: string | null
    first_name: string | null
    last_name: string | null
  } | null = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url, first_name, last_name')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const sidebarUser = user
    ? {
        id: user.id,
        email: user.email || '',
        avatarUrl: profile?.avatar_url || null,
        displayName:
          [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user.email || '',
      }
    : null

  return (
    <div className="relative bg-background">
      <div className="mx-auto flex w-full max-w-[1260px] justify-center">
        <div className="hidden w-[88px] shrink-0 sm:block xl:w-[275px]">
          <header className="sticky top-0 flex h-screen flex-col justify-between overflow-y-auto">
            <CommunityLeftSidebar user={sidebarUser} />
          </header>
        </div>

        <main className="flex min-h-screen w-full max-w-[600px] shrink-0 flex-col border-x border-border">
          <div className="sticky top-0 z-20 space-y-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md">
            <h1 className="text-xl font-bold">{t('community')}</h1>
            <CommunityFeedControls sort={sort} scope={scope} showScope={!!user} />
          </div>

          <div className="relative z-0 w-full">
            <Feed sort={sort} scope={scope} />
          </div>
        </main>

        <div className="hidden w-[350px] shrink-0 lg:block">
          <aside className="sticky top-0 h-screen overflow-y-auto px-6 py-4">
            <div className="mb-4 rounded-full border border-border/70 bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
              <Link href="/community/hashtags" className="hover:text-foreground">
                {tCommunity('feed_controls.open_hashtags')}
              </Link>
            </div>
            <CommunityLeaderboardCard
              contributorScope={contributorScope}
              basePath="/community"
              extraQuery={{ sort, scope }}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
