import { selectTodaySummary } from '@/features/dashboard'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type {
  CreateInterventionDraftInput,
  Intervention,
  InterventionDraft,
  Person,
  Phase,
  Project,
  WorkEntry,
  Zone,
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

export const createMockClarusRepository = (): ClarusRepository => {
  const project = cloneProject(mockProject)
  const people = mockPeople.map(clonePerson)
  const phases = mockPhases.map(clonePhase)
  const zones = mockZones.map(cloneZone)
  const interventions = mockInterventions.map(cloneIntervention)
  const workEntries = mockWorkEntries.map(cloneWorkEntry)
  let draftSequence = 0

  return {
    getProject: async () => cloneProject(project),
    getPeople: async () => people.map(clonePerson),
    getPhases: async () => phases.map(clonePhase),
    getZones: async () => zones.map(cloneZone),
    getInterventions: async () => interventions.map(cloneIntervention),
    getInterventionById: async (id: string) =>
      cloneInterventionOrNull(interventions.find((intervention) => intervention.id === id) ?? null),
    getWorkEntries: async () => workEntries.map(cloneWorkEntry),
    getTodaySummary: async (date: string) =>
      selectTodaySummary({
        date,
        interventions,
        workEntries,
        people,
        zones,
        phases,
      }),
    createInterventionDraft: async (input: CreateInterventionDraftInput) => {
      draftSequence += 1
      const draft = createInterventionDraft(input, draftSequence)

      interventions.push(cloneIntervention(draft.intervention))
      workEntries.push(...draft.workEntries.map(cloneWorkEntry))

      return cloneInterventionDraft(draft)
    },
  }
}

export const mockClarusRepository = createMockClarusRepository()

const createInterventionDraft = (
  input: CreateInterventionDraftInput,
  draftSequence: number,
): InterventionDraft => {
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
  const draftId = `draft-${data.date}-${slugify(data.title)}-${draftSequence}`
  const intervention: Intervention = {
    id: draftId,
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

function cloneProject(project: Project): Project {
  return { ...project }
}

function clonePerson(person: Person): Person {
  return { ...person }
}

function clonePhase(phase: Phase): Phase {
  return { ...phase }
}

function cloneZone(zone: Zone): Zone {
  return { ...zone }
}

function cloneIntervention(intervention: Intervention): Intervention {
  return { ...intervention }
}

function cloneInterventionOrNull(intervention: Intervention | null): Intervention | null {
  return intervention === null ? null : cloneIntervention(intervention)
}

function cloneWorkEntry(workEntry: WorkEntry): WorkEntry {
  return { ...workEntry }
}

function cloneInterventionDraft(draft: InterventionDraft): InterventionDraft {
  return {
    intervention: cloneIntervention(draft.intervention),
    workEntries: draft.workEntries.map(cloneWorkEntry),
  }
}
