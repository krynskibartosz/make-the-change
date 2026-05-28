'use server'

import {
  getMockAdvantageById,
  getMockSlotById,
} from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import {
  addLineToCart,
  calculateCartSummary,
  createEmptyMockCart,
  getCartSellerIds,
  getSellerShippingProfile,
  type MockCart,
  updateCartLineQuantity,
} from '@/lib/mock/mock-commerce'
import {
  clearCurrentMockCart,
  getCurrentMockCart,
  getCurrentMockCommerceEvents,
  getCurrentUnlockedAdvantageIds,
  setCurrentMockCart,
  setCurrentMockCommerceEvents,
} from '@/lib/mock/mock-commerce-server'
import type { MockOrderRecord } from '@/lib/mock/mock-member-data'
import { getCurrentMockImpactCreditsBalance } from '@/lib/mock/mock-member-data-server'
import { persistCurrentMockOrder } from '@/lib/mock/mock-order-history-server'
import type { MockCheckoutCustomer } from '@/lib/mock/mock-checkout-session'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'

export async function addProductToCartAction(
  productId: string,
  confirmSeparateShipment = false,
): Promise<
  | { ok: true; cart: MockCart }
  | { ok: false; reason: 'not_found' | 'separate_shipping_confirmation' }
> {
  const product = getMockProductById(productId)
  if (!product) return { ok: false, reason: 'not_found' }

  const cart = await getCurrentMockCart()
  const sellerIds = getCartSellerIds(cart)
  const addsAnotherSeller = sellerIds.length > 0 && !sellerIds.includes(product.producer_id)
  if (addsAnotherSeller && !confirmSeparateShipment) {
    return { ok: false, reason: 'separate_shipping_confirmation' }
  }

  const result = addLineToCart(cart, { productId })
  await setCurrentMockCart(result.cart)
  return result
}

export async function updateCartLineAction(productId: string, quantity: number): Promise<MockCart> {
  const cart = updateCartLineQuantity(await getCurrentMockCart(), productId, quantity)
  await setCurrentMockCart(cart)
  return cart
}

export async function clearCartAction(): Promise<MockCart> {
  const cart = createEmptyMockCart()
  await setCurrentMockCart(cart)
  return cart
}

export async function redeemAdvantageAction(
  advantageId: string,
): Promise<{ ok: boolean; balance?: number; error?: 'auth' | 'insufficient' | 'invalid' }> {
  const session = await getMockViewerSession()
  if (!session) return { ok: false, error: 'auth' }

  const advantage = getMockAdvantageById(advantageId)
  if (!advantage || advantage.type !== 'discount' || advantage.status !== 'available') {
    return { ok: false, error: 'invalid' }
  }

  const existing = await getCurrentMockCommerceEvents()
  const alreadyUnlocked = existing.some(
    (event) =>
      event.type === 'ci_redemption' &&
      event.userId === session.viewerId &&
      event.advantageId === advantageId,
  )
  const balance = await getCurrentMockImpactCreditsBalance(session.viewerId, session.faction)
  if (alreadyUnlocked) return { ok: true, balance }
  if (balance < advantage.priceCredits) return { ok: false, error: 'insufficient', balance }

  await setCurrentMockCommerceEvents([
    {
      type: 'ci_redemption',
      advantageId,
      costCi: advantage.priceCredits,
      userId: session.viewerId,
      createdAt: new Date().toISOString(),
    },
    ...existing,
  ])
  return { ok: true, balance: balance - advantage.priceCredits }
}

export async function reserveExperienceAction(
  advantageId: string,
  slotId: string,
): Promise<
  | { ok: true; reservationId: string; balance: number }
  | { ok: false; error: 'auth' | 'insufficient' | 'invalid' | 'slot_not_found' | 'already_reserved' }
> {
  const session = await getMockViewerSession()
  if (!session) return { ok: false, error: 'auth' }

  const advantage = getMockAdvantageById(advantageId)
  if (!advantage || advantage.type !== 'experience' || advantage.status !== 'available') {
    return { ok: false, error: 'invalid' }
  }

  const slot = getMockSlotById(advantageId, slotId)
  if (!slot || slot.status === 'full') return { ok: false, error: 'slot_not_found' }

  const existing = await getCurrentMockCommerceEvents()
  const alreadyReserved = existing.some(
    (event) =>
      event.type === 'reservation_confirmed' &&
      event.userId === session.viewerId &&
      event.advantageId === advantageId,
  )
  if (alreadyReserved) return { ok: false, error: 'already_reserved' }

  const balance = await getCurrentMockImpactCreditsBalance(session.viewerId, session.faction)
  if (balance < advantage.priceCredits) return { ok: false, error: 'insufficient' }

  const reservationId =
    'RES-' + advantageId.slice(-8).toUpperCase() + '-' + Date.now().toString().slice(-6)

  await setCurrentMockCommerceEvents([
    {
      type: 'reservation_confirmed',
      advantageId,
      slotId,
      costCi: advantage.priceCredits,
      userId: session.viewerId,
      reservationId,
      createdAt: new Date().toISOString(),
    },
    ...existing,
  ])

  return { ok: true, reservationId, balance: balance - advantage.priceCredits }
}

