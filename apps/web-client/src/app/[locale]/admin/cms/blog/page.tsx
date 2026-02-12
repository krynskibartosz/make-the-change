import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { FileText, Plus } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { BlogPostActionsMenu } from './blog-post-actions-menu'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .schema('content')
    .from('blog_posts')
    .select('id, title, status, published_at, view_count, author:blog_authors(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/cms/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Article
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {posts?.map((post) => {
          const authorValue = post.author as { name?: string }[] | { name?: string } | null
          const authorName = Array.isArray(authorValue) ? authorValue[0]?.name : authorValue?.name

          return (
          <Card key={post.id}>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                    {post.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {authorName || 'Unknown Author'} • {formatDate(post.published_at || '')} • {post.view_count} vues
                </p>
              </div>
              <div className="flex items-center gap-2">
                <BlogPostActionsMenu postId={post.id} />
              </div>
            </CardContent>
          </Card>
          )
        })}

        {(!posts || posts.length === 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Aucun article pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
