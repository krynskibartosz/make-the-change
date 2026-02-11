import { getBlogPostById } from '@/features/blog/blog-data'
import { BlogEditor } from '@/features/blog/components/blog-editor'
import { notFound } from 'next/navigation'

export default async function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(id)

  if (!post) {
    notFound()
  }

  // Ensure coverImage/cover_image_url consistency
  const editorPost = {
    ...post,
    cover_image_url: post.coverImage || undefined,
    // Cast status because getBlogPostById returns it (as we saw in my modification) 
    // but TypeScript might need help if I didn't update the BlogPost interface globally.
    status: (post as any).status || 'draft' 
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <BlogEditor post={editorPost} />
    </div>
  )
}
