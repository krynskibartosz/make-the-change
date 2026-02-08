import { db } from '@make-the-change/core/db'
import { orderItems, orders, publicProfiles } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import { requireAdminPage } from '@/lib/auth-guards'

import { OrderEditClient } from './order-edit-client'

type Address =
  | string
  | {
      street?: string
      postal_code?: string
      postalCode?: string
      city?: string
      country?: string
    }
  | null

const formatAddress = (address: Address) => {
  if (!address) return ''
  if (typeof address === 'string') return address
  const parts = [
    address.street,
    address.postal_code || address.postalCode,
    address.city,
    address.country,
  ].filter(Boolean)
  return parts.join(', ')
}

export default async function AdminOrderEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  await requireAdminPage(locale)

  const [orderRow] = await db
    .select({
      order: orders,
      customer: publicProfiles,
    })
    .from(orders)
    .leftJoin(publicProfiles, eq(publicProfiles.id, orders.user_id))
    .where(eq(orders.id, id))
    .limit(1)

  if (!orderRow?.order) {
    return <div className="p-8">Commande non trouvée</div>
  }

  const order = orderRow.order
  const customer = orderRow.customer
  const customerName = customer
    ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.email
    : 'Unknown'

  const orderItemsRows = await db.select().from(orderItems).where(eq(orderItems.order_id, order.id))

  const items = orderItemsRows.map((item) => {
    const snapshot = item.product_snapshot as { name?: string; name_default?: string } | null
    return {
      productId: item.product_id,
      name: snapshot?.name || snapshot?.name_default || 'Produit',
      quantity: item.quantity,
      price: Number(item.unit_price_points || 0),
    }
  })

  const orderData = {
    id: order.id,
    customerName: customerName || '',
    email: customer?.email || '',
    status: order.status ?? 'pending',
    createdAt: order.created_at?.toISOString() ?? '',
    total: Number(order.total_points || 0),
    items,
    shippingAddress: formatAddress(order.shipping_address as Address),
  }

  return <OrderEditClient initialOrder={orderData} />
}
