import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { CreatePostPageClient } from '@/components/social/create-post-page-client'
import { getPostById } from '@/lib/social/feed.reads'

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

export default async function CommunityCreatePostPage({ searchParams }: CommunityCreatePostPageProps) {
  const query = await searchParams
  const quotePostId = typeof query.quote === 'string' ? query.quote.trim() : ''
  const quotedPost = quotePostId ? await getPostById(quotePostId) : null

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <CreatePostPageClient
        quotePostId={quotePostId || undefined}
        quotedPost={quotedPost}
        renderMode="page"
      />
    </div>
  )
}
