import type {
  BillingStatus,
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateMaterialMovementInput,
  CreatePersonInput,
  CreateTaskInput,
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
  PlanPin,
  PlanZone,
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
  CreateExpenseInput,
  CreateInterventionDraftInput,
  CreateMaterialMovementInput,
  CreatePersonInput,
  CreateTaskInput,
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
  PlanPin,
  PlanZone,
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

export type UpdatePersonInput = Partial<CreatePersonInput> & { active?: boolean }
