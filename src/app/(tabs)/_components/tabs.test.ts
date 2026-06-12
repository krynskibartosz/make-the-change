import { describe, expect, it } from 'vitest'

import { getTabsForRole } from './tabs'

describe('getTabsForRole', () => {
  it('keeps Hubert focused on capture and his own submissions', () => {
    expect(getTabsForRole('ouvrier').map((tab) => [tab.label, tab.href])).toEqual([
      ['Accueil', '/chantier'],
      ['Envoyés', '/historique'],
      ['Menu', '/menu'],
    ])
  })

  it('keeps Christophe focused on chantier supervision', () => {
    expect(getTabsForRole('chef').map((tab) => [tab.label, tab.href])).toEqual([
      ['Chantier', '/chantier'],
      ['À vérifier', '/a-verifier'],
      ['Menu', '/menu'],
    ])
  })

  it('keeps Martin focused on projects and decisions', () => {
    expect(getTabsForRole('admin').map((tab) => [tab.label, tab.href])).toEqual([
      ['Projets', '/projets'],
      ['Pilotage', '/dashboard'],
      ['Menu', '/menu'],
    ])
  })

  it('uses client-friendly navigation labels and order', () => {
    expect(getTabsForRole('client').map((tab) => [tab.label, tab.href])).toEqual([
      ['Suivi', '/chantier'],
      ['À valider', '/validations'],
      ['Photos', '/photos'],
      ['Plus', '/menu'],
    ])
  })
})
