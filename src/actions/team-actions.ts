'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { mockClarusRepository } from '@/lib/repositories'

export async function createPersonAction(_prevState: unknown, formData: FormData) {
  try {
    const input = {
      projectId: (formData.get('projectId') as string) || 'project-1',
      name: formData.get('name') as string,
      role: formData.get('role') as string | undefined,
      defaultHourlyRate: Number(formData.get('defaultHourlyRate')) || 0,
      avatarUrl: formData.get('avatarUrl') as string | null,
      phone: formData.get('phone') as string | undefined,
      email: formData.get('email') as string | undefined,
      company: formData.get('company') as string | undefined,
      skills: formData.getAll('skills') as string[],
    } as Parameters<typeof mockClarusRepository.createPerson>[0]

    await mockClarusRepository.createPerson(input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation createPerson completed.')
    })

    revalidatePath('/equipe')
  } catch (error: unknown) {
    const err = error as Error
    return { error: err.message || 'Failed to create person', success: false }
  }

  redirect('/equipe')
}

export async function updatePersonAction(id: string, _prevState: unknown, formData: FormData) {
  try {
    const input: Parameters<typeof mockClarusRepository.updatePerson>[1] = {}
    if (formData.has('name')) input.name = formData.get('name') as string
    if (formData.has('role')) input.role = formData.get('role') as string
    if (formData.has('defaultHourlyRate'))
      input.defaultHourlyRate = Number(formData.get('defaultHourlyRate'))
    if (formData.has('avatarUrl')) input.avatarUrl = formData.get('avatarUrl') as string | null
    if (formData.has('phone')) input.phone = formData.get('phone') as string
    if (formData.has('email')) input.email = formData.get('email') as string
    if (formData.has('company')) input.company = formData.get('company') as string
    if (formData.has('active')) input.active = formData.get('active') === 'true'
    if (formData.getAll('skills').length > 0) input.skills = formData.getAll('skills') as string[]

    await mockClarusRepository.updatePerson(id, input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation updatePerson completed.')
    })

    revalidatePath('/equipe')
  } catch (error: unknown) {
    const err = error as Error
    return { error: err.message || 'Failed to update person', success: false }
  }

  redirect('/equipe')
}

export async function deletePersonAction(id: string) {
  try {
    await mockClarusRepository.deletePerson(id)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation deletePerson completed.')
    })
    revalidatePath('/equipe')
  } catch (error: unknown) {
    const err = error as Error
    return { error: err.message || 'Failed to delete person', success: false }
  }

  redirect('/equipe')
}
