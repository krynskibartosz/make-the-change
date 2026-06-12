import { describe, expect, it } from 'vitest'
import type { Phase } from '@/lib/domain'
import { getPhaseStatusLabel, sortPhasesByOrder } from './phase-summary'

describe('sortPhasesByOrder', () => {
  it('ordonne les phases sans modifier la collection source', () => {
    const phases = [
      { id: 'phase-2', projectId: 'project-1', name: 'Deux', order: 2 },
      { id: 'phase-1', projectId: 'project-1', name: 'Un', order: 1 },
    ] satisfies Phase[]

    expect(sortPhasesByOrder(phases).map((phase) => phase.id)).toEqual(['phase-1', 'phase-2'])
    expect(phases.map((phase) => phase.id)).toEqual(['phase-2', 'phase-1'])
  })
})

describe('getPhaseStatusLabel', () => {
  it.each([
    ['completed', 'Terminée'],
    ['in_progress', 'En cours'],
    ['delayed', 'En retard'],
    ['not_started', 'À venir'],
    [undefined, 'À venir'],
  ] as const)('traduit %s en %s', (status, label) => {
    expect(getPhaseStatusLabel(status)).toBe(label)
  })
})
