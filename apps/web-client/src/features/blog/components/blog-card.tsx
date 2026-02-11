import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'
import type { BlogPost } from '../blog-types'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  post: BlogPost
  className?: string
  variant?: 'default' | 'featured' | 'minimal'
}

export function BlogCard({ post, className, variant = 'default' }: BlogCardProps) {
  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`} className="group relative block h-full overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-muted">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-client-black/80 via-client-black/20 to-transparent" />
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 md:p-10">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} className="bg-client-white/10 hover:bg-client-white/20 text-client-white border-none backdrop-blur-md rounded-full px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-client-white leading-tight tracking-tight">
              {post.title}
            </h2>
            
            {post.excerpt && (
              <p className="line-clamp-2 text-lg text-client-white/80 max-w-2xl font-medium">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center gap-3 text-client-white/70 pt-2">
              {post.author?.avatarUrl && (
                <img src={post.author.avatarUrl} alt={post.author.name} className="h-8 w-8 rounded-full border border-client-white/10" />
              )}
              <span className="text-sm font-medium">{post.author?.name}</span>
              <span className="text-client-white/30">•</span>
              <span className="text-sm">{formatDate(post.publishedAt || '')}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'minimal') {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex gap-4 items-start">
        <div className="relative aspect-square w-24 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-muted">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>
        <div className="space-y-2 py-1">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 1).map((tag) => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatDate(post.publishedAt || '')}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block h-full", className)}>
      <div className="h-full flex flex-col overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : null}
          <div className="absolute inset-0 bg-client-black/10 transition-opacity group-hover:opacity-0" />
          {post.featured ? (
            <Badge className="absolute right-3 top-3 rounded-full bg-client-white/90 text-client-black hover:bg-client-white backdrop-blur-sm shadow-sm">
              ★ Featured
            </Badge>
          ) : null}
        </div>
        
        <div className="flex flex-1 flex-col p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold leading-snug tracking-tight group-hover:text-primary transition-colors">
              {post.title}
            </h2>
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
            <div className="flex items-center gap-2">
              {post.author?.avatarUrl ? (
                <img src={post.author.avatarUrl} alt={post.author.name} className="h-6 w-6 rounded-full" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-primary/10" />
              )}
              <span className="text-xs font-medium text-foreground/80">{post.author?.name}</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {formatDate(post.publishedAt || '')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

