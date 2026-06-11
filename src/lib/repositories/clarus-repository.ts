import type {
  Client,
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateMaterialMovementInput,
  CreatePersonInput,
  CreateTaskInput,
  DashboardKPIs,
  Expense,
  Intervention,
  InterventionDraft,
  Material,
  MaterialMovement,
  Person,
  Phase,
  Photo,
  Plan,
  PlanPin,
  PlanZone,
  Project,
  Task,
  TaskStatus,
  TimelineEvent,
  TodaySummary,
  UpdatePersonInput,
  WeeklyPlan,
  WorkEntry,
  Zone,
} from '@/lib/domain'

export type ClarusRepository = {
  getProject: () => Promise<Project>
  getProjects: () => Promise<Project[]>
  getClient: (id: string) => Promise<Client | null>
  getClients: () => Promise<Client[]>
  getPeople: () => Promise<Person[]>
  getPersonById: (id: string) => Promise<Person | null>
  createPerson: (input: CreatePersonInput) => Promise<Person>
  updatePerson: (id: string, input: UpdatePersonInput) => Promise<Person>
  getPhases: () => Promise<Phase[]>
  getProjectPhases: (projectId: string) => Promise<Phase[]>
  updatePhase: (id: string, input: Partial<Phase>) => Promise<Phase>
  getZones: () => Promise<Zone[]>
  getMaterials: () => Promise<Material[]>
  getMaterialById: (id: string) => Promise<Material | null>
  updateMaterial: (id: string, input: Partial<Material>) => Promise<Material>
  getMaterialMovements: () => Promise<MaterialMovement[]>
  getPhotos: () => Promise<Photo[]>
  createPhoto: (input: Omit<Photo, 'id'>) => Promise<Photo>
  getPlans: () => Promise<Plan[]>
  getPlanZones: (planId: string) => Promise<PlanZone[]>
  getPlanPins: (planId: string) => Promise<PlanPin[]>
  getTasks: () => Promise<Task[]>
  getTaskById: (id: string) => Promise<Task | null>
  getInterventions: () => Promise<Intervention[]>
  getInterventionById: (id: string) => Promise<Intervention | null>
  getWorkEntries: () => Promise<WorkEntry[]>
  getExpenses: () => Promise<Expense[]>
  getTodaySummary: (date: string) => Promise<TodaySummary>
  createInterventionDraft: (input: CreateInterventionDraftInput) => Promise<InterventionDraft>
  createTask: (input: CreateTaskInput) => Promise<Task>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>
  updateTask: (id: string, input: Partial<Task>) => Promise<Task>
  createExpense: (input: CreateExpenseInput) => Promise<Expense>
  createMaterialMovement: (input: CreateMaterialMovementInput) => Promise<MaterialMovement>
  markAsInvoiced: (interventionIds: string[], expenseIds: string[]) => Promise<void>

  getTimelineEvents: () => Promise<TimelineEvent[]>
  getWeeklyPlan: (weekStart: string) => Promise<WeeklyPlan | null>
  getDashboardKPIs: () => Promise<DashboardKPIs>
}
