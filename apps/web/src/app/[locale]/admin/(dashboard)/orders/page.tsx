import { db } from '@make-the-change/core/db'
import { orders, publicProfiles } from '@make-the-change/core/schema'
import { and, count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import type { Order } from '@/lib/types/order'
import { PAGE_SIZE } from './constants'
import { OrdersClient } from './orders-client'

type SearchParams = {
  q?: string
  status?: string
  page?: string
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'admin.orders' })

  return {
    title: `${t('title')} | Admin`,
  }
}

export default async function AdminOrdersPage(props: {
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
    // Ensure we handle UUID search gracefully or search only valid text fields
    // Assuming 'q' is meant for ID or Customer Name.
    // ID is uuid, so ilike might fail if strict uuid type. Usually text casting works or we check if valid uuid.
    // For simplicity and robustness with Drizzle + Postgres text search:
    conditions.push(
      or(
        sql`CAST(${orders.id} AS TEXT) ILIKE ${searchLower}`,
        ilike(publicProfiles.email, searchLower),
        ilike(publicProfiles.first_name, searchLower),
        ilike(publicProfiles.last_name, searchLower),
      ),
    )
  }

  const isValidStatus = (
    status: string,
  ): status is 'pending' | 'paid' | 'processing' | 'in_transit' | 'completed' | 'closed' => {
    return ['pending', 'paid', 'processing', 'in_transit', 'completed', 'closed'].includes(status)
  }

  if (statusFilter && statusFilter !== 'all' && isValidStatus(statusFilter)) {
    conditions.push(eq(orders.status, statusFilter))
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Execute Queries
  // Execute Queries
  type OrderRow = {
    id: string
    status: string | null
    created_at: Date | null
    total_points: number | null
    email: string | null
    first_name: string | null
    last_name: string | null
  }

  let orderRows: OrderRow[] = []
  let totalResult = [{ count: 0 }]

  try {
    const results = await Promise.all([
      // 1. Orders (Paginated & Filtered)
      db
        .select({
          id: orders.id,
          status: orders.status,
          created_at: orders.created_at,
          total_points: orders.total_points,
          email: publicProfiles.email,
          first_name: publicProfiles.first_name,
          last_name: publicProfiles.last_name,
        })
        .from(orders)
        .leftJoin(publicProfiles, eq(publicProfiles.id, orders.user_id))
        .where(whereClause)
        .orderBy(desc(orders.created_at))
        .limit(PAGE_SIZE)
        .offset(offset),

      // 2. Count (Filtered)
      db
        .select({ count: count() })
        .from(orders)
        .leftJoin(publicProfiles, eq(publicProfiles.id, orders.user_id))
        .where(whereClause),
    ])

    orderRows = results[0]
    totalResult = results[1]
  } catch (error) {
    console.error('CRITIQUE: Erreur lors de la récupération des commandes:', error)
  }

  const currentTotal = totalResult[0]?.count ?? 0

  const ordersList = orderRows.map((row) => ({
    id: row.id,
    status: (row.status as Order['status']) ?? 'pending',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : '',
    total: row.total_points ?? 0,
    customerName: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email || 'Unknown',
    items: [],
    user: {
      email: row.email ?? '',
      first_name: row.first_name ?? '',
      last_name: row.last_name ?? '',
    },
  }))

  return (
    <OrdersClient
      initialData={{
        items: ordersList,
        total: currentTotal,
      }}
    />
  )
}
