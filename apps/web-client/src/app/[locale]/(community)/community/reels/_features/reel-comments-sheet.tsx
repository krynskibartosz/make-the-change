'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
  Button,
  Textarea,
} from '@make-the-change/core/ui'
import { formatDistanceToNow } from 'date-fns'
import { enUS, fr, nl as nlLocale } from 'date-fns/locale'
import { Heart, Loader2, MessageCircle, SendHorizontal } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { addComment, fetchPostCommentsPage, toggleCommentLike } from '@/lib/social/feed.actions'
import { cn } from '@/lib/utils'

type ReelComment = {
  id: string
  content: string
  created_at: string
  reactions_count?: number
  user_has_reacted?: boolean
  author?: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

type CommentSort = 'top' | 'newest'

type ReelCommentsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  initialCount: number
  onCommentCountChange?: (delta: number) => void
}

const COMMENTS_PAGE_SIZE = 20

const getInitial = (name: string) => name.trim().slice(0, 1).toUpperCase() || 'U'

export function ReelCommentsSheet({
  open,
  onOpenChange,
  postId,
  initialCount,
  onCommentCountChange,
}: ReelCommentsSheetProps) {
  const { toast } = useToast()
  const t = useTranslations('community')
  const locale = useLocale()
  const dateFnsLocale = locale === 'fr' ? fr : locale === 'nl' ? nlLocale : enUS

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [sort, setSort] = useState<CommentSort>('top')
  const [comments, setComments] = useState<ReelComment[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(initialCount)
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingCommentLikes, setPendingCommentLikes] = useState<string[]>([])

  const loadComments = useCallback(
    async (requestedPage: number, nextSort: CommentSort, mode: 'replace' | 'append') => {
      const loader = mode === 'append' ? setIsLoadingMore : setIsLoadingInitial
      loader(true)

      try {
        const response = await fetchPostCommentsPage(postId, {
          page: requestedPage,
          limit: COMMENTS_PAGE_SIZE,
          sort: nextSort,
        })

        const nextComments = (response.comments || []) as ReelComment[]

        setComments((current) =>
          mode === 'append'
            ? [
                ...current,
                ...nextComments.filter(
                  (comment) => !current.some((existing) => existing.id === comment.id),
                ),
              ]
            : nextComments,
        )
        setHasMore(response.hasMore)
        setPage(response.page)
        setTotalCount(Math.max(response.totalCount, nextComments.length, initialCount))
      } catch {
        toast({
          title: t('thread.comment_error_title'),
          description: t('thread.comment_error_description'),
          variant: 'destructive',
        })

        if (mode === 'replace') {
          setComments([])
          setHasMore(false)
          setPage(1)
          setTotalCount(initialCount)
        }
      } finally {
        loader(false)
      }
    },
    [initialCount, postId, t, toast],
  )

  useEffect(() => {
    if (!open) {
      return
    }

    void loadComments(1, sort, 'replace')
  }, [loadComments, open, sort])

  useEffect(() => {
    if (!open || !hasMore || isLoadingInitial || isLoadingMore) {
      return
    }

    const target = sentinelRef.current
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry?.isIntersecting) {
          return
        }

        void loadComments(page + 1, sort, 'append')
      },
      {
        rootMargin: '160px 0px',
      },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMore, isLoadingInitial, isLoadingMore, loadComments, open, page, sort])

  const displayedCount = useMemo(
    () => Math.max(initialCount, totalCount, comments.length),
    [comments.length, initialCount, totalCount],
  )

  const handleSortChange = (nextSort: CommentSort) => {
    if (nextSort === sort) {
      return
    }

    setComments([])
    setPage(1)
    setHasMore(false)
    setSort(nextSort)
  }

  const handleAddComment = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = newComment.trim()
    if (!trimmed) {
      return
    }

    setIsSubmitting(true)

    try {
      await addComment(postId, trimmed)
      setNewComment('')
      onCommentCountChange?.(1)

      if (sort !== 'newest') {
        setSort('newest')
      } else {
        await loadComments(1, 'newest', 'replace')
      }
    } catch {
      toast({
        title: t('thread.comment_error_title'),
        description: t('thread.comment_error_description'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleCommentLike = async (commentId: string) => {
    if (pendingCommentLikes.includes(commentId)) {
      return
    }

    const previousComments = comments

    setPendingCommentLikes((current) => [...current, commentId])
    setComments((current) =>
      current.map((comment) => {
        if (comment.id !== commentId) {
          return comment
        }

        const wasLiked = !!comment.user_has_reacted
        return {
          ...comment,
          user_has_reacted: !wasLiked,
          reactions_count: Math.max((comment.reactions_count || 0) + (wasLiked ? -1 : 1), 0),
        }
      }),
    )

    try {
      await toggleCommentLike(commentId)
    } catch {
      setComments(previousComments)
      toast({
        title: t('thread.login_required_title'),
        description: t('thread.login_required_description'),
        variant: 'destructive',
      })
    } finally {
      setPendingCommentLikes((current) => current.filter((value) => value !== commentId))
    }
  }

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent className="flex h-[82svh] overflow-hidden !p-0 sm:max-w-2xl">
        <div className="flex min-h-0 flex-1 flex-col">
          <BottomSheetHeader className="flex-col items-start gap-3 px-4 pb-3 pt-2">
            <div className="flex w-full items-start justify-between gap-4">
              <div>
                <BottomSheetTitle className="flex items-center gap-2 text-base font-semibold">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  {t('thread.comments_label', { count: displayedCount })}
                </BottomSheetTitle>
                <BottomSheetDescription className="text-sm text-muted-foreground">
                  {t('reels.comments_sheet_description')}
                </BottomSheetDescription>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 rounded-full bg-muted/25 p-1">
              <button
                type="button"
                onClick={() => handleSortChange('top')}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  sort === 'top'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t('feed_controls.sort_best')}
              </button>
              <button
                type="button"
                onClick={() => handleSortChange('newest')}
                className={cn(
                  'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  sort === 'newest'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t('feed_controls.sort_newest')}
              </button>
            </div>
          </BottomSheetHeader>

          <BottomSheetBody className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-0">
            {isLoadingInitial ? (
              <div className="flex min-h-full items-center justify-center py-8 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('thread.comment_loading')}
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-1">
                {comments.map((comment) => {
                  const authorName = comment.author?.full_name || t('thread.user_fallback')
                  const createdAt = formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                    locale: dateFnsLocale,
                  })
                  const isLikePending = pendingCommentLikes.includes(comment.id)

                  return (
                    <article key={comment.id} className="flex items-start gap-3 py-3">
                      <Avatar className="mt-0.5 h-9 w-9 shrink-0">
                        <AvatarImage
                          src={comment.author?.avatar_url || undefined}
                          alt={authorName}
                        />
                        <AvatarFallback>{getInitial(authorName)}</AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <p className="truncate text-sm font-semibold">{authorName}</p>
                              <p className="text-xs text-muted-foreground">{createdAt}</p>
                            </div>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/95">
                              {comment.content}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleCommentLike(comment.id)}
                            disabled={isLikePending}
                            className="mt-0.5 inline-flex min-w-10 flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
                            aria-label={t('post.action_like')}
                          >
                            {isLikePending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Heart
                                className={cn(
                                  'h-4 w-4',
                                  comment.user_has_reacted && 'fill-current text-red-400',
                                )}
                              />
                            )}
                            <span className="text-[11px] font-medium">
                              {comment.reactions_count || 0}
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}

                <div ref={sentinelRef} className="h-6 w-full">
                  {isLoadingMore ? (
                    <div className="flex items-center justify-center py-2 text-xs text-muted-foreground">
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      {t('thread.comment_loading')}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="flex min-h-full items-center justify-center">
                <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                  {t('thread.no_comments')}
                </div>
              </div>
            )}
          </BottomSheetBody>

          <form
            onSubmit={handleAddComment}
            className="border-t border-border/70 bg-background/95 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur"
          >
            <div className="flex items-end gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback>{t('thread.you_label').slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>

              <Textarea
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    if (!isSubmitting && newComment.trim()) {
                      event.currentTarget.form?.requestSubmit()
                    }
                  }
                }}
                placeholder={t('thread.comment_placeholder')}
                className={cn(
                  'min-h-[52px] resize-none rounded-2xl',
                  'max-h-32 border-border/70 bg-muted/20',
                )}
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-full"
                disabled={isSubmitting || !newComment.trim()}
                aria-label={t('thread.comment_publish')}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SendHorizontal className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </BottomSheetContent>
    </BottomSheet>
  )
}
