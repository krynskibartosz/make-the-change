'use client'

import type { Post } from '@make-the-change/core/shared'
import { Avatar, AvatarFallback, AvatarImage, Button, Textarea } from '@make-the-change/core/ui'
import { Loader2, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { startTransition, useOptimistic, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from '@/i18n/navigation'
import { createPost, toggleBookmark, toggleLike } from '@/lib/social/feed.actions'
import { PostCard } from './post-card'

interface FeedProps {
  initialPosts: Post[]
  hideCreatePost?: boolean
  canWrite?: boolean
  guildId?: string
  emptyMessage?: string
}

type OptimisticAction =
  | { type: 'like'; postId: string }
  | { type: 'bookmark'; postId: string }
  | { type: 'post'; post: Post }
type FeedOptimisticAction = OptimisticAction | { type: 'remove_post'; postId: string }

export function FeedClient({
  initialPosts,
  hideCreatePost = false,
  canWrite = false,
  guildId,
  emptyMessage,
}: FeedProps) {
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('community')
  const tNav = useTranslations('navigation')

  const [newPostContent, setNewPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const hashtagSuggestions = t('create_post.suggested_hashtags')
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)

  // Optimistic State
  const [optimisticPosts, setOptimisticPosts] = useOptimistic<Post[], FeedOptimisticAction>(
    initialPosts,
    (currentPosts, action) => {
      if (action.type === 'like') {
        return currentPosts.map((post) => {
          if (post.id === action.postId) {
            const wasLiked = post.user_has_reacted
            return {
              ...post,
              user_has_reacted: !wasLiked,
              reactions_count: (post.reactions_count || 0) + (wasLiked ? -1 : 1),
            }
          }
          return post
        })
      }
      if (action.type === 'post') {
        return [action.post, ...currentPosts]
      }
      if (action.type === 'bookmark') {
        return currentPosts.map((post) => {
          if (post.id !== action.postId) {
            return post
          }

          return {
            ...post,
            user_has_bookmarked: !post.user_has_bookmarked,
          }
        })
      }
      if (action.type === 'remove_post') {
        return currentPosts.filter((post) => post.id !== action.postId)
      }
      return currentPosts
    },
  )

  const handleLike = async (postId: string) => {
    // 1. Optimistic Update
    startTransition(() => {
      setOptimisticPosts({ type: 'like', postId })
    })

    // 2. Server Action
    try {
      await toggleLike(postId)
    } catch (_error) {
      startTransition(() => {
        setOptimisticPosts({ type: 'like', postId })
      })

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

  const handleBookmark = async (postId: string) => {
    startTransition(() => {
      setOptimisticPosts({ type: 'bookmark', postId })
    })

    try {
      await toggleBookmark(postId)
    } catch (_error) {
      startTransition(() => {
        setOptimisticPosts({ type: 'bookmark', postId })
      })

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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canWrite) {
      toast({
        title: t('feed.login_required_title'),
        description: t('feed.login_required_description'),
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
            {tNav('login')}
          </Button>
        ),
      })
      return
    }

    const contentToPost = newPostContent.trim()
    if (!contentToPost) return

    setIsPosting(true)
    let tempPostId: string | null = null
    setNewPostContent('')

    try {
      tempPostId = `temp-${Date.now()}`

      // Fake a post for optimistic UI
      const tempPost: Post = {
        id: tempPostId,
        content: contentToPost,
        author_id: 'temp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: 'user_post',
        visibility: 'public',
        image_urls: [],
        project_update_id: null,
        metadata: {},
        author: {
          id: 'temp',
          full_name: t('thread.you_label'),
          avatar_url: '',
        },
        reactions_count: 0,
        comments_count: 0,
        user_has_reacted: false,
        user_has_bookmarked: false,
      }

      startTransition(() => {
        setOptimisticPosts({ type: 'post', post: tempPost })
      })

      await createPost(contentToPost, [], { guildId: guildId || null })
      router.refresh()
    } catch (error: unknown) {
      if (tempPostId) {
        const postIdToRemove = tempPostId
        startTransition(() => {
          setOptimisticPosts({ type: 'remove_post', postId: postIdToRemove })
        })
      }

      setNewPostContent(contentToPost)

      const errorMessage = error instanceof Error ? error.message : ''
      const isLoginError = errorMessage.toLowerCase().includes('connect')

      toast({
        title: isLoginError ? t('feed.login_required_title') : t('create_post.error_title'),
        description: isLoginError
          ? t('feed.login_required_description')
          : t('create_post.error_description'),
        variant: 'destructive',
        action: isLoginError ? (
          <Button variant="outline" size="sm" onClick={() => router.push('/login')}>
            {tNav('login')}
          </Button>
        ) : undefined,
      })
    } finally {
      setIsPosting(false)
    }
  }

  const addSuggestedHashtag = (slug: string) => {
    const hashtag = `#${slug.replace(/^#/, '')}`
    if (newPostContent.includes(hashtag)) {
      return
    }

    setNewPostContent((current) => `${current.trim()}${current.trim() ? ' ' : ''}${hashtag}`)
  }

  const handleComment = (postId: string) => {
    router.push(`/community/posts/${postId}`)
  }

  const handleShare = (postId: string) => {
    router.push(`/community/posts/${postId}/share`)
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Create Post Form */}
      {!hideCreatePost && (
        <div className="border-b border-border bg-background p-4 sm:p-6">
          {canWrite ? (
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage alt={t('thread.you_label')} />
                  <AvatarFallback>V</AvatarFallback>
                </Avatar>
                <Textarea
                  placeholder={t('feed.placeholder')}
                  className="min-h-[100px] resize-none border-border/50 bg-background/50 text-base"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  disabled={isPosting}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {hashtagSuggestions.map((slug) => (
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

              <div className="flex items-center justify-end border-t border-border/50 pt-3">
                <Button
                  type="submit"
                  size="sm"
                  className="gap-2 rounded-full px-6"
                  disabled={isPosting || !newPostContent.trim()}
                >
                  {isPosting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isPosting ? t('create_post.publishing') : t('create_post.publish')}
                </Button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              <p>{t('feed.write_login_prompt')}</p>
              <Button className="mt-3" size="sm" onClick={() => router.push('/login')}>
                {tNav('login')}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Posts List */}
      <div>
        {optimisticPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            <p>{emptyMessage || t('feed.empty')}</p>
          </div>
        ) : (
          optimisticPosts.map((post) => {
            const isTemporaryPost = post.id.startsWith('temp-')

            return (
              <PostCard
                key={post.id}
                post={post}
                postHref={isTemporaryPost ? undefined : `/community/posts/${post.id}`}
                readonlyActions={isTemporaryPost}
                onLike={() => handleLike(post.id)}
                onBookmark={() => handleBookmark(post.id)}
                onComment={() => handleComment(post.id)}
                onShare={() => handleShare(post.id)}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
