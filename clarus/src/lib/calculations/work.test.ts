import { describe, expect, it } from 'vitest'
import type { Intervention, Person, Phase, WorkEntry, Zone } from '@/lib/domain'
import {
  calculateInterventionTotals,
  calculateTotalsByPerson,
  calculateTotalsByPhase,
  calculateTotalsByZone,
  calculateWorkEntryAmount,
  calculateWorkEntryDuration,
  getInterventionVerificationStatus,
} from './work'

const baseIntervention: Intervention = {
  id: 'int-1',
  projectId: 'project-1',
  title: 'Demolition beton',
  type: 'demolition',
  date: '2026-06-08',
  phaseId: 'phase-demolition',
  zoneId: 'zone-garage',
  status: 'done',
  isExtra: false,
  billingStatus: 'to_invoice',
  paymentStatus: 'not_applicable',
  createdAt: '2026-06-08T07:00:00.000Z',
  updatedAt: '2026-06-08T17:00:00.000Z',
}

const workEntry = (
  overrides: Partial<WorkEntry> & Pick<WorkEntry, 'id' | 'interventionId' | 'personId'>,
): WorkEntry => ({
  projectId: 'project-1',
  date: '2026-06-08',
  startTime: '08:00',
  endTime: '17:00',
  breakMinutes: 30,
  days: 1,
  hourlyRate: 45,
  durationMinutes: 510,
  amount: 382.5,
  ...overrides,
})

describe('work calculations', () => {
  it('calculates duration for 08:00 to 18:30 without break', () => {
    expect(
      calculateWorkEntryDuration({
        startTime: '08:00',
        endTime: '18:30',
        breakMinutes: 0,
        days: 1,
      }),
    ).toBe(630)
  })

  it('subtracts a defined break and supports multiple days', () => {
    expect(
      calculateWorkEntryDuration({
        startTime: '08:00',
        endTime: '18:30',
        breakMinutes: 30,
        days: 2,
      }),
    ).toBe(1200)
  })

  it('calculates amount with the default 45 EUR hourly rate', () => {
    expect(calculateWorkEntryAmount({ durationMinutes: 630 })).toBe(472.5)
  })

  it('aggregates intervention totals across multiple people', () => {
    const totals = calculateInterventionTotals({
      interventionId: 'int-1',
      workEntries: [
        workEntry({ id: 'we-1', interventionId: 'int-1', personId: 'person-hubert' }),
        workEntry({
          id: 'we-2',
          interventionId: 'int-1',
          personId: 'person-chris',
          durationMinutes: 480,
          amount: 360,
        }),
        workEntry({ id: 'we-other', interventionId: 'int-other', personId: 'person-hubert' }),
      ],
    })

    expect(totals).toEqual({
      interventionId: 'int-1',
      durationMinutes: 990,
      hours: 16.5,
      amount: 742.5,
      workEntryCount: 2,
      personIds: ['person-chris', 'person-hubert'],
    })
  })

  it('groups totals by person, zone, and phase', () => {
    const people: Person[] = [
      {
        id: 'person-hubert',
        projectId: 'project-1',
        name: 'Hubert',
        defaultHourlyRate: 45,
        active: true,
      },
      {
        id: 'person-chris',
        projectId: 'project-1',
        name: 'Chris',
        defaultHourlyRate: 45,
        active: true,
      },
    ]
    const zones: Zone[] = [
      { id: 'zone-garage', projectId: 'project-1', name: 'Garage', type: 'simple', order: 1 },
    ]
    const phases: Phase[] = [
      { id: 'phase-demolition', projectId: 'project-1', name: 'Demolition', order: 3 },
    ]
    const workEntries = [
      workEntry({ id: 'we-1', interventionId: 'int-1', personId: 'person-hubert' }),
      workEntry({
        id: 'we-2',
        interventionId: 'int-1',
        personId: 'person-chris',
        durationMinutes: 480,
        amount: 360,
      }),
    ]

    expect(calculateTotalsByPerson({ workEntries, people })).toEqual([
      {
        personId: 'person-hubert',
        name: 'Hubert',
        durationMinutes: 510,
        hours: 8.5,
        amount: 382.5,
        workEntryCount: 1,
      },
      {
        personId: 'person-chris',
        name: 'Chris',
        durationMinutes: 480,
        hours: 8,
        amount: 360,
        workEntryCount: 1,
      },
    ])

    expect(
      calculateTotalsByZone({ interventions: [baseIntervention], workEntries, zones }),
    ).toEqual([
      {
        zoneId: 'zone-garage',
        name: 'Garage',
        durationMinutes: 990,
        hours: 16.5,
        amount: 742.5,
        interventionCount: 1,
        workEntryCount: 2,
      },
    ])

    expect(
      calculateTotalsByPhase({ interventions: [baseIntervention], workEntries, phases }),
    ).toEqual([
      {
        phaseId: 'phase-demolition',
        name: 'Demolition',
        durationMinutes: 990,
        hours: 16.5,
        amount: 742.5,
        interventionCount: 1,
        workEntryCount: 2,
      },
    ])
  })

  it('marks incomplete interventions as to_check', () => {
    expect(
      getInterventionVerificationStatus({
        intervention: { ...baseIntervention, status: 'to_check', isExtra: 'to_check' },
        workEntries: [],
      }),
    ).toBe('to_check')

    expect(
      getInterventionVerificationStatus({
        intervention: baseIntervention,
        workEntries: [
          workEntry({ id: 'we-1', interventionId: 'int-1', personId: 'person-hubert' }),
        ],
      }),
    ).toBe('complete')
  })
})
