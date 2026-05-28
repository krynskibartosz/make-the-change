import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import { mockCookieOptions } from '@/lib/mock/cookie-defaults'
import {
  MOCK_PRODUCER_HABEEBEE_ID,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PRODUCT_BEE_SURPRISED_ID,
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_ILANGA_COLLECTION_ID,
  MOCK_PRODUCT_LITCHI_ID,
  MOCK_PRODUCT_SAVON_DOUX_ID,
  MOCK_PRODUCT_SHAMPOING_ID,
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
  | {
      type: 'reservation_confirmed'
      advantageId: string
      slotId: string
      costCi: number
      userId: string
      reservationId: string
      createdAt: string
    }

export type CartSummary = {
  sellerGroups: SellerCartSummary[]
  subtotalEur: number
  discountEur: number
  discountedSubtotalEur: number
  shippingEur: number
  totalEur: number
  amountUntilFreeShippingEur: number
  appliedAdvantageId: string | null
}

export type SellerCartSummary = {
  sellerId: string
  subtotalEur: number
  discountEur: number
  discountedSubtotalEur: number
  shippingEur: number
  totalEur: number
  amountUntilFreeShippingEur: number
  appliedAdvantageId: string | null
}

const ILANGA_DISCOUNT_ID = 'code-ilanga-coffret-10'

const CART_SUGGESTION_PRIORITY_BY_SELLER: Record<string, string[]> = {
  [MOCK_PRODUCER_ILANGA_ID]: [
    MOCK_PRODUCT_EUCALYPTUS_ID,
    MOCK_PRODUCT_LITCHI_ID,
    MOCK_PRODUCT_ILANGA_COLLECTION_ID,
  ],
  [MOCK_PRODUCER_HABEEBEE_ID]: [
    MOCK_PRODUCT_SAVON_DOUX_ID,
    MOCK_PRODUCT_SHAMPOING_ID,
    MOCK_PRODUCT_BEE_SURPRISED_ID,
  ],
}

const SHIPPING_PROFILES: Record<string, SellerShippingProfile> = {
  [MOCK_PRODUCER_ILANGA_ID]: {
    sellerId: MOCK_PRODUCER_ILANGA_ID,
    territory: 'BE',
    standardFeeEur: 6.5,
    freeThresholdEur: 60,
    deliveryLabel: '2 à 3 jours ouvrés',
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

export const createEmptyMockCart = (): MockCart => ({ lines: [] })

export const getSellerShippingProfile = (sellerId: string | null): SellerShippingProfile | null =>
  sellerId ? (SHIPPING_PROFILES[sellerId] ?? null) : null

export function addLineToCart(
  cart: MockCart,
  product: { productId: string },
): { ok: true; cart: MockCart } {
  const current = cart.lines.find((line) => line.productId === product.productId)
  const lines = current
    ? cart.lines.map((line) =>
        line.productId === product.productId ? { ...line, quantity: line.quantity + 1 } : line,
      )
    : [...cart.lines, { productId: product.productId, quantity: 1 }]

  return { ok: true, cart: { lines } }
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
    lines,
  }
}

export function getCartSellerIds(cart: MockCart): string[] {
  return Array.from(
    new Set(
      cart.lines.flatMap((line) => {
        const product = getMockProductById(line.productId)
        return product ? [product.producer_id] : []
      }),
    ),
  )
}

function cartContainsProductFamily(cart: MockCart, candidateProductId: string): boolean {
  const candidate = getMockProductById(candidateProductId)
  if (!candidate) return true

  return cart.lines.some((line) => {
    if (line.productId === candidateProductId) return true
    if (candidate.variants?.some((variant) => variant.id === line.productId)) return true

    const lineProduct = getMockProductById(line.productId)
    return lineProduct?.variants?.some((variant) => variant.id === candidateProductId) ?? false
  })
}

export function getCartSuggestionProductIds(cart: MockCart): string[] {
  return getCartSellerIds(cart).flatMap((sellerId) => {
    const suggestedProductId = CART_SUGGESTION_PRIORITY_BY_SELLER[sellerId]?.find(
      (productId) => !cartContainsProductFamily(cart, productId),
    )
    return suggestedProductId ? [suggestedProductId] : []
  })
}

function calculateSellerSummary(
  cart: MockCart,
  sellerId: string,
  context: { unlockedAdvantageIds: string[] },
): SellerCartSummary {
  const sellerLines = cart.lines.filter(
    (line) => getMockProductById(line.productId)?.producer_id === sellerId,
  )
  const subtotalEur = roundEur(
    sellerLines.reduce((sum, line) => {
      const product = getMockProductById(line.productId)
      return sum + (product?.price_eur_equivalent ?? 0) * line.quantity
    }, 0),
  )
  const canUseIlangaDiscount =
    context.unlockedAdvantageIds.includes(ILANGA_DISCOUNT_ID) &&
    sellerLines.some((line) => line.productId === MOCK_PRODUCT_ILANGA_COLLECTION_ID)
  const discountEur = canUseIlangaDiscount
    ? roundEur(
        sellerLines.reduce((sum, line) => {
          if (line.productId !== MOCK_PRODUCT_ILANGA_COLLECTION_ID) return sum
          const product = getMockProductById(line.productId)
          return sum + (product?.price_eur_equivalent ?? 0) * line.quantity * 0.1
        }, 0),
      )
    : 0
  const discountedSubtotalEur = roundEur(subtotalEur - discountEur)
  const shipping = getSellerShippingProfile(sellerId)
  const shippingEur =
    shipping && discountedSubtotalEur < shipping.freeThresholdEur && sellerLines.length > 0
      ? shipping.standardFeeEur
      : 0

  return {
    sellerId,
    subtotalEur,
    discountEur,
    discountedSubtotalEur,
    shippingEur,
    totalEur: roundEur(discountedSubtotalEur + shippingEur),
    amountUntilFreeShippingEur: shipping
      ? roundEur(Math.max(0, shipping.freeThresholdEur - discountedSubtotalEur))
      : 0,
    appliedAdvantageId: canUseIlangaDiscount ? ILANGA_DISCOUNT_ID : null,
  }
}

export function calculateCartSummary(
  cart: MockCart,
  context: { unlockedAdvantageIds: string[] },
): CartSummary {
  const sellerGroups = getCartSellerIds(cart).map((sellerId) =>
    calculateSellerSummary(cart, sellerId, context),
  )
  const subtotalEur = roundEur(sellerGroups.reduce((sum, group) => sum + group.subtotalEur, 0))
  const discountEur = roundEur(sellerGroups.reduce((sum, group) => sum + group.discountEur, 0))
  const discountedSubtotalEur = roundEur(subtotalEur - discountEur)
  const shippingEur = roundEur(sellerGroups.reduce((sum, group) => sum + group.shippingEur, 0))

  return {
    sellerGroups,
    subtotalEur,
    discountEur,
    discountedSubtotalEur,
    shippingEur,
    totalEur: roundEur(discountedSubtotalEur + shippingEur),
    amountUntilFreeShippingEur: roundEur(
      sellerGroups.reduce((sum, group) => sum + group.amountUntilFreeShippingEur, 0),
    ),
    appliedAdvantageId:
      sellerGroups.find((group) => group.appliedAdvantageId)?.appliedAdvantageId ?? null,
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
    return { lines }
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
      if (event.type === 'reservation_confirmed') {
        return (
          typeof event.advantageId === 'string' &&
          typeof event.slotId === 'string' &&
          typeof event.costCi === 'number' &&
          typeof event.userId === 'string' &&
          typeof event.reservationId === 'string'
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
  return events.reduce((sum, event) => {
    if (event.type === 'ci_redemption' && event.userId === userId) return sum + event.costCi
    if (event.type === 'reservation_confirmed' && event.userId === userId) return sum + event.costCi
    return sum
  }, 0)
}

export function getReservationByAdvantage(
  events: MockCommerceEvent[],
  advantageId: string,
  userId: string,
): { slotId: string; reservationId: string } | null {
  const event = events.find(
    (e) =>
      e.type === 'reservation_confirmed' &&
      e.userId === userId &&
      e.advantageId === advantageId,
  )
  if (!event || event.type !== 'reservation_confirmed') return null
  return { slotId: event.slotId, reservationId: event.reservationId }
}
