'use server'

import { revalidatePath } from 'next/cache'

import { requireAdmin } from '@/lib/auth-guards'
import {
  type ProjectFormData,
  projectFormSchema,
  projectPatchSchema,
} from '@/lib/validators/project'

export type ProjectActionResult = {
  success: boolean
  data?: { id: string } & Record<string, unknown>
  error?: string
  errors?: Record<string, string[]>
}

import type { NewProject } from '@make-the-change/core/schema'

// Adapter to map form data to schema-compatible format
function adaptProjectDataForSchema(data: ProjectFormData | Partial<ProjectFormData>): Partial<NewProject> {
  const patch: Partial<NewProject> = {}

  // Explicit mapping of fields to avoid 'as unknown' casting
  
  // Mapped fields
  if ('name' in data) patch.name_default = data.name
  if ('description' in data) patch.description_default = data.description
  if ('long_description' in data) patch.long_description_default = data.long_description
  if ('images' in data) patch.gallery_image_urls = data.images
  if ('hero_image' in data) patch.hero_image_url = data.hero_image
  if ('avatar_image' in data) patch.avatar_image_url = data.avatar_image

  // Direct fields
  if ('slug' in data) patch.slug = data.slug
  if ('type' in data) patch.type = data.type
  if ('target_budget' in data) patch.target_budget = data.target_budget
  if ('producer_id' in data) patch.producer_id = data.producer_id
  if ('status' in data) patch.status = data.status
  if ('featured' in data) patch.featured = data.featured
  
  // SEO & Translations
  if ('seo_title' in data) patch.seo_title = data.seo_title
  if ('seo_description' in data) patch.seo_description = data.seo_description
  
  if ('name_i18n' in data) patch.name_i18n = data.name_i18n
  if ('description_i18n' in data) patch.description_i18n = data.description_i18n
  if ('long_description_i18n' in data) patch.long_description_i18n = data.long_description_i18n
  if ('seo_title_i18n' in data) patch.seo_title_i18n = data.seo_title_i18n
  if ('seo_description_i18n' in data) patch.seo_description_i18n = data.seo_description_i18n

  return patch
}

export async function createProjectAction(input: ProjectFormData): Promise<ProjectActionResult> {
  await requireAdmin()
  const parsed = projectFormSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const db = await import('@make-the-change/core/db').then((m) => m.db)
  const { projects } = await import('@make-the-change/core/schema')

  try {
    const adapted = adaptProjectDataForSchema(parsed.data)
    const [data] = await db
      .insert(projects)
      .values(adapted as NewProject)
      .returning()

    revalidatePath('/admin/projects')
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create project',
    }
  }
}

export async function updateProjectAction(
  id: string,
  patch: Partial<ProjectFormData>,
): Promise<ProjectActionResult> {
  await requireAdmin()
  const parsed = projectPatchSchema.safeParse(patch)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const db = await import('@make-the-change/core/db').then((m) => m.db)
  const { projects } = await import('@make-the-change/core/schema')
  const { eq } = await import('drizzle-orm')

  try {
    const adapted = adaptProjectDataForSchema(parsed.data)
    const [data] = await db.update(projects).set(adapted).where(eq(projects.id, id)).returning()

    if (!data) {
      return { success: false, error: 'Project not found' }
    }

    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${id}`)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update project',
    }
  }
}
