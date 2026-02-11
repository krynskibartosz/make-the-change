import { Button } from '@make-the-change/core/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function AdminCmsPage() {
  const t = await getTranslations('admin')

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">CMS Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Menu Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Gérer la structure du Mega Menu (liens, images, titres).
            </p>
            <Link href="/admin/cms/menus/main-header">
              <Button className="w-full">Modifier le Menu</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Page d'Accueil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Modifier les textes, images et statistiques de la home page.
            </p>
            <Link href="/admin/cms/pages/home">
              <Button className="w-full">Modifier la Page</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
