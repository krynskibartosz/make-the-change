import { selectTodaySummary } from '@/features/dashboard'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type {
  CreateInterventionDraftInput,
  Intervention,
  InterventionDraft,
  WorkEntry,
} from '@/lib/domain'
import {
  mockInterventions,
  mockPeople,
  mockPhases,
  mockProject,
  mockWorkEntries,
  mockZones,
} from '@/lib/mock'
import { createInterventionDraftInputSchema } from '@/lib/schemas'
import type { ClarusRepository } from './clarus-repository'

const FALLBACK_PHASE_ID = 'phase-admin'
const FALLBACK_ZONE_ID = 'zone-maison-existante'

export const createMockClarusRepository = (): ClarusRepository => ({
  getProject: async () => mockProject,
  getPeople: async () => [...mockPeople],
  getPhases: async () => [...mockPhases],
  getZones: async () => [...mockZones],
  getInterventions: async () => [...mockInterventions],
  getInterventionById: async (id: string) =>
    mockInterventions.find((intervention) => intervention.id === id) ?? null,
  getWorkEntries: async () => [...mockWorkEntries],
  getTodaySummary: async (date: string) =>
    selectTodaySummary({
      date,
      interventions: mockInterventions,
      workEntries: mockWorkEntries,
      people: mockPeople,
      zones: mockZones,
      phases: mockPhases,
    }),
  createInterventionDraft: async (input: CreateInterventionDraftInput) =>
    createInterventionDraft(input),
})

export const mockClarusRepository = createMockClarusRepository()

const createInterventionDraft = (input: CreateInterventionDraftInput): InterventionDraft => {
  const parsed = createInterventionDraftInputSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join(', '))
  }

  const data = parsed.data
  const isIncomplete =
    data.phaseId === null ||
    data.zoneId === null ||
    data.personIds.length === 0 ||
    data.startTime === null ||
    data.endTime === null ||
    data.isExtra === 'to_check'
  const now = new Date().toISOString()
  const intervention: Intervention = {
    id: `draft-${data.date}-${slugify(data.title)}`,
    projectId: data.projectId,
    title: data.title,
    description: data.description,
    type: data.type,
    date: data.date,
    phaseId: data.phaseId ?? FALLBACK_PHASE_ID,
    zoneId: data.zoneId ?? FALLBACK_ZONE_ID,
    status: isIncomplete ? 'to_check' : 'draft',
    isExtra: data.isExtra,
    billingStatus: isIncomplete || data.isExtra === true ? 'to_check' : 'not_billable',
    paymentStatus: 'not_applicable',
    sourceNote: data.notes,
    createdAt: now,
    updatedAt: now,
  }
  const workEntries =
    data.startTime !== null && data.endTime !== null
      ? data.personIds.map((personId) =>
          createDraftWorkEntry({
            input: data,
            personId,
            interventionId: intervention.id,
          }),
        )
      : []

  return {
    intervention,
    workEntries,
  }
}

const createDraftWorkEntry = ({
  input,
  personId,
  interventionId,
}: {
  input: CreateInterventionDraftInput
  personId: string
  interventionId: string
}): WorkEntry => {
  const startTime = input.startTime ?? '08:00'
  const endTime = input.endTime ?? '08:00'
  const person = mockPeople.find((candidate) => candidate.id === personId)
  const hourlyRate = person?.defaultHourlyRate ?? input.hourlyRate
  const durationMinutes = calculateWorkEntryDuration({
    startTime,
    endTime,
    breakMinutes: input.breakMinutes,
    days: input.days,
  })

  return {
    id: `draft-we-${interventionId}-${personId}`,
    projectId: input.projectId,
    interventionId,
    personId,
    date: input.date,
    startTime,
    endTime,
    breakMinutes: input.breakMinutes,
    days: input.days,
    hourlyRate,
    durationMinutes,
    amount: calculateWorkEntryAmount({ durationMinutes, hourlyRate }),
    notes: input.notes,
  }
}

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
