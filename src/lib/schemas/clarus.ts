import { z } from 'zod'

export const projectStatusSchema = z.enum(['active', 'paused', 'done'])
export const zoneTypeSchema = z.enum(['simple', 'technical'])
export const interventionTypeSchema = z.enum([
  'work',
  'demolition',
  'evacuation',
  'protection',
  'dismantling',
  'structure',
  'preparation',
  'material_need',
  'material_use',
  'expense',
  'task',
  'decision',
  'photo',
  'extra',
  'other',
])
export const interventionStatusSchema = z.enum([
  'draft',
  'to_check',
  'in_progress',
  'done',
  'blocked',
  'cancelled',
])
export const billingStatusSchema = z.enum([
  'not_billable',
  'to_check',
  'to_invoice',
  'invoiced',
  'paid',
])
export const paymentStatusSchema = z.enum([
  'not_applicable',
  'to_pay',
  'paid',
  'partially_paid',
  'to_check',
])
export const taskStatusSchema = z.enum(['to_do', 'in_progress', 'blocked', 'done', 'to_check'])
export const taskPrioritySchema = z.enum(['low', 'normal', 'high', 'urgent'])
export const materialMovementTypeSchema = z.enum([
  'needed',
  'purchased',
  'on_site',
  'used',
  'returned',
  'wasted',
])
export const materialMovementStatusSchema = z.enum([
  'to_buy',
  'bought',
  'on_site',
  'used',
  'missing',
  'to_check',
])
export const expenseStatusSchema = z.enum([
  'to_pay',
  'paid',
  'to_rebill',
  'rebilled',
  'to_check',
  'invoiced',
])
export const photoTypeSchema = z.enum([
  'before',
  'during',
  'after',
  'problem',
  'proof',
  'material',
  'waste',
  'plan',
  'receipt',
  'other',
])

export const planZoneShapeSchema = z.enum(['rect', 'polygon'])
export const planPinTypeSchema = z.enum([
  'photo',
  'task',
  'problem',
  'confirm',
  'done',
  'material',
  'expense',
])

const idSchema = z.string().min(1)
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const isoDateTimeSchema = z.string().datetime()
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/)
const nonNegativeMoneySchema = z.number().nonnegative()
const toCheckBooleanSchema = z.union([z.boolean(), z.literal('to_check')])

export const baseEntitySchema = z.object({
  id: idSchema,
  projectId: idSchema,
})

export const locationContextSchema = z.object({
  zoneId: idSchema.nullish(),
  phaseId: idSchema.nullish(),
  interventionId: idSchema.nullish(),
})

export const timestampedSchema = z.object({
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema.optional(),
})

export const projectSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  address: z.string().min(1),
  description: z.string(),
  status: projectStatusSchema,
})

export const phaseSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  order: z.number().int().positive(),
  description: z.string().optional(),
})

export const zoneSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  type: zoneTypeSchema,
  order: z.number().int().positive(),
  parentZoneId: idSchema.nullish(),
  technicalCode: z.string().nullish(),
  planReference: z.string().nullish(),
  description: z.string().optional(),
  isSensitive: z.boolean().optional(),
})

export const personSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  role: z.string().optional(),
  defaultHourlyRate: nonNegativeMoneySchema,
  active: z.boolean(),
  avatarUrl: z.string().url().nullish(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  skills: z.array(z.string()).optional(),
})

export const interventionSchema = baseEntitySchema
  .extend({
    title: z.string().min(1),
    description: z.string().optional(),
    type: interventionTypeSchema,
    date: isoDateSchema, // Legacy, we keep it for backward compatibility
    plannedDate: isoDateSchema.nullish(),
    actualDate: isoDateSchema.nullish(),
    plannedDurationMinutes: z.number().int().nonnegative().nullish(),
    actualDurationMinutes: z.number().int().nonnegative().nullish(),
    phaseId: idSchema,
    zoneId: idSchema,
    status: interventionStatusSchema,
    isExtra: toCheckBooleanSchema,
    billingStatus: billingStatusSchema,
    paymentStatus: paymentStatusSchema,
    sourceNote: z.string().optional(),
  })
  .merge(timestampedSchema)

