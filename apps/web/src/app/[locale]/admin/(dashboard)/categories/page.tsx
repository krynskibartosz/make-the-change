import { db } from '@make-the-change/core/db'
import { categories, products } from '@make-the-change/core/schema'
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { CategoriesClient } from './categories-client'
import { loadCategorySearchParams } from './categories-search-params'

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
    namespace: 'admin.categories',
  })
  
  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function CategoriesPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await loadCategorySearchParams(props.searchParams)
  
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
        ilike(categories.name_default, searchLower),
        ilike(categories.description_default, searchLower),
        ilike(categories.slug, searchLower),
      ),
    )
  }

  let orderBy = desc(categories.created_at)
  if (sort) {
    switch (sort) {
      case 'created_at_asc':
        orderBy = asc(categories.created_at)
        break
      case 'created_at_desc':
        orderBy = desc(categories.created_at)
        break
      case 'name_asc':
        orderBy = asc(categories.name_default)
        break
      case 'name_desc':
        orderBy = desc(categories.name_default)
        break
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // We want to count products per category, but Drizzle relation count might be tricky in simple query
  // For now we'll fetch categories and maybe join or just not show counts if it's complex without aggregation
  // Let's try to just list categories first.

  const [categoriesResult, countResult] = await Promise.all([
    db.query.categories.findMany({
      where: whereClause,
      orderBy: orderBy,
      limit: PAGE_SIZE,
      offset: offset,
      // We can't easily count related products in a single findMany without extra SQL or aggregation helpers
      // If we want counts, we might need raw SQL or separate queries.
      // For MVP, we skip counts or do a separate count query if needed.
    }),
    db.select({ count: count() }).from(categories).where(whereClause),
  ])

  // Enhance with counts if possible, or just mock for now
  // To get real counts efficiently we'd need a left join and group by.
  
  const items = categoriesResult.map(c => ({
    id: c.id,
    name_default: c.name_default,
    description_default: c.description_default,
    slug: c.slug,
    parent_id: c.parent_id,
    is_active: c.is_active,
    created_at: c.created_at.toISOString(),
    updated_at: c.updated_at.toISOString(),
    _count: {
        products: 0, // Placeholder
        children: 0 // Placeholder
    }
  }))

  const total = countResult[0]?.count ?? 0

  return <CategoriesClient initialData={{ items, total }} />
}
