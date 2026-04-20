import type { Locale } from '@make-the-change/core/i18n'
import { defaultLocale, isLocale } from '@make-the-change/core/i18n'
import { getLocale, getTranslations } from 'next-intl/server'
import { getBlogPosts } from '@/app/[locale]/(focus)/blog/_features/blog-data'
import { BlogShell } from '@/app/[locale]/(focus)/blog/_features/blog-shell'
import { Link } from '@/i18n/navigation'
import { cn, formatDate, getLocalizedContent } from '@/lib/utils'

interface BlogPageProps {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const t = await getTranslations('marketing_pages.blog_list')
  const localeValue = await getLocale()
  const locale: Locale = isLocale(localeValue) ? localeValue : defaultLocale
  const params = await searchParams

  const rawPosts = await getBlogPosts()
  const posts = rawPosts.map((post) => ({
    ...post,
    title: getLocalizedContent(post.titleI18n, locale, post.title),
    excerpt: getLocalizedContent(post.excerptI18n, locale, post.excerpt),
  }))

  const selectedCategory = params.category?.trim() || 'all'
  const normalizedCategory = selectedCategory.toLowerCase()

  const categories = Array.from(
    new Set(
      posts
        .flatMap((post) => post.tags)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    ),
  ).sort((first, second) => first.localeCompare(second))

  const filteredPosts =
    normalizedCategory === 'all'
      ? posts
      : posts.filter((post) => post.tags.some((tag) => tag.toLowerCase() === normalizedCategory))

  const featuredPost = filteredPosts.find((post) => post.featured) || filteredPosts[0]
  const otherPosts = filteredPosts.filter((post) => post.id !== featuredPost?.id)

  return (
    <BlogShell title="Blog">
      {/* Halo lumineux */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-lime-500/5 blur-[100px] pointer-events-none z-0" />

      {/* HERO éditorial */}
      <div className="relative z-10 px-6 pt-24 pb-6 flex flex-col items-start">
        <span className="text-[10px] font-bold tracking-[0.25em] text-lime-400 uppercase mb-3">
          {t('badge')}
        </span>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance text-white hyphens-none leading-[1.1]">
          {t('title')}
        </h1>
        <p className="text-base font-light leading-relaxed text-pretty text-gray-400">
          {t('description')}
        </p>
      </div>

      {/* Chips catégories scrollables */}
      {categories.length > 0 ? (
        <div className="relative z-10 w-full overflow-x-auto pb-2 mb-6 pt-2 px-6 flex gap-2" style={{ scrollbarWidth: 'none' }}>
          <Link
            href="/blog"
            className={cn(
              'whitespace-nowrap px-4 py-2 rounded-full text-sm',
              normalizedCategory === 'all'
                ? 'bg-lime-400 text-[#0B0F15] font-bold'
                : 'border border-white/10 bg-white/5 text-gray-400',
            )}
          >
            {t('categories.all')}
          </Link>
          {categories.map((category) => {
            const isActive = normalizedCategory === category.toLowerCase()
            return (
              <Link
                key={category}
                href={`/blog?category=${encodeURIComponent(category)}`}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-full text-sm',
                  isActive
                    ? 'bg-lime-400 text-[#0B0F15] font-bold'
                    : 'border border-white/10 bg-white/5 text-gray-400',
                )}
              >
                {category}
              </Link>
            )
          })}
        </div>
      ) : null}

      {/* Hero Card : article à la une */}
      {featuredPost ? (
        <Link
          href={`/blog/${featuredPost.slug}`}
          className="relative z-10 mx-6 mb-8 block overflow-hidden rounded-3xl aspect-[4/5] sm:aspect-video border border-white/5 shadow-2xl bg-[#1A1F26] group"
        >
          {featuredPost.coverImage ? (
            // biome-ignore lint/performance/noImgElement: blog cover can be remote
            <img
              src={featuredPost.coverImage}
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-lime-500/20 via-emerald-900/20 to-[#0B0F15]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F15] via-[#0B0F15]/80 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start">
            <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider mb-3">
              À la une
            </span>
            <h2 className="text-2xl font-black text-white mb-2 leading-tight text-balance">
              {featuredPost.title}
            </h2>
            <span className="text-xs text-gray-300 font-medium">
              {featuredPost.publishedAt ? formatDate(featuredPost.publishedAt) : null}
            </span>
          </div>
        </Link>
      ) : null}

      {/* Flux d'articles : liste compacte */}
      {otherPosts.length > 0 ? (
        <div className="relative z-10 px-6 flex flex-col gap-6 mb-12">
          {otherPosts.map((post) => {
            const primaryTag = post.tags[0]
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex items-center gap-4 group cursor-pointer w-full hover:bg-white/[0.02] p-2 -mx-2 rounded-2xl transition-colors"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-white/5 bg-[#1A1F26]">
                  {post.coverImage ? (
                    // biome-ignore lint/performance/noImgElement: blog cover can be remote
                    <img
                      src={post.coverImage}
                      alt="Miniature"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A1F26]" />
                  )}
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0 py-1">
                  {primaryTag ? (
                    <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest mb-1.5">
                      {primaryTag}
                    </span>
                  ) : null}
                  <h3 className="text-base font-bold text-white leading-snug line-clamp-2 mb-2 text-pretty">
                    {post.title}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {post.publishedAt ? formatDate(post.publishedAt) : null}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="relative z-10 mx-6 flex flex-col items-center rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.05] to-transparent p-8 text-center">
          <p className="mb-2 text-base font-bold text-white">{t('empty_title')}</p>
          <p className="text-sm text-gray-400 text-pretty">{t('empty_description')}</p>
        </div>
      )}
    </BlogShell>
  )
}
