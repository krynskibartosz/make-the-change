import { Badge, Button, Card, CardContent } from '@make-the-change/core/ui'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SectionContainer } from '@/components/ui/section-container'
import { getBlogPostBySlug } from '@/features/blog/blog-data'
import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const paragraphs = post.content
    ? post.content
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean)
    : []

  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-4 sm:py-8"
    >
      <div className="space-y-6">
        <Link href="/blog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Blog
          </Button>
        </Link>

        <Card className="overflow-hidden border bg-background/70 shadow-sm backdrop-blur">
          {post.coverImage ? (
            <div className="relative aspect-[16/8] bg-muted">
              <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                      <Badge variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {post.title}
                </h1>
                <p className="mt-2 text-sm text-white/80">
                  {post.author?.name ? post.author.name : '—'}
                  {post.publishedAt ? ` • ${formatDate(post.publishedAt)}` : ''}
                </p>
              </div>
            </div>
          ) : null}

          <CardContent className="space-y-4 p-6 sm:p-8">
            {!post.coverImage ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link key={tag} href={`/blog/tag/${encodeURIComponent(tag)}`}>
                      <Badge variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {post.author?.name ? post.author.name : '—'}
                  {post.publishedAt ? ` • ${formatDate(post.publishedAt)}` : ''}
                </p>
              </div>
            ) : null}

            {post.excerpt ? (
              <p className="text-base text-muted-foreground">{post.excerpt}</p>
            ) : null}

            <div className="space-y-4 text-[15px] leading-relaxed">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, idx) => (
                  <p key={idx} className="text-foreground/90">
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-muted-foreground">Contenu indisponible.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  )
}
