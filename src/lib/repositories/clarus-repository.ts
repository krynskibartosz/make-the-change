import type {
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateTaskInput,
  Expense,
  Intervention,
  InterventionDraft,
  Person,
  Phase,
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
  getInterventions: () => Promise<Intervention[]>
  getInterventionById: (id: string) => Promise<Intervention | null>
  getWorkEntries: () => Promise<WorkEntry[]>
  getTodaySummary: (date: string) => Promise<TodaySummary>
  createInterventionDraft: (input: CreateInterventionDraftInput) => Promise<InterventionDraft>
  updateInterventionDraft: (
    id: string,
    input: CreateInterventionDraftInput,
  ) => Promise<InterventionDraft>

  getTasks: () => Promise<Task[]>
  getExpenses: () => Promise<Expense[]>
  getExpensesByInterventionId: (interventionId: string) => Promise<Expense[]>
  createTask: (input: CreateTaskInput) => Promise<Task>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>
  createExpense: (input: CreateExpenseInput) => Promise<Expense>
  markAsInvoiced: (interventionIds: string[], expenseIds: string[]) => Promise<void>
}