export const workEntrySchema = baseEntitySchema.extend({
  interventionId: idSchema,
  personId: idSchema,
  date: isoDateSchema,
  startTime: timeSchema,
  endTime: timeSchema,
  breakMinutes: z.number().int().nonnegative(),
  days: z.number().positive(),
  hourlyRate: nonNegativeMoneySchema,
  durationMinutes: z.number().int().nonnegative(),
  amount: nonNegativeMoneySchema,
  notes: z.string().optional(),
})

export const taskSchema = baseEntitySchema.merge(locationContextSchema).extend({
  title: z.string().min(1),
  description: z.string().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignedTo: idSchema.nullish(),
  dueDate: isoDateSchema.nullish(),
  plannedDate: isoDateSchema.nullish(),
  completedAt: isoDateTimeSchema.nullish(),
  createdAt: isoDateTimeSchema,
})

export const materialSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  category: z.string().optional(),
  defaultUnit: z.string().optional(),
  photoUrl: z.string().url().nullish(),
})

export const materialMovementSchema = baseEntitySchema.merge(locationContextSchema).extend({
  materialId: idSchema,
  type: materialMovementTypeSchema,
  quantity: z.number().positive(),
  unit: z.string().min(1),
  estimatedCost: nonNegativeMoneySchema.nullish(),
  realCost: nonNegativeMoneySchema.nullish(),
  supplier: z.string().nullish(),
  status: materialMovementStatusSchema,
})

export const expenseSchema = baseEntitySchema.extend({
  interventionId: idSchema.nullish(),
  materialMovementId: idSchema.nullish(),
  supplier: z.string().min(1),
  description: z.string().min(1),
  amount: nonNegativeMoneySchema.nullish(),
  date: isoDateSchema,
  status: expenseStatusSchema,
  isRebillable: toCheckBooleanSchema,
  receiptPhotoId: idSchema.nullish(),
})

export const photoSchema = baseEntitySchema.merge(locationContextSchema).extend({
  type: photoTypeSchema,
  url: z.string().min(1),
  comment: z.string().optional(),
  takenAt: isoDateTimeSchema,
})

export const planSchema = baseEntitySchema.extend({
  title: z.string().min(1),
  url: z.string().min(1),
  description: z.string().optional(),
  createdAt: isoDateTimeSchema,
})

export const planZoneSchema = z.object({
  id: idSchema,
  planId: idSchema,
  label: z.string().min(1),
  shapeType: planZoneShapeSchema,
  coordinates: z.array(z.array(z.number())),
})

export const planPinSchema = z.object({
  id: idSchema,
  planId: idSchema,
  zoneId: idSchema.nullish(),
  interventionId: idSchema.nullish(),
  type: planPinTypeSchema,
  x: z.number(),
  y: z.number(),
  title: z.string().min(1),
  status: z.string().optional(),
})

export const goalStatusSchema = z.enum(['not_started', 'in_progress', 'completed', 'blocked'])

export const goalSchema = baseEntitySchema.extend({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['global', 'monthly', 'weekly']),
  startDate: isoDateSchema,
  endDate: isoDateSchema,
  status: goalStatusSchema,
  progress: z.number().min(0).max(100),
})

export const weeklyPlanSchema = baseEntitySchema.extend({
  weekStart: isoDateSchema,
  weekEnd: isoDateSchema,
  mainObjective: z.string(),
  status: goalStatusSchema,
  notes: z.string().optional(),
  goals: z.array(goalSchema).optional(),
})

