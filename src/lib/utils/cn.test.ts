import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('joins class names while skipping empty values', () => {
    expect(cn('base', false && 'hidden', undefined, 'active')).toBe('base active')
  })
})
