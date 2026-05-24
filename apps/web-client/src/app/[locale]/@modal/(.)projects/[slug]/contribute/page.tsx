import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { ProjectContributeOneFlow } from '@/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow'
import { getPublicProjectBySlug } from '@/app/[locale]/(screens)/projects/[slug]/project-detail-data'
import { getLocalizedContent } from '@/lib/utils'

function isContributionType(value: unknown): value is 'reef' | 'coral' {
  return value === 'reef' || value === 'coral'
}

function toOptionalString(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

type InterceptedContributePageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ source?: string | string[]; option?: string | string[] }>
}

export default async function InterceptedProjectContributePage({
  params,
  searchParams,
}: InterceptedContributePageProps) {
  const { slug } = await params
  const query = await searchParams

  const project = await getPublicProjectBySlug(slug)

  if (!project || !isContributionType(project.type) || !project.donation_options) {
    notFound()
  }

  const locale = await getLocale()

  const initialOptionId = toOptionalString(query.option)

  return (
    <FullScreenSlideModal
      fallbackHref={`/projects/${project.slug}`}
      headerMode="close"
      refreshOnClose={true}
    >
      <ProjectContributeOneFlow
        project={{
          id: project.id,
          slug: project.slug,
          name: getLocalizedContent(project.name_i18n, locale, project.name_default),
          type: project.type,
          coverImage: project.hero_image_url,
          currentFunding: project.current_funding,
          targetBudget: project.target_budget,
          donationOptions: project.donation_options,
          expectedImpact: project.expected_impact,
        }}
        presentation="modal"
        isAuthenticated={false}
        discoveredSpeciesId={null}
        initialOptionId={initialOptionId}
      />
    </FullScreenSlideModal>
  )
}