// --- Type Inference ---
export type ProjectStatus = z.infer<typeof projectStatusSchema>
export type ZoneType = z.infer<typeof zoneTypeSchema>
export type InterventionType = z.infer<typeof interventionTypeSchema>
export type InterventionStatus = z.infer<typeof interventionStatusSchema>
export type BillingStatus = z.infer<typeof billingStatusSchema>
export type PaymentStatus = z.infer<typeof paymentStatusSchema>
export type TaskStatus = z.infer<typeof taskStatusSchema>
export type TaskPriority = z.infer<typeof taskPrioritySchema>
export type MaterialMovementType = z.infer<typeof materialMovementTypeSchema>
export type MaterialMovementStatus = z.infer<typeof materialMovementStatusSchema>
export type ExpenseStatus = z.infer<typeof expenseStatusSchema>
export type PhotoType = z.infer<typeof photoTypeSchema>

export type Project = z.infer<typeof projectSchema>
export type Phase = z.infer<typeof phaseSchema>
export type Zone = z.infer<typeof zoneSchema>
export type Person = z.infer<typeof personSchema>
export type Intervention = z.infer<typeof interventionSchema>
export type WorkEntry = z.infer<typeof workEntrySchema>
export type Task = z.infer<typeof taskSchema>
export type Material = z.infer<typeof materialSchema>
export type MaterialMovement = z.infer<typeof materialMovementSchema>
export type Expense = z.infer<typeof expenseSchema>
export type Photo = z.infer<typeof photoSchema>
export type Plan = z.infer<typeof planSchema>
export type PlanZone = z.infer<typeof planZoneSchema>
export type PlanPin = z.infer<typeof planPinSchema>
export type Goal = z.infer<typeof goalSchema>
export type WeeklyPlan = z.infer<typeof weeklyPlanSchema>

export const createInterventionDraftInputSchema = z.object({
  projectId: idSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  type: interventionTypeSchema,
  date: isoDateSchema,
  phaseId: idSchema.nullable(),
  zoneId: idSchema.nullable(),
  personIds: z.array(idSchema),
  startTime: timeSchema.nullable(),
  endTime: timeSchema.nullable(),
  breakMinutes: z.number().int().nonnegative(),
  days: z.number().positive(),
  hourlyRate: nonNegativeMoneySchema,
  isExtra: toCheckBooleanSchema,
  notes: z.string().optional(),
})

