import { describe, expect, it } from 'vitest'
import {
  addLineToCart,
  calculateCartSummary,
  getCartSuggestionProductIds,
  getSellerShippingProfile,
  type MockCart,
} from './mock-commerce'

describe('mock partner commerce rules', () => {
  it('keeps products from several partners in one cart with separate shipping totals', () => {
    const initial: MockCart = {
      lines: [{ productId: 'mock-product-collection-miels-ilanga', quantity: 1 }],
    }

    const result = addLineToCart(initial, {
      productId: 'mock-product-bee-surprised-habeebee',
    })

    expect(result.ok).toBe(true)
    if (!result.ok) throw new Error('Expected a grouped cart')

    const summary = calculateCartSummary(result.cart, { unlockedAdvantageIds: [] })
    expect(summary.sellerGroups.map((group) => group.sellerId)).toEqual([
      'mock-producer-ilanga-nature',
      'mock-producer-habeebee-belgique',
    ])
    expect(summary.subtotalEur).toBe(58.05)
    expect(summary.shippingEur).toBe(13)
    expect(summary.totalEur).toBe(71.05)
  })

  it('applies the Ilanga discount only to its eligible collection', () => {
    const summary = calculateCartSummary(
      {
        lines: [
          { productId: 'mock-product-collection-miels-ilanga', quantity: 1 },
          { productId: 'mock-product-miel-eucalyptus-ilanga', quantity: 1 },
        ],
      },
      { unlockedAdvantageIds: ['code-ilanga-coffret-10'] },
    )

    expect(summary.subtotalEur).toBe(36.05)
    expect(summary.discountEur).toBe(2.91)
    expect(summary.shippingEur).toBe(6.5)
    expect(summary.totalEur).toBe(39.64)
  })

  it('evaluates free shipping after the applied discount', () => {
    const summary = calculateCartSummary(
      {
        lines: [{ productId: 'mock-product-collection-miels-ilanga', quantity: 3 }],
      },
      { unlockedAdvantageIds: ['code-ilanga-coffret-10'] },
    )

    expect(summary.discountedSubtotalEur).toBe(78.43)
    expect(summary.shippingEur).toBe(0)
    expect(getSellerShippingProfile('mock-producer-ilanga-nature')?.feeStatus).toBe(
      'prototype_estimate',
    )
  })

  it('prices selected Ilanga honey formats as distinct cart lines', () => {
    const summary = calculateCartSummary(
      {
        lines: [
          { productId: 'mock-product-miel-eucalyptus-140g-ilanga', quantity: 1 },
          { productId: 'mock-product-miel-litchi-140g-ilanga', quantity: 1 },
        ],
      },
      { unlockedAdvantageIds: [] },
    )

    expect(summary.subtotalEur).toBe(11)
    expect(summary.shippingEur).toBe(6.5)
    expect(summary.totalEur).toBe(17.5)
  })

  it('suggests at most one additional product for each partner already in the cart', () => {
    const suggestions = getCartSuggestionProductIds({
      lines: [
        { productId: 'mock-product-collection-miels-ilanga', quantity: 1 },
        { productId: 'mock-product-bee-surprised-habeebee', quantity: 1 },
      ],
    })

    expect(suggestions).toEqual([
      'mock-product-miel-eucalyptus-ilanga',
      'mock-product-savon-doux-habeebee',
    ])
  })

  it('does not suggest another format of a product already selected', () => {
    const suggestions = getCartSuggestionProductIds({
      lines: [{ productId: 'mock-product-miel-eucalyptus-140g-ilanga', quantity: 1 }],
    })

    expect(suggestions).toEqual(['mock-product-miel-litchi-ilanga'])
  })
})
