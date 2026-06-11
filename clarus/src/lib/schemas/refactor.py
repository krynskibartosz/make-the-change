import re

with open('clarus.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# projectSchema
content = re.sub(
    r'export const projectSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+name: z\.string\(\)\.min\(1\),\s+address: z\.string\(\)\.min\(1\),\s+description: z\.string\(\),\s+status: projectStatusSchema,\s+\}\)',
    r'''export const projectSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  address: z.string().min(1),
  description: z.string(),
  status: projectStatusSchema,
})''',
    content
)

# phaseSchema
content = re.sub(
    r'export const phaseSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+name: z\.string\(\)\.min\(1\),\s+order: z\.number\(\)\.int\(\)\.positive\(\),\s+description: z\.string\(\)\.optional\(\),\s+\}\)',
    r'''export const phaseSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  order: z.number().int().positive(),
  description: z.string().optional(),
})''',
    content
)

# zoneSchema
content = re.sub(
    r'export const zoneSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+name: z\.string\(\)\.min\(1\),\s+type: zoneTypeSchema,\s+order: z\.number\(\)\.int\(\)\.positive\(\),\s+parentZoneId: idSchema\.nullish\(\),\s+technicalCode: z\.string\(\)\.nullish\(\),\s+planReference: z\.string\(\)\.nullish\(\),\s+description: z\.string\(\)\.optional\(\),\s+\}\)',
    r'''export const zoneSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  type: zoneTypeSchema,
  order: z.number().int().positive(),
  parentZoneId: idSchema.nullish(),
  technicalCode: z.string().nullish(),
  planReference: z.string().nullish(),
  description: z.string().optional(),
})''',
    content
)

# personSchema
content = re.sub(
    r'export const personSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+name: z\.string\(\)\.min\(1\),\s+role: z\.string\(\)\.optional\(\),\s+defaultHourlyRate: nonNegativeMoneySchema,\s+active: z\.boolean\(\),\s+\}\)',
    r'''export const personSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  role: z.string().optional(),
  defaultHourlyRate: nonNegativeMoneySchema,
  active: z.boolean(),
})''',
    content
)

# interventionSchema
content = re.sub(
    r'export const interventionSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+title: z\.string\(\)\.min\(1\),\s+description: z\.string\(\)\.optional\(\),\s+type: interventionTypeSchema,\s+date: isoDateSchema,\s+phaseId: idSchema,\s+zoneId: idSchema,\s+status: interventionStatusSchema,\s+isExtra: toCheckBooleanSchema,\s+billingStatus: billingStatusSchema,\s+paymentStatus: paymentStatusSchema,\s+sourceNote: z\.string\(\)\.optional\(\),\s+createdAt: isoDateTimeSchema,\s+updatedAt: isoDateTimeSchema,\s+\}\)',
    r'''export const interventionSchema = baseEntitySchema.extend({
  title: z.string().min(1),
  description: z.string().optional(),
  type: interventionTypeSchema,
  date: isoDateSchema,
  phaseId: idSchema, // explicitly required, overrides optional from locationContextSchema if we merged
  zoneId: idSchema,
  status: interventionStatusSchema,
  isExtra: toCheckBooleanSchema,
  billingStatus: billingStatusSchema,
  paymentStatus: paymentStatusSchema,
  sourceNote: z.string().optional(),
}).merge(timestampedSchema)''',
    content
)

# workEntrySchema
content = re.sub(
    r'export const workEntrySchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+interventionId: idSchema,\s+personId: idSchema,\s+date: isoDateSchema,\s+startTime: timeSchema,\s+endTime: timeSchema,\s+breakMinutes: z\.number\(\)\.int\(\)\.nonnegative\(\),\s+days: z\.number\(\)\.positive\(\),\s+hourlyRate: nonNegativeMoneySchema,\s+durationMinutes: z\.number\(\)\.int\(\)\.nonnegative\(\),\s+amount: nonNegativeMoneySchema,\s+notes: z\.string\(\)\.optional\(\),\s+\}\)',
    r'''export const workEntrySchema = baseEntitySchema.extend({
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
})''',
    content
)

# taskSchema
content = re.sub(
    r'export const taskSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+interventionId: idSchema\.nullish\(\),\s+phaseId: idSchema\.nullish\(\),\s+zoneId: idSchema\.nullish\(\),\s+title: z\.string\(\)\.min\(1\),\s+description: z\.string\(\)\.optional\(\),\s+status: taskStatusSchema,\s+priority: taskPrioritySchema,\s+assignedTo: idSchema\.nullish\(\),\s+dueDate: isoDateSchema\.nullish\(\),\s+createdAt: isoDateTimeSchema,\s+\}\)',
    r'''export const taskSchema = baseEntitySchema.merge(locationContextSchema).extend({
  title: z.string().min(1),
  description: z.string().optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignedTo: idSchema.nullish(),
  dueDate: isoDateSchema.nullish(),
  createdAt: isoDateTimeSchema,
})''',
    content
)

# materialSchema
content = re.sub(
    r'export const materialSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+name: z\.string\(\)\.min\(1\),\s+category: z\.string\(\)\.optional\(\),\s+defaultUnit: z\.string\(\)\.optional\(\),\s+\}\)',
    r'''export const materialSchema = baseEntitySchema.extend({
  name: z.string().min(1),
  category: z.string().optional(),
  defaultUnit: z.string().optional(),
})''',
    content
)

# materialMovementSchema
content = re.sub(
    r'export const materialMovementSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+materialId: idSchema,\s+interventionId: idSchema\.nullish\(\),\s+zoneId: idSchema\.nullish\(\),\s+phaseId: idSchema\.nullish\(\),\s+type: materialMovementTypeSchema,\s+quantity: z\.number\(\)\.positive\(\),\s+unit: z\.string\(\)\.min\(1\),\s+estimatedCost: nonNegativeMoneySchema\.nullish\(\),\s+realCost: nonNegativeMoneySchema\.nullish\(\),\s+supplier: z\.string\(\)\.nullish\(\),\s+status: materialMovementStatusSchema,\s+\}\)',
    r'''export const materialMovementSchema = baseEntitySchema.merge(locationContextSchema).extend({
  materialId: idSchema,
  type: materialMovementTypeSchema,
  quantity: z.number().positive(),
  unit: z.string().min(1),
  estimatedCost: nonNegativeMoneySchema.nullish(),
  realCost: nonNegativeMoneySchema.nullish(),
  supplier: z.string().nullish(),
  status: materialMovementStatusSchema,
})''',
    content
)

# expenseSchema
content = re.sub(
    r'export const expenseSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+interventionId: idSchema\.nullish\(\),\s+materialMovementId: idSchema\.nullish\(\),\s+supplier: z\.string\(\)\.min\(1\),\s+description: z\.string\(\)\.min\(1\),\s+amount: nonNegativeMoneySchema\.nullish\(\),\s+date: isoDateSchema,\s+status: expenseStatusSchema,\s+isRebillable: toCheckBooleanSchema,\s+receiptPhotoId: idSchema\.nullish\(\),\s+\}\)',
    r'''export const expenseSchema = baseEntitySchema.extend({
  interventionId: idSchema.nullish(),
  materialMovementId: idSchema.nullish(),
  supplier: z.string().min(1),
  description: z.string().min(1),
  amount: nonNegativeMoneySchema.nullish(),
  date: isoDateSchema,
  status: expenseStatusSchema,
  isRebillable: toCheckBooleanSchema,
  receiptPhotoId: idSchema.nullish(),
})''',
    content
)

# photoSchema
content = re.sub(
    r'export const photoSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+interventionId: idSchema\.nullish\(\),\s+zoneId: idSchema\.nullish\(\),\s+phaseId: idSchema\.nullish\(\),\s+type: photoTypeSchema,\s+url: z\.string\(\)\.min\(1\),\s+comment: z\.string\(\)\.optional\(\),\s+takenAt: isoDateTimeSchema,\s+\}\)',
    r'''export const photoSchema = baseEntitySchema.merge(locationContextSchema).extend({
  type: photoTypeSchema,
  url: z.string().min(1),
  comment: z.string().optional(),
  takenAt: isoDateTimeSchema,
})''',
    content
)

# planSchema
content = re.sub(
    r'export const planSchema = z\.object\(\{\s+id: idSchema,\s+projectId: idSchema,\s+title: z\.string\(\)\.min\(1\),\s+url: z\.string\(\)\.min\(1\),\s+description: z\.string\(\)\.optional\(\),\s+createdAt: isoDateTimeSchema,\s+\}\)',
    r'''export const planSchema = baseEntitySchema.extend({
  title: z.string().min(1),
  url: z.string().min(1),
  description: z.string().optional(),
  createdAt: isoDateTimeSchema,
})''',
    content
)

with open('clarus.ts', 'w', encoding='utf-8') as f:
    f.write(content)
