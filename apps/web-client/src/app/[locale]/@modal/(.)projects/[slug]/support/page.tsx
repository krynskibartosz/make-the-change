import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { ProjectSupportOneFlow } from '@/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow'
import { getPublicProjectBySlug } from '@/app/[locale]/(screens)/projects/[slug]/project-detail-data'
import { getSpeciesForProject } from '@/app/[locale]/(screens)/projects/_api/project-species.service'
import { getLocalizedContent } from '@/lib/utils'

function isSupportType(value: unknown): value is 'beehive' | 'olive_tree' | 'vineyard' {
  return value === 'beehive' || value === 'olive_tree' || value === 'vineyard'
}

function toOptionalAmount(value: string | string[] | undefined): number | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

interface InterceptedSupportPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    source?: string | string[]
    amount?: string | string[]
  }>
}

export default async function InterceptedProjectSupportPage({
  params,
  searchParams,
}: InterceptedSupportPageProps) {
  const { slug } = await params
  const query = await searchParams
  const locale = await getLocale()

  const project = await getPublicProjectBySlug(slug)

  if (!project || !isSupportType(project.type)) {
    notFound()
  }

  const projectSpecies = await getSpeciesForProject(project.slug, project.id)

  return (
    <FullScreenSlideModal
      fallbackHref={`/projects/${project.slug}`}
      headerMode="close"
      refreshOnClose={true}
    >
      <ProjectSupportOneFlow
        project={{
          id: project.id,
          slug: project.slug,
          name: getLocalizedContent(project.name_i18n, locale, project.name_default),
          type: project.type,
          coverImage: project.hero_image_url,
          currentFunding: project.current_funding,
          targetBudget: project.target_budget,
          expectedImpact: project.expected_impact,
        }}
        presentation="modal"
        isAuthenticated={false}
        initialAmount={toOptionalAmount(query.amount)}
        discoveredSpeciesId={projectSpecies[0]?.id ?? null}
        species={projectSpecies}
      />
    </FullScreenSlideModal>
  )
}
