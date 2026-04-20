import type { Locale } from '@make-the-change/core/i18n'
import { defaultLocale, isLocale } from '@make-the-change/core/i18n'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArticleHeader } from '@/app/[locale]/(focus)/blog/_features/blog-shell'
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

  const wordCount = post.rawContent.split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))
  const primaryTag = post.tags[0] ?? null
  const authorInitials = post.author?.name
    ? post.author.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'MT'

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
    <div className="min-h-screen bg-[#0B0F15] text-white pb-24">
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <ArticleHeader />

      <main className="pt-[72px]">
        {/* Cover image */}
        <div className="w-full aspect-video bg-[#1A1F26] overflow-hidden">
          {post.coverImage ? (
            // biome-ignore lint/performance/noImgElement: remote cover image
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-lime-500/20 via-emerald-900/20 to-[#0B0F15]" />
          )}
        </div>

        {/* Article header */}
        <header className="px-6 pt-6">
          <div className="flex items-center gap-2 mb-4">
            {primaryTag ? (
              <span className="px-2.5 py-1 rounded-md bg-lime-400/10 text-lime-400 text-[10px] font-bold uppercase tracking-wider border border-lime-400/20">
                {primaryTag}
              </span>
            ) : null}
            <span className="text-xs text-gray-500 font-medium">
              {t('reading_time', { minutes: readingTime })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-6 text-balance">
            {post.title}
          </h1>

          {/* Author + date */}
          <div className="flex items-center gap-3 py-4 border-y border-white/5">
            {post.author?.avatarUrl ? (
              // biome-ignore lint/performance/noImgElement: remote avatar
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="h-10 w-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center shrink-0">
                <span className="text-[#0B0F15] font-bold text-sm">{authorInitials}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none">
                {post.author?.name ?? t('team_name')}
              </span>
              {post.publishedAt ? (
                <span className="mt-1 text-xs text-gray-500">
                  {t('published_on', { date: formatDate(post.publishedAt) })}
                </span>
              ) : null}
            </div>
          </div>
        </header>

        {/* Article body */}
        <article className="px-6 pt-8 pb-12">
          {post.excerpt ? (
            <p className="mb-8 text-lg leading-relaxed text-white/70 text-pretty font-light border-l-2 border-lime-400/40 pl-4 italic">
              {post.excerpt}
            </p>
          ) : null}

          {/* Drop cap on first paragraph via scoped CSS */}
          <style>{`.article-body>div>p:first-of-type::first-letter{font-size:3.5rem;font-weight:900;float:left;margin-right:0.35rem;margin-top:0.1rem;line-height:1;color:white}`}</style>
          <div className="article-body">
            <RenderTipTapContent
              content={post.content}
              className="[&_p]:text-gray-300 [&_p]:leading-relaxed max-w-none"
            />
          </div>
        </article>
      </main>
    </div>
  )
}
