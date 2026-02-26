import { Button } from '@make-the-change/core/ui'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { PostCard } from '@/components/social/post-card'
import { SharePostActions } from '@/components/social/share-post-actions'
import { Link } from '@/i18n/navigation'
import { getPostById } from '@/lib/social/feed.actions'

type CommunityPostSharePageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CommunityPostSharePageProps) {
  const { id } = await params
  const post = await getPostById(id)
  const t = await getTranslations('community')
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001')

  const ogImageUrl = `${appUrl}/api/og/community/post/${id}`
  const postUrl = `${appUrl}/community/posts/${id}`
  const title = post?.content
    ? `${t('post.share_prefix')}: ${post.content.slice(0, 32)}`
    : t('post.share_default_title')

  return {
    title,
    openGraph: {
      title,
      url: postUrl,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: [ogImageUrl],
    },
  }
}

export default async function CommunityPostSharePage({ params }: CommunityPostSharePageProps) {
  const { id } = await params
  const t = await getTranslations('community')
  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6 sm:px-6 sm:py-8">
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
        <Link href={`/community/posts/${id}`}>
          <ArrowLeft className="h-4 w-4" />
          {t('actions.back_to_feed')}
        </Link>
      </Button>

      <PostCard post={post} readonlyActions />
      <SharePostActions postId={post.id} title={post.content || t('post.share_fallback_title')} />
    </div>
  )
}
