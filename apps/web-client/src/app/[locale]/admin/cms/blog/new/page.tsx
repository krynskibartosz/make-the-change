import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@make-the-change/core/ui'
import { createBlogPost } from '@/features/blog/actions/blog-actions'

export default function NewBlogPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Nouvel Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createBlogPost} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" placeholder="Mon super article" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" name="slug" placeholder="mon-super-article" required />
            </div>
            <Button type="submit" className="w-full">
              Créer le brouillon
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
