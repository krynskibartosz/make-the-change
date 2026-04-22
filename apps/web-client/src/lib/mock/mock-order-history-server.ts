import {
  MOCK_ORDERS_COOKIE_NAME,
  parseMockOrdersCookieValue,
} from '@/lib/mock/mock-order-history'
import { getMockOrderById, getMockOrders, type MockOrderRecord } from '@/lib/mock/mock-member-data'

const clonePersistedOrder = (order: MockOrderRecord): MockOrderRecord => ({
  ...order,
  shipping_address: { ...order.shipping_address },
  items: order.items.map((item) => ({
    ...item,
    product_snapshot: { ...item.product_snapshot },
    product: item.product ? { ...item.product } : null,
  })),
})

export async function getCurrentMockOrders(viewerId: string): Promise<MockOrderRecord[]> {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const persistedOrders = parseMockOrdersCookieValue(
    cookieStore.get(MOCK_ORDERS_COOKIE_NAME)?.value,
  )
    .filter((entry) => entry.viewerId === viewerId)
    .map((entry) => clonePersistedOrder(entry.order))

  const knownOrderIds = new Set(persistedOrders.map((order) => order.id))
  const baseOrders = getMockOrders(viewerId).filter((order) => !knownOrderIds.has(order.id))

  return [...persistedOrders, ...baseOrders].sort((first, second) =>
    second.created_at.localeCompare(first.created_at),
  )
}

export async function getCurrentMockOrderById(
  viewerId: string,
  orderId: string,
): Promise<MockOrderRecord | null> {
  const currentOrders = await getCurrentMockOrders(viewerId)
  return currentOrders.find((order) => order.id === orderId) || getMockOrderById(viewerId, orderId)
}
