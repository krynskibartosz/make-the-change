import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import { mockCookieOptions } from '@/lib/mock/cookie-defaults'
import {
  MOCK_PRODUCER_HABEEBEE_ID,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PRODUCT_ILANGA_COLLECTION_ID,
} from '@/lib/mock/mock-ids'
import { isRecord } from '@/lib/type-guards'

export const MOCK_CART_COOKIE_NAME = 'mtc_mock_cart'
export const MOCK_COMMERCE_EVENTS_COOKIE_NAME = 'mtc_mock_commerce_events'
export { mockCookieOptions as mockCommerceCookieOptions }

export type MockCartLine = {
  productId: string
  quantity: number
}

export type MockCart = {
  sellerId: string | null
  lines: MockCartLine[]
}

export type SellerShippingProfile = {
  sellerId: string
  territory: 'BE'
  standardFeeEur: number
  freeThresholdEur: number
  deliveryLabel: string
  carrierLabel: string
  feeStatus: 'confirmed' | 'prototype_estimate'
  sourceUrl: string
}

export type MockCommerceEvent =
  | {
      type: 'ci_redemption'
      advantageId: string
      costCi: number
      userId: string
      createdAt: string
    }
  | {
      type: 'discount_used'
      advantageId: string
      orderId: string
      userId: string
      createdAt: string
    }
  | {
      type: 'product_order'
      orderId: string
      sellerId: string
      userId?: string
      createdAt: string
    }

export type CartSummary = {
  subtotalEur: number
  discountEur: number
  discountedSubtotalEur: number
  shippingEur: number
  totalEur: number
  amountUntilFreeShippingEur: number
  appliedAdvantageId: string | null
}

const ILANGA_DISCOUNT_ID = 'code-ilanga-coffret-10'

const SHIPPING_PROFILES: Record<string, SellerShippingProfile> = {
  [MOCK_PRODUCER_ILANGA_ID]: {
    sellerId: MOCK_PRODUCER_ILANGA_ID,
    territory: 'BE',
    standardFeeEur: 6.5,
    freeThresholdEur: 60,
    deliveryLabel: '5 jours ouvrés',
    carrierLabel: 'Bpost / UPS',
    feeStatus: 'prototype_estimate',
    sourceUrl: 'https://www.ilanga-nature.com/en/livraison',
  },
  [MOCK_PRODUCER_HABEEBEE_ID]: {
    sellerId: MOCK_PRODUCER_HABEEBEE_ID,
    territory: 'BE',
    standardFeeEur: 6.5,
    freeThresholdEur: 59,
    deliveryLabel: '2 à 7 jours',
    carrierLabel: 'Bpost',
    feeStatus: 'confirmed',
    sourceUrl: 'https://habeebee.be/pages/faqs',
  },
}

const roundEur = (amount: number): number => Math.round(amount * 100) / 100

export const createEmptyMockCart = (): MockCart => ({ sellerId: null, lines: [] })

export const getSellerShippingProfile = (sellerId: string | null): SellerShippingProfile | null =>
  sellerId ? (SHIPPING_PROFILES[sellerId] ?? null) : null

export function addLineToCart(
  cart: MockCart,
  product: { productId: string; sellerId: string },
): { ok: true; cart: MockCart } | { ok: false; reason: 'different_seller'; sellerId: string } {
  if (cart.sellerId && cart.sellerId !== product.sellerId) {
    return { ok: false, reason: 'different_seller', sellerId: cart.sellerId }
  }

  const current = cart.lines.find((line) => line.productId === product.productId)
  const lines = current
    ? cart.lines.map((line) =>
        line.productId === product.productId ? { ...line, quantity: line.quantity + 1 } : line,
      )
    : [...cart.lines, { productId: product.productId, quantity: 1 }]

  return { ok: true, cart: { sellerId: product.sellerId, lines } }
}

export function updateCartLineQuantity(
  cart: MockCart,
  productId: string,
  quantity: number,
): MockCart {
  const lines =
    quantity <= 0
      ? cart.lines.filter((line) => line.productId !== productId)
      : cart.lines.map((line) => (line.productId === productId ? { ...line, quantity } : line))

  return {
    sellerId: lines.length === 0 ? null : cart.sellerId,
    lines,
  }
}

