'use server'

import { after } from 'next/server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { mockClarusRepository } from '@/lib/repositories'

export async function createMaterialMovementAction(prevState: any, formData: FormData) {
  try {
    const input: any = {
      projectId: formData.get('projectId') as string || 'project-1',
      materialId: formData.get('materialId') as string,
      type: formData.get('type') as any,
      quantity: Number(formData.get('quantity')) || 0,
      unit: formData.get('unit') as string,
      estimatedCost: formData.has('estimatedCost') && formData.get('estimatedCost') ? Number(formData.get('estimatedCost')) : null,
      realCost: formData.has('realCost') && formData.get('realCost') ? Number(formData.get('realCost')) : null,
      supplier: formData.get('supplier') as string | null,
      status: formData.get('status') as any,
      zoneId: formData.get('zoneId') as string | null,
      phaseId: formData.get('phaseId') as string | null,
      interventionId: formData.get('interventionId') as string | null,
    }

    await mockClarusRepository.createMaterialMovement(input)
    after(async () => { console.log('[BACKGROUND AUDIT] Operation createMaterialMovement completed.') })

    revalidatePath('/inventaire')
  } catch (error: any) {
    return { error: error.message || 'Failed to create material movement', success: false }
  }

  redirect('/inventaire')
}
