import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getPublicProjectBySlug } from '@/app/[locale]/(marketing)/projects/[slug]/project-detail-data'
import { ProjectQuickView } from '@/app/[locale]/(marketing)/projects/[slug]/project-quick-view'
import { getLocalizedContent } from '@/lib/utils'

interface InterceptedProjectPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function InterceptedProjectPage({ params }: InterceptedProjectPageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <FullScreenSlideModal
      title={getLocalizedContent(project.name_i18n, locale, project.name_default)}
      fallbackHref={`/projects/${project.slug}`}
    >
      <ProjectQuickView project={project} />
    </FullScreenSlideModal>
  )
}
