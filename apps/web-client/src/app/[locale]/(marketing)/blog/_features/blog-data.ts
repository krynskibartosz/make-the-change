import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { asBoolean, asString, isRecord } from '@/lib/type-guards'
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
  title_i18n?: Record<string, string> | null
  excerpt: string | null
  excerpt_i18n?: Record<string, string> | null
  content: unknown
  cover_image_url: string | null
  published_at: string | null
  featured: boolean | null
  status?: BlogPostStatus | null
  author?: BlogAuthorRow | BlogAuthorRow[] | null
  blog_post_tags?: BlogTagRelationRow[] | null
}

const toLocalizedRecord = (value: unknown): Record<string, string> | null => {
  if (!isRecord(value)) {
    return null
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

const toBlogPostRow = (value: unknown): BlogPostRow | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const slug = asString(value.slug)
  if (!id || !slug) {
    return null
  }

  const toAuthorRow = (authorValue: unknown): BlogAuthorRow => {
    if (!isRecord(authorValue)) {
      return null
    }

    return {
      name: asString(authorValue.name) || null,
      avatar_url: asString(authorValue.avatar_url) || null,
    }
  }

  const toTagRelationRow = (tagValue: unknown): BlogTagRelationRow => {
    if (!isRecord(tagValue)) {
      return null
    }

    const tag = isRecord(tagValue.tag)
      ? {
          name: asString(tagValue.tag.name) || null,
        }
      : null

    return { tag }
  }

  return {
    id,
    slug,
    title: asString(value.title) || null,
    title_i18n: toLocalizedRecord(value.title_i18n),
    excerpt: asString(value.excerpt) || null,
    excerpt_i18n: toLocalizedRecord(value.excerpt_i18n),
    content: value.content,
    cover_image_url: asString(value.cover_image_url) || null,
    published_at: asString(value.published_at) || null,
    featured: asBoolean(value.featured, false),
    status: toStatus(value.status) ?? null,
    author: Array.isArray(value.author)
      ? value.author.map((author) => toAuthorRow(author)).filter((author) => author !== null)
      : toAuthorRow(value.author),
    blog_post_tags: Array.isArray(value.blog_post_tags)
      ? value.blog_post_tags
          .map((relation) => toTagRelationRow(relation))
          .filter((relation) => relation !== null)
      : null,
  }
}

const BLOG_POST_SELECT = `
  id,
  slug,
  title,
  title_i18n,
  excerpt,
  excerpt_i18n,
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
  title_i18n,
  excerpt,
  excerpt_i18n,
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
  const status = toStatus(row.status)

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title || ''),
    titleI18n: row.title_i18n || null,
    excerpt: String(row.excerpt || ''),
    excerptI18n: row.excerpt_i18n || null,
    content: parseBlogContent(row.content),
    rawContent,
    coverImage: row.cover_image_url || null,
    author: toAuthor(row.author),
    publishedAt: row.published_at ? String(row.published_at) : null,
    tags: toTags(row.blog_post_tags),
    featured: Boolean(row.featured),
    ...(status !== undefined ? { status } : {}),
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

    return data
      .map((row) => toBlogPostRow(row))
      .filter((row): row is BlogPostRow => row !== null)
      .map((row) => mapPost(row))
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

    const row = toBlogPostRow(data)
    return row ? mapPost(row) : null
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

    const row = toBlogPostRow(data)
    return row ? mapPost(row) : null
  } catch {
    return null
  }
}
