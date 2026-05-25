import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { ProjectContributeOneFlow } from '@/app/[locale]/(screens)/projects/[slug]/contribute/_components/project-contribute-one-flow'
import { getPublicProjectBySlug } from '@/app/[locale]/(screens)/projects/[slug]/project-detail-data'
import { getSpeciesForProject } from '@/app/[locale]/(screens)/projects/_api/project-species.service'
import { getUser } from '@/app/[locale]/(auth)/_features/auth-guards'
import { getLocalizedContent } from '@/lib/utils'
import { isContributionType, toOptionalString } from '@/app/[locale]/(screens)/projects/[slug]/_utils/project-type-guards'

type ContributePageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ source?: string | string[]; option?: string | string[] }>
}

export default async function ContributePage({ params, searchParams }: ContributePageProps) {
  const { slug } = await params
  const query = await searchParams
  const project = await getPublicProjectBySlug(slug)

  if (!project || !isContributionType(project.type) || !project.donation_options) {
    notFound()
  }

  const [locale, projectSpecies, user] = await Promise.all([
    getLocale(),
    getSpeciesForProject(project.slug, project.id),
    getUser(),
  ])

  return (
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
      presentation="page"
      isAuthenticated={user !== null}
      discoveredSpeciesId={projectSpecies[0]?.id ?? null}
      initialOptionId={toOptionalString(query.option)}
    />
  )
}
