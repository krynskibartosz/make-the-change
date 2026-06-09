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
export const expenseStatusSchema = z.enum(['to_pay', 'paid', 'to_rebill', 'rebilled', 'to_check'])
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

const idSchema = z.string().min(1)
const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const isoDateTimeSchema = z.string().datetime()
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/)
const nonNegativeMoneySchema = z.number().nonnegative()
const toCheckBooleanSchema = z.union([z.boolean(), z.literal('to_check')])

export const projectSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  address: z.string().min(1),
  description: z.string(),
  status: projectStatusSchema,
})

export const phaseSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  name: z.string().min(1),
  order: z.number().int().positive(),
  description: z.string().optional(),
})

export const zoneSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  name: z.string().min(1),
  type: zoneTypeSchema,
  order: z.number().int().positive(),
  parentZoneId: idSchema.nullish(),
  technicalCode: z.string().nullish(),
  planReference: z.string().nullish(),
  description: z.string().optional(),
})

export const personSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  name: z.string().min(1),
  role: z.string().optional(),
  defaultHourlyRate: nonNegativeMoneySchema,
  active: z.boolean(),
})

export const interventionSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  type: interventionTypeSchema,
  date: isoDateSchema,
  phaseId: idSchema,
  zoneId: idSchema,
  status: interventionStatusSchema,
  isExtra: toCheckBooleanSchema,
  billingStatus: billingStatusSchema,
  paymentStatus: paymentStatusSchema,
  sourceNote: z.string().optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export const workEntrySchema = z.object({
  id: idSchema,
  projectId: idSchema,
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

export const taskSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  interventionId: idSchema.nullish(),
  phaseId: idSchema.nullish(),
  zoneId: idSchema.nullish(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignedTo: idSchema.nullish(),
  dueDate: isoDateSchema.nullish(),
  createdAt: isoDateTimeSchema,
})

export const materialSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  name: z.string().min(1),
  category: z.string().optional(),
  defaultUnit: z.string().optional(),
})

export const materialMovementSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  materialId: idSchema,
  interventionId: idSchema.nullish(),
  zoneId: idSchema.nullish(),
  phaseId: idSchema.nullish(),
  type: materialMovementTypeSchema,
  quantity: z.number().positive(),
  unit: z.string().min(1),
  estimatedCost: nonNegativeMoneySchema.nullish(),
  realCost: nonNegativeMoneySchema.nullish(),
  supplier: z.string().nullish(),
  status: materialMovementStatusSchema,
})

export const expenseSchema = z.object({
  id: idSchema,
  projectId: idSchema,
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

export const photoSchema = z.object({
  id: idSchema,
  projectId: idSchema,
  interventionId: idSchema.nullish(),
  zoneId: idSchema.nullish(),
  phaseId: idSchema.nullish(),
  type: photoTypeSchema,
  url: z.string().min(1),
  comment: z.string().optional(),
  takenAt: isoDateTimeSchema,
})

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
  billingStatus: billingStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
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
export type CreateInterventionDraftInputSchema = z.infer<typeof createInterventionDraftInputSchema>

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
