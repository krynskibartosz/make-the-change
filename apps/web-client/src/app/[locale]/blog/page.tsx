import { Badge, Card, CardContent } from '@make-the-change/core/ui'
import { SectionContainer } from '@/components/ui/section-container'
import { getBlogPosts } from '@/features/blog/blog-data'
import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <SectionContainer
      size="lg"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-6 sm:py-10"
    >
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Blog</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Idées, impact, coulisses
            </h1>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
              <Card className="h-full overflow-hidden border bg-background/70 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative aspect-[16/10] bg-muted">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {post.featured ? (
                    <Badge className="absolute left-3 top-3 rounded-full">À la une</Badge>
                  ) : null}
                </div>
                <CardContent className="space-y-3 p-5">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {post.author?.name ? post.author.name : '—'}
                    {post.publishedAt ? ` • ${formatDate(post.publishedAt)}` : ''}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}
