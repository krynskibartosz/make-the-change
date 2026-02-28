'use client'

import type { Post } from '@make-the-change/core/shared'
import { Avatar, AvatarFallback, AvatarImage, Button } from '@make-the-change/core/ui'
import { Bookmark, Heart, MessageCircle, Share2, Volume2, VolumeX } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Link, useRouter } from '@/i18n/navigation'
import { toggleBookmark, toggleLike } from '@/lib/social/feed.actions'
import { ReelCommentsSheet } from './reel-comments-sheet'
import { ReelShareSheet } from './reel-share-sheet'

const getInitial = (name: string) => name.trim().slice(0, 1).toUpperCase() || 'U'

type ReelPlayerCardProps = {
  post: Post
  className?: string
}

export function ReelPlayerCard({ post, className }: ReelPlayerCardProps) {
  const t = useTranslations('community')
  const tNav = useTranslations('navigation')
  const locale = useLocale()
  const { toast } = useToast()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isInView, setIsInView] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [postState, setPostState] = useState(post)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [clientOrigin, setClientOrigin] = useState('')

  const authorName = postState.author?.full_name || t('thread.user_fallback')
  const authorHref = `/profile/${postState.author?.id || postState.author_id}`
  const hashtags = (postState.hashtags || []).slice(0, 6)
  const previewImage = postState.image_urls?.[0] || null

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientOrigin(window.location.origin)
    }
  }, [])

  const videoUrl = useMemo(() => {
    const primary = postState.primary_video_url || ''
    if (primary) {
      return primary
    }

    return postState.media?.find((media) => media.kind === 'video')?.url || ''
  }, [postState.media, postState.primary_video_url])

  const canonicalUrl = useMemo(() => {
    if (postState.share_url) {
      return postState.share_url
    }

    const postPath = `/${locale}/community/posts/${postState.id}`
    return clientOrigin ? `${clientOrigin}${postPath}` : postPath
  }, [clientOrigin, locale, postState.id, postState.share_url])

  const embedUrl = useMemo(() => {
    if (!clientOrigin) {
      return null
    }

    return `${clientOrigin}/${locale}/embed/community/posts/${postState.id}`
  }, [clientOrigin, locale, postState.id])

  const ogImageUrl = useMemo(() => {
    if (postState.og_image_url) {
      return postState.og_image_url
    }

    if (!clientOrigin) {
      return null
    }

    return `${clientOrigin}/api/og/community/post/${postState.id}`
  }, [clientOrigin, postState.id, postState.og_image_url])

  useEffect(() => {
    const node = containerRef.current
    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsInView(!!entry?.isIntersecting && entry.intersectionRatio >= 0.65)
      },
      {
        threshold: [0.35, 0.65, 0.85],
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    video.muted = isMuted

    if (isInView) {
      void video.play().catch(() => {
        // Ignore autoplay rejections.
      })
      return
    }

    video.pause()
  }, [isInView, isMuted])

  const handleToggleMute = () => {
    setIsMuted((current) => !current)
  }

  const handleLike = async () => {
    const previousState = postState
    const wasLiked = !!postState.user_has_reacted
    setPostState((current) => ({
      ...current,
      user_has_reacted: !wasLiked,
      reactions_count: Math.max((current.reactions_count || 0) + (wasLiked ? -1 : 1), 0),
    }))

    try {
      await toggleLike(postState.id)
    } catch {
      setPostState(previousState)
      toast({
        title: t('feed.login_required_title'),
        description: t('feed.login_required_description'),
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
            {tNav('login')}
          </Button>
        ),
      })
    }
  }

  const handleBookmark = async () => {
    const previousState = postState
    setPostState((current) => ({
      ...current,
      user_has_bookmarked: !current.user_has_bookmarked,
    }))

    try {
      await toggleBookmark(postState.id)
    } catch {
      setPostState(previousState)
      toast({
        title: t('feed.login_required_title'),
        description: t('feed.login_required_description'),
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
            {tNav('login')}
          </Button>
        ),
      })
    }
  }

  const handleCommentCountChange = (delta: number) => {
    if (delta === 0) {
      return
    }

    setPostState((current) => ({
      ...current,
      comments_count: Math.max((current.comments_count || 0) + delta, 0),
    }))
  }

  const handleShareRecorded = () => {
    setPostState((current) => ({
      ...current,
      shares_count: (current.shares_count || 0) + 1,
    }))
  }

  return (
    <div ref={containerRef} className={className}>
      <article className="relative h-full w-full overflow-hidden bg-black">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="h-full w-full object-cover"
            loop
            autoPlay
            muted
            playsInline
            onClick={handleToggleMute}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            {t('reels.video_unavailable')}
          </div>
        )}

        <button
          type="button"
          onClick={handleToggleMute}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/60"
          aria-label={isMuted ? t('reels.unmute') : t('reels.mute')}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {isMuted ? (
          <p className="absolute left-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white">
            {t('reels.tap_unmute')}
          </p>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/75 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-5">
          <div className="min-w-0 space-y-2">
            <Link
              href={authorHref}
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-full bg-black/45 px-2 py-1 text-white transition-colors hover:bg-black/65"
            >
              <Avatar className="h-7 w-7 border border-white/25">
                <AvatarImage src={postState.author?.avatar_url || undefined} alt={authorName} />
                <AvatarFallback>{getInitial(authorName)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold">{authorName}</span>
            </Link>

            {postState.content ? (
              <p className="max-w-md whitespace-pre-wrap text-sm text-white/95">
                {postState.content}
              </p>
            ) : null}

            {hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((slug) => (
                  <Link
                    key={slug}
                    href={`/community?tag=${encodeURIComponent(slug)}&sort=best`}
                    prefetch={false}
                    className="rounded-full bg-white/15 px-2 py-0.5 text-xs text-white hover:bg-white/25"
                  >
                    #{slug}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="pointer-events-auto flex shrink-0 flex-col items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
              onClick={handleLike}
              aria-label={t('post.action_like')}
            >
              <Heart
                className={`h-5 w-5 ${postState.user_has_reacted ? 'fill-current text-red-400' : ''}`}
              />
            </Button>
            <span className="text-xs font-semibold text-white">
              {postState.reactions_count || 0}
            </span>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
              onClick={() => setIsCommentsOpen(true)}
              aria-label={t('post.action_comment')}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <span className="text-xs font-semibold text-white">
              {postState.comments_count || 0}
            </span>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
              onClick={handleBookmark}
              aria-label={t('post.action_bookmark')}
            >
              <Bookmark
                className={`h-5 w-5 ${postState.user_has_bookmarked ? 'fill-current text-primary' : ''}`}
              />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-11 w-11 rounded-full bg-black/45 text-white hover:bg-black/65 hover:text-white"
              onClick={() => setIsShareOpen(true)}
              aria-label={t('post.action_share')}
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <span className="text-xs font-semibold text-white">{postState.shares_count || 0}</span>
          </div>
        </div>
      </article>

      <ReelCommentsSheet
        open={isCommentsOpen}
        onOpenChange={setIsCommentsOpen}
        postId={postState.id}
        initialCount={postState.comments_count || 0}
        onCommentCountChange={handleCommentCountChange}
      />

      <ReelShareSheet
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        postId={postState.id}
        title={postState.content || authorName}
        description={postState.content}
        imageUrl={previewImage}
        canonicalUrl={canonicalUrl}
        embedUrl={embedUrl}
        ogImageUrl={ogImageUrl}
        onShareRecorded={handleShareRecorded}
      />
    </div>
  )
}
