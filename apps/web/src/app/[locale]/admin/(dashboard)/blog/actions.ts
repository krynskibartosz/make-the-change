'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth-guards'
import {
  type BlogPostFormData,
  blogPostFormSchema,
} from '@/lib/validators/blog'
import { db } from '@make-the-change/core/db'
import { blog_posts } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'

export type BlogPostActionResult = {
  success: boolean
  data?: { id: string } & Record<string, unknown>
  error?: string
  errors?: Record<string, string[]>
}

export async function createBlogPostAction(input: BlogPostFormData): Promise<BlogPostActionResult> {
  await requireAdmin()
  const parsed = blogPostFormSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const [data] = await db
      .insert(blog_posts)
      .values({
        ...parsed.data,
        published_at: parsed.data.status === 'published' ? new Date() : null,
      } as any)
      .returning()

    revalidatePath('/admin/blog')
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create blog post',
    }
  }
}

export async function updateBlogPostAction(
  id: string,
  input: Partial<BlogPostFormData>,
): Promise<BlogPostActionResult> {
  await requireAdmin()
  const parsed = blogPostFormSchema.partial().safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const updateData: any = { ...parsed.data };
    
    if (updateData.status === 'published' && !updateData.published_at) {
        updateData.published_at = new Date();
    }

    const [data] = await db
      .update(blog_posts)
      .set(updateData)
      .where(eq(blog_posts.id, id))
      .returning()

    if (!data) {
      return { success: false, error: 'Blog post not found' }
    }

    revalidatePath('/admin/blog')
    revalidatePath(`/admin/blog/${id}`)
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update blog post',
    }
  }
}

export async function deleteBlogPostAction(id: string): Promise<BlogPostActionResult> {
  await requireAdmin()
  
  try {
    await db.delete(blog_posts).where(eq(blog_posts.id, id))
    revalidatePath('/admin/blog')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete blog post',
    }
  }
}
