import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { ProjectDonateOneFlow } from '@/app/[locale]/(screens)/projects/[slug]/donate/_components/project-donate-one-flow'
import { getPublicProjectBySlug } from '@/app/[locale]/(screens)/projects/[slug]/project-detail-data'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { createClient } from '@/lib/supabase/server'
import { getLocalizedContent } from '@/lib/utils'

function isDonationType(value: unknown): value is 'reef' | 'coral' {
  return value === 'reef' || value === 'coral'
}

function toOptionalString(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

type DonatePageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ source?: string | string[]; option?: string | string[] }>
}

export default async function DonatePage({ params, searchParams }: DonatePageProps) {
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
    ? speciesList.find(
        (species) =>
          species.user_status?.isUnlocked && species.user_status.unlockSource === 'donation',
      )
    : null

  return (
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
      presentation="page"
      isAuthenticated={Boolean(user)}
      source={toOptionalString(query.source)}
      discoveredSpeciesId={unlockedSpecies?.id ?? null}
      initialOptionId={toOptionalString(query.option)}
    />
  )
}
