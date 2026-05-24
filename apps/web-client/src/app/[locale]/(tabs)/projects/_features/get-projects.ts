import { unstable_cache } from 'next/cache'
import { getMockProjects } from './mock-projects'
import type { ProjectListSpeciesSeed } from './project-list-species'

export type GetProjectsOptions = {
  status?: string
  search?: string
}

type ProjectListItem = {
  id: string | null
  slug: string | null
  name_default: string | null
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  target_budget: number | null
  current_funding: number | null
  funding_progress: number | null
  address_city: string | null
  address_country_code: string | null
  latitude: number | null
  longitude: number | null
  featured: boolean | null
  launch_date: string | null
  status: string | null
  hero_image_url: string | null
  type: string | null
  unit_label: string | null
  species: ProjectListSpeciesSeed[] | null
  producer:
    | {
        name_default?: string | null
        name_i18n?: Record<string, string> | null
        description_default?: string | null
        description_i18n?: Record<string, string> | null
      }
    | Record<string, unknown>
    | null
}

function toProjectListSpeciesArray(
  species: ReturnType<typeof getMockProjects>[number]['species'],
): ProjectListSpeciesSeed[] | null {
  if (!Array.isArray(species) || species.length === 0) {
    return null
  }

  return species.map((entry) => ({
    id: entry.id,
    name: entry.name,
    icon: entry.icon,
  }))
}

function toMockProjectListItem(
  project: ReturnType<typeof getMockProjects>[number],
): ProjectListItem {
  const fundingProgress =
    project.target_budget > 0
      ? Math.min((project.current_funding / project.target_budget) * 100, 100)
      : 0

  return {
    id: project.id,
    slug: project.slug,
    name_default: project.name_default,
    name_i18n: project.name_i18n || null,
    description_default: project.description_default,
    description_i18n: project.description_i18n || null,
    target_budget: project.target_budget,
    current_funding: project.current_funding,
    funding_progress: fundingProgress,
    address_city: project.address_city,
    address_country_code: project.address_country_code,
    latitude: project.latitude || null,
    longitude: project.longitude || null,
    featured: project.featured,
    launch_date: project.launch_date,
    status: project.status,
    hero_image_url: project.hero_image_url,
    type: project.type,
    unit_label: project.unit_label || null,
    species: toProjectListSpeciesArray(project.species),
    producer: {
      name_default: project.producer.name_default,
      name_i18n: project.producer.name_i18n || null,
      description_default: project.producer.description_default,
      description_i18n: project.producer.description_i18n || null,
    },
  }
}

function matchesSearch(project: ProjectListItem, search: string) {
  if (!search) return true
  const query = search.trim().toLowerCase()
  if (!query) return true

  const producerName =
    project.producer && 'name_default' in project.producer
      ? project.producer.name_default || ''
      : ''

  const haystack = [
    project.name_default || '',
    project.description_default || '',
    producerName,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

function matchesStatus(project: ProjectListItem, status: string) {
  if (status === 'all') return true
  return project.status === status
}

const _getProjects = async (options: GetProjectsOptions = {}) => {
  const { status = 'all', search } = options

  return getMockProjects()
    .map((project) => toMockProjectListItem(project))
    .filter((project) => matchesStatus(project, status))
    .filter((project) => matchesSearch(project, search || ''))
}

export const getProjects = unstable_cache(_getProjects, ['projects-list'], {
  revalidate: 3600,
  tags: ['projects-list'],
})
