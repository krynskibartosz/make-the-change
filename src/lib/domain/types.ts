import type {
  BillingStatus,
  CreateInterventionDraftInput,
  Expense,
  ExpenseStatus,
  Intervention,
  InterventionStatus,
  InterventionType,
  Material,
  MaterialMovement,
  MaterialMovementStatus,
  MaterialMovementType,
  PaymentStatus,
  Person,
  Phase,
  Photo,
  PhotoType,
  Plan,
  Project,
  ProjectStatus,
  Task,
  TaskPriority,
  TaskStatus,
  WorkEntry,
  Zone,
  ZoneType,
} from '@/lib/schemas/clarus'

export type {
  BillingStatus,
  CreateInterventionDraftInput,
  Expense,
  ExpenseStatus,
  Intervention,
  InterventionStatus,
  InterventionType,
  Material,
  MaterialMovement,
  MaterialMovementStatus,
  MaterialMovementType,
  PaymentStatus,
  Person,
  Phase,
  Photo,
  PhotoType,
  Plan,
  Project,
  ProjectStatus,
  Task,
  TaskPriority,
  TaskStatus,
  WorkEntry,
  Zone,
  ZoneType,
}

export type VerificationStatus = 'complete' | 'to_check'

export type CreateTaskInput = {
  projectId: string
  interventionId?: string | null
  phaseId?: string | null
  zoneId?: string | null
  title: string
  description?: string
  priority?: TaskPriority
  assignedTo?: string | null
  dueDate?: string | null
}

export type CreateExpenseInput = {
  projectId: string
  interventionId?: string | null
  materialMovementId?: string | null
  supplier: string
  description: string
  amount?: number | null
  date: string
  isRebillable: boolean | 'to_check'
  receiptPhotoId?: string | null
}

export type CreateMaterialMovementInput = {
  projectId: string
  materialId: string
  interventionId?: string | null
  zoneId?: string | null
  phaseId?: string | null
  type: MaterialMovementType
  quantity: number
  unit: string
  status: MaterialMovementStatus
}

export type InterventionDraft = {
  intervention: Intervention
  workEntries: WorkEntry[]
}

export type InterventionListItem = {
  id: string
  title: string
  date: string
  type: InterventionType
  status: InterventionStatus
  verificationStatus: VerificationStatus
  isExtra: boolean | 'to_check'
  zoneName: string
  phaseName: string
  hours: number
  amount: number
  updatedAt: string
}

export type TodayAlert = {
  id: string
  title: string
  description: string
  severity: 'info' | 'warning'
  interventionId?: string
}

export type TodaySummary = {
  date: string
  metrics: {
    interventionCount: number
    hours: number
    estimatedAmount: number
    toCheckCount: number
  }
  latestInterventions: InterventionListItem[]
  alerts: TodayAlert[]
}
export type CreatePersonInput = {
  projectId: string
  name: string
  role?: string
  defaultHourlyRate: number
}
export type UpdatePersonInput = Partial<CreatePersonInput> & { active?: boolean }
