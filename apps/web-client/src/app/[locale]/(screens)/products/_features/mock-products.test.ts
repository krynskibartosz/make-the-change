import { describe, expect, it } from 'vitest'
import { getMockProducts } from './mock-products'

describe('V1 euro product catalogue', () => {
  const products = getMockProducts()

  it('publishes the six verified partner offers only', () => {
    expect(products.map((product) => product.name_default)).toEqual([
      'Collection de 3 Miels 250g',
      'BEE SURPRISED',
      'Miel d’Eucalyptus 250g',
      'Miel de Litchi 250g',
      'Savon DOUX',
      'Shampoing solide',
    ])
  })

  it('prices physical products only in euros', () => {
    expect(products.map((product) => product.price_eur_equivalent)).toEqual([
      26.5, 29, 7, 7, 7.1, 11,
    ])
    expect(products.every((product) => !('price_points' in product))).toBe(true)
  })

  it('uses optimized provisional visuals for each current product offer', () => {
    expect(products.every((product) => product.image_url.endsWith('.webp'))).toBe(true)
    expect(products.every((product) => product.isTemporaryVisual)).toBe(true)
  })
})
