import { describe, expect, it } from 'vitest'

import { createInitialAddInterventionState, reduceAddInterventionState } from './reducer'

describe('add intervention reducer', () => {
  it('derives a title from the selected intervention type when title is empty', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const next = reduceAddInterventionState(state, {
      type: 'selectType',
      interventionType: 'demolition',
      defaultTitle: 'Demolition',
    })

    expect(next.what.type).toBe('demolition')
    expect(next.what.title).toBe('Demolition')
  })

  it('keeps a custom title when changing type', () => {
    const state = reduceAddInterventionState(
      createInitialAddInterventionState({ today: '2026-06-09' }),
      { type: 'setTitle', title: 'Retirer les cloisons garage' },
    )

    const next = reduceAddInterventionState(state, {
      type: 'selectType',
      interventionType: 'evacuation',
      defaultTitle: 'Evacuation',
    })

    expect(next.what.type).toBe('evacuation')
    expect(next.what.title).toBe('Retirer les cloisons garage')
  })

  it('toggles people without duplicates', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const selected = reduceAddInterventionState(state, {
      type: 'togglePerson',
      personId: 'person-hubert',
    })
    const unselected = reduceAddInterventionState(selected, {
      type: 'togglePerson',
      personId: 'person-hubert',
    })

    expect(selected.who.personIds).toEqual(['person-hubert'])
    expect(unselected.who.personIds).toEqual([])
  })

  it('stores default date and time values', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    expect(state.when.date).toBe('2026-06-09')
    expect(state.when.startTime).toBe('08:00')
    expect(state.when.endTime).toBe('18:30')
    expect(state.when.breakMinutes).toBe(30)
    expect(state.when.days).toBe(1)
  })
})
