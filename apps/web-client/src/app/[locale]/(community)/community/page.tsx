import type { ContributorScope, FeedScope, FeedSort } from '@make-the-change/core/shared'
import { Button } from '@make-the-change/core/ui'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Feed } from '@/components/social/feed'
import { Link } from '@/i18n/navigation'
import { sanitizeHashtagSlug } from '@/lib/social/hashtags'
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
    tag?: string
  }>
}

const parseFeedSort = (value: string | undefined): FeedSort =>
  FEED_SORT_VALUES.includes(value as FeedSort) ? (value as FeedSort) : 'newest'

const parseFeedScope = (value: string | undefined): FeedScope =>
  FEED_SCOPE_VALUES.includes(value as FeedScope) ? (value as FeedScope) : 'all'

const parseContributorScope = (value: string | undefined): ContributorScope =>
  CONTRIBUTOR_SCOPE_VALUES.includes(value as ContributorScope) ? (value as ContributorScope) : 'all'

const buildCommunityHref = ({
  sort,
  scope,
  contributors,
  tag,
}: {
  sort: FeedSort
  scope: FeedScope
  contributors: ContributorScope
  tag?: string
}) => {
  const params = new URLSearchParams()
  params.set('sort', sort)
  params.set('scope', scope)
  params.set('contributors', contributors)

  const normalizedTag = tag ? sanitizeHashtagSlug(tag) : ''
  if (normalizedTag) {
    params.set('tag', normalizedTag)
  }

  return `/community?${params.toString()}`
}

export async function generateMetadata(): Promise<Metadata> {
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
  const activeTag = sanitizeHashtagSlug(params.tag || '')

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
        <div className="hidden shrink-0 sm:block sm:w-[240px] lg:w-[275px]">
          <header className="sticky top-0 flex h-screen flex-col justify-between overflow-y-auto">
            <CommunityLeftSidebar user={sidebarUser} />
          </header>
        </div>

        <main className="flex min-h-screen w-full max-w-[600px] shrink-0 flex-col border-x border-border">
          <div className="sticky top-0 z-20 space-y-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md">
            <h1 className="text-xl font-bold">{t('community')}</h1>
            <CommunityFeedControls sort={sort} scope={scope} showScope={!!user} />
            <form
              method="get"
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2"
            >
              <input type="hidden" name="sort" value={sort} />
              <input type="hidden" name="scope" value={scope} />
              <input type="hidden" name="contributors" value={contributorScope} />
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                name="tag"
                defaultValue={activeTag ? `#${activeTag}` : ''}
                placeholder={tCommunity('hashtags.search_placeholder')}
                className="h-8 w-full border-0 bg-transparent p-0 text-sm outline-none"
              />
              <Button type="submit" size="sm" variant="outline" className="rounded-full">
                #
              </Button>
              {activeTag ? (
                <Link
                  href={buildCommunityHref({ sort, scope, contributors: contributorScope })}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  {tCommunity('actions.cancel')}
                </Link>
              ) : null}
            </form>
            {activeTag ? (
              <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
                <span className="font-medium text-foreground">#{activeTag}</span>
                <span className="text-muted-foreground">
                  {tCommunity('feed_controls.open_hashtags')}
                </span>
              </div>
            ) : null}
          </div>

          <div className="relative z-0 w-full">
            <Feed sort={sort} scope={scope} hashtagSlug={activeTag} />
          </div>
        </main>

        <div className="hidden w-[350px] shrink-0 lg:block">
          <aside className="sticky top-0 h-screen overflow-y-auto px-6 py-4">
            {activeTag ? (
              <div className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs text-muted-foreground">
                  {tCommunity('feed_controls.open_hashtags')}
                </p>
                <p className="text-sm font-semibold text-foreground">#{activeTag}</p>
              </div>
            ) : null}
            <CommunityLeaderboardCard
              contributorScope={contributorScope}
              basePath="/community"
              extraQuery={{ sort, scope, tag: activeTag }}
            />
          </aside>
        </div>
      </div>
    </div>
  )
}
