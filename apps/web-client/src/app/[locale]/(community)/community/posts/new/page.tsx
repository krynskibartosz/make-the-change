import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CreatePostPageClient } from '@/components/social/create-post-page-client'
import { getPostById } from '@/lib/social/feed.reads'
import { CommunityPageFrame } from '../../_features/community-page-frame'
import { CommunityRightRail } from '../../_features/community-right-rail'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('community')
  return {
    title: t('create_post.meta_title'),
  }
}

type CommunityCreatePostPageProps = {
  searchParams: Promise<{
    quote?: string
  }>
}

export default async function CommunityCreatePostPage({
  searchParams,
}: CommunityCreatePostPageProps) {
  const query = await searchParams
  const quotePostId = typeof query.quote === 'string' ? query.quote.trim() : ''
  const quotedPost = quotePostId ? await getPostById(quotePostId) : null

  return (
    <CommunityPageFrame rightRail={<CommunityRightRail variant="default" />}>
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <CreatePostPageClient
          quotePostId={quotePostId || undefined}
          quotedPost={quotedPost}
          renderMode="page"
        />
      </div>
    </CommunityPageFrame>
  )
}
