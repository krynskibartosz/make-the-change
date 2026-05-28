import { mockCookieOptions } from '@/lib/mock/cookie-defaults'
import { isRecord } from '@/lib/type-guards'

export const MOCK_CHECKOUT_SESSION_COOKIE_NAME = 'mtc_mock_checkout_session'

export const mockCheckoutSessionCookieOptions = {
  ...mockCookieOptions,
  maxAge: 60 * 60 * 24, // 24h — session temporaire
}

export type MockCheckoutCustomer = {
  email: string
  name: string
  street: string
  postalCode: string
  city: string
  country: string
}

export type MockCheckoutCompletedOrder = {
  orderId: string
  totalEur: number
  partnerOrders: Array<{
    orderId: string
    sellerId: string
    sellerName: string
    deliveryLabel: string | null
  }>
}

export type MockCheckoutSession = {
  customer: MockCheckoutCustomer
  completedOrder?: MockCheckoutCompletedOrder
}

export const createEmptyCheckoutSession = (): MockCheckoutSession => ({
  customer: { email: '', name: '', street: '', postalCode: '', city: '', country: 'BE' },
})

export function parseMockCheckoutSessionCookie(
  value: string | null | undefined,
): MockCheckoutSession {
  if (!value) return createEmptyCheckoutSession()
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown
    if (!isRecord(parsed)) return createEmptyCheckoutSession()

    const customerRaw = parsed.customer
    if (!isRecord(customerRaw)) return createEmptyCheckoutSession()

    const customer: MockCheckoutCustomer = {
      email: typeof customerRaw.email === 'string' ? customerRaw.email : '',
      name: typeof customerRaw.name === 'string' ? customerRaw.name : '',
      street: typeof customerRaw.street === 'string' ? customerRaw.street : '',
      postalCode: typeof customerRaw.postalCode === 'string' ? customerRaw.postalCode : '',
      city: typeof customerRaw.city === 'string' ? customerRaw.city : '',
      country: typeof customerRaw.country === 'string' ? customerRaw.country : 'BE',
    }

    const completedOrderRaw = parsed.completedOrder
    if (!isRecord(completedOrderRaw) || !Array.isArray(completedOrderRaw.partnerOrders)) {
      return { customer }
    }

    const partnerOrders = completedOrderRaw.partnerOrders.flatMap((item: unknown) => {
      if (!isRecord(item)) return []
      if (typeof item.orderId !== 'string' || typeof item.sellerId !== 'string') return []
      return [
        {
          orderId: item.orderId,
          sellerId: item.sellerId,
          sellerName: typeof item.sellerName === 'string' ? item.sellerName : item.sellerId,
          deliveryLabel: typeof item.deliveryLabel === 'string' ? item.deliveryLabel : null,
        },
      ]
    })

    const completedOrder: MockCheckoutCompletedOrder = {
      orderId: typeof completedOrderRaw.orderId === 'string' ? completedOrderRaw.orderId : '',
      totalEur: typeof completedOrderRaw.totalEur === 'number' ? completedOrderRaw.totalEur : 0,
      partnerOrders,
    }

    return { customer, completedOrder }
  } catch {
    return createEmptyCheckoutSession()
  }
}

export const serializeMockCheckoutSession = (session: MockCheckoutSession): string =>
  encodeURIComponent(JSON.stringify(session))
