import { notFound } from 'next/navigation'
import { getBlogPostById } from '@/features/blog/blog-data'
import { BlogEditor } from '@/features/blog/components/blog-editor'

export default async function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(id)

  if (!post) {
    notFound()
  }

  const editorPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.rawContent,
    excerpt: post.excerpt,
    status: post.status ?? 'draft',
    cover_image_url: post.coverImage || undefined,
    featured: Boolean(post.featured),
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <BlogEditor post={editorPost} />
    </div>
  )
}
