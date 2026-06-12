import { describe, expect, it } from 'vitest'

import { createInitialAddInterventionState, reduceAddInterventionState } from './reducer'

describe('add intervention reducer', () => {
  it('updates form fields with updateForm action', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const next = reduceAddInterventionState(state, {
      type: 'updateForm',
      payload: { type: 'demolition', title: 'Demolition' },
    })

    expect(next.form.type).toBe('demolition')
    expect(next.form.title).toBe('Demolition')
  })

  it('updates status with setStatus action', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    const next = reduceAddInterventionState(state, {
      type: 'setStatus',
      status: 'blocked',
    })

    expect(next.status.simplified).toBe('blocked')
  })

  it('stores default date and time values', () => {
    const state = createInitialAddInterventionState({ today: '2026-06-09' })

    expect(state.form.date).toBe('2026-06-09')
    expect(state.form.startTime).toBe('08:00')
    expect(state.form.endTime).toBe('18:30')
    expect(state.form.breakMinutes).toBe(30)
    expect(state.form.days).toBe(1)
  })
})
