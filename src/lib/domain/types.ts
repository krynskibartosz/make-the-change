export type ProjectStatus = 'active' | 'paused' | 'done'

export type ZoneType = 'simple' | 'technical'

export type InterventionType =
  | 'work'
  | 'demolition'
  | 'evacuation'
  | 'protection'
  | 'dismantling'
  | 'structure'
  | 'preparation'
  | 'material_need'
  | 'material_use'
  | 'expense'
  | 'task'
  | 'decision'
  | 'photo'
  | 'extra'
  | 'other'

export type InterventionStatus =
  | 'draft'
  | 'to_check'
  | 'in_progress'
  | 'done'
  | 'blocked'
  | 'cancelled'

export type BillingStatus = 'not_billable' | 'to_check' | 'to_invoice' | 'invoiced' | 'paid'

export type PaymentStatus = 'not_applicable' | 'to_pay' | 'paid' | 'partially_paid' | 'to_check'

export type TaskStatus = 'to_do' | 'in_progress' | 'blocked' | 'done' | 'to_check'

export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent'

export type MaterialMovementType =
  | 'needed'
  | 'purchased'
  | 'on_site'
  | 'used'
  | 'returned'
  | 'wasted'

export type MaterialMovementStatus =
  | 'to_buy'
  | 'bought'
  | 'on_site'
  | 'used'
  | 'missing'
  | 'to_check'

export type ExpenseStatus = 'to_pay' | 'paid' | 'to_rebill' | 'rebilled' | 'to_check' | 'invoiced'

export type PhotoType =
  | 'before'
  | 'during'
  | 'after'
  | 'problem'
  | 'proof'
  | 'material'
  | 'waste'
  | 'plan'
  | 'receipt'
  | 'other'

export type VerificationStatus = 'complete' | 'to_check'

export type Project = {
  id: string
  name: string
  address: string
  description: string
  status: ProjectStatus
}

export type Phase = {
  id: string
  projectId: string
  name: string
  order: number
  description?: string
}

export type Zone = {
  id: string
  projectId: string
  name: string
  type: ZoneType
  order: number
  parentZoneId?: string | null
  technicalCode?: string | null
  planReference?: string | null
  description?: string
}

export type Person = {
  id: string
  projectId: string
  name: string
  role?: string
  defaultHourlyRate: number
  active: boolean
}

export type Intervention = {
  id: string
  projectId: string
  title: string
  description?: string
  type: InterventionType
  date: string
  phaseId: string
  zoneId: string
  status: InterventionStatus
  isExtra: boolean | 'to_check'
  billingStatus: BillingStatus
  paymentStatus: PaymentStatus
  sourceNote?: string
  createdAt: string
  updatedAt: string
}

export type WorkEntry = {
  id: string
  projectId: string
  interventionId: string
  personId: string
  date: string
  startTime: string
  endTime: string
  breakMinutes: number
  days: number
  hourlyRate: number
  durationMinutes: number
  amount: number
  notes?: string
}

export type Task = {
  id: string
  projectId: string
  interventionId?: string | null
  phaseId?: string | null
  zoneId?: string | null
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: string | null
  dueDate?: string | null
  createdAt: string
}

export type Material = {
  id: string
  projectId: string
  name: string
  category?: string
  defaultUnit?: string
}

export type MaterialMovement = {
  id: string
  projectId: string
  materialId: string
  interventionId?: string | null
  zoneId?: string | null
  phaseId?: string | null
  type: MaterialMovementType
  quantity: number
  unit: string
  estimatedCost?: number | null
  realCost?: number | null
  supplier?: string | null
  status: MaterialMovementStatus
}

export type Expense = {
  id: string
  projectId: string
  interventionId?: string | null
  materialMovementId?: string | null
  supplier: string
  description: string
  amount?: number | null
  date: string
  status: ExpenseStatus
  isRebillable: boolean | 'to_check'
  receiptPhotoId?: string | null
}

export type Photo = {
  id: string
  projectId: string
  interventionId?: string | null
  zoneId?: string | null
  phaseId?: string | null
  type: PhotoType
  url: string
  comment?: string
  takenAt: string
}

export type CreateInterventionDraftInput = {
  projectId: string
  title: string
  description?: string
  type: InterventionType
  date: string
  phaseId: string | null
  zoneId: string | null
  personIds: string[]
  startTime: string | null
  endTime: string | null
  breakMinutes: number
  days: number
  hourlyRate: number
  isExtra: boolean | 'to_check'
  billingStatus?: BillingStatus
  paymentStatus?: PaymentStatus
  notes?: string
}

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
  zoneId: string
  phaseId: string
  personIds: string[]
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
