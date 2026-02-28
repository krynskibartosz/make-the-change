import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvestClient } from '@/app/[locale]/(marketing)/projects/_features/invest-client'

const isInvestmentType = (value: unknown): value is 'beehive' | 'olive_tree' | 'vineyard' =>
  value === 'beehive' || value === 'olive_tree' || value === 'vineyard'

interface InvestPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export default async function InvestPage({ params }: InvestPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: project } = await supabase
    .from('public_projects')
    .select('id, slug, name_default, type, hero_image_url')
    .eq('slug', slug)
    .single()

  if (!project || !isInvestmentType(project.type)) {
    notFound()
  }

  let pointsBalance = 0

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('points_balance')
      .eq('id', user.id)
      .maybeSingle()

    pointsBalance = Number(profile?.points_balance || 0)
  }

  return (
    <InvestClient
      project={{
        id: project.id,
        slug: project.slug,
        name: project.name_default,
        type: project.type,
        coverImage: project.hero_image_url,
      }}
      pointsBalance={pointsBalance}
    />
  )
}
