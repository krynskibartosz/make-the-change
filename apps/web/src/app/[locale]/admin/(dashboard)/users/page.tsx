import { db } from '@make-the-change/core/db'
import { profiles } from '@make-the-change/core/schema'
import { and, count, desc, eq, ilike, or } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { PAGE_SIZE } from './constants'
import { UsersClient } from './users-client'

type SearchParams = {
  q?: string
  role?: string
  page?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.users' })

  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function AdminUsersPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const searchParams = await props.searchParams
  const { q, role, page } = searchParams

  const pageNumber = Number(page && page !== 'undefined' ? page : 1)
  const offset = (pageNumber - 1) * PAGE_SIZE

  // Build Filter Conditions
  const conditions = []

  if (q) {
    const searchLower = `%${q.toLowerCase()}%`
    conditions.push(
      or(
        ilike(profiles.email, searchLower),
        ilike(profiles.first_name, searchLower),
        ilike(profiles.last_name, searchLower),
      ),
    )
  }

  if (role && role !== 'all' && ['explorateur', 'protecteur', 'ambassadeur'].includes(role)) {
    conditions.push(eq(profiles.user_level, role as 'explorateur' | 'protecteur' | 'ambassadeur'))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Execute Queries
  const [userRows, totalResult] = await Promise.all([
    // 1. Users (Paginated & Filtered)
    db
      .select({
        id: profiles.id,
        email: profiles.email,
        first_name: profiles.first_name,
        last_name: profiles.last_name,
        user_level: profiles.user_level,
        kyc_status: profiles.kyc_status,
      })
      .from(profiles)
      .where(whereClause)
      .orderBy(desc(profiles.created_at))
      .limit(PAGE_SIZE)
      .offset(offset),

    // 2. Count (Filtered)
    db.select({ count: count() }).from(profiles).where(whereClause),
  ])

  const currentTotal = totalResult[0]?.count ?? 0

  const users = userRows.map((row) => ({
    id: row.id,
    name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email || 'Unknown',
    email: row.email ?? '',
    user_level: row.user_level ?? 'explorateur',
    kyc_status: row.kyc_status ?? 'pending',
    first_name: row.first_name ?? undefined,
    last_name: row.last_name ?? undefined,
  }))

  const initialData = {
    items: users,
    total: currentTotal,
  }

  return <UsersClient initialData={initialData} />
}
