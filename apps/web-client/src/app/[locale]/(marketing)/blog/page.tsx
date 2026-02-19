import { getTranslations } from 'next-intl/server'
import { getBlogPosts } from '@/app/[locale]/(marketing)/blog/_features/blog-data'
import { BlogCard } from '@/app/[locale]/(marketing)/blog/_features/components/blog-card'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface BlogPageProps {
  searchParams: Promise<{
    category?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const t = await getTranslations('marketing_pages.blog_list')
  const navT = await getTranslations('navigation')
  const params = await searchParams
  const posts = await getBlogPosts()

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

  const categoryLabel =
    normalizedCategory === 'all'
      ? t('categories.all')
      : categories.find((tag) => tag.toLowerCase() === normalizedCategory) || selectedCategory

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title={t('title')}
        description={t('description')}
        badge={t('badge')}
        size="lg"
        variant="gradient"
      >
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/blog"
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-all',
              normalizedCategory === 'all'
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
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
                  'rounded-full px-4 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                )}
              >
                {category}
              </Link>
            )
          })}
        </div>
      </PageHero>

      <div className="container py-6">
        <Breadcrumbs items={[{ label: navT('blog'), href: '/blog' }]} />
      </div>

      {featuredPost ? (
        <SectionContainer size="md" className="pt-0">
          <div className="relative group">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
            <BlogCard
              post={featuredPost}
              variant="featured"
              className="aspect-[4/3] lg:aspect-[3/2]"
            />
          </div>
        </SectionContainer>
      ) : null}

      <SectionContainer
        size="lg"
        className={cn('bg-muted/30', featuredPost ? 'pt-6' : 'pt-0')}
        title={t('recent_title')}
        description={t('active_filter', { category: categoryLabel })}
      >
        {otherPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed bg-background/70 p-10 text-center">
            <p className="text-lg font-semibold">{t('empty_title')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t('empty_description')}</p>
          </div>
        )}
      </SectionContainer>
    </div>
  )
}
