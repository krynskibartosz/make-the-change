import { getTranslations } from 'next-intl/server'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { createClient } from '@/lib/supabase/server'
import { ProjectsClient } from './projects-client'

interface ProjectsPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const t = await getTranslations('projects')
  const navT = await getTranslations('navigation')
  const params = await searchParams
  const status = params.status === 'active' || params.status === 'completed' ? params.status : 'all'
  const supabase = await createClient()

  // Build query
  let projectsQuery = supabase
    .from('public_projects')
    .select(`
      *,
      producer:public_producers!producer_id(*)
    `)
    .order('created_at', { ascending: false })

  // Apply filters
  if (status !== 'all') {
    projectsQuery = projectsQuery.eq('status', status)
  }

  if (params.search) {
    projectsQuery = projectsQuery.ilike('name_default', `%${params.search}%`)
  }

  const { data: projectsList } = await projectsQuery

  return (
    <>
      <PageHero
        title={t('title')}
        description={t('subtitle')}
        hideDescriptionOnMobile
        size="md"
        variant="gradient"
      />
      <SectionContainer size="lg">
        <Breadcrumbs items={[{ label: navT('projects'), href: '/projects' }]} />
        <ProjectsClient
          projects={projectsList || []}
          initialStatus={status}
          initialSearch={params.search || ''}
        />
      </SectionContainer>
    </>
  )
}
