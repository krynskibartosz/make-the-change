import type { investment } from '@make-the-change/core'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { SectionContainer } from '@/components/ui/section-container'
import { InvestClient } from '@/features/investment/invest-client'
import { redirect } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/server'

interface ProjectInvestPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectInvestPage({ params }: ProjectInvestPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const locale = await getLocale()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const returnTo = encodeURIComponent(`/projects/${slug}/invest`)
    return redirect({ href: `/login?returnTo=${returnTo}`, locale })
  }

  const { data: project } = await supabase
    .from('public_projects')
    .select('id, slug, name_default, type, hero_image_url')
    .eq('slug', slug)
    .single()

  if (!project) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('metadata')
    .eq('id', user.id)
    .single()

  const metadata = (profile?.metadata || {}) as Record<string, unknown>
  const pointsBalance = Number((metadata.points_balance as number | undefined) ?? 0)

  return (
    <SectionContainer
      size="md"
      className="min-h-[calc(100svh-4rem)] bg-gradient-to-b from-background via-background to-muted/20 py-4 sm:py-6"
    >
      <InvestClient
        project={{
          id: project.id,
          slug: project.slug,
          name: project.name_default || 'Projet',
          type: project.type as investment.InvestmentType,
          coverImage: project.hero_image_url,
        }}
        pointsBalance={pointsBalance}
      />
    </SectionContainer>
  )
}
