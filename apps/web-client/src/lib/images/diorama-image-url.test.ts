import { describe, expect, it } from 'vitest'

import { toTransparentDioramaImageUrl } from './diorama-image-url'

describe('toTransparentDioramaImageUrl', () => {
  it('moves legacy diorama image URLs to the transparent directory', () => {
    expect(toTransparentDioramaImageUrl('/images/dioramas/abeille-noire.png')).toBe(
      '/images/dioramas/transparent/abeille-noire.png',
    )
  })

  it('leaves transparent diorama URLs and unrelated URLs unchanged', () => {
    expect(toTransparentDioramaImageUrl('/images/dioramas/transparent/abeille-noire.png')).toBe(
      '/images/dioramas/transparent/abeille-noire.png',
    )
    expect(toTransparentDioramaImageUrl('/images/products/miel.png')).toBe(
      '/images/products/miel.png',
    )
    expect(toTransparentDioramaImageUrl(null)).toBe(null)
  })
})
