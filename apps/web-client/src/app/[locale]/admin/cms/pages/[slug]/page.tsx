import { getPageContent } from '@/features/cms/cms.service'
import { PageEditor } from '@/features/cms/components/page-editor'

export default async function EditPageContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pageContent = await getPageContent(slug)

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Éditer la Page: {slug}</h1>
      <PageEditor initialData={pageContent} slug={slug} />
    </div>
  )
}
