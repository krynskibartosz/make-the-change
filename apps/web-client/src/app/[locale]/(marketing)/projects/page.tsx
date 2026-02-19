import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { ProjectsClient } from './projects-client'
import { getProjects } from './_features/get-projects'

interface ProjectsPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projects')
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
    },
  }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const t = await getTranslations('projects')
  const navT = await getTranslations('navigation')
  const params = await searchParams
  const status = params.status === 'active' || params.status === 'completed' ? params.status : 'all'

  const projectsList = await getProjects({
    status,
    search: params.search,
  })

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
