import { notFound } from 'next/navigation'
import { InterceptedRouteDialog } from '@/app/[locale]/@modal/_components/intercepted-route-dialog'
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
      contentClassName="overflow-hidden p-0 !bg-background/95 sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:max-w-[1420px] sm:rounded-[28px] sm:border sm:border-border/60 sm:shadow-[0_25px_100px_hsl(var(--marketing-overlay-dark)/0.5)] sm:backdrop-blur-2xl"
    >
      <ProjectQuickView project={project} />
    </InterceptedRouteDialog>
  )
}
