import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { BlogPost } from './blog-types'

const extractTextFromTipTap = (json: any): string => {
  if (!json || typeof json !== 'object') return String(json || '')
  if (json.type === 'text' && typeof json.text === 'string') return json.text
  if (Array.isArray(json.content)) {
    return json.content.map(extractTextFromTipTap).join('\n\n')
  }
  return ''
}

const mapPost = (row: any): BlogPost => {
  const authorRaw = row.author
  const authorValue = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw
  const author =
    authorValue && typeof authorValue === 'object' ? (authorValue as Record<string, unknown>) : null
  const coverImage = row.cover_image_url || null
  
  // Handle nested tags from the many-to-many relationship
  const tags = row.blog_post_tags 
    ? row.blog_post_tags
        .map((item: any) => item.tag?.name)
        .filter((t: any): t is string => typeof t === 'string')
    : []

  let content = ''
  if (typeof row.content === 'string') {
    content = row.content
  } else if (row.content && typeof row.content === 'object') {
    content = extractTextFromTipTap(row.content)
  }

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title || ''),
    excerpt: String(row.excerpt || ''),
    content,
    coverImage,
    author: author
      ? {
          name: String(author.name || 'Auteur'),
          avatarUrl: typeof author.avatar_url === 'string' ? author.avatar_url : null,
        }
      : null,
    publishedAt: row.published_at ? String(row.published_at) : null,
    tags,
    featured: Boolean(row.featured),
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .schema('content')
      .from('blog_posts')
      .select(
        `
        id,
        slug,
        title,
        excerpt,
        content,
        cover_image_url,
        published_at,
        featured,
        author:blog_authors(
          name,
          avatar_url
        ),
        blog_post_tags(
          tag:blog_tags(
            name
          )
        )
      `,
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error || !data) return []

    return data.map(mapPost)
  } catch {
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .schema('content')
      .from('blog_posts')
      .select(
        `
        id,
        slug,
        title,
        excerpt,
        content,
        cover_image_url,
        published_at,
        featured,
        author:blog_authors(
          name,
          avatar_url
        ),
        blog_post_tags(
          tag:blog_tags(
            name
          )
        )
      `,
      )
      .eq('slug', slug)
      .single()

    if (error || !data) return null

    return mapPost(data)
  } catch {
    return null
  }
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .schema('content')
      .from('blog_posts')
      .select(
        `
        id,
        slug,
        title,
        excerpt,
        content,
        cover_image_url,
        published_at,
        status,
        featured,
        author:blog_authors(
          name,
          avatar_url
        ),
        blog_post_tags(
          tag:blog_tags(
            name
          )
        )
      `,
      )
      .eq('id', id)
      .single()

    if (error || !data) return null

    // For admin, we need the raw status, which mapPost doesn't currently include in BlogPost type?
    // Let's check BlogPost type. If it's missing status, we should add it.
    // For now, mapPost returns BlogPost which is for public view. 
    // But the Admin Editor needs 'status'.
    // I'll extend the return type or just return the raw data mapped + status.
    
    const post = mapPost(data)
    return { ...post, status: data.status } as BlogPost & { status: 'draft' | 'published' | 'archived' }
  } catch {
    return null
  }
}
