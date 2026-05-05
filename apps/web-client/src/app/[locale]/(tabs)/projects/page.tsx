import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getSpeciesContextList } from '@/lib/api/species-context.service'
import { getProjects } from './_features/get-projects'
import { getProjectSpeciesPreviews } from './_features/project-list-species'
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
  const initialView: 'grid' | 'list' | 'map' =
    params.view === 'list' || params.view === 'map' || params.view === 'grid' ? params.view : 'grid'

  const [projectsList, speciesList] = await Promise.all([
    getProjects({
      status,
      ...(params.search !== undefined ? { search: params.search } : {}),
    }),
    getSpeciesContextList(),
  ])

  const projectsWithSpecies = projectsList.map((project) => ({
    ...project,
    linked_species: getProjectSpeciesPreviews(project, speciesList),
  }))

  return (
    <>
      <section className="pb-12 pt-0 md:pb-16 md:pt-2">
        <ProjectsClient
          projects={projectsWithSpecies || []}
          initialStatus={status}
          initialSearch={params.search || ''}
          initialView={initialView}
        />
      </section>
    </>
  )
}
