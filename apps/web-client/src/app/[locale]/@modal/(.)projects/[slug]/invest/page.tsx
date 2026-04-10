import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { ProjectInvestOneFlow } from '@/app/[locale]/(marketing)/projects/_features/project-invest-one-flow'
import { getPublicProjectBySlug } from '@/app/[locale]/(marketing)/projects/[slug]/project-detail-data'
import { createClient } from '@/lib/supabase/server'
import { getLocalizedContent } from '@/lib/utils'

const isInvestmentType = (value: unknown): value is 'beehive' | 'olive_tree' | 'vineyard' =>
  value === 'beehive' || value === 'olive_tree' || value === 'vineyard'

const toOptionalString = (value: string | string[] | undefined): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined

const toOptionalAmount = (value: string | string[] | undefined): number | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

interface InterceptedInvestPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    source?: string | string[]
    amount?: string | string[]
  }>
}

export default async function InterceptedProjectInvestPage({
  params,
  searchParams,
}: InterceptedInvestPageProps) {
  const { slug } = await params
  const query = await searchParams
  const locale = await getLocale()

  const project = await getPublicProjectBySlug(slug)

  if (!project || !isInvestmentType(project.type)) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <FullScreenSlideModal
      title={getLocalizedContent(project.name_i18n, locale, project.name_default)}
      fallbackHref={`/projects/${project.slug}`}
    >
      <ProjectInvestOneFlow
        project={{
          id: project.id,
          slug: project.slug,
          name: getLocalizedContent(project.name_i18n, locale, project.name_default),
          type: project.type,
          coverImage: project.hero_image_url,
          currentFunding: project.current_funding,
          targetBudget: project.target_budget,
        }}
        presentation="modal"
        isAuthenticated={Boolean(user)}
        source={toOptionalString(query.source)}
        initialAmount={toOptionalAmount(query.amount)}
      />
    </FullScreenSlideModal>
  )
}
