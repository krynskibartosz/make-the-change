import { db } from '@make-the-change/core/db'
import { investments } from '@make-the-change/core/schema'
import { and, asc, count, desc, type SQL } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { InvestmentsClient } from './investments-client'
import { loadInvestmentSearchParams } from './investments-search-params'

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
    namespace: 'admin.investments',
  })
  
  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function InvestmentsPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await loadInvestmentSearchParams(props.searchParams)
  
  const {
    q,
    page,
    sort,
  } = searchParams

  const offset = (page - 1) * PAGE_SIZE

  const conditions: SQL[] = []

  // If search is needed, we usually need to join or have a denormalized field. 
  // For now, no search condition on base table except maybe ID.
  
  let orderBy = desc(investments.created_at)
  if (sort) {
    switch (sort) {
      case 'created_at_asc':
        orderBy = asc(investments.created_at)
        break
      case 'created_at_desc':
        orderBy = desc(investments.created_at)
        break
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [invResult, countResult] = await Promise.all([
    db.query.investments.findMany({
      where: whereClause,
      orderBy: orderBy,
      limit: PAGE_SIZE,
      offset: offset,
      with: {
        user: true,
        project: true
      }
    }),
    db.select({ count: count() }).from(investments).where(whereClause),
  ])

  const items = invResult.map(inv => ({
    id: inv.id,
    user_email: (inv as any).user?.email || 'Inconnu',
    project_name: (inv as any).project?.name_default || 'Projet inconnu',
    amount_points: Number(inv.amount_points),
    status: inv.status || 'unknown',
    created_at: inv.created_at?.toISOString() || new Date().toISOString(),
  }))

  const total = countResult[0]?.count ?? 0

  return <InvestmentsClient initialData={{ items, total }} />
}
