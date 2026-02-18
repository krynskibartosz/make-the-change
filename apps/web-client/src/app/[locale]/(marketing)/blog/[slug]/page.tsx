import { Badge, Button } from '@make-the-change/core/ui'
import { ArrowLeft, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getBlogPostBySlug } from '@/app/[locale]/(marketing)/blog/_features/blog-data'
import { RenderTipTapContent } from '@/app/[locale]/(marketing)/blog/_features/content/render-tiptap-content'
import { Link } from '@/i18n/navigation'
import { formatDate } from '@/lib/utils'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  const t = await getTranslations('marketing_pages.blog_post')

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt, // Assuming no modified date available, fallback to published
    author: post.author
      ? [
        {
          '@type': 'Person',
          name: post.author.name,
          image: post.author.avatarUrl,
        },
      ]
      : undefined,
    description: post.excerpt,
  }

  return (
    <article className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto max-w-5xl px-4 pb-16 md:pb-24">
            <Link href="/blog">
              <Button
                variant="ghost"
                size="sm"
                className="mb-8 -ml-4 rounded-full text-marketing-overlay-light backdrop-blur-sm hover:bg-marketing-overlay-light/20 hover:text-marketing-overlay-light"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back_to_blog')}
              </Button>
            </Link>

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="rounded-full border-marketing-overlay-light/20 bg-marketing-overlay-light/10 px-4 py-1.5 text-sm text-marketing-overlay-light backdrop-blur-md transition-colors hover:bg-marketing-overlay-light/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tighter text-marketing-overlay-light drop-shadow-sm md:text-7xl lg:text-8xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 pt-4 text-base font-medium text-marketing-overlay-light/90 md:text-lg">
                {post.author && (
                  <div className="flex items-center gap-3">
                    {post.author.avatarUrl ? (
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="h-12 w-12 rounded-full border-2 border-marketing-overlay-light/20 shadow-xl"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-marketing-overlay-light/20 bg-marketing-overlay-light/10 shadow-xl">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="leading-none font-bold">{post.author.name}</span>
                      <span className="mt-1 text-xs opacity-70">{t('author_label')}</span>
                    </div>
                  </div>
                )}

                {post.publishedAt && (
                  <div className="flex h-10 items-center gap-3 border-l border-marketing-overlay-light/20 pl-4">
                    <div className="flex flex-col">
                      <span className="leading-none font-bold">{formatDate(post.publishedAt)}</span>
                      <span className="mt-1 text-xs opacity-70">{t('published_label')}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-20 md:py-32">
        {post.excerpt && (
          <p className="mb-16 text-2xl font-medium leading-relaxed text-foreground/80 md:text-3xl">
            {post.excerpt}
          </p>
        )}

        <RenderTipTapContent content={post.content} className="max-w-none" />

        <div className="mt-20 flex items-center justify-between border-t pt-10">
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('all_articles')}
            </Button>
          </Link>
        </div>
      </div>
    </article>
  )
}
