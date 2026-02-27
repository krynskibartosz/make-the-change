'use client'

import type { Post } from '@make-the-change/core/shared'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from '@make-the-change/core/ui'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Link, useRouter } from '@/i18n/navigation'
import { createPost, createQuoteRepost } from '@/lib/social/feed.actions'

type CreatePostPageClientProps = {
  quotePostId?: string
  quotedPost?: Post | null
  renderMode?: 'page' | 'modal'
}

export function CreatePostPageClient({
  quotePostId,
  quotedPost = null,
  renderMode = 'page',
}: CreatePostPageClientProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('community')
  const suggestedHashtags = t('create_post.suggested_hashtags')
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
  const isModal = renderMode === 'modal'

  const closeComposer = () => {
    if (isModal && typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push('/community')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmed = content.trim()
    if (!trimmed) {
      return
    }

    if (quotePostId && !quotedPost) {
      toast({
        title: t('create_post.error_title'),
        description: t('create_post.quote_not_found'),
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const post = quotePostId
        ? await createQuoteRepost(quotePostId, trimmed)
        : await createPost(trimmed)

      toast({
        title: t('create_post.success_title'),
        description: t('create_post.success_description'),
      })

      if (post?.id) {
        router.push(`/community/posts/${post.id}`)
      } else {
        router.push('/community')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : null
      toast({
        title: t('create_post.error_title'),
        description: errorMessage || t('create_post.error_description'),
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSuggestedHashtag = (slug: string) => {
    const hashtag = `#${slug.replace(/^#/, '')}`
    if (content.includes(hashtag)) {
      return
    }

    setContent((current) => `${current.trim()}${current.trim() ? ' ' : ''}${hashtag}`)
  }

  const quoteAuthorName = quotedPost?.author?.full_name || t('thread.user_fallback')
  const submitLabel = quotePostId ? t('create_post.publish_quote') : t('create_post.publish')
  const cardTitle = quotePostId ? t('create_post.quote_heading') : t('create_post.heading')

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {!isModal ? (
        <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
          <Link href="/community">
            <ArrowLeft className="h-4 w-4" />
            {t('actions.back_to_feed')}
          </Link>
        </Button>
      ) : null}

      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>{cardTitle}</CardTitle>
          {quotePostId ? (
            <p className="text-sm text-muted-foreground">{t('create_post.quote_helper')}</p>
          ) : null}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {quotePostId ? (
              <div className="rounded-xl border border-border/80 bg-muted/30 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('create_post.quote_source_label')}
                </p>

                {quotedPost ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={quotedPost.author?.avatar_url || undefined} alt={quoteAuthorName} />
                        <AvatarFallback>{quoteAuthorName.slice(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{quoteAuthorName}</p>
                        <Link
                          href={`/community/posts/${quotedPost.id}`}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {t('share.open_original_post')}
                        </Link>
                      </div>
                    </div>
                    {quotedPost.content ? (
                      <p className="line-clamp-3 text-sm text-foreground/90">{quotedPost.content}</p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t('create_post.quote_not_found')}</p>
                )}
              </div>
            ) : null}

            <Textarea
              placeholder={t('create_post.placeholder')}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[180px]"
              disabled={isSubmitting}
            />

            <div className="flex flex-wrap items-center gap-2">
              {suggestedHashtags.map((slug) => (
                <Button
                  key={slug}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full px-3 text-xs"
                  onClick={() => addSuggestedHashtag(slug)}
                >
                  #{slug}
                </Button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeComposer}>
                {t('actions.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting || !content.trim()} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('create_post.publishing')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {submitLabel}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
