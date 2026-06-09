import { describe, expect, it } from 'vitest'

import { mockPeople, mockProject } from '@/lib/mock'
import { createDraftInputFromState } from './draft'
import { createInitialAddInterventionState } from './reducer'

describe('createDraftInputFromState', () => {
  it('maps a complete wizard state to repository input', () => {
    const base = createInitialAddInterventionState({ today: '2026-06-09' })

    const input = createDraftInputFromState({
      project: mockProject,
      people: mockPeople,
      state: {
        ...base,
        what: { type: 'demolition', title: '  Demolition garage  ', note: '  Mur retire.  ' },
        where: {
          phaseId: 'phase-demolition',
          zoneId: 'zone-garage',
          locationToDefine: false,
        },
        who: { personIds: ['person-hubert', 'person-chris'] },
        when: { ...base.when, date: '  2026-06-09  ' },
      },
    })

    expect(input).toMatchObject({
      projectId: 'project-sparrenlaan',
      title: 'Demolition garage',
      type: 'demolition',
      date: '2026-06-09',
      phaseId: 'phase-demolition',
      zoneId: 'zone-garage',
      personIds: ['person-hubert', 'person-chris'],
      startTime: '08:00',
      endTime: '18:30',
      breakMinutes: 30,
      days: 1,
      hourlyRate: 45,
      isExtra: false,
      description: 'Mur retire.',
      notes: 'Mur retire.',
    })
  })

  it('keeps location null and preserves extra status when location is to define', () => {
    const base = createInitialAddInterventionState({ today: '2026-06-09' })

    const input = createDraftInputFromState({
      project: mockProject,
      people: mockPeople,
      state: {
        ...base,
        what: { type: 'demolition', title: 'Demolition garage', note: '' },
        where: {
          phaseId: 'phase-demolition',
          zoneId: 'zone-garage',
          locationToDefine: true,
        },
        who: { personIds: ['person-hubert'] },
      },
    })

    expect(input.phaseId).toBeNull()
    expect(input.zoneId).toBeNull()
    expect(input.isExtra).toBe(false)
    expect(input.description).toBeUndefined()
    expect(input.notes).toBeUndefined()
  })

  it('preserves an extra status when warning fields are incomplete', () => {
    const base = createInitialAddInterventionState({ today: '2026-06-09' })

    const input = createDraftInputFromState({
      project: mockProject,
      people: mockPeople,
      state: {
        ...base,
        what: { type: 'task', title: 'Controle', note: '' },
        where: {
          phaseId: null,
          zoneId: null,
          locationToDefine: false,
        },
        who: { personIds: [] },
        status: { ...base.status, isExtra: true },
      },
    })

    expect(input.isExtra).toBe(true)
  })

  it('preserves an explicit to_check extra status', () => {
    const base = createInitialAddInterventionState({ today: '2026-06-09' })

    const input = createDraftInputFromState({
      project: mockProject,
      people: mockPeople,
      state: {
        ...base,
        what: { type: 'task', title: 'Controle', note: '' },
        where: {
          phaseId: 'phase-demolition',
          zoneId: 'zone-garage',
          locationToDefine: false,
        },
        who: { personIds: ['person-hubert'] },
        status: { ...base.status, isExtra: 'to_check' },
      },
    })

    expect(input.isExtra).toBe('to_check')
  })

  it('uses the first active person default hourly rate', () => {
    const base = createInitialAddInterventionState({ today: '2026-06-09' })

    const peopleWithDistinctRates = [
      { ...mockPeople[0]!, active: false, defaultHourlyRate: 120 },
      { ...mockPeople[1]!, active: true, defaultHourlyRate: 67 },
      { ...mockPeople[2]!, active: true, defaultHourlyRate: 89 },
    ]

    const input = createDraftInputFromState({
      project: mockProject,
      people: peopleWithDistinctRates,
      state: {
        ...base,
        what: { type: 'task', title: 'Controle', note: '  ' },
        where: {
          phaseId: null,
          zoneId: null,
          locationToDefine: false,
        },
        who: { personIds: [] },
      },
    })

    expect(input.hourlyRate).toBe(67)
  })

  it('keeps missing phase and zone null and falls back to 45 when no person is active', () => {
    const base = createInitialAddInterventionState({ today: '2026-06-09' })

    const input = createDraftInputFromState({
      project: mockProject,
      people: mockPeople.map((person) => ({ ...person, active: false })),
      state: {
        ...base,
        what: { type: 'task', title: 'Controle', note: '  ' },
        where: {
          phaseId: null,
          zoneId: null,
          locationToDefine: false,
        },
        who: { personIds: [] },
        when: {
          date: '2026-06-10',
          startTime: '09:15',
          endTime: '11:45',
          breakMinutes: 15,
          days: 2,
        },
      },
    })

    expect(input).toMatchObject({
      phaseId: null,
      zoneId: null,
      personIds: [],
      date: '2026-06-10',
      startTime: '09:15',
      endTime: '11:45',
      breakMinutes: 15,
      days: 2,
      hourlyRate: 45,
      isExtra: false,
    })
  })

  it('throws when critical fields are missing', () => {
    const base = createInitialAddInterventionState({ today: '2026-06-09' })

    expect(() =>
      createDraftInputFromState({
        project: mockProject,
        people: mockPeople,
        state: base,
      }),
    ).toThrow('Choisis un type d intervention. Ajoute un titre court.')
  })
})
