import { describe, expect, it } from 'vitest'

import { clarusTabs } from './tabs'

describe('clarusTabs', () => {
  it('keeps the V0 mobile tab contract in order', () => {
    expect(clarusTabs.map((tab) => [tab.label, tab.href])).toEqual([
      ["Aujourd'hui", '/aujourd-hui'],
      ['Journal', '/journal'],
      ['Chantier', '/chantier'],
      ['Couts', '/couts'],
    ])
  })
})
