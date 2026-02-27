'use client'

import type { Post } from '@make-the-change/core/shared'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Textarea,
} from '@make-the-change/core/ui'
import { formatDistanceToNow } from 'date-fns'
import { enUS, fr, nl as nlLocale } from 'date-fns/locale'
import { Loader2, MessageCircle } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { addComment, toggleBookmark, toggleLike } from '@/lib/social/feed.actions'
import { PostCard } from './post-card'

type PostComment = {
  id: string
  content: string
  created_at: string
  author?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

type PostThreadClientProps = {
  post: Post
  initialComments: PostComment[]
}

export function PostThreadClient({ post, initialComments }: PostThreadClientProps) {
  const { toast } = useToast()
  const t = useTranslations('community')
  const locale = useLocale()
  const dateFnsLocale = locale === 'fr' ? fr : locale === 'nl' ? nlLocale : enUS
  const [postState, setPostState] = useState(post)
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const handleLike = async () => {
    const previous = postState
    const wasLiked = !!postState.user_has_reacted

    setPostState((current) => ({
      ...current,
      user_has_reacted: !wasLiked,
      reactions_count: (current.reactions_count || 0) + (wasLiked ? -1 : 1),
    }))

    try {
      await toggleLike(postState.id)
    } catch (_error) {
      setPostState(previous)
      toast({
        title: t('thread.login_required_title'),
        description: t('thread.login_required_description'),
      })
    }
  }

  const handleAddComment = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = newComment.trim()
    if (!trimmed) {
      return
    }

    const optimisticComment: PostComment = {
      id: `optimistic-${Date.now()}`,
      content: trimmed,
      created_at: new Date().toISOString(),
      author: {
        id: 'me',
        full_name: t('thread.you_label'),
        avatar_url: null,
      },
    }

    setIsSubmittingComment(true)
    setNewComment('')
    setComments((current) => [...current, optimisticComment])
    setPostState((current) => ({
      ...current,
      comments_count: (current.comments_count || 0) + 1,
    }))

    try {
      await addComment(postState.id, trimmed)
    } catch (_error) {
      setComments((current) => current.filter((comment) => comment.id !== optimisticComment.id))
      setPostState((current) => ({
        ...current,
        comments_count: Math.max((current.comments_count || 1) - 1, 0),
      }))
      setNewComment(trimmed)
      toast({
        title: t('thread.comment_error_title'),
        description: t('thread.comment_error_description'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleBookmark = async () => {
    const previous = postState

    setPostState((current) => ({
      ...current,
      user_has_bookmarked: !current.user_has_bookmarked,
    }))

    try {
      await toggleBookmark(postState.id)
    } catch (_error) {
      setPostState(previous)
      toast({
        title: t('thread.login_required_title'),
        description: t('thread.login_required_description'),
      })
    }
  }

  return (
    <div className="space-y-6">
      <PostCard post={postState} onLike={handleLike} onBookmark={handleBookmark} />

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">
              {t('thread.comments_label', { count: comments.length })}
            </h2>
          </div>

          <form onSubmit={handleAddComment} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder={t('thread.comment_placeholder')}
              className="min-h-[100px]"
              disabled={isSubmittingComment}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmittingComment || !newComment.trim()}>
                {isSubmittingComment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('thread.comment_sending')}
                  </>
                ) : (
                  t('thread.comment_publish')
                )}
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => {
                const authorName = comment.author?.full_name || t('thread.user_fallback')
                const authorInitial = authorName.slice(0, 1).toUpperCase()
                const createdAt = formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: dateFnsLocale,
                })

                return (
                  <article key={comment.id} className="rounded-xl border border-border/70 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={comment.author?.avatar_url || undefined}
                          alt={authorName}
                        />
                        <AvatarFallback>{authorInitial}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{authorName}</p>
                        <p className="text-xs text-muted-foreground">{createdAt}</p>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {comment.content}
                    </p>
                  </article>
                )
              })
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                {t('thread.no_comments')}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
