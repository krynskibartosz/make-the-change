import type { Post } from '@make-the-change/core/shared'
import { Button } from '@make-the-change/core/ui'
import { ArrowLeft, Share2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { PostThreadClient } from '@/components/social/post-thread-client'
import { Link } from '@/i18n/navigation'
import { getComments, getPostById } from '@/lib/social/feed.reads'

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

type CommunityPostThreadContentProps = {
  postId: string
  mode?: 'page' | 'modal'
  initialPost?: Post | null
  initialComments?: unknown[] | null
}

const normalizeComments = (comments: unknown[] | null | undefined, userFallback: string) =>
  Array.isArray(comments)
    ? comments.map((comment) => {
        const raw = comment as RawComment
        return {
          id: String(raw.id || ''),
          content: String(raw.content || ''),
          created_at: String(raw.created_at || new Date().toISOString()),
          author: {
            id: String(raw.author?.id || raw.author_id || ''),
            full_name: String(raw.author?.full_name || userFallback),
            avatar_url: raw.author?.avatar_url || null,
          },
        }
      })
    : []

export async function CommunityPostThreadContent({
  postId,
  mode = 'page',
  initialPost,
  initialComments,
}: CommunityPostThreadContentProps) {
  const t = await getTranslations('community')

  const [post, comments] = await Promise.all([
    initialPost === undefined ? getPostById(postId) : initialPost,
    initialComments === undefined ? getComments(postId) : initialComments,
  ])

  if (!post) {
    notFound()
  }

  const normalizedComments = normalizeComments(comments, t('thread.user_fallback'))
  const isModal = mode === 'modal'

  return (
    <div
      className={
        isModal
          ? 'w-full space-y-4 p-4 sm:p-5'
          : 'mx-auto w-full max-w-3xl space-y-4 px-4 py-6 sm:px-6 sm:py-8'
      }
    >
      <div className={`flex items-center gap-2 ${isModal ? 'justify-end' : 'justify-between'}`}>
        {!isModal ? (
          <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
            <Link href="/community">
              <ArrowLeft className="h-4 w-4" />
              {t('actions.back_to_feed')}
            </Link>
          </Button>
        ) : null}

        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/community/posts/${post.id}/share`} prefetch={false}>
            <Share2 className="h-4 w-4" />
            {t('actions.share')}
          </Link>
        </Button>
      </div>

      <PostThreadClient post={post} initialComments={normalizedComments} />
    </div>
  )
}
