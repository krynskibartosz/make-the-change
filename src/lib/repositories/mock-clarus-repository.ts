import { selectTodaySummary } from '@/features/dashboard'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type {
  Client,
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateMaterialMovementInput,
  CreatePersonInput,
  CreateTaskInput,
  Expense,
  Intervention,
  InterventionDraft,
  Material,
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
  mockClient,
  mockExpenses,
  mockInterventions,
  mockMaterialMovements,
  mockMaterials,
  mockPeople,
  mockPhases,
  mockPhotos,
  mockPlanPins,
  mockPlans,
  mockPlanZones,
  mockProject,
  mockProjects,
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
  const materials: Material[] = [...mockMaterials]
  const people = mockPeople.map(clonePerson)

  return {
    getProject: async () => mockProject,
    getProjects: async () => mockProjects,
    getClient: async (id: string) => (id === mockClient.id ? mockClient : null),
    getClients: async () => [mockClient],
    getPeople: async () => people.map(clonePerson),
    getPhases: async () => [...mockPhases],
    getProjectPhases: async (projectId: string) =>
      mockPhases.filter((p) => p.projectId === projectId),
    updatePhase: async (id: string, input: Partial<Phase>) => {
      const idx = mockPhases.findIndex((p) => p.id === id)
      if (idx === -1) throw new Error('Phase not found')
      mockPhases[idx] = { ...mockPhases[idx], ...input } as Phase
      return { ...mockPhases[idx] } as Phase
    },
    createPerson: async (input: CreatePersonInput) => {
      const person: Person = {
        id: `person-${Date.now()}`,
        projectId: input.projectId,
        name: input.name,
        role: input.role,
        defaultHourlyRate: input.defaultHourlyRate,
        avatarUrl: input.avatarUrl,
        active: true,
      }
      people.push(person)
      return clonePerson(person)
    },
    updatePerson: async (id: string, input: UpdatePersonInput) => {
      const idx = people.findIndex((p) => p.id === id)
      if (idx === -1) throw new Error('Person not found')
      const person = people[idx]!
      const updated: Person = {
        ...person,
        ...input,
        id: person.id,
        projectId: person.projectId,
        name: input.name ?? person.name,
        role: input.role ?? person.role,
        defaultHourlyRate: input.defaultHourlyRate ?? person.defaultHourlyRate,
        avatarUrl: input.avatarUrl !== undefined ? input.avatarUrl : person.avatarUrl,
        active: input.active ?? person.active,
      }
      people[idx] = updated
      return clonePerson(updated)
    },
    getZones: async () => [...mockZones],
    getMaterials: async () => [...materials],
    getMaterialById: async (id: string) => materials.find((m) => m.id === id) ?? null,
    updateMaterial: async (id: string, input: Partial<Material>) => {
      const idx = materials.findIndex((m) => m.id === id)
      if (idx === -1) throw new Error('Material not found')
      const current = materials[idx]!
      materials[idx] = {
        ...current,
        ...input,
        photoUrl: input.photoUrl !== undefined ? input.photoUrl : current.photoUrl,
      } as Material
      return materials[idx]
    },
    getMaterialMovements: async () => [...materialMovements],
    getPhotos: async () => [...mockPhotos],
    createPhoto: async (input: Omit<Photo, 'id'>) => {
      const photo: Photo = { ...input, id: `photo-${crypto.randomUUID()}` }
      mockPhotos.push(photo)
      return photo
    },
    getTimelineEvents: async () => {
      const events: import('../domain').TimelineEvent[] = []
      for (const intervention of interventions) {
        const d = intervention.actualDate || intervention.date
        if (d) events.push({ type: 'intervention', data: intervention, date: d })
      }
      for (const task of tasks) {
        const d = task.completedAt?.split('T')[0] || task.plannedDate
        if (d) events.push({ type: 'task', data: task, date: d })
      }
      for (const expense of expenses) {
        if (expense.date) events.push({ type: 'expense', data: expense, date: expense.date })
      }
      for (const photo of mockPhotos) {
        const d = photo.takenAt?.split('T')[0]
        if (d) events.push({ type: 'photo', data: photo, date: d })
      }
      return events.sort((a, b) => b.date.localeCompare(a.date))
    },
    getWeeklyPlan: async (weekStart: string) => {
      return {
        id: 'wp-1',
        projectId: mockProject.id,
        weekStart,
        weekEnd: '2026-06-14',
        mainObjective: 'Terminer la démolition béton extérieur et évacuer gravats',
        status: 'in_progress',
        goals: [
          {
            id: 'goal-1',
            projectId: mockProject.id,
            title: 'Démolition béton extérieur',
            type: 'weekly',
            startDate: weekStart,
            endDate: '2026-06-14',
            status: 'in_progress',
            progress: 60,
          },
          {
            id: 'goal-2',
            projectId: mockProject.id,
            title: 'Évacuation gravats',
            type: 'weekly',
            startDate: weekStart,
            endDate: '2026-06-14',
            status: 'not_started',
            progress: 0,
          },
        ],
      } as import('../domain').WeeklyPlan
    },
    getPlans: async () => [...mockPlans],
    getPlanZones: async (planId: string) => mockPlanZones.filter((z) => z.planId === planId),
    getPlanPins: async (planId: string) => mockPlanPins.filter((p) => p.planId === planId),
    getTasks: async () => [...tasks],
    getInterventions: async () => [...interventions],
    getInterventionById: async (id: string) =>
      interventions.find((intervention) => intervention.id === id) ?? null,
    getWorkEntries: async () => [...mockWorkEntries],
    getExpenses: async () => [...expenses],
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
        id: `task-${crypto.randomUUID()}`,
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
        id: `expense-${crypto.randomUUID()}`,
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
        id: `movement-${crypto.randomUUID()}`,
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
    getDashboardKPIs: async () => {
      const budgetHours = 200
      const budgetCost = 15000

      const totalHours = mockWorkEntries.reduce((acc, entry) => acc + entry.durationMinutes / 60, 0)
      const totalCost =
        mockWorkEntries.reduce((acc, entry) => acc + entry.amount, 0) +
        expenses.filter((e) => e.status !== 'to_check').reduce((acc, e) => acc + (e.amount || 0), 0)

      const billableInterventions = interventions.filter(
        (i) => i.billingStatus === 'to_invoice' || i.isExtra === true,
      )
      const billableExpenses = expenses.filter(
        (e) => e.isRebillable === true && e.status !== 'invoiced',
      )

      const toInvoiceAmount =
        billableInterventions.reduce((acc, i) => {
          const entrySum = mockWorkEntries
            .filter((we) => we.interventionId === i.id)
            .reduce((sum, we) => sum + we.amount, 0)
          return acc + entrySum
        }, 0) + billableExpenses.reduce((acc, e) => acc + (e.amount || 0), 0)

      const blockedTasksCount = tasks.filter((t) => t.status === 'blocked').length

      return {
        totalHours: Math.round(totalHours),
        totalCost: Math.round(totalCost),
        toInvoiceAmount: Math.round(toInvoiceAmount),
        budgetHours,
        budgetCost,
        blockedTasksCount,
      }
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
