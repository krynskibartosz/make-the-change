import { describe, expect, it } from 'vitest'

import { createInitialAddInterventionState } from './reducer'
import { validateAddInterventionState } from './validation'

describe('validateAddInterventionState', () => {
  it('blocks when type, title, and date are missing', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      form: { ...state.form, date: '' },
    })

    expect(result.canSave).toBe(false)
    expect(result.blockingMessages).toEqual([
      'Choisis un type de travail.',
      'Ajoute un titre court.',
      'Choisis une date.',
    ])
  })

  it('allows incomplete phase, zone, and people with warnings', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      form: {
        ...state.form,
        type: 'demolition',
        title: 'Demolition garage',
        phaseId: null,
        zoneId: null,
        locationToDefine: false,
        personIds: [],
      },
    })

    expect(result.canSave).toBe(true)
    expect(result.shouldMarkToCheck).toBe(true)
    expect(result.warningMessages).toEqual(['Zone ou phase à vérifier.', 'Personnes à vérifier.'])
  })

  it('blocks when time range is invalid', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      form: {
        ...state.form,
        type: 'demolition',
        title: 'Demolition garage',
        startTime: '18:00',
        endTime: '08:00',
      },
    })

    expect(result.canSave).toBe(false)
    expect(result.blockingMessages).toContain('Vérifie les horaires.')
  })

  it('marks location to define as zone or phase to verify', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      form: {
        ...state.form,
        type: 'demolition',
        title: 'Demolition garage',
        phaseId: 'phase-demolition',
        zoneId: 'zone-garage',
        locationToDefine: true,
        personIds: ['person-hubert'],
      },
    })

    expect(result.canSave).toBe(true)
    expect(result.shouldMarkToCheck).toBe(true)
    expect(result.warningMessages).toEqual(['Zone ou phase à vérifier.'])
  })

  it('marks extra status to_check as a warning', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const result = validateAddInterventionState({
      ...state,
      form: {
        ...state.form,
        type: 'demolition',
        title: 'Demolition garage',
        phaseId: 'phase-demolition',
        zoneId: 'zone-garage',
        locationToDefine: false,
        personIds: ['person-hubert'],
      },
      status: {
        simplified: 'to_check',
      },
    })

    expect(result.canSave).toBe(true)
    expect(result.shouldMarkToCheck).toBe(true)
    expect(result.warningMessages).toEqual(['Statut à vérifier.'])
  })
})
