import type { ContributorScope } from '@make-the-change/core/shared'
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@make-the-change/core/ui'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getTopContributors, getTrendingHashtags } from '@/lib/social/feed.reads'

type CommunityLeaderboardCardProps = {
  contributorScope?: ContributorScope
  basePath?: string
  extraQuery?: Record<string, string | undefined>
}

const SCOPE_VALUES: ContributorScope[] = ['all', 'citizens', 'companies']

const buildQueryHref = (
  basePath: string,
  key: string,
  value: string,
  extraQuery: Record<string, string | undefined>,
) => {
  const params = new URLSearchParams()

  for (const [queryKey, queryValue] of Object.entries(extraQuery)) {
    if (queryValue) {
      params.set(queryKey, queryValue)
    }
  }

  params.set(key, value)

  const queryString = params.toString()
  return queryString ? `${basePath}?${queryString}` : basePath
}

const buildHashtagFeedHref = (slug: string) => {
  const params = new URLSearchParams()
  params.set('tag', slug)
  params.set('sort', 'best')
  return `/community?${params.toString()}`
}

export async function CommunityLeaderboardCard({
  contributorScope = 'all',
  basePath = '/community',
  extraQuery = {},
}: CommunityLeaderboardCardProps) {
  const t = await getTranslations('community')

  const [topContributors, trendingHashtags] = await Promise.all([
    getTopContributors(contributorScope, 5),
    getTrendingHashtags(7),
  ])

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 rounded-2xl p-4">
        <h2 className="mb-4 text-xl font-extrabold">{t('leaderboard.top_contributors')}</h2>

        <div className="mb-4 flex flex-wrap gap-2">
          {SCOPE_VALUES.map((scope) => (
            <Link
              key={scope}
              href={buildQueryHref(basePath, 'contributors', scope, extraQuery)}
              prefetch={false}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                contributorScope === scope
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground'
              }`}
            >
              {t(`leaderboard.scope_${scope}`)}
            </Link>
          ))}
        </div>

        <div className="space-y-3">
          {topContributors.length > 0 ? (
            topContributors.map((contributor) => (
              <div key={contributor.user_id} className="flex items-center justify-between gap-3">
                <Link
                  href={`/profile/${contributor.user_id}`}
                  prefetch={false}
                  className="group flex min-w-0 items-center gap-3"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contributor.avatar_url || undefined} />
                    <AvatarFallback>{contributor.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold group-hover:underline">
                      {contributor.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        `leaderboard.scope_${contributor.author_type === 'company' ? 'companies' : 'citizens'}`,
                      )}
                    </p>
                  </div>
                </Link>
                <Badge variant="secondary">{Math.round(contributor.score)}</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t('leaderboard.no_contributors')}</p>
          )}

          <Link
            href="/leaderboard"
            prefetch={false}
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            {t('leaderboard.full_leaderboard')}
          </Link>
        </div>
      </div>

      <div className="bg-muted/30 rounded-2xl p-4">
        <h2 className="mb-4 text-xl font-extrabold">{t('sidebar.trending_hashtags')}</h2>
        <div className="space-y-2">
          {trendingHashtags.length > 0 ? (
            trendingHashtags.map((hashtag) => (
              <Link
                key={hashtag.slug}
                href={buildHashtagFeedHref(hashtag.slug)}
                prefetch={false}
                className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm transition-colors hover:bg-background/70"
              >
                <span className="font-medium text-foreground">#{hashtag.slug}</span>
                <span className="text-muted-foreground">
                  {hashtag.total_count.toLocaleString()}
                </span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">{t('trending.no_trending')}</p>
          )}
        </div>

        <Link
          href="/community"
          prefetch={false}
          className="mt-3 inline-block text-sm text-primary hover:underline"
        >
          {t('leaderboard.show_more')}
        </Link>
      </div>
    </div>
  )
}
