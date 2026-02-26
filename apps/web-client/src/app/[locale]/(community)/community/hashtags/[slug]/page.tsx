import type { ContributorScope, FeedSort } from '@make-the-change/core/shared'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowLeft, Leaf } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Feed } from '@/components/social/feed'
import { Link } from '@/i18n/navigation'
import { getHashtagStats, getTopContributors } from '@/lib/social/feed.actions'
import { sanitizeHashtagSlug } from '@/lib/social/hashtags'
import { CommunityFeedControls } from '../../_features/community-feed-controls'

const FEED_SORT_VALUES: FeedSort[] = ['best', 'newest', 'oldest']
const CONTRIBUTOR_SCOPE_VALUES: ContributorScope[] = ['all', 'citizens', 'companies']

type CommunityHashtagPageProps = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    sort?: string
    contributors?: string
  }>
}

const parseFeedSort = (value: string | undefined): FeedSort =>
  FEED_SORT_VALUES.includes(value as FeedSort) ? (value as FeedSort) : 'newest'

const parseContributorScope = (value: string | undefined): ContributorScope =>
  CONTRIBUTOR_SCOPE_VALUES.includes(value as ContributorScope) ? (value as ContributorScope) : 'all'

const buildContributorHref = (slug: string, scope: ContributorScope, sort: FeedSort): string => {
  const params = new URLSearchParams()
  params.set('contributors', scope)
  params.set('sort', sort)
  return `/community/hashtags/${slug}?${params.toString()}`
}

export async function generateMetadata({ params }: CommunityHashtagPageProps) {
  const t = await getTranslations('community')
  const { slug } = await params
  const normalizedSlug = sanitizeHashtagSlug(slug)

  if (!normalizedSlug) {
    return {
      title: t('hashtags.meta_title'),
    }
  }

  return {
    title: t('hashtags.detail_meta_title', { slug: normalizedSlug }),
  }
}

export default async function CommunityHashtagPage({
  params,
  searchParams,
}: CommunityHashtagPageProps) {
  const t = await getTranslations('community')
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const normalizedSlug = sanitizeHashtagSlug(slug)
  if (!normalizedSlug) {
    notFound()
  }
  const sort = parseFeedSort(query.sort)
  const contributorScope = parseContributorScope(query.contributors)

  const [stats, topContributors] = await Promise.all([
    getHashtagStats(normalizedSlug),
    getTopContributors(contributorScope, 6, normalizedSlug),
  ])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href="/community/hashtags">
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <header className="space-y-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">#{stats.slug}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {t('hashtags.detail_description', { slug: stats.slug })}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t('hashtags.today')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-bold">{stats.today_count}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t('hashtags.month')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-bold">{stats.month_count}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t('hashtags.year')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-bold">{stats.year_count}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{t('hashtags.total')}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-2xl font-bold">{stats.total_count}</CardContent>
          </Card>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <CommunityFeedControls sort={sort} scope="all" showScope={false} />
          <Feed sort={sort} hashtagSlug={stats.slug} />
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('leaderboard.top_contributors')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {CONTRIBUTOR_SCOPE_VALUES.map((scope) => (
                  <Link
                    key={scope}
                    href={buildContributorHref(stats.slug, scope, sort)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      contributorScope === scope
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t(`leaderboard.scope_${scope}`)}
                  </Link>
                ))}
              </div>

              {topContributors.length > 0 ? (
                topContributors.map((contributor) => (
                  <div
                    key={contributor.user_id}
                    className="flex items-center justify-between gap-3"
                  >
                    <Link
                      href={`/profile/${contributor.user_id}`}
                      className="truncate text-sm font-medium hover:underline"
                    >
                      {contributor.full_name}
                    </Link>
                    <Badge variant="secondary">{Math.round(contributor.score)}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t('leaderboard.no_contributors')}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('hashtags.support_title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t('hashtags.support_description', { slug: stats.slug })}
              </p>
              <Button asChild className="w-full gap-2">
                <Link href={`/projects?tag=${stats.slug}`}>
                  <Leaf className="h-4 w-4" />
                  {t('hashtags.support_cta')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
