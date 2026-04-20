import type { Locale } from '@make-the-change/core/i18n'
import { defaultLocale, isLocale } from '@make-the-change/core/i18n'
import { User } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { BlogShell } from '@/app/[locale]/(focus)/blog/_features/blog-shell'
import { getBlogPostBySlug } from '@/app/[locale]/(focus)/blog/_features/blog-data'
import { RenderTipTapContent } from '@/app/[locale]/(focus)/blog/_features/content/render-tiptap-content'
import { formatDate, getLocalizedContent } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {}
  }

  const localeValue = await getLocale()
  const locale: Locale = isLocale(localeValue) ? localeValue : defaultLocale
  const localizedTitle = getLocalizedContent(post.titleI18n, locale, post.title)
  const localizedExcerpt = getLocalizedContent(post.excerptI18n, locale, post.excerpt)

  return {
    title: localizedTitle,
    description: localizedExcerpt,
    openGraph: {
      title: localizedTitle,
      description: localizedExcerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const rawPost = await getBlogPostBySlug(slug)
  const t = await getTranslations('marketing_pages.blog_post')
  const localeValue = await getLocale()
  const locale: Locale = isLocale(localeValue) ? localeValue : defaultLocale

  if (!rawPost) {
    notFound()
  }

  const post = {
    ...rawPost,
    title: getLocalizedContent(rawPost.titleI18n, locale, rawPost.title),
    excerpt: getLocalizedContent(rawPost.excerptI18n, locale, rawPost.excerpt),
  }

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
    <BlogShell title={post.title}>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* Cover hero */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[3/2] overflow-hidden">
        {post.coverImage ? (
          // biome-ignore lint/performance/noImgElement: remote cover image
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 via-emerald-900/20 to-[#0B0F15]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pt-20 pb-8 flex flex-col items-start">
          {post.tags.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white hyphens-none text-balance leading-[1.1]">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Meta : auteur + date */}
      <div className="relative z-10 px-6 pt-6 flex items-center gap-4 border-b border-white/5 pb-6">
        {post.author ? (
          <div className="flex items-center gap-3">
            {post.author.avatarUrl ? (
              // biome-ignore lint/performance/noImgElement: remote avatar
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="h-10 w-10 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <User className="h-5 w-5 text-white/80" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white leading-none">
                {post.author.name}
              </span>
              <span className="mt-1 text-[11px] uppercase tracking-wider text-gray-500">
                {t('author_label')}
              </span>
            </div>
          </div>
        ) : null}
        {post.publishedAt ? (
          <div className="ml-auto flex flex-col items-end">
            <span className="text-sm font-semibold text-white leading-none">
              {formatDate(post.publishedAt)}
            </span>
            <span className="mt-1 text-[11px] uppercase tracking-wider text-gray-500">
              {t('published_label')}
            </span>
          </div>
        ) : null}
      </div>

      {/* Corps de l'article */}
      <article className="relative z-10 px-6 pt-8 pb-12">
        {post.excerpt ? (
          <p className="mb-8 text-lg leading-relaxed text-white/80 text-pretty font-light">
            {post.excerpt}
          </p>
        ) : null}

        <RenderTipTapContent content={post.content} className="max-w-none" />
      </article>
    </BlogShell>
  )
}
