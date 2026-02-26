import { Button } from '@make-the-change/core/ui'
import { ArrowLeft, Share2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { PostThreadClient } from '@/components/social/post-thread-client'
import { Link } from '@/i18n/navigation'
import { getComments, getPostById } from '@/lib/social/feed.actions'

type CommunityPostPageProps = {
  params: Promise<{ id: string }>
}

type RawComment = {
  id?: string | null
  content?: string | null
  created_at?: string | null
  author_id?: string | null
  author?: {
    id?: string | null
    full_name?: string | null
    avatar_url?: string | null
  } | null
}

export async function generateMetadata({ params }: CommunityPostPageProps) {
  const { id } = await params
  const post = await getPostById(id)
  const t = await getTranslations('community')

  return {
    title: post?.content?.slice(0, 40) || t('post.default_title'),
  }
}

export default async function CommunityPostPage({ params }: CommunityPostPageProps) {
  const { id } = await params
  const t = await getTranslations('community')

  const post = await getPostById(id)
  if (!post) {
    notFound()
  }

  const comments = await getComments(id)
  const normalizedComments = Array.isArray(comments)
    ? comments.map((comment) => {
        const raw = comment as RawComment
        return {
          id: String(raw.id || ''),
          content: String(raw.content || ''),
          created_at: String(raw.created_at || new Date().toISOString()),
          author: {
            id: String(raw.author?.id || raw.author_id || ''),
            full_name: String(raw.author?.full_name || t('thread.user_fallback')),
            avatar_url: raw.author?.avatar_url || null,
          },
        }
      })
    : []

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-center justify-between gap-2">
        <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
          <Link href="/community">
            <ArrowLeft className="h-4 w-4" />
            {t('actions.back_to_feed')}
          </Link>
        </Button>

        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/community/posts/${post.id}/share`}>
            <Share2 className="h-4 w-4" />
            {t('actions.share')}
          </Link>
        </Button>
      </div>

      <PostThreadClient post={post} initialComments={normalizedComments} />
    </div>
  )
}
