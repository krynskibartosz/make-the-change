import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { ArrowLeft, Search } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Feed } from '@/components/social/feed'
import { Link } from '@/i18n/navigation'
import { getTrendingHashtags } from '@/lib/social/feed.reads'
import { sanitizeHashtagSlug } from '@/lib/social/hashtags'

type CommunityHashtagsPageProps = {
  searchParams: Promise<{
    q?: string
    tag?: string
  }>
}

const buildCommunityTagHref = (slug: string) => {
  const params = new URLSearchParams()
  params.set('tag', slug)
  params.set('sort', 'best')
  return `/community?${params.toString()}`
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('community')
  return {
    title: t('hashtags.meta_title'),
  }
}

export default async function CommunityHashtagsPage({ searchParams }: CommunityHashtagsPageProps) {
  const t = await getTranslations('community')
  const { q = '', tag = '' } = await searchParams
  const normalizedQuery = q.trim().toLowerCase()
  const selectedTag = sanitizeHashtagSlug(tag || q)

  const hashtags = await getTrendingHashtags(60)
  const filteredHashtags = hashtags.filter((hashtag) => {
    if (!normalizedQuery) {
      return true
    }

    return (
      hashtag.slug.toLowerCase().includes(normalizedQuery) ||
      hashtag.label.toLowerCase().includes(normalizedQuery)
    )
  })

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 min-h-11">
        <Link href="/community" prefetch={false}>
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <header className="space-y-2 rounded-2xl border border-border/70 bg-linear-to-br from-background to-muted/30 p-5 sm:p-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('hashtags.title')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t('hashtags.description')}</p>
      </header>

      <form
        className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-3"
        method="get"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          name="q"
          defaultValue={q}
          placeholder={t('hashtags.search_placeholder')}
          className="h-11 w-full border-0 bg-transparent p-0 outline-none"
        />
        {selectedTag ? <input type="hidden" name="tag" value={selectedTag} /> : null}
      </form>

      <section className="space-y-3 rounded-2xl border border-border/70 bg-background p-4 sm:p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('sidebar.trending_hashtags')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {hashtags.slice(0, 18).map((hashtag) => (
            <Link
              key={hashtag.slug}
              href={buildCommunityTagHref(hashtag.slug)}
              prefetch={false}
              className="rounded-full border border-border/70 bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              #{hashtag.slug}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border/70 bg-background p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-foreground">{t('feed_controls.open_hashtags')}</h2>
          {selectedTag ? (
            <Button asChild variant="outline" className="min-h-11">
              <Link href={buildCommunityTagHref(selectedTag)} prefetch={false}>
                #{selectedTag}
              </Link>
            </Button>
          ) : null}
        </div>

        {filteredHashtags.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredHashtags.slice(0, 12).map((hashtag) => (
              <Card key={hashtag.slug} className="border-border/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">#{hashtag.slug}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">
                      {hashtag.total_count.toLocaleString()} {t('hashtags.total_suffix')}
                    </Badge>
                    <Badge variant="outline">
                      {hashtag.month_count.toLocaleString()} {t('hashtags.month_suffix')}
                    </Badge>
                  </div>
                  <Button asChild className="w-full min-h-11">
                    <Link href={buildCommunityTagHref(hashtag.slug)} prefetch={false}>
                      {t('hashtags.open')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            {t('hashtags.empty')}
          </div>
        )}
      </section>

      {selectedTag ? (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-background">
          <div className="border-b border-border/70 p-4 sm:p-5">
            <p className="text-xs text-muted-foreground">{t('share.preview_label')}</p>
            <h2 className="text-lg font-semibold">#{selectedTag}</h2>
          </div>
          <Feed sort="best" scope="all" hashtagSlug={selectedTag} hideCreatePost limit={8} />
        </section>
      ) : null}
    </div>
  )
}
