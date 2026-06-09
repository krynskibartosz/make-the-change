import { describe, expect, it } from 'vitest'

import { createInitialAddInterventionState } from './reducer'
import { validateAddInterventionState } from './validation'

describe('validateAddInterventionState', () => {
  it('blocks when type, title, and date are missing', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      when: { ...state.when, date: '' },
    })

    expect(result.canSave).toBe(false)
    expect(result.blockingMessages).toEqual([
      'Choisis un type d intervention.',
      'Ajoute un titre court.',
      'Choisis une date.',
    ])
  })

  it('allows incomplete phase, zone, and people with warnings', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      what: { ...state.what, type: 'demolition', title: 'Demolition garage' },
      where: { phaseId: null, zoneId: null, locationToDefine: false },
      who: { personIds: [] },
    })

    expect(result.canSave).toBe(true)
    expect(result.shouldMarkToCheck).toBe(true)
    expect(result.warningMessages).toEqual(['Zone ou phase a verifier.', 'Personnes a verifier.'])
  })

  it('marks location to define as zone or phase to verify', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      what: { ...state.what, type: 'demolition', title: 'Demolition garage' },
      where: {
        phaseId: 'phase-demolition',
        zoneId: 'zone-garage',
        locationToDefine: true,
      },
      who: { personIds: ['person-hubert'] },
    })

    expect(result.canSave).toBe(true)
    expect(result.shouldMarkToCheck).toBe(true)
    expect(result.warningMessages).toEqual(['Zone ou phase a verifier.'])
  })

  it('marks extra status to_check as a warning', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      what: { ...state.what, type: 'demolition', title: 'Demolition garage' },
      where: {
        phaseId: 'phase-demolition',
        zoneId: 'zone-garage',
        locationToDefine: false,
      },
      who: { personIds: ['person-hubert'] },
      status: {
        isExtra: 'to_check',
        billingStatus: 'to_check',
        paymentStatus: 'to_check',
      },
    })

    expect(result.canSave).toBe(true)
    expect(result.shouldMarkToCheck).toBe(true)
    expect(result.warningMessages).toEqual(['Statut supplement a verifier.'])
  })
})
