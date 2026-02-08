'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guards'
import {
  type SpeciesAdminFormData,
  speciesAdminFormSchema,
} from '@/lib/validators/species'
import { db } from '@make-the-change/core/db'
import { species } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'

export type SpeciesActionResult = {
  success: boolean
  data?: { id: string } & Record<string, unknown>
  error?: string
  errors?: Record<string, string[]>
}

export async function createSpeciesAction(input: SpeciesAdminFormData): Promise<SpeciesActionResult> {
  await requireAdmin()
  const parsed = speciesAdminFormSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const [data] = await db
      .insert(species)
      .values({
        ...parsed.data,
        name_default: parsed.data.name_i18n.fr,
        description_default: parsed.data.description_i18n?.fr,
        habitat_default: parsed.data.habitat_i18n?.fr,
      } as any)
      .returning()

    revalidatePath('/admin/biodex')
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create species',
    }
  }
}

export async function updateSpeciesAction(
  id: string,
  input: Partial<SpeciesAdminFormData>,
): Promise<SpeciesActionResult> {
  await requireAdmin()
  const parsed = speciesAdminFormSchema.partial().safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const updateData: any = { ...parsed.data };
    
    // Update generated defaults
    if (updateData.name_i18n?.fr) {
        updateData.name_default = updateData.name_i18n.fr;
    }
    if (updateData.description_i18n?.fr) {
        updateData.description_default = updateData.description_i18n.fr;
    }
    if (updateData.habitat_i18n?.fr) {
        updateData.habitat_default = updateData.habitat_i18n.fr;
    }

    const [data] = await db
      .update(species)
      .set(updateData)
      .where(eq(species.id, id))
      .returning()

    if (!data) {
      return { success: false, error: 'Species not found' }
    }

    revalidatePath('/admin/biodex')
    revalidatePath(`/admin/biodex/${id}`)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update species',
    }
  }
}

export async function deleteSpeciesAction(id: string): Promise<SpeciesActionResult> {
  await requireAdmin()
  
  try {
    // Check for linked projects
    const { projects } = await import('@make-the-change/core/schema')
    const linkedProject = await db.query.projects.findFirst({
        where: eq(projects.species_id, id)
    })

    if (linkedProject) {
        return { success: false, error: 'Impossible de supprimer une espèce liée à un projet.' }
    }

    await db.delete(species).where(eq(species.id, id))
    revalidatePath('/admin/biodex')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete species',
    }
  }
}
