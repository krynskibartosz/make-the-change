import { describe, expect, it } from 'vitest'
import { filterAdvantagesByType, getMockAdvantages } from './mock-advantages'

describe('filterAdvantagesByType', () => {
  const advantages = getMockAdvantages()

  it('limits product category results to product advantages', () => {
    const filtered = filterAdvantagesByType(advantages, 'product')

    expect(filtered.length > 0).toBe(true)
    expect(filtered.every((advantage) => advantage.type === 'product')).toBe(true)
  })

  it('groups content and experiences in the experiences category', () => {
    const filtered = filterAdvantagesByType(advantages, 'content')

    expect(filtered.some((advantage) => advantage.type === 'content')).toBe(true)
    expect(filtered.some((advantage) => advantage.type === 'experience')).toBe(true)
    expect(filtered.every((advantage) => advantage.type === 'content' || advantage.type === 'experience')).toBe(true)
  })
})
