import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { ProjectDonateOneFlow } from '@/app/[locale]/(marketing)/projects/_features/project-donate-one-flow'
import { getPublicProjectBySlug } from '@/app/[locale]/(marketing)/projects/[slug]/project-detail-data'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { createClient } from '@/lib/supabase/server'
import { getLocalizedContent } from '@/lib/utils'

const isDonationType = (value: unknown): value is 'reef' | 'coral' =>
  value === 'reef' || value === 'coral'

const toOptionalString = (value: string | string[] | undefined): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined

const toOptionalAmount = (value: string | string[] | undefined): number | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const parsed = Number(value)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined
  }

  return parsed
}

type InterceptedDonatePageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ source?: string | string[] }>
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

  const supabase = await createClient()
  const locale = await getLocale()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const speciesList = await getSpeciesContextList()
  const unlockedSpecies = user
    ? speciesList.find((species) => species.user_status?.isUnlocked && species.user_status.unlockSource === 'donation')
    : null

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
        }}
        presentation="modal"
        isAuthenticated={Boolean(user)}
        source={toOptionalString(query.source)}
        discoveredSpeciesId={unlockedSpecies?.id ?? null}
      />
    </FullScreenSlideModal>
  )
}
