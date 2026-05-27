import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { DARK_APP_MODAL_CLASSNAME } from '@/app/[locale]/@modal/_components/modal-content-presets'
import {
  filterAdvantagesByProducerSlug,
  getMockAdvantages,
} from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { getProjectContext } from '@/app/[locale]/(screens)/projects/_api/project-context.service'
import { getSpeciesForProject } from '@/app/[locale]/(screens)/projects/_api/project-species.service'
import {
  getPublicProjectBySlug,
  getRelatedProjectsByType,
} from '@/app/[locale]/(screens)/projects/[slug]/project-detail-data'
import { ProjectQuickView } from '@/app/[locale]/(screens)/projects/[slug]/project-quick-view'
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
  const producerAdvantages = filterAdvantagesByProducerSlug(
    getMockAdvantages(),
    project.producer?.slug,
  )

  return (
    <FullScreenSlideModal
      title={getLocalizedContent(project.name_i18n, locale, project.name_default)}
      fallbackHref="/projects"
      headerMode="dynamic"
      className={DARK_APP_MODAL_CLASSNAME}
    >
      <ProjectQuickView
        project={project}
        species={species}
        producerProducts={producerProducts}
        producerAdvantages={producerAdvantages}
        relatedProjects={relatedProjects}
      />
    </FullScreenSlideModal>
  )
}
