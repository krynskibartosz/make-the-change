import type { FeedSort } from '@make-the-change/core/shared'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowLeft, Compass } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getFeed } from '@/lib/social/feed.actions'
import { CommunityFeedControls } from '../_features/community-feed-controls'

const FEED_SORT_VALUES: FeedSort[] = ['best', 'newest', 'oldest']

type CommunityTrendingPageProps = {
  searchParams: Promise<{
    sort?: string
  }>
}

const parseSort = (value: string | undefined): FeedSort =>
  FEED_SORT_VALUES.includes(value as FeedSort) ? (value as FeedSort) : 'best'

export async function generateMetadata() {
  const t = await getTranslations('community')
  return {
    title: t('trending.meta_title'),
  }
}

export default async function CommunityTrendingPage({ searchParams }: CommunityTrendingPageProps) {
  const t = await getTranslations('community')
  const { sort: sortParam } = await searchParams
  const sort = parseSort(sortParam)
  const posts = await getFeed({ page: 1, limit: 12, sort })

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href="/community">
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('trending.title')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t('trending.description')}</p>
      </header>

      <CommunityFeedControls sort={sort} scope="all" showScope={false} />

      <div className="grid gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="border-border/70">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="line-clamp-2 text-base sm:text-lg">
                    {post.content || t('trending.post_without_text')}
                  </CardTitle>
                  <Badge variant="secondary">
                    {post.reactions_count || 0} {t('trending.likes_suffix')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3 pt-0">
                <p className="truncate text-xs text-muted-foreground">
                  {t('trending.by_prefix')} {post.author?.full_name || t('thread.user_fallback')}
                </p>
                <Button asChild size="sm" variant="outline" className="gap-2">
                  <Link href={`/community/posts/${post.id}`}>
                    <Compass className="h-4 w-4" />
                    {t('trending.open')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            {t('trending.no_trending')}
          </div>
        )}
      </div>
    </div>
  )
}
