import { db } from '@make-the-change/core/db'
import { blog_posts } from '@make-the-change/core/schema'
import { and, asc, count, desc, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { BlogClient } from './blog-client'
import { loadBlogSearchParams } from './blog-search-params'

const PAGE_SIZE = 10

type SearchParams = {
  q?: string
  page?: string
  sort?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.blog',
  })
  
  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function BlogPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await loadBlogSearchParams(props.searchParams)
  
  const {
    q,
    page,
    sort,
  } = searchParams

  const offset = (page - 1) * PAGE_SIZE

  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(
        ilike(blog_posts.title, searchLower),
        ilike(blog_posts.slug, searchLower),
      ),
    )
  }

  let orderBy = desc(blog_posts.created_at)
  if (sort) {
    switch (sort) {
      case 'created_at_asc':
        orderBy = asc(blog_posts.created_at)
        break
      case 'created_at_desc':
        orderBy = desc(blog_posts.created_at)
        break
      case 'title_asc':
        orderBy = asc(blog_posts.title)
        break
      case 'title_desc':
        orderBy = desc(blog_posts.title)
        break
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // We should ideally join with authors (profiles or blog_authors)
  // For now we'll just fetch posts
  const [postsResult, countResult] = await Promise.all([
    db.query.blog_posts.findMany({
      where: whereClause,
      orderBy: orderBy,
      limit: PAGE_SIZE,
      offset: offset,
      with: {
        author: true // assuming relation exists
      }
    }),
    db.select({ count: count() }).from(blog_posts).where(whereClause),
  ])

  const items = postsResult.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    created_at: p.created_at.toISOString(),
    author_name: (p as any).author?.name || 'Inconnu'
  }))

  const total = countResult[0]?.count ?? 0

  return <BlogClient initialData={{ items, total }} />
}
