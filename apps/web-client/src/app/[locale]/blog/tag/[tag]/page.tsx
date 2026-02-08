import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowLeft } from 'lucide-react'
import { SectionContainer } from '@/components/ui/section-container'
import { getBlogPostsByTag } from '@/features/blog/blog-data'
import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'

interface BlogTagPageProps {
  params: Promise<{ tag: string }>
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const posts = await getBlogPostsByTag(decoded)

  return (
    <SectionContainer
      size="lg"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-6 sm:py-10"
    >
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Blog
            </Button>
          </Link>
          <Badge variant="secondary" className="rounded-full">
            Tag: {decoded}
          </Badge>
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
                </div>
                <CardContent className="space-y-2 p-5">
                  <h2 className="text-lg font-semibold leading-snug">{post.title}</h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground">
                    {post.author?.name ? post.author.name : '—'}
                    {post.publishedAt ? ` • ${formatDate(post.publishedAt)}` : ''}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {posts.length === 0 ? (
            <Card className="border bg-background/70 shadow-sm backdrop-blur sm:col-span-2 lg:col-span-3">
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                Aucun article pour ce tag.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </SectionContainer>
  )
}
