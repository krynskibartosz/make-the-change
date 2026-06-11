import { describe, expect, it } from 'vitest'

import { clarusThemeTokens } from './tokens'

describe('clarusThemeTokens', () => {
  it('keeps the V0 primary color contract', () => {
    expect(clarusThemeTokens.dark.primary).toBe('#B6F255')
  })

  it('is light-ready with the same semantic token names', () => {
    const darkTokenNames = Object.keys(clarusThemeTokens.dark).sort()
    const lightTokenNames = Object.keys(clarusThemeTokens.light).sort()

    expect(lightTokenNames).toEqual(darkTokenNames)
  })
})
