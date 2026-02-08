import { db } from '@make-the-change/core/db'
import { orderItems, orders, products, publicProfiles } from '@make-the-change/core/schema'
import { and, count, desc, eq, inArray } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireProducer, requireProducerOrAdminPage } from '@/lib/auth-guards'
import { OrdersClient } from './orders-client'

const PAGE_SIZE = 20

type SearchParams = {
  status?: string
  page?: string
}

type OrderRow = {
  id: string
  status: string
  created_at: Date
  total_points: number
  email: string | null
  first_name: string | null
  last_name: string | null
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'partner.orders' })
  return { title: `${t('title')} | Partner` }
}

export default async function PartnerOrdersPage(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await props.params
  await requireProducerOrAdminPage(locale)
  const { producer } = await requireProducer()
  const searchParams = await props.searchParams
  const { status: statusFilter, page } = searchParams

  if (!producer) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Profil producteur non configuré</h1>
        <p className="text-muted-foreground">
          Votre compte n'est pas encore associé à un profil producteur.
        </p>
      </div>
    )
  }

  const pageNumber = Number(page && page !== 'undefined' ? page : 1)
  const offset = (pageNumber - 1) * PAGE_SIZE

  // Get products that belong to this producer
  const producerProducts = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.producer_id, producer.id))

  const productIds = producerProducts.map((p) => p.id)

  if (productIds.length === 0) {
    return <OrdersClient initialOrders={{ items: [], total: 0 }} />
  }

  // Get order items that contain producer's products
  const relevantOrderItems = await db
    .select({ order_id: orderItems.order_id })
    .from(orderItems)
    .where(inArray(orderItems.product_id, productIds))

  const orderIds = [...new Set(relevantOrderItems.map((oi) => oi.order_id))]

  if (orderIds.length === 0) {
    return <OrdersClient initialOrders={{ items: [], total: 0 }} />
  }

  // Build filter conditions
  const conditions = [inArray(orders.id, orderIds as string[])]

  if (statusFilter && statusFilter !== 'all') {
    conditions.push(eq(orders.status, statusFilter as any))
  }

  const whereClause = and(...conditions)

  let orderRows: OrderRow[] = []
  let totalResult: Array<{ count: number }> = [{ count: 0 }]

  try {
    const results = await Promise.all([
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

      db.select({ count: count() }).from(orders).where(whereClause),
    ])

    orderRows = results[0]
    totalResult = results[1]
  } catch (error) {
    console.error('CRITIQUE: Erreur commandes partner:', error)
  }

  const currentTotal = totalResult[0]?.count ?? 0

  const ordersList = orderRows.map((row) => ({
    id: row.id,
    status: row.status ?? 'pending',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : '',
    total: row.total_points ?? 0,
    customerName: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.email || 'Unknown',
  }))

  return <OrdersClient initialOrders={{ items: ordersList, total: currentTotal }} />
}
