import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { ProjectSupportOneFlow } from '@/app/[locale]/(screens)/projects/[slug]/support/_components/project-support-one-flow'
import { getPublicProjectBySlug } from '@/app/[locale]/(screens)/projects/[slug]/project-detail-data'
import { getSpeciesForProject } from '@/app/[locale]/(screens)/projects/_api/project-species.service'
import { getUser } from '@/app/[locale]/(auth)/_features/auth-guards'
import { getLocalizedContent } from '@/lib/utils'
import { isSupportType, toOptionalString } from '@/app/[locale]/(screens)/projects/[slug]/_utils/project-type-guards'

const toOptionalAmount = (value: string | string[] | undefined): number | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

interface SupportPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    source?: string | string[]
    amount?: string | string[]
    tier?: string | string[]
  }>
}

export default async function SupportPage({ params, searchParams }: SupportPageProps) {
  const { slug } = await params
  const query = await searchParams
  const locale = await getLocale()

  const project = await getPublicProjectBySlug(slug)

  if (!project || !isSupportType(project.type)) {
    notFound()
  }

  const [projectSpecies, user] = await Promise.all([
    getSpeciesForProject(project.slug, project.id),
    getUser(),
  ])

  return (
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
        supportRewardTiers: project.support_reward_tiers,
      }}
      presentation="page"
      isAuthenticated={user !== null}
      initialAmount={toOptionalAmount(query.amount)}
      initialTierId={toOptionalString(query.tier)}
      discoveredSpeciesId={projectSpecies[0]?.id ?? null}
      species={projectSpecies ?? undefined}
    />
  )
}
