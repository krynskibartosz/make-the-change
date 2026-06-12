'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { mockClarusRepository } from '@/lib/repositories'

export async function createZoneAction(_prevState: unknown, formData: FormData) {
  try {
    const input = {
      name: formData.get('name') as string,
      type: formData.get('type') as any,
      order: Number(formData.get('order')) || 1,
      parentZoneId: formData.get('parentZoneId') as string | null,
      technicalCode: formData.get('technicalCode') as string | null,
      planReference: formData.get('planReference') as string | null,
      description: formData.get('description') as string | undefined,
      isSensitive: formData.get('isSensitive') === 'true',
      projectId: (formData.get('projectId') as string) || 'project-1',
    } as Parameters<typeof mockClarusRepository.createZone>[0]

    await mockClarusRepository.createZone(input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation createZone completed.')
    })

    revalidatePath('/zones')
  } catch (error: unknown) {
    const err = error as Error
    return { error: err.message || 'Failed to create zone', success: false }
  }

  redirect('/zones')
}

export async function updateZoneAction(id: string, _prevState: unknown, formData: FormData) {
  try {
    const input: Parameters<typeof mockClarusRepository.updateZone>[1] = {}
    if (formData.has('name')) input.name = formData.get('name') as string
    if (formData.has('type')) input.type = formData.get('type') as any
    if (formData.has('order')) input.order = Number(formData.get('order'))
    if (formData.has('parentZoneId'))
      input.parentZoneId = formData.get('parentZoneId') as string | null
    if (formData.has('technicalCode'))
      input.technicalCode = formData.get('technicalCode') as string | null
    if (formData.has('planReference'))
      input.planReference = formData.get('planReference') as string | null
    if (formData.has('description')) input.description = formData.get('description') as string
    if (formData.has('isSensitive')) input.isSensitive = formData.get('isSensitive') === 'true'

    await mockClarusRepository.updateZone(id, input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation updateZone completed.')
    })

    revalidatePath('/zones')
  } catch (error: unknown) {
    const err = error as Error
    return { error: err.message || 'Failed to update zone', success: false }
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
  } catch (error: unknown) {
    const err = error as Error
    return { error: err.message || 'Failed to delete zone', success: false }
  }

  redirect('/zones')
}
