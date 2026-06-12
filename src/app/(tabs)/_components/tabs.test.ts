import { describe, expect, it } from 'vitest'

import { getTabsForRole } from './tabs'

describe('getTabsForRole', () => {
  it('keeps Hubert focused on capture and his own submissions', () => {
    expect(getTabsForRole('ouvrier').map((tab) => [tab.label, tab.href])).toEqual([
      ['Accueil', '/chantier'],
      ['Envoyés', '/historique'],
      ['Profil', '/profil'],
    ])
  })

  it('keeps Christophe focused on chantier supervision', () => {
    expect(getTabsForRole('chef').map((tab) => [tab.label, tab.href])).toEqual([
      ['Aujourd\'hui', '/planning'],
      ['Kanban', '/board'],
      ['À vérifier', '/a-verifier'],
      ['Chantier', '/chantier'],
      ['Ressources', '/ressources'],
    ])
  })

  it('keeps Martin focused on projects and decisions', () => {
    expect(getTabsForRole('admin').map((tab) => [tab.label, tab.href])).toEqual([
      ['Projets', '/projets'],
      ['Dashboard', '/dashboard'],
      ['Facturation', '/facturation'],
      ['Équipe', '/equipe'],
      ['Réglages', '/settings'],
    ])
  })

  it('uses client-friendly navigation labels and order', () => {
    expect(getTabsForRole('client').map((tab) => [tab.label, tab.href])).toEqual([
      ['Suivi', '/chantier'],
      ['À valider', '/validations'],
      ['Photos', '/photos'],
      ['Contact', '/contact'],
    ])
  })
})
