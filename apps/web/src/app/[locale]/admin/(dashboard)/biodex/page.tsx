import { db } from '@make-the-change/core/db'
import { species } from '@make-the-change/core/schema'
import { and, asc, count, desc, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { BiodexClient } from './biodex-client'
import { loadBiodexSearchParams } from './biodex-search-params'

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
    namespace: 'admin.biodex',
  })
  
  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function BiodexPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await loadBiodexSearchParams(props.searchParams)
  
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
        ilike(species.name, searchLower),
        ilike(species.scientific_name, searchLower),
      ),
    )
  }

  let orderBy = desc(species.created_at)
  if (sort) {
    switch (sort) {
      case 'created_at_asc':
        orderBy = asc(species.created_at)
        break
      case 'created_at_desc':
        orderBy = desc(species.created_at)
        break
      case 'name_asc':
        orderBy = asc(species.name)
        break
      case 'name_desc':
        orderBy = desc(species.name)
        break
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [speciesResult, countResult] = await Promise.all([
    db.query.species.findMany({
      where: whereClause,
      orderBy: orderBy,
      limit: PAGE_SIZE,
      offset: offset,
    }),
    db.select({ count: count() }).from(species).where(whereClause),
  ])

  const items = speciesResult.map(s => ({
    id: s.id,
    name_default: s.name,
    scientific_name: s.scientific_name,
    conservation_status: s.iucn_status,
    is_featured: s.is_featured ?? false,
    created_at: s.created_at?.toISOString() ?? new Date().toISOString(),
  }))

  const total = countResult[0]?.count ?? 0

  return <BiodexClient initialData={{ items, total }} />
}
