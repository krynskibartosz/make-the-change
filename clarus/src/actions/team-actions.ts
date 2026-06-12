'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { z } from 'zod'
import { mockClarusRepository } from '@/lib/repositories'

const createPersonSchema = z.object({
  projectId: z.string().default('project-1'),
  name: z.string().min(1),
  role: z.string().optional(),
  defaultHourlyRate: z.coerce.number().default(0),
  avatarUrl: z.string().nullable().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  company: z.string().optional(),
  skills: z.array(z.string()).default([]),
})

const updatePersonSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  defaultHourlyRate: z.coerce.number().optional(),
  avatarUrl: z.string().nullable().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  company: z.string().optional(),
  active: z.coerce
    .string()
    .transform((v) => v === 'true')
    .optional(),
  skills: z.array(z.string()).optional(),
})

export async function createPersonAction(_prevState: unknown, formData: FormData) {
  try {
    const rawData = {
      projectId: formData.get('projectId') || 'project-1',
      name: formData.get('name'),
      role: formData.get('role') || undefined,
      defaultHourlyRate: formData.get('defaultHourlyRate') || 0,
      avatarUrl: formData.get('avatarUrl') || null,
      phone: formData.get('phone') || undefined,
      email: formData.get('email') || undefined,
      company: formData.get('company') || undefined,
      skills: formData.getAll('skills'),
    }

    const input = createPersonSchema.parse(rawData)

    await mockClarusRepository.createPerson(input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation createPerson completed.')
    })

    revalidatePath('/equipe')
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to create person',
      success: false,
    }
  }

  redirect('/equipe')
}

export async function updatePersonAction(id: string, _prevState: unknown, formData: FormData) {
  try {
    const rawData: Record<string, unknown> = {}
    if (formData.has('name')) rawData.name = formData.get('name')
    if (formData.has('role')) rawData.role = formData.get('role')
    if (formData.has('defaultHourlyRate'))
      rawData.defaultHourlyRate = formData.get('defaultHourlyRate')
    if (formData.has('avatarUrl')) rawData.avatarUrl = formData.get('avatarUrl') || null
    if (formData.has('phone')) rawData.phone = formData.get('phone')
    if (formData.has('email')) rawData.email = formData.get('email')
    if (formData.has('company')) rawData.company = formData.get('company')
    if (formData.has('active')) rawData.active = formData.get('active')
    if (formData.getAll('skills').length > 0) rawData.skills = formData.getAll('skills')

    const input = updatePersonSchema.parse(rawData)

    await mockClarusRepository.updatePerson(id, input)
    after(async () => {
      console.log('[BACKGROUND AUDIT] Operation updatePerson completed.')
    })

    revalidatePath('/equipe')
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to update person',
      success: false,
    }
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
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to delete person',
      success: false,
    }
  }

  redirect('/equipe')
}
