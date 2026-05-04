import { describe, expect, it } from 'vitest'
import { CURRENCY_DESIGN, getCurrencyDesign } from './currency-design'

describe('currency design identity', () => {
  it('keeps seeds visually organic and separate from shop value', () => {
    expect(getCurrencyDesign('seeds')).toEqual(CURRENCY_DESIGN.seeds)
    expect(CURRENCY_DESIGN.seeds.icon).toBe('Sprout')
    expect(CURRENCY_DESIGN.seeds.toneClassName).toBe('text-emerald-300')
    expect(CURRENCY_DESIGN.seeds.surfaceClassName).toBe(
      'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    )
  })

  it('keeps impact credits premium, geometric, and non-green', () => {
    expect(getCurrencyDesign('impactCredits')).toEqual(CURRENCY_DESIGN.impactCredits)
    expect(CURRENCY_DESIGN.impactCredits.icon).toBe('Hexagon')
    expect(CURRENCY_DESIGN.impactCredits.toneClassName).toBe('text-amber-300')
    expect(CURRENCY_DESIGN.impactCredits.surfaceClassName).toBe(
      'border-amber-300/25 bg-amber-300/10 text-amber-300',
    )
  })
})
