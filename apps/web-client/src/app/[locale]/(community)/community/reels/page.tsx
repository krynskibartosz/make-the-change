import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getReelsFeed } from '@/lib/social/feed.reads'
import { CommunityPageFrame } from '../_features/community-page-frame'
import { ReelsFeed } from './_features/reels-feed'

type CommunityReelsPageProps = {
  searchParams: Promise<{
    scope?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('community')
  return {
    title: t('reels.meta_title'),
  }
}

export default async function CommunityReelsPage({ searchParams }: CommunityReelsPageProps) {
  const params = await searchParams
  const scope = params.scope === 'following' ? 'following' : 'all'
  const reels = await getReelsFeed({
    page: 1,
    limit: 20,
    scope,
  })

  return (
    <CommunityPageFrame centerClassName="max-w-[760px]">
      <ReelsFeed initialPosts={reels} scope={scope} />
    </CommunityPageFrame>
  )
}
