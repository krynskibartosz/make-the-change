import { notFound } from 'next/navigation'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
import { getPublicProjectBySlug } from '@/app/[locale]/(marketing)/projects/[slug]/project-detail-data'
import { ProjectDetails } from '@/app/[locale]/(marketing)/projects/[slug]/project-details'

interface InterceptedProjectPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function InterceptedProjectPage({ params }: InterceptedProjectPageProps) {
  const { locale, slug } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <InterceptedRouteDialog
      title={project.name_default}
      contentClassName="w-[min(100vw-1.5rem,80rem)]"
    >
      <ProjectDetails project={project} locale={locale} includeStructuredData={false} />
    </InterceptedRouteDialog>
  )
}
