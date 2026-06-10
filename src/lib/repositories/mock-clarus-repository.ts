import { selectTodaySummary } from '@/features/dashboard'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type {
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateMaterialMovementInput,
  CreatePersonInput,
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
  UpdatePersonInput,
  WorkEntry,
} from '@/lib/domain'
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
import { createInterventionDraftInputSchema } from '@/lib/schemas'
import type { ClarusRepository } from './clarus-repository'

const FALLBACK_PHASE_ID = 'phase-admin'
const FALLBACK_ZONE_ID = 'zone-maison-existante'

export const createMockClarusRepository = (): ClarusRepository => {
  let interventions: Intervention[] = [...mockInterventions]
  let tasks: Task[] = [...mockTasks] as Task[]
  let expenses: Expense[] = [...mockExpenses] as Expense[]
  let materialMovements: MaterialMovement[] = [...mockMaterialMovements] as MaterialMovement[]
  const _photos = mockPhotos.map(clonePhoto)
  const people = mockPeople.map(clonePerson)
  const _draftSequence = 0

  return {
    getProject: async () => mockProject,
    getPeople: async () => people.map(clonePerson),
    createPerson: async (input: CreatePersonInput) => {
      const person: Person = {
        id: `person-${Date.now()}`,
        projectId: input.projectId,
        name: input.name,
        role: input.role,
        defaultHourlyRate: input.defaultHourlyRate,
        active: true,
      }
      people.push(person)
      return clonePerson(person)
    },
    updatePerson: async (id: string, input: UpdatePersonInput) => {
      const idx = people.findIndex((p) => p.id === id)
      if (idx === -1) throw new Error('Person not found')
      const person = people[idx]
      const updated: Person = { ...person!, ...input, id: person!.id, projectId: person!.projectId, name: input.name || person!.name, defaultHourlyRate: input.defaultHourlyRate ?? person!.defaultHourlyRate, active: input.active ?? person!.active }
      people[idx] = updated
      return clonePerson(updated)
    },
    getPhases: async () => mockPhases.map((p) => ({ ...p })),
    getZones: async () => [...mockZones],
    getMaterials: async () => [...mockMaterials],
    getPhotos: async () => [...mockPhotos],
    getTasks: async () => [...tasks],
    getInterventions: async () => [...interventions],
    getInterventionById: async (id: string) =>
      interventions.find((intervention) => intervention.id === id) ?? null,
    getWorkEntries: async () => [...mockWorkEntries],
    getTodaySummary: async (date: string) =>
      selectTodaySummary({
        date,
        interventions,
        workEntries: mockWorkEntries,
        people: mockPeople,
        zones: mockZones,
        phases: mockPhases,
      }),
    createInterventionDraft: async (input: CreateInterventionDraftInput) =>
      createInterventionDraft(input),
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
      tasks = [...tasks, task]
      return task
    },
    updateTaskStatus: async (id: string, status: TaskStatus) => {
      const index = tasks.findIndex((t) => t.id === id)
      if (index === -1) throw new Error('Task not found')
      const updatedTask: Task = { ...tasks[index], status } as Task
      tasks = [...tasks.slice(0, index), updatedTask, ...tasks.slice(index + 1)]
      return updatedTask
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
      expenses = [...expenses, expense]
      return expense
    },
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
        status: input.status,
      }
      materialMovements = [...materialMovements, movement]
      return movement
    },
    markAsInvoiced: async (interventionIds: string[], expenseIds: string[]) => {
      interventions = interventions.map((intervention) =>
        interventionIds.includes(intervention.id)
          ? { ...intervention, billingStatus: 'invoiced' }
          : intervention,
      )
      expenses = expenses.map((expense) =>
        expenseIds.includes(expense.id) ? { ...expense, status: 'invoiced' } : expense,
      )
    },
  }
}

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
function clonePerson(person: Person): Person {
  return { ...person }
}
function clonePhoto(photo: Photo): Photo {
  return { ...photo }
}
