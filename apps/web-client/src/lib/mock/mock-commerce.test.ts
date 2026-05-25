import { describe, expect, it } from 'vitest'
import {
  addLineToCart,
  calculateCartSummary,
  getSellerShippingProfile,
  type MockCart,
} from './mock-commerce'

describe('mock partner commerce rules', () => {
  it('rejects products from a second partner in one cart', () => {
    const initial: MockCart = {
      sellerId: 'mock-producer-ilanga-nature',
      lines: [{ productId: 'mock-product-collection-miels-ilanga', quantity: 1 }],
    }

    const result = addLineToCart(initial, {
      productId: 'mock-product-bee-surprised-habeebee',
      sellerId: 'mock-producer-habeebee-belgique',
    })

    expect(result.ok).toBe(false)
    if (result.ok) throw new Error('Expected a seller conflict')
    expect(result.reason).toBe('different_seller')
  })

  it('applies the Ilanga discount only to its eligible collection', () => {
    const summary = calculateCartSummary(
      {
        sellerId: 'mock-producer-ilanga-nature',
        lines: [
          { productId: 'mock-product-collection-miels-ilanga', quantity: 1 },
          { productId: 'mock-product-miel-eucalyptus-ilanga', quantity: 1 },
        ],
      },
      { unlockedAdvantageIds: ['code-ilanga-coffret-10'] },
    )

    expect(summary.subtotalEur).toBe(33.5)
    expect(summary.discountEur).toBe(2.65)
    expect(summary.shippingEur).toBe(6.5)
    expect(summary.totalEur).toBe(37.35)
  })

  it('evaluates free shipping after the applied discount', () => {
    const summary = calculateCartSummary(
      {
        sellerId: 'mock-producer-ilanga-nature',
        lines: [{ productId: 'mock-product-collection-miels-ilanga', quantity: 3 }],
      },
      { unlockedAdvantageIds: ['code-ilanga-coffret-10'] },
    )

    expect(summary.discountedSubtotalEur).toBe(71.55)
    expect(summary.shippingEur).toBe(0)
    expect(getSellerShippingProfile('mock-producer-ilanga-nature')?.feeStatus).toBe(
      'prototype_estimate',
    )
  })
})
