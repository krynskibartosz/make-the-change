import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { ProjectDonateOneFlow } from '@/app/[locale]/(screens)/projects/[slug]/donate/_components/project-donate-one-flow'
import { getPublicProjectBySlug } from '@/app/[locale]/(screens)/projects/[slug]/project-detail-data'
import { getLocalizedContent } from '@/lib/utils'

function isDonationType(value: unknown): value is 'reef' | 'coral' {
  return value === 'reef' || value === 'coral'
}

function toOptionalString(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

type InterceptedDonatePageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ source?: string | string[]; option?: string | string[] }>
}

export default async function InterceptedProjectDonatePage({
  params,
  searchParams,
}: InterceptedDonatePageProps) {
  const { slug } = await params
  const query = await searchParams

  const project = await getPublicProjectBySlug(slug)

  if (!project || !isDonationType(project.type) || !project.donation_options) {
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
      <ProjectDonateOneFlow
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