export async function completeMockCheckoutAction(customer: MockCheckoutCustomer): Promise<
  | {
      ok: true
      orderId: string
      totalEur: number
      discountApplied: boolean
      partnerOrders: Array<{ orderId: string; sellerId: string }>
    }
  | { ok: false; error: 'empty_cart' }
> {
  const cart = await getCurrentMockCart()
  if (cart.lines.length === 0) return { ok: false, error: 'empty_cart' }

  const session = await getMockViewerSession()
  const events = await getCurrentMockCommerceEvents()
  const unlockedIds = await getCurrentUnlockedAdvantageIds(session?.viewerId ?? null)
  const summary = calculateCartSummary(cart, { unlockedAdvantageIds: unlockedIds })
  const orderId = `MTC-BE-${Date.now().toString().slice(-6)}`
  const createdAt = new Date().toISOString()
  const partnerOrders = summary.sellerGroups.map((group, index) => ({
    orderId: `${orderId}-${index + 1}`,
    sellerId: group.sellerId,
  }))
  const discountOrderId =
    summary.sellerGroups.find((group) => group.appliedAdvantageId)?.sellerId ?? null
  const discountPartnerOrder = partnerOrders.find((order) => order.sellerId === discountOrderId)
  const nextEvents = [
    ...partnerOrders.map((order) => ({
      type: 'product_order' as const,
      orderId: order.orderId,
      sellerId: order.sellerId,
      userId: session?.viewerId,
      createdAt,
    })),
    ...(summary.appliedAdvantageId && session
      ? [
          {
            type: 'discount_used' as const,
            advantageId: summary.appliedAdvantageId,
            orderId: discountPartnerOrder?.orderId ?? orderId,
            userId: session.viewerId,
            createdAt,
          },
        ]
      : []),
    ...events,
  ]

  await setCurrentMockCommerceEvents(nextEvents)
  if (session) {
    const nameParts = customer.name.trim().split(/\s+/)
    for (const partnerOrder of partnerOrders) {
      const group = summary.sellerGroups.find((entry) => entry.sellerId === partnerOrder.sellerId)
      if (!group) continue
      const order: MockOrderRecord = {
        id: partnerOrder.orderId,
        status: 'paid',
        subtotal_points: 0,
        shipping_cost_points: 0,
        tax_points: 0,
        total_points: 0,
        subtotal_euros: group.discountedSubtotalEur,
        shipping_cost_euros: group.shippingEur,
        tax_euros: 0,
        total_euros: group.totalEur,
        created_at: createdAt,
        tracking_number: null,
        carrier: getSellerShippingProfile(group.sellerId)?.carrierLabel ?? null,
        shipping_address: {
          firstName: nameParts[0] ?? '',
          lastName: nameParts.slice(1).join(' '),
          street: customer.street,
          postalCode: customer.postalCode,
          city: customer.city,
          country: 'Belgique',
          email: customer.email,
        },
        items: cart.lines.flatMap((line) => {
          const product = getMockProductById(line.productId)
          return product && product.producer_id === partnerOrder.sellerId
            ? [
                {
                  id: `${orderId}-${product.id}`,
                  quantity: line.quantity,
                  unit_price_points: 0,
                  total_price_points: 0,
                  product_snapshot: {
                    name: product.name_default,
                    priceEuros: product.price_eur_equivalent,
                    pricePoints: 0,
                    cover_image_url: product.image_url,
                  },
                  product: {
                    id: product.id,
                    name_default: product.name_default,
                    slug: product.slug,
                  },
                },
              ]
            : []
        }),
      }
      await persistCurrentMockOrder(session.viewerId, order)
    }
  }
  await clearCurrentMockCart()
  return {
    ok: true,
    orderId,
    totalEur: summary.totalEur,
    discountApplied: Boolean(summary.appliedAdvantageId),
    partnerOrders,
  }
}
