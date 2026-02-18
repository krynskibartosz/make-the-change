import { getMenu } from '@/app/[locale]/admin/cms/_features/cms.service'
import { MenuEditor } from '@/app/[locale]/admin/cms/_features/components/menu-editor'

export default async function EditMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const menuData = await getMenu(slug)

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Éditer le Menu: {slug}</h1>
      <MenuEditor initialData={menuData} slug={slug} />
    </div>
  )
}
