import type {
  Client,
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateMaterialMovementInput,
  CreatePersonInput,
  CreateTaskInput,
  CreateZoneInput,
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
  getPersonById: (id: string) => Promise<Person | undefined>
  createPerson: (input: CreatePersonInput) => Promise<Person>
  updatePerson: (id: string, input: UpdatePersonInput) => Promise<Person>
  deletePerson: (id: string) => Promise<void>
  getPhases: () => Promise<Phase[]>
  getProjectPhases: (projectId: string) => Promise<Phase[]>
  updatePhase: (id: string, input: Partial<Phase>) => Promise<Phase>
  getZones: () => Promise<Zone[]>
  getZoneById: (id: string) => Promise<Zone | undefined>
  createZone: (input: CreateZoneInput) => Promise<Zone>
  updateZone: (id: string, input: Partial<Zone>) => Promise<Zone>
  deleteZone: (id: string) => Promise<void>
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
  getExpenseById: (id: string) => Promise<Expense | undefined>
  getTodaySummary: (date: string) => Promise<TodaySummary>
  createInterventionDraft: (input: CreateInterventionDraftInput) => Promise<InterventionDraft>
  createTask: (input: CreateTaskInput) => Promise<Task>
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>
  updateTask: (id: string, input: Partial<Task>) => Promise<Task>
  createExpense: (input: CreateExpenseInput) => Promise<Expense>
  updateExpense: (id: string, input: Partial<Expense>) => Promise<Expense>
  deleteExpense: (id: string) => Promise<void>
  createMaterialMovement: (input: CreateMaterialMovementInput) => Promise<MaterialMovement>
  markAsInvoiced: (interventionIds: string[], expenseIds: string[]) => Promise<void>

  getTimelineEvents: () => Promise<TimelineEvent[]>
  getWeeklyPlan: (weekStart: string) => Promise<WeeklyPlan | null>
  getDashboardKPIs: () => Promise<DashboardKPIs>
}
