import { describe, expect, it } from 'vitest'
import {
  filterAdvantagesByProducerSlug,
  filterAdvantagesByType,
  getMockAdvantages,
} from './mock-advantages'

describe('filterAdvantagesByType', () => {
  const advantages = getMockAdvantages()

  it('contains only Credits Impact discounts and upcoming experiences', () => {
    expect(advantages.map((advantage) => advantage.id)).toEqual([
      'code-ilanga-coffret-10',
      'experience-visite-habeebee',
    ])
    expect(
      advantages.every(
        (advantage) => advantage.type === 'discount' || advantage.type === 'experience',
      ),
    ).toBe(true)
  })

  it('limits discount category results to checkout discounts', () => {
    const filtered = filterAdvantagesByType(advantages, 'discount')

    expect(filtered.length > 0).toBe(true)
    expect(filtered.every((advantage) => advantage.type === 'discount')).toBe(true)
    expect(filtered[0]?.title).toBe('Collection de 3 Miels Ilanga')
    expect(filtered[0]?.imageBadge).toBe('-10 % à débloquer')
    expect(filtered[0]?.imageUrl.includes('ilanga-collection-3-miels-reduction.webp')).toBe(true)
    expect(filtered[0]?.partnerImageUrl).toBe(
      '/images/producteurs/illanga-nature/identity/pur-logo.png',
    )
    expect(filtered[0]?.isTemporaryVisual).toBe(true)
  })

  it('limits experiences results to experiences without paid terrain content', () => {
    const filtered = filterAdvantagesByType(advantages, 'experience')

    expect(filtered.some((advantage) => advantage.type === 'experience')).toBe(true)
    expect(filtered.every((advantage) => advantage.type === 'experience')).toBe(true)
    expect(filtered[0]?.imageUrl.includes('visite-rucher-urbain.webp')).toBe(true)
    expect(filtered[0]?.partnerImageUrl).toBe('/images/producteurs/habeebee/identity/pur-logo.png')
    expect(filtered[0]?.isTemporaryVisual).toBe(true)
  })

  it('returns only advantages offered by the requested partner', () => {
    expect(
      filterAdvantagesByProducerSlug(advantages, 'ilanga-nature').map((advantage) => advantage.id),
    ).toEqual(['code-ilanga-coffret-10'])
    expect(
      filterAdvantagesByProducerSlug(advantages, 'habeebee-belgique').map(
        (advantage) => advantage.id,
      ),
    ).toEqual(['experience-visite-habeebee'])
    expect(filterAdvantagesByProducerSlug(advantages, 'trilogy-ocean-restoration')).toEqual([])
  })
})
