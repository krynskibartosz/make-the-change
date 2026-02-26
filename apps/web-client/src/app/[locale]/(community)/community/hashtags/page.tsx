import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@make-the-change/core/ui'
import { ArrowLeft, Search } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getTrendingHashtags } from '@/lib/social/feed.actions'

type CommunityHashtagsPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata() {
  const t = await getTranslations('community')
  return {
    title: t('hashtags.meta_title'),
  }
}

export default async function CommunityHashtagsPage({ searchParams }: CommunityHashtagsPageProps) {
  const t = await getTranslations('community')
  const { q = '' } = await searchParams
  const normalizedQuery = q.trim().toLowerCase()

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
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href="/community">
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('hashtags.title')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t('hashtags.description')}</p>
      </header>

      <form className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-3" method="get">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={q}
          placeholder={t('hashtags.search_placeholder')}
          className="border-0 p-0 focus-visible:ring-0"
        />
      </form>

      {filteredHashtags.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredHashtags.map((hashtag) => (
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
                <Button asChild className="w-full">
                  <Link href={`/community/hashtags/${hashtag.slug}`}>{t('hashtags.open')}</Link>
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
    </div>
  )
}
