'use client'

import type { Post } from '@make-the-change/core/shared'
import { Avatar, AvatarFallback, AvatarImage, Badge, Button } from '@make-the-change/core/ui'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Heart, MessageCircle, MoreHorizontal, Share2, Sprout } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

interface PostCardProps {
  post: Post
  postHref?: string
  onLike?: (postId: string) => void
  onSuperLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
}

export function PostCard({
  post,
  postHref,
  onLike,
  onSuperLike,
  onComment,
  onShare,
}: PostCardProps) {
  const authorName = post.author?.full_name || 'Utilisateur inconnu'
  const authorAvatar = post.author?.avatar_url || '/images/avatars/default.png'
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: fr })
  const authorHref = `/profile/${post.author?.id || post.author_id}`

  return (
    <article className="border-b border-border bg-background transition-colors hover:bg-muted/30">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <Link
            href={authorHref}
            className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={authorAvatar} alt={authorName} />
              <AvatarFallback>{authorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-foreground">{authorName}</div>
              <div className="text-xs text-muted-foreground">{timeAgo}</div>
            </div>
          </Link>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {postHref ? (
            <Link
              href={postHref}
              className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {post.content && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {post.content}
                </p>
              )}

              {/* Images Grid */}
              {post.image_urls && post.image_urls.length > 0 && (
                <div
                  className={`mt-4 grid gap-2 overflow-hidden rounded-xl ${
                    post.image_urls.length === 1
                      ? 'grid-cols-1'
                      : post.image_urls.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-2'
                  }`}
                >
                  {post.image_urls.slice(0, 4).map((url, index) => (
                    <div
                      key={index}
                      className={`relative aspect-video w-full overflow-hidden bg-muted ${
                        post.image_urls.length === 3 && index === 0 ? 'col-span-2' : ''
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Image du post de ${authorName}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Link>
          ) : (
            <>
              {post.content && (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {post.content}
                </p>
              )}

              {/* Images Grid */}
              {post.image_urls && post.image_urls.length > 0 && (
                <div
                  className={`grid gap-2 overflow-hidden rounded-xl ${
                    post.image_urls.length === 1
                      ? 'grid-cols-1'
                      : post.image_urls.length === 2
                        ? 'grid-cols-2'
                        : 'grid-cols-2'
                  }`}
                >
                  {post.image_urls.slice(0, 4).map((url, index) => (
                    <div
                      key={index}
                      className={`relative aspect-video w-full overflow-hidden bg-muted ${
                        post.image_urls.length === 3 && index === 0 ? 'col-span-2' : ''
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Image du post de ${authorName}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Project Update Context Badge */}
          {post.type === 'project_update_share' && (
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              Update Projet
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${post.user_has_reacted ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => onLike?.(post.id)}
            >
              <Heart className={`h-4 w-4 ${post.user_has_reacted ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{post.reactions_count || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onSuperLike?.(post.id)}
            >
              <Sprout className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => onComment?.(post.id)}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">{post.comments_count || 0}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => onShare?.(post.id)}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs font-medium">Partager</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
