import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { BlogPost, BlogPostStatus } from './blog-types'
import { parseBlogContent } from './content/parse-blog-content'

type BlogTagRelationRow = {
  tag?: {
    name?: string | null
  } | null
} | null

type BlogAuthorRow = {
  name?: string | null
  avatar_url?: string | null
} | null

type BlogPostRow = {
  id: string
  slug: string
  title: string | null
  excerpt: string | null
  content: unknown
  cover_image_url: string | null
  published_at: string | null
  featured: boolean | null
  status?: BlogPostStatus | null
  author?: BlogAuthorRow | BlogAuthorRow[] | null
  blog_post_tags?: BlogTagRelationRow[] | null
}

const BLOG_POST_SELECT = `
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
`

const BLOG_POST_ADMIN_SELECT = `
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
`

const toRawContent = (content: unknown): string => {
  if (typeof content === 'string') {
    return content
  }

  if (content === null || content === undefined) {
    return ''
  }

  if (typeof content === 'object') {
    try {
      return JSON.stringify(content)
    } catch {
      return ''
    }
  }

  return String(content)
}

const toAuthor = (authorRaw: BlogPostRow['author']) => {
  const authorValue = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw
  if (!authorValue || typeof authorValue !== 'object') {
    return null
  }

  return {
    name:
      typeof authorValue.name === 'string' && authorValue.name.trim() ? authorValue.name : 'Author',
    avatarUrl: typeof authorValue.avatar_url === 'string' ? authorValue.avatar_url : null,
  }
}

const toTags = (relations: BlogPostRow['blog_post_tags']): string[] => {
  if (!Array.isArray(relations)) {
    return []
  }

  return relations
    .map((relation) => relation?.tag?.name)
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
}

const toStatus = (value: unknown): BlogPostStatus | undefined => {
  if (value === 'draft' || value === 'published' || value === 'archived') {
    return value
  }

  return undefined
}

const mapPost = (row: BlogPostRow): BlogPost => {
  const rawContent = toRawContent(row.content)

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title || ''),
    excerpt: String(row.excerpt || ''),
    content: parseBlogContent(row.content),
    rawContent,
    coverImage: row.cover_image_url || null,
    author: toAuthor(row.author),
    publishedAt: row.published_at ? String(row.published_at) : null,
    tags: toTags(row.blog_post_tags),
    featured: Boolean(row.featured),
    status: toStatus(row.status),
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .schema('content')
      .from('blog_posts')
      .select(BLOG_POST_SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50)

    if (error || !data) {
      return []
    }

    return data.map((row) => mapPost(row as BlogPostRow))
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
      .select(BLOG_POST_SELECT)
      .eq('slug', slug)
      .single()

    if (error || !data) {
      return null
    }

    return mapPost(data as BlogPostRow)
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
      .select(BLOG_POST_ADMIN_SELECT)
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    return mapPost(data as BlogPostRow)
  } catch {
    return null
  }
}
