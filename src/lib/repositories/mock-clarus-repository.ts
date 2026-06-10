import { selectTodaySummary } from '@/features/dashboard'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type {
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateMaterialMovementInput,
  CreateTaskInput,
  Expense,
  Intervention,
  InterventionDraft,
  MaterialMovement,
  Person,
  Phase,
  Photo,
  Project,
  Task,
  TaskStatus,
  WorkEntry,
  Zone,
} from '@/lib/domain'
import {
  mockExpenses,
  mockInterventions,
  mockMaterialMovements,
  mockPeople,
  mockPhases,
  mockPhotos,
  mockProject,
  mockTasks,
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
  const tasks = mockTasks.map(cloneTask)
  const expenses = mockExpenses.map(cloneExpense)
  const materialMovements = mockMaterialMovements.map(cloneMaterialMovement)
  const photos = mockPhotos.map(clonePhoto)
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
    updateInterventionDraft: async (id: string, input: CreateInterventionDraftInput) => {
      // Find and remove old work entries for this intervention
      const oldWeIndices: number[] = []
      for (let i = 0; i < workEntries.length; i++) {
        const we = workEntries[i]
        if (we && we.interventionId === id) {
          oldWeIndices.push(i)
        }
      }
      for (let i = oldWeIndices.length - 1; i >= 0; i--) {
        const index = oldWeIndices[i]
        if (index !== undefined) {
          workEntries.splice(index, 1)
        }
      }

      // Generate new draft to get updated intervention and new work entries
      const draft = createInterventionDraft(input, draftSequence)
      // Keep original ID and dates
      draft.intervention.id = id
      const existingInt = interventions.find((i) => i.id === id)
      if (existingInt) {
        draft.intervention.createdAt = existingInt.createdAt
        draft.intervention.updatedAt = new Date().toISOString()
        const index = interventions.indexOf(existingInt)
        interventions[index] = cloneIntervention(draft.intervention)
      } else {
        interventions.push(cloneIntervention(draft.intervention))
      }

      // Add new work entries (fix their interventionId just in case)
      draft.workEntries.forEach((we) => {
        we.interventionId = id
        workEntries.push(cloneWorkEntry(we))
      })

      return cloneInterventionDraft(draft)
    },
    getTasks: async () => tasks.map(cloneTask),
    getExpenses: async () => expenses.map(cloneExpense),
    getExpensesByInterventionId: async (interventionId: string) =>
      expenses.filter((e) => e.interventionId === interventionId).map(cloneExpense),
    createTask: async (input: CreateTaskInput) => {
      const now = new Date().toISOString()
      const task: Task = {
        id: `task-${Date.now()}`,
        projectId: input.projectId,
        interventionId: input.interventionId,
        phaseId: input.phaseId,
        zoneId: input.zoneId,
        title: input.title,
        description: input.description,
        status: 'to_do',
        priority: input.priority ?? 'normal',
        assignedTo: input.assignedTo,
        dueDate: input.dueDate,
        createdAt: now,
      }
      tasks.push(cloneTask(task))
      return cloneTask(task)
    },
    updateTaskStatus: async (id: string, status: TaskStatus) => {
      const index = tasks.findIndex((t) => t.id === id)
      if (index === -1) throw new Error('Task not found')
      const taskToUpdate = tasks[index]
      if (!taskToUpdate) throw new Error('Task not found')
      taskToUpdate.status = status
      return cloneTask(taskToUpdate)
    },
    createExpense: async (input: CreateExpenseInput) => {
      const expense: Expense = {
        id: `expense-${Date.now()}`,
        projectId: input.projectId,
        interventionId: input.interventionId,
        materialMovementId: input.materialMovementId,
        supplier: input.supplier,
        description: input.description,
        amount: input.amount,
        date: input.date,
        status: 'to_pay',
        isRebillable: input.isRebillable,
        receiptPhotoId: input.receiptPhotoId,
      }
      expenses.push(cloneExpense(expense))
      return cloneExpense(expense)
    },
    markAsInvoiced: async (interventionIds: string[], expenseIds: string[]) => {
      interventionIds.forEach((id) => {
        const int = interventions.find((i) => i.id === id)
        if (int) int.billingStatus = 'invoiced'
      })
      expenseIds.forEach((id) => {
        const exp = expenses.find((e) => e.id === id)
        if (exp) exp.status = 'invoiced'
      })
    },
    getMaterialMovements: async () => materialMovements.map(cloneMaterialMovement),
    createMaterialMovement: async (input: CreateMaterialMovementInput) => {
      const movement: MaterialMovement = {
        id: `movement-${Date.now()}`,
        projectId: input.projectId,
        materialId: input.materialId,
        interventionId: input.interventionId,
        zoneId: input.zoneId,
        phaseId: input.phaseId,
        type: input.type,
        quantity: input.quantity,
        unit: input.unit,
        estimatedCost: input.estimatedCost,
        realCost: input.realCost,
        supplier: input.supplier,
        status: 'on_site',
      }
      materialMovements.push(cloneMaterialMovement(movement))
      return cloneMaterialMovement(movement)
    },
    getPhotos: async () => photos.map(clonePhoto),
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
    billingStatus:
      data.billingStatus ?? (isIncomplete || data.isExtra === true ? 'to_check' : 'not_billable'),
    paymentStatus: data.paymentStatus ?? 'not_applicable',
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

function cloneTask(task: Task): Task {
  return { ...task }
}

function cloneExpense(expense: Expense): Expense {
  return { ...expense }
}

function cloneMaterialMovement(movement: MaterialMovement): MaterialMovement {
  return { ...movement }
}

function clonePhoto(photo: Photo): Photo {
  return { ...photo }
}
