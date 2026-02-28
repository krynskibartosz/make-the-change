import { Button } from '@make-the-change/core/ui'
import { ArrowLeft, Bookmark } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { FeedClient } from '@/components/social/feed-client'
import { Link } from '@/i18n/navigation'
import { CommunityPageFrame } from '../_features/community-page-frame'
import { CommunityRightRail } from '../_features/community-right-rail'
import { getUserBookmarkedPosts } from '@/lib/social/user-content.service'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('community')
  return {
    title: t('bookmarks.meta_title'),
  }
}

export default async function CommunityBookmarksPage() {
  const t = await getTranslations('community')
  const bookmarkedPosts = await getUserBookmarkedPosts(20)

  return (
    <CommunityPageFrame rightRail={<CommunityRightRail variant="default" />}>
      <div className="space-y-4 px-4 py-6 sm:px-6 sm:py-8">
        <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
          <Link href="/community">
            <ArrowLeft className="h-4 w-4" />
            {t('actions.back_to_feed')}
          </Link>
        </Button>

        <header className="rounded-2xl border border-border/70 bg-linear-to-br from-background via-background to-primary/5 p-5">
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Bookmark className="h-4 w-4" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">{t('bookmarks.title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('bookmarks.description')}</p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-border/70 bg-background">
          <FeedClient initialPosts={bookmarkedPosts} hideCreatePost canWrite={false} />
        </section>
      </div>
    </CommunityPageFrame>
  )
}
