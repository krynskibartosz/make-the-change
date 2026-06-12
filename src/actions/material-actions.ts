'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { z } from 'zod'
import { mockClarusRepository } from '@/lib/repositories'
import { materialMovementStatusSchema, materialMovementTypeSchema } from '@/lib/schemas/clarus'

const materialMovementFormSchema = z.object({
  projectId: z.string().default('project-1'),
  materialId: z.string(),
  type: materialMovementTypeSchema,
  quantity: z.coerce.number(),
  unit: z.string(),
  estimatedCost: z.coerce.number().nullable().optional(),
  realCost: z.coerce.number().nullable().optional(),
  supplier: z.string().nullable().optional(),
  status: materialMovementStatusSchema,
  zoneId: z.string().nullable().optional(),
  phaseId: z.string().nullable().optional(),
  interventionId: z.string().nullable().optional(),
})

export async function createMaterialMovementAction(_prevState: unknown, formData: FormData) {
  try {
    const rawInput = {
      projectId: formData.get('projectId') || 'project-1',
      materialId: formData.get('materialId'),
      type: formData.get('type'),
      quantity: formData.get('quantity'),
      unit: formData.get('unit'),
      estimatedCost:
        formData.has('estimatedCost') && formData.get('estimatedCost')
          ? formData.get('estimatedCost')
          : null,
      realCost:
        formData.has('realCost') && formData.get('realCost') ? formData.get('realCost') : null,
      supplier: formData.get('supplier'),
      status: formData.get('status'),
      zoneId: formData.get('zoneId'),
      phaseId: formData.get('phaseId'),
      interventionId: formData.get('interventionId'),
    }

    const input = materialMovementFormSchema.parse(rawInput)

    await mockClarusRepository.createMaterialMovement(input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation createMaterialMovement completed.')
    })

    revalidatePath('/inventaire')
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message, success: false }
    }
    return { error: 'Failed to create material movement', success: false }
  }

  redirect('/inventaire')
}
