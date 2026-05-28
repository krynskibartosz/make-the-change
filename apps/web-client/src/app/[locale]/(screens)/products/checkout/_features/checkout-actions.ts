'use server'

import { redirect } from 'next/navigation'
import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import { completeMockCheckoutAction } from '@/app/[locale]/(screens)/products/_features/mock-commerce-actions'
import { getSellerShippingProfile } from '@/lib/mock/mock-commerce'
import { getCurrentMockCart } from '@/lib/mock/mock-commerce-server'
import type { MockCheckoutCustomer } from '@/lib/mock/mock-checkout-session'
import {
  clearCurrentCheckoutSession,
  getCurrentCheckoutSession,
  setCurrentCheckoutSession,
} from '@/lib/mock/mock-checkout-session-server'

export async function saveCheckoutCustomerAction(customer: MockCheckoutCustomer): Promise<void> {
  const session = await getCurrentCheckoutSession()
  await setCurrentCheckoutSession({ ...session, customer })
}

export async function completeCheckoutAction(
  locale: string,
): Promise<{ ok: false; error: 'empty_cart' | 'no_customer' }> {
  const checkoutSession = await getCurrentCheckoutSession()
  const { customer } = checkoutSession

  if (!customer.email || !customer.name || !customer.street || !customer.postalCode || !customer.city) {
    return { ok: false, error: 'no_customer' }
  }

  // Fetch cart now — completeMockCheckoutAction will clear it,
  // so we need seller info before calling it.
  const cart = await getCurrentMockCart()
  if (cart.lines.length === 0) return { ok: false, error: 'empty_cart' }

  const result = await completeMockCheckoutAction(customer)
  if (!result.ok) return { ok: false, error: result.error }

  const enrichedPartnerOrders = result.partnerOrders.map((order) => {
    const sellerLine = cart.lines.find((line) => {
      const product = getMockProductById(line.productId)
      return product?.producer_id === order.sellerId
    })
    const product = sellerLine ? getMockProductById(sellerLine.productId) : null
    const shipping = getSellerShippingProfile(order.sellerId)
    return {
      orderId: order.orderId,
      sellerId: order.sellerId,
      sellerName: product?.producer.name_default ?? order.sellerId,
      deliveryLabel: shipping?.deliveryLabel ?? null,
    }
  })

  await setCurrentCheckoutSession({
    ...checkoutSession,
    completedOrder: {
      orderId: result.orderId,
      totalEur: result.totalEur,
      partnerOrders: enrichedPartnerOrders,
    },
  })

  redirect(`/${locale}/products/checkout/confirmation`)
}

export async function clearCheckoutSessionAction(): Promise<void> {
  await clearCurrentCheckoutSession()
}
