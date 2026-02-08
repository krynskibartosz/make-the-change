import { db } from '@make-the-change/core/db'
import { points_transactions, profiles } from '@make-the-change/core/schema'
import { and, asc, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { PointsClient } from './points-client'
import { loadPointsSearchParams } from './points-search-params'

const PAGE_SIZE = 20

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
    namespace: 'admin.points',
  })
  
  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function PointsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await loadPointsSearchParams(props.searchParams)
  
  const {
    q,
    page,
    sort,
  } = searchParams

  const offset = (page - 1) * PAGE_SIZE

  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    // We need to join with profiles to search by email, but for simple where clause in findMany with relations, 
    // Drizzle's `where` applies to the main table. 
    // Searching by relation field usually requires `eq` on ID or specialized query.
    // For now, let's search description. 
    // To search user email, we'd need to fetch user IDs first or use a join.
    conditions.push(
        ilike(points_transactions.description, searchLower)
    )
  }

  let orderBy = desc(points_transactions.created_at)
  if (sort) {
    switch (sort) {
      case 'created_at_asc':
        orderBy = asc(points_transactions.created_at)
        break
      case 'created_at_desc':
        orderBy = desc(points_transactions.created_at)
        break
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [txResult, countResult] = await Promise.all([
    db.query.points_transactions.findMany({
      where: whereClause,
      orderBy: orderBy,
      limit: PAGE_SIZE,
      offset: offset,
      with: {
        user: true // Assuming 'user' relation points to profiles
      }
    }),
    db.select({ count: count() }).from(points_transactions).where(whereClause),
  ])

  const items = txResult.map(tx => ({
    id: tx.id,
    user_email: (tx as any).user?.email || 'Inconnu',
    amount: tx.amount,
    type: tx.type,
    description: tx.description,
    created_at: tx.created_at.toISOString(),
  }))

  const total = countResult[0]?.count ?? 0

  return <PointsClient initialData={{ items, total }} />
}
