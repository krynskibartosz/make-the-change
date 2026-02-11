'use client'

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@make-the-change/core/ui'
import { ArrowLeft, Save, Trash } from 'lucide-react'
import { useState, useTransition } from 'react'
import { deleteBlogPost, updateBlogPost } from '@/features/blog/actions/blog-actions'
import { EditorComponent } from '@/features/cms/components/editor/editor-component'
import { useToast } from '@/hooks/use-toast'
import { Link, useRouter } from '@/i18n/navigation'

interface BlogEditorProps {
  post: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string
    status: 'draft' | 'published' | 'archived'
    cover_image_url?: string
    featured: boolean
  }
}

export function BlogEditor({ post }: BlogEditorProps) {
  const [data, setData] = useState(post)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()
  const BLOG_STATUSES = ['draft', 'published', 'archived'] as const

  const isBlogStatus = (value: string): value is (typeof BLOG_STATUSES)[number] =>
    BLOG_STATUSES.includes(value as (typeof BLOG_STATUSES)[number])

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateBlogPost(post.id, {
          title: data.title,
          slug: data.slug, // Although usually we don't change slug often, let's allow it
          content: data.content,
          excerpt: data.excerpt,
          status: data.status,
          featured: data.featured,
          cover_image_url: data.cover_image_url,
        })
        toast({
          title: 'Succès',
          description: 'Article sauvegardé.',
        })
      } catch {
        toast({
          title: 'Erreur',
          description: 'Impossible de sauvegarder.',
          variant: 'destructive',
        })
      }
    })
  }

  const handleDelete = () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return

    startTransition(async () => {
      try {
        await deleteBlogPost(post.id)
        toast({ title: 'Supprimé', description: 'Article supprimé avec succès.' })
        router.push('/admin/cms/blog')
      } catch {
        toast({ title: 'Erreur', description: 'Impossible de supprimer.', variant: 'destructive' })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/cms/blog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold truncate max-w-md">{data.title || 'Sans titre'}</h1>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                data.status === 'published'
                  ? 'bg-client-green-100 text-client-green-700'
                  : 'bg-client-yellow-100 text-client-yellow-700'
              }`}
            >
              {data.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isPending}>
            <Trash className="h-4 w-4" />
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label>Contenu</Label>
            <div className="min-h-[500px]">
              <EditorComponent
                content={data.content}
                onChange={(serializedDoc) => setData({ ...data, content: serializedDoc })}
                className="min-h-[500px]"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="font-semibold">Paramètres</h3>

            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={data.status}
                onValueChange={(value) => {
                  if (isBlogStatus(value)) {
                    setData({ ...data, status: value })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input
                value={data.slug}
                onChange={(e) => setData({ ...data, slug: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Extrait (Description courte)</Label>
              <textarea
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                value={data.excerpt}
                onChange={(e) => setData({ ...data, excerpt: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Image de couverture (URL)</Label>
              <Input
                value={data.cover_image_url || ''}
                onChange={(e) => setData({ ...data, cover_image_url: e.target.value })}
                placeholder="https://..."
              />
              {data.cover_image_url && (
                <div className="aspect-video rounded-md overflow-hidden border mt-2">
                  <img
                    src={data.cover_image_url}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label>Mettre à la une</Label>
              <Switch
                checked={data.featured}
                onCheckedChange={(checked) => setData({ ...data, featured: checked })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
