import { describe, expect, it } from 'vitest'
import { getMockProductById, getMockProducts } from './mock-products'

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

  it('stores sourced product information for each selected partner offer', () => {
    expect(
      products.every(
        (product) =>
          product.productInformation?.sourceUrl.startsWith('https://') &&
          product.productInformation.verifiedAt === '2026-05-26',
      ),
    ).toBe(true)

    const eucalyptus = products.find((product) => product.slug === 'miel-eucalyptus-ilanga')
    expect(eucalyptus?.productInformation.formatLabel).toBe('250 g')
    expect(eucalyptus?.productInformation.ingredients).toBe('100% miel d’Eucalyptus')
    expect(eucalyptus?.productInformation.origin).toBe('Madagascar')
    expect(eucalyptus?.productInformation.packaging).toBe('Bocal en verre')
    expect(eucalyptus?.productInformation.certification).toBe('Non certifié biologique')
    expect(eucalyptus?.productInformation.sensoryNotes).toEqual([
      'Boisé',
      'Aromatique',
      'Légèrement mentholé',
    ])
    expect(eucalyptus?.productInformation?.nutrition?.energy_kcal).toBe(328)

    const surprised = products.find((product) => product.slug === 'bee-surprised-habeebee')
    expect(surprised?.productInformation.contents?.length).toBe(4)
  })

  it('offers the confirmed consumer formats only on individual Ilanga honeys', () => {
    expect(products.every((product) => product.productInformation?.formatLabel)).toBe(true)

    const eucalyptus = products.find((product) => product.slug === 'miel-eucalyptus-ilanga')
    const litchi = products.find((product) => product.slug === 'miel-litchi-ilanga')
    expect(eucalyptus?.variants?.map((variant) => variant.format_label)).toEqual(['140 g', '250 g'])
    expect(litchi?.variants?.map((variant) => variant.format_label)).toEqual(['140 g', '250 g'])
    expect(
      products
        .filter(
          (product) =>
            product.slug !== 'miel-eucalyptus-ilanga' && product.slug !== 'miel-litchi-ilanga',
        )
        .every((product) => !product.variants?.length),
    ).toBe(true)

    const eucalyptus140g = getMockProductById('mock-product-miel-eucalyptus-140g-ilanga')
    const litchi140g = getMockProductById('mock-product-miel-litchi-140g-ilanga')
    expect(eucalyptus140g?.price_eur_equivalent).toBe(5.5)
    expect(eucalyptus140g?.productInformation.formatLabel).toBe('140 g')
    expect(litchi140g?.price_eur_equivalent).toBe(5.5)
    expect(litchi140g?.productInformation.formatLabel).toBe('140 g')
  })
})
