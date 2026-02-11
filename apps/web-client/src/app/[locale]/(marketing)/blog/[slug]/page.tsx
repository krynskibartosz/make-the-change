import { Badge, Button } from '@make-the-change/core/ui'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { getBlogPostBySlug } from '@/features/blog/blog-data'
import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container px-4 pb-16 md:pb-24 max-w-5xl mx-auto">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 mb-8 -ml-4 rounded-full backdrop-blur-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au blog
              </Button>
            </Link>
            
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <Badge key={tag} className="bg-white/10 text-white border-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-sm hover:bg-white/20 transition-colors">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.95] drop-shadow-sm max-w-4xl">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 text-white/90 text-base md:text-lg font-medium pt-4">
                {post.author && (
                  <div className="flex items-center gap-3">
                    {post.author.avatarUrl ? (
                      <img 
                        src={post.author.avatarUrl} 
                        alt={post.author.name} 
                        className="h-12 w-12 rounded-full border-2 border-white/20 shadow-xl"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 shadow-xl">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="leading-none font-bold">{post.author.name}</span>
                      <span className="text-xs opacity-70 mt-1">Auteur</span>
                    </div>
                  </div>
                )}
                
                {post.publishedAt && (
                  <div className="flex items-center gap-3 pl-4 border-l border-white/20 h-10">
                    <div className="flex flex-col">
                      <span className="leading-none font-bold">{formatDate(post.publishedAt)}</span>
                      <span className="text-xs opacity-70 mt-1">Publié le</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container px-4 py-20 md:py-32 max-w-4xl mx-auto">
        {post.excerpt && (
          <p className="text-2xl md:text-3xl font-medium text-foreground/80 mb-16 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        
        <div className="prose prose-xl dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline max-w-none prose-img:rounded-3xl prose-img:shadow-2xl">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
        
        {/* Footer Navigation */}
        <div className="mt-20 pt-10 border-t flex justify-between items-center">
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tous les articles
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
