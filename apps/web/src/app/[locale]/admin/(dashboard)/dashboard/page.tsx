import { db } from '@make-the-change/core/db'
import { orders, producers, products, projects } from '@make-the-change/core/schema'
import { and, count, eq, inArray, lte } from 'drizzle-orm'
import { requireAdminPage } from '@/lib/auth-guards'
import AdminDashboardClient from './dashboard-client'

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAdminPage(locale)

  try {
    const [pendingOrders] = await db
      .select({ count: count() })
      .from(orders)
      .where(inArray(orders.status, ['pending', 'paid', 'processing']))

    const [lowStockProducts] = await db
      .select({ count: count() })
      .from(products)
      .where(and(eq(products.stock_management, true), lte(products.stock_quantity, 5)))

    const [pendingProducers] = await db
      .select({ count: count() })
      .from(producers)
      .where(eq(producers.status, 'pending'))

    const [activeProjects] = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, 'active'))

    return (
      <AdminDashboardClient
        stats={{
          pendingOrders: pendingOrders?.count ?? 0,
          lowStockProducts: lowStockProducts?.count ?? 0,
          pendingProducers: pendingProducers?.count ?? 0,
          activeProjects: activeProjects?.count ?? 0,
        }}
      />
    )
  } catch {
    return (
      <AdminDashboardClient
        stats={{
          pendingOrders: 0,
          lowStockProducts: 0,
          pendingProducers: 0,
          activeProjects: 0,
        }}
        hasError
      />
    )
  }
}
