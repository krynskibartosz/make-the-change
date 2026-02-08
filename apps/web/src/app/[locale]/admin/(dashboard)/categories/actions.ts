'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guards'
import {
  type CategoryFormData,
  categoryFormSchema,
} from '@/lib/validators/category'
import { db } from '@make-the-change/core/db'
import { categories } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'

export type CategoryActionResult = {
  success: boolean
  data?: { id: string } & Record<string, unknown>
  error?: string
  errors?: Record<string, string[]>
}

export async function createCategoryAction(input: CategoryFormData): Promise<CategoryActionResult> {
  await requireAdmin()
  const parsed = categoryFormSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const [data] = await db
      .insert(categories)
      .values({
        ...parsed.data,
        name_default: parsed.data.name_i18n.fr, // Fallback default name
        description_default: parsed.data.description_i18n?.fr, // Fallback default description
      } as any)
      .returning()

    revalidatePath('/admin/categories')
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category',
    }
  }
}

export async function updateCategoryAction(
  id: string,
  input: Partial<CategoryFormData>,
): Promise<CategoryActionResult> {
  await requireAdmin()
  // Allow partial updates
  const parsed = categoryFormSchema.partial().safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const updateData: any = { ...parsed.data };
    
    // Update generated defaults if i18n fields are present
    if (updateData.name_i18n?.fr) {
        updateData.name_default = updateData.name_i18n.fr;
    }
    if (updateData.description_i18n?.fr) {
        updateData.description_default = updateData.description_i18n.fr;
    }

    const [data] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning()

    if (!data) {
      return { success: false, error: 'Category not found' }
    }

    revalidatePath('/admin/categories')
    revalidatePath(`/admin/categories/${id}`)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category',
    }
  }
}

export async function deleteCategoryAction(id: string): Promise<CategoryActionResult> {
  await requireAdmin()
  
  try {
    // Check if category has children
    const children = await db.query.categories.findFirst({
        where: eq(categories.parent_id, id)
    })

    if (children) {
        return { success: false, error: 'Impossible de supprimer une catégorie qui a des sous-catégories.' }
    }

    // Check if category has products
    const { products } = await import('@make-the-change/core/schema')
    const hasProducts = await db.query.products.findFirst({
        where: eq(products.category_id, id)
    })

    if (hasProducts) {
        return { success: false, error: 'Impossible de supprimer une catégorie liée à des produits.' }
    }

    await db.delete(categories).where(eq(categories.id, id))
    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete category',
    }
  }
}
