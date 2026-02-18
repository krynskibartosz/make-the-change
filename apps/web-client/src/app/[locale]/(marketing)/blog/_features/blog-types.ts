export type BlogAuthor = {
  name: string
  avatarUrl?: string | null
} | null

export type BlogPostStatus = 'draft' | 'published' | 'archived'

export type TipTapMark = {
  type: string
  attrs?: Record<string, unknown>
}

export type TipTapNode = {
  type: string
  attrs?: Record<string, unknown>
  text?: string
  marks?: TipTapMark[]
  content?: TipTapNode[]
}

export type TipTapDoc = {
  type: 'doc'
  content?: TipTapNode[]
}

export type BlogPostContent =
  | {
      kind: 'tiptap'
      doc: TipTapDoc
    }
  | {
      kind: 'legacyText'
      text: string
    }

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: BlogPostContent
  rawContent: string
  coverImage: string | null
  author: BlogAuthor
  publishedAt: string | null
  tags: string[]
  featured?: boolean
  status?: BlogPostStatus
}
