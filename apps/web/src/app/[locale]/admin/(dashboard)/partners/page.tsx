import { db } from '@make-the-change/core/db'
import { type Producer, producers } from '@make-the-change/core/schema'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { PAGE_SIZE } from './constants'
import { PartnersClient } from './partners-client'

type SearchParams = {
  q?: string
  status?: string
  page?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.partners' })

  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function AdminPartnersPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await props.searchParams
  const { q, status: statusFilter, page } = searchParams

  const pageNumber = Number(page && page !== 'undefined' ? page : 1)
  const offset = (pageNumber - 1) * PAGE_SIZE

  // Build Filter Conditions
  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(ilike(producers.name_default, searchLower), ilike(producers.contact_email, searchLower)),
    )
  }

  if (statusFilter && statusFilter !== 'all') {
    conditions.push(eq(producers.status, statusFilter as Producer['status']))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Execute Queries
  // Execute Queries
  let partnerRows: Producer[] = []
  let totalResult = [{ count: 0 }]

  try {
    const results = await Promise.all([
      // 1. Partners (Paginated & Filtered)
      db
        .select()
        .from(producers)
        .where(whereClause)
        .orderBy(desc(producers.created_at))
        .limit(PAGE_SIZE)
        .offset(offset),

      // 2. Count (Filtered)
      db.select({ count: count() }).from(producers).where(whereClause),
    ])

    partnerRows = results[0]
    totalResult = results[1]
  } catch (error) {
    console.error('CRITIQUE: Erreur lors de la récupération des partenaires:', error)
  }

  const currentTotal = totalResult[0]?.count ?? 0

  // Transform to match UI expectations
  const partners = partnerRows.map((p) => ({
    id: p.id,
    name: p.name_default || 'Unknown Business',
    contact_email: p.contact_email,
    status: p.status || 'pending',
    created_at: p.created_at ? new Date(p.created_at).toISOString() : null,
  }))

  return <PartnersClient initialConvertData={partners} total={currentTotal} />
}
