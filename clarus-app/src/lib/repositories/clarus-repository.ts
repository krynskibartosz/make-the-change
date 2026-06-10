import type {
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateMaterialMovementInput,
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
  TodaySummary,
  WorkEntry,
  Zone,
} from '@/lib/domain'

export type ClarusRepository = {
  getProject: () => Promise<Project>
  getPeople: () => Promise<Person[]>
  getPhases: () => Promise<Phase[]>
  getZones: () => Promise<Zone[]>
  getMaterials: () => Promise<Material[]>
  getPhotos: () => Promise<Photo[]>
  getTasks: () => Promise<Task[]>
  getInterventions: () => Promise<Intervention[]>
  getInterventionById: (id: string) => Promise<Intervention | null>
  getWorkEntries: () => Promise<WorkEntry[]>
  getTodaySummary: (date: string) => Promise<TodaySummary>
  createInterventionDraft: (input: CreateInterventionDraftInput) => Promise<InterventionDraft>
  createTask: (input: CreateTaskInput) => Promise<Task>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>
  createExpense: (input: CreateExpenseInput) => Promise<Expense>
  createMaterialMovement: (input: CreateMaterialMovementInput) => Promise<MaterialMovement>
  markAsInvoiced: (interventionIds: string[], expenseIds: string[]) => Promise<void>
}
