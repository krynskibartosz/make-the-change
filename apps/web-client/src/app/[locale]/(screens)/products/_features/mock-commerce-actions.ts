'use server'

import { getMockAdvantageById } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import {
  addLineToCart,
  calculateCartSummary,
  createEmptyMockCart,
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
import { getMockViewerSession } from '@/lib/mock/mock-session-server'

export async function addProductToCartAction(
  productId: string,
  replaceExisting = false,
): Promise<
  | { ok: true; cart: MockCart }
  | { ok: false; reason: 'not_found' | 'different_seller'; sellerId?: string }
> {
  const product = getMockProductById(productId)
  if (!product) return { ok: false, reason: 'not_found' }

  const cart = replaceExisting ? createEmptyMockCart() : await getCurrentMockCart()
  const result = addLineToCart(cart, { productId, sellerId: product.producer_id })
  if (!result.ok) return result

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

type MockCheckoutCustomer = {
  name: string
  street: string
  postalCode: string
  city: string
}

export async function completeMockCheckoutAction(
  customer: MockCheckoutCustomer,
): Promise<
  | { ok: true; orderId: string; totalEur: number; discountApplied: boolean }
  | { ok: false; error: 'empty_cart' }
> {
  const cart = await getCurrentMockCart()
  if (cart.lines.length === 0 || !cart.sellerId) return { ok: false, error: 'empty_cart' }

  const session = await getMockViewerSession()
  const events = await getCurrentMockCommerceEvents()
  const unlockedIds = await getCurrentUnlockedAdvantageIds(session?.viewerId ?? null)
  const summary = calculateCartSummary(cart, { unlockedAdvantageIds: unlockedIds })
  const orderId = `MTC-BE-${Date.now().toString().slice(-6)}`
  const createdAt = new Date().toISOString()
  const nextEvents = [
    {
      type: 'product_order' as const,
      orderId,
      sellerId: cart.sellerId,
      userId: session?.viewerId,
      createdAt,
    },
    ...(summary.appliedAdvantageId && session
      ? [
          {
            type: 'discount_used' as const,
            advantageId: summary.appliedAdvantageId,
            orderId,
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
    const order: MockOrderRecord = {
      id: orderId,
      status: 'paid',
      subtotal_points: 0,
      shipping_cost_points: 0,
      tax_points: 0,
      total_points: 0,
      subtotal_euros: summary.discountedSubtotalEur,
      shipping_cost_euros: summary.shippingEur,
      tax_euros: 0,
      total_euros: summary.totalEur,
      created_at: createdAt,
      tracking_number: null,
      carrier: cart.sellerId.includes('habeebee') ? 'Bpost' : 'Bpost / UPS',
      shipping_address: {
        firstName: nameParts[0] ?? '',
        lastName: nameParts.slice(1).join(' '),
        street: customer.street,
        postalCode: customer.postalCode,
        city: customer.city,
        country: 'Belgique',
      },
      items: cart.lines.flatMap((line) => {
        const product = getMockProductById(line.productId)
        return product
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
  await clearCurrentMockCart()
  return {
    ok: true,
    orderId,
    totalEur: summary.totalEur,
    discountApplied: Boolean(summary.appliedAdvantageId),
  }
}
