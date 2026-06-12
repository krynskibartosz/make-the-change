import { describe, expect, it } from 'vitest'
import {
  mockExpenses,
  mockInterventions,
  mockMaterialMovements,
  mockMaterials,
  mockPeople,
  mockPhases,
  mockPhotos,
  mockProject,
  mockTasks,
  mockWorkEntries,
  mockZones,
} from '@/lib/mock'
import { createInterventionDraftInputSchema, validateMockDataset } from './clarus'

describe('clarus schemas', () => {
  it('validates the Sparrenlaan mock dataset', () => {
    const result = validateMockDataset({
      project: mockProject,
      people: mockPeople,
      phases: mockPhases,
      zones: mockZones,
      interventions: mockInterventions,
      workEntries: mockWorkEntries,
      tasks: mockTasks,
      materials: mockMaterials,
      materialMovements: mockMaterialMovements,
      expenses: mockExpenses,
      photos: mockPhotos,
    })

    if (!result.success) {
      console.log(result.error.errors)
    }
    expect(result.success).toBe(true)
  })

  it('accepts field-compatible incomplete draft inputs for later to_check handling', () => {
    const result = createInterventionDraftInputSchema.safeParse({
      projectId: 'project-sparrenlaan',
      title: 'Point a verifier',
      type: 'decision',
      date: '2026-06-08',
      phaseId: null,
      zoneId: null,
      personIds: [],
      startTime: null,
      endTime: null,
      breakMinutes: 0,
      days: 1,
      hourlyRate: 45,
      isExtra: 'to_check',
      notes: 'Confirmer avec Martin',
    })

    expect(result.success).toBe(true)
  })
})
