import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getProjects } from './_features/get-projects'
import { ProjectsClient } from './projects-client'

interface ProjectsPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
    view?: string
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
  const initialView: 'grid' | 'map' = params.view === 'map' ? 'map' : 'grid'

  const projects = await getProjects({
    status,
    ...(params.search !== undefined ? { search: params.search } : {}),
  })

  return (
    <ProjectsClient
      projects={projects}
      initialView={initialView}
    />
  )
}
