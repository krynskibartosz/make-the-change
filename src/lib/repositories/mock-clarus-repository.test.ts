import { describe, expect, it } from 'vitest'

import { createMockClarusRepository } from './mock-clarus-repository'

describe('mock Clarus repository', () => {
  it('exposes Sparrenlaan data through the repository contract', async () => {
    const repository = createMockClarusRepository()

    await expect(repository.getProject()).resolves.toMatchObject({ name: 'Villa Sparrenlaan' })
    await expect(repository.getPeople()).resolves.toHaveLength(4)
    await expect(repository.getPhases()).resolves.toHaveLength(7)
    await expect(repository.getZones()).resolves.toHaveLength(31)
    await expect(repository.getInterventions()).resolves.toHaveLength(12)
    await expect(repository.getWorkEntries()).resolves.toHaveLength(24)
  })

  it('finds an intervention by id and returns null when missing', async () => {
    const repository = createMockClarusRepository()
    const interventions = await repository.getInterventions()
    const firstIntervention = interventions[0]

    expect(firstIntervention).toBeDefined()
    await expect(repository.getInterventionById(firstIntervention?.id ?? '')).resolves.toEqual(
      firstIntervention,
    )
    await expect(repository.getInterventionById('missing')).resolves.toBeNull()
  })

  it("returns Aujourd'hui summary from mocks", async () => {
    const repository = createMockClarusRepository()
    const summary = await repository.getTodaySummary('2026-06-08')

    expect(summary.metrics.interventionCount).toBeGreaterThanOrEqual(2)
    expect(summary.alerts.length).toBeGreaterThanOrEqual(1)
  })

  it('creates a to_check draft when optional field data is missing', async () => {
    const repository = createMockClarusRepository()

    const draft = await repository.createInterventionDraft({
      projectId: 'project-sparrenlaan',
      title: 'Confirmer point structure',
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
      notes: 'Verifier P1.7 avec Martin',
    })

    expect(draft.intervention.status).toBe('to_check')
    expect(draft.intervention.billingStatus).toBe('to_check')
    expect(draft.workEntries).toEqual([])
  })
})
