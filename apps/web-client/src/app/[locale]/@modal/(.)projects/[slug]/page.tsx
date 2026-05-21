import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getProjectContext } from '@/app/[locale]/(screens)/projects/_api/project-context.service'
import { getSpeciesForProject } from '@/app/[locale]/(screens)/projects/_api/project-species.service'
import { getLocalizedContent } from '@/lib/utils'
import {
  getPublicProjectBySlug,
  getRelatedProjectsByType,
} from '@/app/[locale]/(screens)/projects/[slug]/project-detail-data'
import { ProjectQuickView } from '@/app/[locale]/(screens)/projects/[slug]/project-quick-view'

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

  const [projectContext, species, relatedProjects] = await Promise.all([
    project.is_mock ? null : getProjectContext(project.slug),
    getSpeciesForProject(project.slug, project.id),
    getRelatedProjectsByType({
      type: project.type,
      excludeProjectId: project.id,
      excludeProjectSlug: project.slug,
      limit: 3,
    }),
  ])

  const producerProducts = projectContext?.producer_products ?? project.producer_products ?? null

  return (
    <FullScreenSlideModal
      title={getLocalizedContent(project.name_i18n, locale, project.name_default)}
      fallbackHref={`/projects/${project.slug}`}
      headerMode="dynamic"
    >
      <ProjectQuickView
        project={project}
        species={species}
        producerProducts={producerProducts}
        relatedProjects={relatedProjects}
      />
    </FullScreenSlideModal>
  )
}
