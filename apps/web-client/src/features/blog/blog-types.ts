export type BlogAuthor = {
  name: string
  avatarUrl?: string | null
} | null

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string | null
  author: BlogAuthor
  publishedAt: string | null
  tags: string[]
  featured?: boolean
}