export const mockDatasetSchema = z
  .object({
    project: projectSchema,
    people: z.array(personSchema).min(1),
    phases: z.array(phaseSchema).min(1),
    zones: z.array(zoneSchema).min(1),
    interventions: z.array(interventionSchema),
    workEntries: z.array(workEntrySchema),
    tasks: z.array(taskSchema),
    materials: z.array(materialSchema),
    materialMovements: z.array(materialMovementSchema),
    expenses: z.array(expenseSchema),
    photos: z.array(photoSchema),
    plans: z.array(planSchema).optional(),
    planZones: z.array(planZoneSchema).optional(),
    planPins: z.array(planPinSchema).optional(),
  })
  .superRefine((dataset, context) => {
    const interventionIds = new Set(dataset.interventions.map((intervention) => intervention.id))
    const personIds = new Set(dataset.people.map((person) => person.id))
    const phaseIds = new Set(dataset.phases.map((phase) => phase.id))
    const zoneIds = new Set(dataset.zones.map((zone) => zone.id))
    const materialIds = new Set(dataset.materials.map((material) => material.id))
    const materialMovementIds = new Set(dataset.materialMovements.map((movement) => movement.id))
    const photoIds = new Set(dataset.photos.map((photo) => photo.id))

    for (const intervention of dataset.interventions) {
      addMissingReferenceIssue(context, phaseIds, intervention.phaseId, [
        'interventions',
        intervention.id,
        'phaseId',
      ])
      addMissingReferenceIssue(context, zoneIds, intervention.zoneId, [
        'interventions',
        intervention.id,
        'zoneId',
      ])
    }

    for (const entry of dataset.workEntries) {
      addMissingReferenceIssue(context, interventionIds, entry.interventionId, [
        'workEntries',
        entry.id,
        'interventionId',
      ])
      addMissingReferenceIssue(context, personIds, entry.personId, [
        'workEntries',
        entry.id,
        'personId',
      ])
    }

    for (const task of dataset.tasks) {
      addNullableReferenceIssue(context, interventionIds, task.interventionId, [
        'tasks',
        task.id,
        'interventionId',
      ])
      addNullableReferenceIssue(context, personIds, task.assignedTo, [
        'tasks',
        task.id,
        'assignedTo',
      ])
      addNullableReferenceIssue(context, phaseIds, task.phaseId, ['tasks', task.id, 'phaseId'])
      addNullableReferenceIssue(context, zoneIds, task.zoneId, ['tasks', task.id, 'zoneId'])
    }

    for (const movement of dataset.materialMovements) {
      addMissingReferenceIssue(context, materialIds, movement.materialId, [
        'materialMovements',
        movement.id,
        'materialId',
      ])
      addNullableReferenceIssue(context, interventionIds, movement.interventionId, [
        'materialMovements',
        movement.id,
        'interventionId',
      ])
      addNullableReferenceIssue(context, phaseIds, movement.phaseId, [
        'materialMovements',
        movement.id,
        'phaseId',
      ])
      addNullableReferenceIssue(context, zoneIds, movement.zoneId, [
        'materialMovements',
        movement.id,
        'zoneId',
      ])
    }

    for (const expense of dataset.expenses) {
      addNullableReferenceIssue(context, interventionIds, expense.interventionId, [
        'expenses',
        expense.id,
        'interventionId',
      ])
      addNullableReferenceIssue(context, materialMovementIds, expense.materialMovementId, [
        'expenses',
        expense.id,
        'materialMovementId',
      ])
      addNullableReferenceIssue(context, photoIds, expense.receiptPhotoId, [
        'expenses',
        expense.id,
        'receiptPhotoId',
      ])
    }

    for (const photo of dataset.photos) {
      addNullableReferenceIssue(context, interventionIds, photo.interventionId, [
        'photos',
        photo.id,
        'interventionId',
      ])
      addNullableReferenceIssue(context, phaseIds, photo.phaseId, ['photos', photo.id, 'phaseId'])
      addNullableReferenceIssue(context, zoneIds, photo.zoneId, ['photos', photo.id, 'zoneId'])
    }
  })

export type MockDataset = z.infer<typeof mockDatasetSchema>
export type CreateInterventionDraftInput = z.infer<typeof createInterventionDraftInputSchema>
export const createTaskInputSchema = taskSchema.omit({ id: true, createdAt: true })
export const createExpenseInputSchema = expenseSchema.omit({ id: true, status: true })
export const createMaterialMovementInputSchema = materialMovementSchema.omit({ id: true })
export const createPersonInputSchema = personSchema.omit({ id: true, active: true })

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>
export type CreateExpenseInput = z.infer<typeof createExpenseInputSchema>
export type CreateMaterialMovementInput = z.infer<typeof createMaterialMovementInputSchema>
export type CreatePersonInput = z.infer<typeof createPersonInputSchema>

export const validateMockDataset = (dataset: MockDataset) => mockDatasetSchema.safeParse(dataset)

const addMissingReferenceIssue = (
  context: z.RefinementCtx,
  validIds: Set<string>,
  id: string,
  path: (string | number)[],
) => {
  if (!validIds.has(id)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Reference not found: ${id}`,
      path,
    })
  }
}

const addNullableReferenceIssue = (
  context: z.RefinementCtx,
  validIds: Set<string>,
  id: string | null | undefined,
  path: (string | number)[],
) => {
  if (id !== null && id !== undefined) {
    addMissingReferenceIssue(context, validIds, id, path)
  }
}
