'use client'

import type { Post } from '@make-the-change/core/shared'
import { Avatar, AvatarFallback, AvatarImage, Button, Textarea } from '@make-the-change/core/ui'
import { Image as ImageIcon, Loader2, Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { startTransition, useOptimistic, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from '@/i18n/navigation'
import { createPost, toggleLike, toggleSuperLike } from '@/lib/social/feed.actions'
import { PostCard } from './post-card'

interface FeedProps {
  initialPosts: Post[]
  hideCreatePost?: boolean
}

type OptimisticAction = { type: 'like'; postId: string } | { type: 'post'; post: Post }

export function FeedClient({ initialPosts, hideCreatePost = false }: FeedProps) {
  const { toast } = useToast()
  const router = useRouter()
  const t = useTranslations('community')
  const tNav = useTranslations('navigation')

  const [newPostContent, setNewPostContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  // Optimistic State
  const [optimisticPosts, setOptimisticPosts] = useOptimistic<Post[], OptimisticAction>(
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

  const handleSuperLike = async (postId: string) => {
    try {
      await toggleSuperLike(postId)
      toast({
        title: t('feed.super_like_success_title'),
        description: t('feed.super_like_success_description'),
      })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : t('feed.super_like_error_default')
      toast({
        title: t('feed.super_like_error_title'),
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPostContent.trim()) return

    setIsPosting(true)
    try {
      const tempPostId = `temp-${Date.now()}`

      // Fake a post for optimistic UI
      const tempPost: Post = {
        id: tempPostId,
        content: newPostContent,
        author_id: 'temp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        type: 'user_post',
        visibility: 'public',
        image_urls: [],
        project_update_id: null,
        metadata: {},
        author: { id: 'temp', full_name: 'Vous', avatar_url: '/images/avatars/default.png' },
        reactions_count: 0,
        comments_count: 0,
        user_has_reacted: false,
      }

      startTransition(() => {
        setOptimisticPosts({ type: 'post', post: tempPost })
      })

      const contentToPost = newPostContent
      setNewPostContent('')

      await createPost(contentToPost)
      router.refresh()
    } catch (_error) {
      toast({
        title: t('create_post.error_title'),
        description: t('create_post.error_description'),
        variant: 'destructive',
      })
    } finally {
      setIsPosting(false)
    }
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
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src="/images/avatars/default.png" alt="Vous" />
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
            <div className="flex items-center justify-between border-t border-border/50 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                disabled
              >
                <ImageIcon className="h-4 w-4" />
                {t('feed.image_label')}
              </Button>
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
        </div>
      )}

      {/* Posts List */}
      <div>
        {optimisticPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            <p>{t('feed.empty')}</p>
          </div>
        ) : (
          optimisticPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              postHref={post.id.startsWith('temp-') ? undefined : `/community/posts/${post.id}`}
              onLike={() => handleLike(post.id)}
              onSuperLike={() => handleSuperLike(post.id)}
              onComment={() => handleComment(post.id)}
              onShare={() => handleShare(post.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
