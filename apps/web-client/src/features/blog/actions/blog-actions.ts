'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  
  if (!title || !slug) {
    throw new Error('Title and Slug are required')
  }

  const { data, error } = await supabase
    .schema('content')
    .from('blog_posts')
    .insert({
      title,
      slug,
      status: 'draft',
      author_id: '00000000-0000-0000-0000-000000000000', // TODO: Get or create author profile for user
      created_by: user.id,
      updated_by: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    throw new Error('Failed to create post')
  }

  revalidatePath('/admin/cms/blog')
  redirect(`/admin/cms/blog/${data.id}`)
}

export async function updateBlogPost(id: string, data: {
  title?: string
  content?: string // HTML content from TipTap
  excerpt?: string
  cover_image_url?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .schema('content')
    .from('blog_posts')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
      published_at: data.status === 'published' ? new Date().toISOString() : undefined
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating post:', error)
    throw new Error('Failed to update post')
  }

  revalidatePath('/blog')
  revalidatePath('/admin/cms/blog')
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .schema('content')
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    throw new Error('Failed to delete post')
  }

  revalidatePath('/admin/cms/blog')
  return { success: true }
}
