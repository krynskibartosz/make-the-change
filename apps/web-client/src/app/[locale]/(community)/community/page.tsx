import type { ContributorScope, FeedScope, FeedSort } from '@make-the-change/core/shared'
import { Button } from '@make-the-change/core/ui'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { Feed } from '@/components/social/feed'
import { Link } from '@/i18n/navigation'
import { sanitizeHashtagSlug } from '@/lib/social/hashtags'
import { CommunityFeedControls } from './_features/community-feed-controls'
import {
  CommunityPageFrame,
  type CommunitySidebarUser,
  getCommunitySidebarUser,
} from './_features/community-page-frame'
import { CommunityRightRail } from './_features/community-right-rail'

const FEED_SORT_VALUES: FeedSort[] = ['best', 'newest', 'oldest']
const FEED_SCOPE_VALUES: FeedScope[] = ['all', 'following', 'my_guilds']
const CONTRIBUTOR_SCOPE_VALUES: ContributorScope[] = ['all', 'citizens', 'companies']

type CommunityPageProps = {
  searchParams: Promise<{
    sort?: string
    scope?: string
    contributors?: string
    tag?: string
  }>
}

type CommunityCopy = {
  communityTitle: string
  likesShortcut: string
  bookmarksShortcut: string
  hashtagSearchPlaceholder: string
  cancelLabel: string
  openHashtagsLabel: string
  loadingLabel: string
  followingEmptyLabel: string
}

type CommunityResolvedProps = {
  sort: FeedSort
  scope: FeedScope
  contributorScope: ContributorScope
  activeTag: string
  copy: CommunityCopy
  sidebarUser: CommunitySidebarUser
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

async function getCommunityCopy(): Promise<CommunityCopy> {
  const t = await getTranslations('navigation')
  const tCommunity = await getTranslations('community')

  return {
    communityTitle: t('community'),
    likesShortcut: tCommunity('likes.shortcut'),
    bookmarksShortcut: tCommunity('bookmarks.shortcut'),
    hashtagSearchPlaceholder: tCommunity('hashtags.search_placeholder'),
    cancelLabel: tCommunity('actions.cancel'),
    openHashtagsLabel: tCommunity('feed_controls.open_hashtags'),
    loadingLabel: 'Loading community feed...',
    followingEmptyLabel: tCommunity('feed.empty_following'),
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('navigation')
  return {
    title: `${t('community')} | Make the Change`,
  }
}

function CommunityResolved({
  sort,
  scope,
  contributorScope,
  activeTag,
  copy,
  sidebarUser,
}: CommunityResolvedProps) {
  const hasUser = !!sidebarUser

  return (
    <CommunityPageFrame
      sidebarUser={sidebarUser}
      rightRail={
        <CommunityRightRail
          variant="default"
          activeTag={activeTag}
          contributorScope={contributorScope}
          basePath="/community"
          extraQuery={{ sort, scope, tag: activeTag }}
        />
      }
    >
      <div className="sticky top-0 z-20 space-y-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md">
        <h1 className="text-xl font-bold">{copy.communityTitle}</h1>
        <CommunityFeedControls sort={sort} scope={scope} showScope={hasUser} />
        {hasUser ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/community/likes"
              className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {copy.likesShortcut}
            </Link>
            <Link
              href="/community/bookmarks"
              className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {copy.bookmarksShortcut}
            </Link>
          </div>
        ) : null}
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
            placeholder={copy.hashtagSearchPlaceholder}
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
              {copy.cancelLabel}
            </Link>
          ) : null}
        </form>
        {activeTag ? (
          <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs">
            <span className="font-medium text-foreground">#{activeTag}</span>
            <span className="text-muted-foreground">{copy.openHashtagsLabel}</span>
          </div>
        ) : null}
      </div>

      <div className="relative z-0 w-full">
        <Feed
          sort={sort}
          scope={scope}
          hashtagSlug={activeTag}
          emptyMessage={scope === 'following' ? copy.followingEmptyLabel : undefined}
        />
      </div>
    </CommunityPageFrame>
  )
}

function CommunityFallback({ copy }: { copy: CommunityCopy }) {
  return (
    <CommunityPageFrame
      sidebarUser={null}
      rightRail={
        <div className="space-y-4">
          <div className="h-80 animate-pulse rounded-2xl bg-muted/60" />
          <div className="h-60 animate-pulse rounded-2xl bg-muted/60" />
        </div>
      }
    >
      <div className="sticky top-0 z-20 space-y-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md">
        <h1 className="text-xl font-bold">{copy.communityTitle}</h1>
        <div className="h-11 rounded-xl border border-border/70 bg-background/80" />
      </div>
      <div className="px-4 py-6 text-sm text-muted-foreground">{copy.loadingLabel}</div>
    </CommunityPageFrame>
  )
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const [params, copy, sidebarUser] = await Promise.all([
    searchParams,
    getCommunityCopy(),
    getCommunitySidebarUser(),
  ])

  const sort = parseFeedSort(params.sort)
  const scope = parseFeedScope(params.scope)
  const contributorScope = parseContributorScope(params.contributors)
  const activeTag = sanitizeHashtagSlug(params.tag || '')

  return (
    <Suspense fallback={<CommunityFallback copy={copy} />}>
      <CommunityResolved
        sort={sort}
        scope={scope}
        contributorScope={contributorScope}
        activeTag={activeTag}
        copy={copy}
        sidebarUser={sidebarUser}
      />
    </Suspense>
  )
}
