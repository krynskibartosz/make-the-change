import type { MockOrderRecord } from '@/lib/mock/mock-member-data'
import { isRecord } from '@/lib/type-guards'
import { mockCookieOptions } from '@/lib/mock/cookie-defaults'

export const MOCK_ORDERS_COOKIE_NAME = 'mtc_mock_orders'

export { mockCookieOptions as mockOrdersCookieOptions }

type PersistedMockOrderEntry = {
  viewerId: string
  order: MockOrderRecord
}

const isMockOrderRecord = (value: unknown): value is MockOrderRecord => {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.status === 'string' &&
    typeof value.created_at === 'string' &&
    typeof value.subtotal_points === 'number' &&
    typeof value.shipping_cost_points === 'number' &&
    typeof value.tax_points === 'number' &&
    typeof value.total_points === 'number' &&
    Array.isArray(value.items) &&
    isRecord(value.shipping_address)
  )
}

const parsePersistedMockOrderEntry = (value: unknown): PersistedMockOrderEntry | null => {
  if (!isRecord(value)) {
    return null
  }

  const viewerId = typeof value.viewerId === 'string' ? value.viewerId : ''
  const order = isMockOrderRecord(value.order) ? value.order : null

  if (!viewerId || !order) {
    return null
  }

  return { viewerId, order }
}

export const parseMockOrdersCookieValue = (
  value: string | null | undefined,
): PersistedMockOrderEntry[] => {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((entry) => parsePersistedMockOrderEntry(entry))
      .filter((entry): entry is PersistedMockOrderEntry => entry !== null)
  } catch {
    return []
  }
}

export const serializeMockOrders = (entries: PersistedMockOrderEntry[]): string =>
  encodeURIComponent(JSON.stringify(entries))

const readCookieValue = (cookieString: string, key: string): string | null => {
  const entries = cookieString.split(';').map((entry) => entry.trim())
  const match = entries.find((entry) => entry.startsWith(`${key}=`))
  if (!match) {
    return null
  }

  return match.slice(key.length + 1)
}

export const getClientPersistedMockOrders = (): PersistedMockOrderEntry[] => {
  if (typeof document === 'undefined') {
    return []
  }

  return parseMockOrdersCookieValue(readCookieValue(document.cookie, MOCK_ORDERS_COOKIE_NAME))
}

export const upsertClientPersistedMockOrder = (
  viewerId: string,
  order: MockOrderRecord,
): void => {
  if (typeof document === 'undefined') {
    return
  }

  const currentEntries = getClientPersistedMockOrders().filter(
    (entry) => !(entry.viewerId === viewerId && entry.order.id === order.id),
  )

  currentEntries.unshift({ viewerId, order })

  document.cookie = `${MOCK_ORDERS_COOKIE_NAME}=${serializeMockOrders(currentEntries)}; path=/; max-age=${mockCookieOptions.maxAge}; samesite=${mockCookieOptions.sameSite}`
}
