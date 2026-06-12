'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { z } from 'zod'
import { mockClarusRepository } from '@/lib/repositories'
import { zoneTypeSchema } from '@/lib/schemas/clarus'

const createZoneSchema = z.object({
  name: z.string().min(1),
  type: zoneTypeSchema,
  order: z.coerce.number().default(1),
  parentZoneId: z.string().nullable(),
  technicalCode: z.string().nullable(),
  planReference: z.string().nullable(),
  description: z.string().optional(),
  isSensitive: z.coerce
    .string()
    .transform((v) => v === 'true')
    .optional()
    .default('false'),
  projectId: z.string().default('project-1'),
})

const updateZoneSchema = z.object({
  name: z.string().min(1).optional(),
  type: zoneTypeSchema.optional(),
  order: z.coerce.number().optional(),
  parentZoneId: z.string().nullable().optional(),
  technicalCode: z.string().nullable().optional(),
  planReference: z.string().nullable().optional(),
  description: z.string().optional(),
  isSensitive: z.coerce
    .string()
    .transform((v) => v === 'true')
    .optional(),
})

export async function createZoneAction(_prevState: unknown, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      type: formData.get('type'),
      order: formData.get('order') || 1,
      parentZoneId: formData.get('parentZoneId') || null,
      technicalCode: formData.get('technicalCode') || null,
      planReference: formData.get('planReference') || null,
      description: formData.get('description') || undefined,
      isSensitive: formData.get('isSensitive') || 'false',
      projectId: formData.get('projectId') || 'project-1',
    }

    const input = createZoneSchema.parse(rawData)

    await mockClarusRepository.createZone(input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation createZone completed.')
    })

    revalidatePath('/zones')
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create zone',
      success: false,
    }
  }

  redirect('/zones')
}

export async function updateZoneAction(id: string, _prevState: unknown, formData: FormData) {
  try {
    const rawData: Record<string, unknown> = {}
    if (formData.has('name')) rawData.name = formData.get('name')
    if (formData.has('type')) rawData.type = formData.get('type')
    if (formData.has('order')) rawData.order = formData.get('order')
    if (formData.has('parentZoneId')) rawData.parentZoneId = formData.get('parentZoneId') || null
    if (formData.has('technicalCode')) rawData.technicalCode = formData.get('technicalCode') || null
    if (formData.has('planReference')) rawData.planReference = formData.get('planReference') || null
    if (formData.has('description')) rawData.description = formData.get('description')
    if (formData.has('isSensitive')) rawData.isSensitive = formData.get('isSensitive')

    const input = updateZoneSchema.parse(rawData)

    await mockClarusRepository.updateZone(id, input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation updateZone completed.')
    })

    revalidatePath('/zones')
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update zone',
      success: false,
    }
  }

  redirect('/zones')
}

export async function deleteZoneAction(id: string) {
  try {
    await mockClarusRepository.deleteZone(id)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation deleteZone completed.')
    })
    revalidatePath('/zones')
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete zone',
      success: false,
    }
  }

  redirect('/zones')
}
