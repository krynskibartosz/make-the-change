import type {
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
  Plan,
  PlanZone,
  PlanPin,
  Project,
  Task,
  TaskStatus,
  TodaySummary,
  UpdatePersonInput,
  WorkEntry,
  Zone,
} from '@/lib/domain'

export type ClarusRepository = {
  getProject: () => Promise<Project>
  getPeople: () => Promise<Person[]>
  createPerson: (input: CreatePersonInput) => Promise<Person>
  updatePerson: (id: string, input: UpdatePersonInput) => Promise<Person>
  getPhases: () => Promise<Phase[]>
  getZones: () => Promise<Zone[]>
  getMaterials: () => Promise<Material[]>
  getPhotos: () => Promise<Photo[]>
  getPlans: () => Promise<Plan[]>
  getPlanZones: (planId: string) => Promise<PlanZone[]>
  getPlanPins: (planId: string) => Promise<PlanPin[]>
  getTasks: () => Promise<Task[]>
  getInterventions: () => Promise<Intervention[]>
  getInterventionById: (id: string) => Promise<Intervention | null>
  getWorkEntries: () => Promise<WorkEntry[]>
  getExpenses: () => Promise<Expense[]>
  getTodaySummary: (date: string) => Promise<TodaySummary>
  createInterventionDraft: (input: CreateInterventionDraftInput) => Promise<InterventionDraft>
  createTask: (input: CreateTaskInput) => Promise<Task>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>
  createExpense: (input: CreateExpenseInput) => Promise<Expense>
  createMaterialMovement: (input: CreateMaterialMovementInput) => Promise<MaterialMovement>
  markAsInvoiced: (interventionIds: string[], expenseIds: string[]) => Promise<void>
}
