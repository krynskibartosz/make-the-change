import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InvestClient } from './invest-client'

interface InvestPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export default async function InvestPage({ params }: InvestPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('public_projects')
    .select('id, slug, name_default, target_budget, current_funding')
    .eq('slug', slug)
    .single()

  if (!project) {
    notFound()
  }

  return <InvestClient project={project} />
}
