import { notFound } from 'next/navigation'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { QUICK_VIEW_MODAL_CONTENT_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import { getPublicProjectBySlug } from '@/app/[locale]/(marketing)/projects/[slug]/project-detail-data'
import { ProjectQuickView } from '@/app/[locale]/(marketing)/projects/[slug]/project-quick-view'

interface InterceptedProjectPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function InterceptedProjectPage({ params }: InterceptedProjectPageProps) {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <InterceptedRouteDialog
      title={project.name_default}
      contentClassName={QUICK_VIEW_MODAL_CONTENT_CLASSNAME}
    >
      <ProjectQuickView project={project} />
    </InterceptedRouteDialog>
  )
}
