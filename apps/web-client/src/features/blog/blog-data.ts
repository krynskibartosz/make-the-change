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

const mapPost = (row: Record<string, unknown>): BlogPost => {
  const authorRaw = row.author
  const authorValue = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw
  const author =
    authorValue && typeof authorValue === 'object' ? (authorValue as Record<string, unknown>) : null
  const coverImage = typeof row.cover_image === 'string' ? row.cover_image : null
  const tags = Array.isArray(row.tags)
    ? row.tags.filter((t): t is string => typeof t === 'string')
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
      .from('blog_posts')
      .select(
        `
        id,
        slug,
        title,
        excerpt,
        content,
        cover_image,
        published_at,
        tags,
        featured,
        author:blog_authors(
          name,
          avatar_url
        )
      `,
      )
      .order('published_at', { ascending: false })
      .limit(50)

    if (error || !data) return []

    return data.map(mapPost)
  } catch {
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getBlogPosts()
  return all.find((p) => p.slug === slug) ?? null
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const all = await getBlogPosts()
  const needle = tag.toLowerCase()
  return all.filter((p) => p.tags.some((t) => t.toLowerCase() === needle))
}
