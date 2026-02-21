import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getProjects } from './_features/get-projects'
import { ProjectsClient } from './projects-client'

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
  const params = await searchParams
  const status = params.status === 'active' || params.status === 'completed' ? params.status : 'all'

  const projectsList = await getProjects({
    status,
    ...(params.search !== undefined ? { search: params.search } : {}),
  })

  return (
    <>
      <section className="pb-12 pt-0 md:pb-16 md:pt-2">
        <ProjectsClient
          projects={projectsList || []}
          initialStatus={status}
          initialSearch={params.search || ''}
        />
      </section>
    </>
  )
}