export function calculateCartSummary(
  cart: MockCart,
  context: { unlockedAdvantageIds: string[] },
): CartSummary {
  const subtotalEur = roundEur(
    cart.lines.reduce((sum, line) => {
      const product = getMockProductById(line.productId)
      return sum + (product?.price_eur_equivalent ?? 0) * line.quantity
    }, 0),
  )

  const canUseIlangaDiscount =
    context.unlockedAdvantageIds.includes(ILANGA_DISCOUNT_ID) &&
    cart.lines.some((line) => line.productId === MOCK_PRODUCT_ILANGA_COLLECTION_ID)
  const discountEur = canUseIlangaDiscount
    ? roundEur(
        cart.lines.reduce((sum, line) => {
          if (line.productId !== MOCK_PRODUCT_ILANGA_COLLECTION_ID) return sum
          const product = getMockProductById(line.productId)
          return sum + (product?.price_eur_equivalent ?? 0) * line.quantity * 0.1
        }, 0),
      )
    : 0
  const discountedSubtotalEur = roundEur(subtotalEur - discountEur)
  const shipping = getSellerShippingProfile(cart.sellerId)
  const shippingEur =
    shipping && discountedSubtotalEur < shipping.freeThresholdEur && cart.lines.length > 0
      ? shipping.standardFeeEur
      : 0
  const amountUntilFreeShippingEur = shipping
    ? roundEur(Math.max(0, shipping.freeThresholdEur - discountedSubtotalEur))
    : 0

  return {
    subtotalEur,
    discountEur,
    discountedSubtotalEur,
    shippingEur,
    totalEur: roundEur(discountedSubtotalEur + shippingEur),
    amountUntilFreeShippingEur,
    appliedAdvantageId: canUseIlangaDiscount ? ILANGA_DISCOUNT_ID : null,
  }
}

function isMockCartLine(value: unknown): value is MockCartLine {
  return (
    isRecord(value) &&
    typeof value.productId === 'string' &&
    typeof value.quantity === 'number' &&
    value.quantity > 0
  )
}

export function parseMockCartCookie(value: string | null | undefined): MockCart {
  if (!value) return createEmptyMockCart()
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown
    if (!isRecord(parsed) || !Array.isArray(parsed.lines)) return createEmptyMockCart()
    const lines = parsed.lines.filter(isMockCartLine)
    const sellerId =
      typeof parsed.sellerId === 'string' && lines.length > 0 ? parsed.sellerId : null
    return { sellerId, lines }
  } catch {
    return createEmptyMockCart()
  }
}

export const serializeMockCart = (cart: MockCart): string =>
  encodeURIComponent(JSON.stringify(cart))

export function parseMockCommerceEventsCookie(
  value: string | null | undefined,
): MockCommerceEvent[] {
  if (!value) return []
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((event): event is MockCommerceEvent => {
      if (
        !isRecord(event) ||
        typeof event.type !== 'string' ||
        typeof event.createdAt !== 'string'
      ) {
        return false
      }
      if (event.type === 'ci_redemption') {
        return (
          typeof event.advantageId === 'string' &&
          typeof event.costCi === 'number' &&
          typeof event.userId === 'string'
        )
      }
      if (event.type === 'discount_used') {
        return (
          typeof event.advantageId === 'string' &&
          typeof event.orderId === 'string' &&
          typeof event.userId === 'string'
        )
      }
      return (
        event.type === 'product_order' &&
        typeof event.orderId === 'string' &&
        typeof event.sellerId === 'string'
      )
    })
  } catch {
    return []
  }
}

export const serializeMockCommerceEvents = (events: MockCommerceEvent[]): string =>
  encodeURIComponent(JSON.stringify(events))

export function getUnlockedAdvantageIds(
  events: MockCommerceEvent[],
  userId: string | null,
): string[] {
  if (!userId) return []
  const used = new Set(
    events.flatMap((event) =>
      event.type === 'discount_used' && event.userId === userId ? [event.advantageId] : [],
    ),
  )
  return events
    .flatMap((event) =>
      event.type === 'ci_redemption' && event.userId === userId ? [event.advantageId] : [],
    )
    .filter((advantageId) => !used.has(advantageId))
}

export function getImpactCreditsDebit(events: MockCommerceEvent[], userId: string): number {
  return events.reduce(
    (sum, event) =>
      event.type === 'ci_redemption' && event.userId === userId ? sum + event.costCi : sum,
    0,
  )
}
