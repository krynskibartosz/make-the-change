import type { Post } from '@make-the-change/core/shared'
import { Button } from '@make-the-change/core/ui'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { PostCard } from '@/components/social/post-card'
import { SharePostActions } from '@/components/social/share-post-actions'
import { Link } from '@/i18n/navigation'
import { buildPublicAppUrl } from '@/lib/public-url'
import { getPostById } from '@/lib/social/feed.reads'

type CommunityPostShareContentProps = {
  postId: string
  locale: string
  mode?: 'page' | 'modal'
  initialPost?: Post | null
}

export async function CommunityPostShareContent({
  postId,
  locale,
  mode = 'page',
  initialPost,
}: CommunityPostShareContentProps) {
  const t = await getTranslations('community')
  const post = initialPost === undefined ? await getPostById(postId) : initialPost

  if (!post) {
    notFound()
  }

  const isModal = mode === 'modal'

  return (
    <div
      className={
        isModal
          ? 'w-full space-y-4 p-4 sm:p-5'
          : 'mx-auto w-full max-w-3xl space-y-4 px-4 py-6 sm:px-6 sm:py-8'
      }
    >
      {!isModal ? (
        <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
          <Link href={`/community/posts/${post.id}`}>
            <ArrowLeft className="h-4 w-4" />
            {t('actions.back_to_feed')}
          </Link>
        </Button>
      ) : null}

      <PostCard post={post} readonlyActions />
      <SharePostActions
        postId={post.id}
        title={post.content || t('post.share_fallback_title')}
        description={post.content || null}
        imageUrl={post.image_urls[0] || null}
        canonicalUrl={buildPublicAppUrl(`/${locale}/community/posts/${post.id}`)}
        embedUrl={buildPublicAppUrl(`/${locale}/embed/community/posts/${post.id}`)}
        oEmbedUrl={buildPublicAppUrl(`/api/oembed/community/post/${post.id}?locale=${locale}`)}
        ogImageUrl={buildPublicAppUrl(`/api/og/community/post/${post.id}?variant=default`)}
      />
    </div>
  )
}
