import { describe, expect, it } from 'vitest'
import { filterAdvantagesByType, getMockAdvantages } from './mock-advantages'

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
  })

  it('limits experiences results to experiences without paid terrain content', () => {
    const filtered = filterAdvantagesByType(advantages, 'experience')

    expect(filtered.some((advantage) => advantage.type === 'experience')).toBe(true)
    expect(filtered.every((advantage) => advantage.type === 'experience')).toBe(true)
  })
})
