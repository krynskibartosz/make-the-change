'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { TipTapDoc } from '../blog-types'
import { blogContentToText, parseBlogContent } from '../content/parse-blog-content'

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
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
      updated_by: user.id,
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isTipTapDoc = (value: unknown): value is TipTapDoc => {
  if (!isRecord(value) || value.type !== 'doc') {
    return false
  }

  if (value.content !== undefined && !Array.isArray(value.content)) {
    return false
  }

  return true
}

const normalizeTipTapContent = (serializedContent: string): string => {
  const trimmed = serializedContent.trim()
  if (!trimmed) {
    return JSON.stringify({
      type: 'doc',
      content: [],
    } satisfies TipTapDoc)
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown
    if (isTipTapDoc(parsed)) {
      return JSON.stringify(parsed)
    }
  } catch {
    // Legacy HTML/text fallback is normalized below.
  }

  const parsedLegacy = parseBlogContent(trimmed)
  const safeText = blogContentToText(parsedLegacy)
  const paragraphs = safeText
    .split(/\n{2,}/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: value }],
    }))

  return JSON.stringify({
    type: 'doc',
    content: paragraphs,
  } satisfies TipTapDoc)
}

type UpdateBlogPostInput = {
  title?: string
  slug?: string
  content?: string // Canonical format: serialized TipTap JSON from editor.getJSON()
  excerpt?: string
  cover_image_url?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
}

export async function updateBlogPost(id: string, data: UpdateBlogPostInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const normalizedData = { ...data }
  if (typeof normalizedData.content === 'string') {
    normalizedData.content = normalizeTipTapContent(normalizedData.content)
  }

  const { error } = await supabase
    .schema('content')
    .from('blog_posts')
    .update({
      ...normalizedData,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
      published_at: normalizedData.status === 'published' ? new Date().toISOString() : undefined,
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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase.schema('content').from('blog_posts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    throw new Error('Failed to delete post')
  }

  revalidatePath('/admin/cms/blog')
  return { success: true }
}
