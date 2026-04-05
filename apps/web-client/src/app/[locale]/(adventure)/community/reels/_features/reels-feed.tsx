'use client'

import type { Post } from '@make-the-change/core/shared'
import { Button } from '@make-the-change/core/ui'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ReelPlayerCard } from './reel-player-card'
import { ReelsScopeTabs } from './reels-scope-tabs'

type ReelsFeedProps = {
  initialPosts: Post[]
  scope: 'all' | 'following'
}

export function ReelsFeed({ initialPosts, scope }: ReelsFeedProps) {
  const t = useTranslations('community')
  const hasPosts = initialPosts.length > 0

  return (
    <div className="relative h-[100svh] w-full bg-black">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">{t('reels.title')}</h1>
            <p className="text-xs text-white/70">{t('reels.subtitle')}</p>
          </div>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/community/reels/new">
              <Plus className="mr-1 h-4 w-4" />
              {t('reels.new_reel')}
            </Link>
          </Button>
        </div>
        <ReelsScopeTabs scope={scope} />
      </header>

      {hasPosts ? (
        <div className="h-[calc(100svh-8rem)] snap-y snap-mandatory overflow-y-auto overscroll-y-contain md:h-[calc(100svh-6.3rem)]">
          {initialPosts.map((post) => (
            <ReelPlayerCard
              key={post.id}
              post={post}
              className="h-[calc(100svh-8rem)] snap-start md:h-[calc(100svh-6.3rem)]"
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[calc(100svh-8rem)] flex-col items-center justify-center gap-4 px-6 text-center md:h-[calc(100svh-6.3rem)]">
          <p className="max-w-md text-sm text-white/80">
            {scope === 'following' ? t('reels.empty_following') : t('reels.empty_for_you')}
          </p>
          <Button
            asChild
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Link href="/community/reels/new">{t('reels.post_first')}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
