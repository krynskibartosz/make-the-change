import { describe, expect, it } from 'vitest'

import { createMockClarusRepository } from './mock-clarus-repository'

describe('mock Clarus repository', () => {
  it('exposes Sparrenlaan data through the repository contract', async () => {
    const repository = createMockClarusRepository()

    await expect(repository.getProject()).resolves.toMatchObject({ name: 'Sparrenlaan' })
    await expect(repository.getPeople()).resolves.toHaveLength(5)
    await expect(repository.getPhases()).resolves.toHaveLength(9)
    await expect(repository.getZones()).resolves.toHaveLength(17)
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

  it('isolates returned repository data from internal state mutations', async () => {
    const repository = createMockClarusRepository()

    const project = await repository.getProject()
    project.name = 'Mutated project'

    const people = await repository.getPeople()
    const person = people[0]
    expect(person).toBeDefined()
    if (person === undefined) {
      throw new Error('Expected at least one person')
    }
    person.name = 'Mutated person'

    const interventions = await repository.getInterventions()
    const intervention = interventions[0]
    expect(intervention).toBeDefined()
    if (intervention === undefined) {
      throw new Error('Expected at least one intervention')
    }
    intervention.title = 'Mutated intervention'

    const workEntries = await repository.getWorkEntries()
    const workEntry = workEntries[0]
    expect(workEntry).toBeDefined()
    if (workEntry === undefined) {
      throw new Error('Expected at least one work entry')
    }
    workEntry.notes = 'Mutated work entry'

    await expect(repository.getProject()).resolves.toMatchObject({ name: 'Sparrenlaan' })
    await expect(repository.getPeople()).resolves.not.toContainEqual(
      expect.objectContaining({ name: 'Mutated person' }),
    )
    await expect(repository.getInterventions()).resolves.not.toContainEqual(
      expect.objectContaining({ title: 'Mutated intervention' }),
    )
    await expect(repository.getWorkEntries()).resolves.not.toContainEqual(
      expect.objectContaining({ notes: 'Mutated work entry' }),
    )
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

  it('preserves explicit billing and payment statuses from draft input', async () => {
    const repository = createMockClarusRepository()

    const draft = await repository.createInterventionDraft({
      projectId: 'project-sparrenlaan',
      title: 'Achat materiaux paye',
      type: 'expense',
      date: '2026-06-09',
      phaseId: 'phase-finitions',
      zoneId: 'zone-stockage',
      personIds: ['person-hubert'],
      startTime: '08:00',
      endTime: '09:00',
      breakMinutes: 0,
      days: 1,
      hourlyRate: 45,
      isExtra: true,
      billingStatus: 'paid',
      paymentStatus: 'paid',
    })

    expect(draft.intervention.isExtra).toBe(true)
    expect(draft.intervention.billingStatus).toBe('paid')
    expect(draft.intervention.paymentStatus).toBe('paid')
  })

  it('returns complete draft interventions and work entries after creation', async () => {
    const repository = createMockClarusRepository()

    const draft = await repository.createInterventionDraft({
      projectId: 'project-sparrenlaan',
      title: 'Pose seuils cuisine',
      type: 'work',
      date: '2026-06-09',
      phaseId: 'phase-finitions',
      zoneId: 'zone-maison-existante',
      personIds: ['person-hubert', 'person-chris'],
      startTime: '08:00',
      endTime: '12:00',
      breakMinutes: 15,
      days: 1,
      hourlyRate: 45,
      isExtra: false,
      notes: 'Ajouter au carnet de suivi',
    })

    await expect(repository.getInterventionById(draft.intervention.id)).resolves.toEqual(
      draft.intervention,
    )
    await expect(repository.getInterventions()).resolves.toContainEqual(draft.intervention)
    await expect(repository.getWorkEntries()).resolves.toEqual(
      expect.arrayContaining(draft.workEntries),
    )
  })

  it('creates distinct ids for matching drafts and keeps work entries attached to their draft', async () => {
    const repository = createMockClarusRepository()
    const input = {
      projectId: 'project-sparrenlaan',
      title: 'Pose seuils cuisine',
      type: 'work' as const,
      date: '2026-06-09',
      phaseId: 'phase-finitions',
      zoneId: 'zone-maison-existante',
      personIds: ['person-hubert'],
      startTime: '08:00',
      endTime: '12:00',
      breakMinutes: 15,
      days: 1,
      hourlyRate: 45,
      isExtra: false as const,
      notes: 'Ajouter au carnet de suivi',
    }

    const firstDraft = await repository.createInterventionDraft(input)
    const secondDraft = await repository.createInterventionDraft(input)

    expect(firstDraft.intervention.id).not.toBe(secondDraft.intervention.id)
    expect(firstDraft.workEntries).toHaveLength(1)
    expect(secondDraft.workEntries).toHaveLength(1)
    const firstWorkEntry = firstDraft.workEntries[0]
    const secondWorkEntry = secondDraft.workEntries[0]

    expect(firstWorkEntry).toBeDefined()
    expect(secondWorkEntry).toBeDefined()
    if (firstWorkEntry === undefined || secondWorkEntry === undefined) {
      throw new Error('Expected each draft to create a work entry')
    }

    expect(firstWorkEntry.interventionId).toBe(firstDraft.intervention.id)
    expect(secondWorkEntry.interventionId).toBe(secondDraft.intervention.id)
    expect(firstWorkEntry.id).not.toBe(secondWorkEntry.id)
  })
})
