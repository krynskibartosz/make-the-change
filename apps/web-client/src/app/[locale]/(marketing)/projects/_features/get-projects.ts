import { unstable_cache } from 'next/cache'
import { isMockDataSource } from '@/lib/mock/data-source'
import { createStaticClient } from '@/lib/supabase/static'
import { asNumber, asString, isRecord } from '@/lib/type-guards'
import { getMockProjects } from './mock-projects'

export type GetProjectsOptions = {
  status?: string
  search?: string
}

type ProjectStatusFilter = 'active' | 'completed' | 'archived' | 'draft' | 'funded'

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

const PROJECT_STATUS_VALUES = [
  'active',
  'completed',
  'archived',
  'draft',
  'funded',
] as const satisfies readonly ProjectStatusFilter[]

const isProjectStatusFilter = (value: string): value is ProjectStatusFilter =>
  PROJECT_STATUS_VALUES.some((entry) => entry === value)

const toLocalizedRecord = (value: unknown): Record<string, string> | null => {
  if (!isRecord(value)) {
    return null
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

const toNullableString = (value: unknown): string | null => {
  const parsed = asString(value)
  return parsed || null
}

const toNullableNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null
  }

  const parsed = asNumber(value, Number.NaN)
  return Number.isFinite(parsed) ? parsed : null
}

const toNullableBoolean = (value: unknown): boolean | null => {
  if (value === null || value === undefined) {
    return null
  }

  return typeof value === 'boolean' ? value : null
}

const toProducer = (value: unknown): ProjectListItem['producer'] => {
  if (!isRecord(value)) {
    return null
  }

  return {
    name_default: toNullableString(value.name_default),
    name_i18n: toLocalizedRecord(value.name_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
  }
}

const toProjectListItem = (value: unknown): ProjectListItem | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = toNullableString(value.id)
  if (!id) {
    return null
  }

  return {
    id,
    slug: toNullableString(value.slug),
    name_default: toNullableString(value.name_default),
    name_i18n: toLocalizedRecord(value.name_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    target_budget: toNullableNumber(value.target_budget),
    current_funding: toNullableNumber(value.current_funding),
    funding_progress: toNullableNumber(value.funding_progress),
    address_city: toNullableString(value.address_city),
    address_country_code: toNullableString(value.address_country_code),
    latitude: toNullableNumber(value.latitude ?? value.address_lat ?? value.lat),
    longitude: toNullableNumber(value.longitude ?? value.address_lng ?? value.lng),
    featured: toNullableBoolean(value.featured),
    launch_date: toNullableString(value.launch_date),
    status: toNullableString(value.status),
    hero_image_url: toNullableString(value.hero_image_url),
    type: toNullableString(value.type),
    producer: toProducer(value.producer),
  }
}

const toMockProjectListItem = (
  project: ReturnType<typeof getMockProjects>[number],
): ProjectListItem => {
  const fundingProgress =
    project.target_budget > 0 ? Math.min((project.current_funding / project.target_budget) * 100, 100) : 0

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
    producer: {
      name_default: project.producer.name_default,
      name_i18n: project.producer.name_i18n || null,
      description_default: project.producer.description_default,
      description_i18n: project.producer.description_i18n || null,
    },
  }
}

const matchesSearch = (project: ProjectListItem, search: string) => {
  if (!search) return true
  const query = search.trim().toLowerCase()
  if (!query) return true

  const haystack = [
    project.name_default || '',
    project.description_default || '',
    isRecord(project.producer) ? asString(project.producer.name_default) || '' : '',
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

const matchesStatus = (project: ProjectListItem, status: string) => {
  if (status === 'all') return true
  return project.status === status
}

export const getProjects = unstable_cache(
  async (options: GetProjectsOptions = {}) => {
    const { status = 'all', search } = options
    const mockProjects = getMockProjects()
      .map((project) => toMockProjectListItem(project))
      .filter((project) => matchesStatus(project, status))
      .filter((project) => matchesSearch(project, search || ''))

    if (isMockDataSource) {
      return mockProjects
    }

    const supabase = createStaticClient()

    // Build query
    let projectsQuery = supabase
      .from('public_projects')
      .select(`
        *,
        producer:public_producers!producer_id(*)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (status !== 'all' && isProjectStatusFilter(status)) {
      projectsQuery = projectsQuery.eq('status', status)
    }

    if (search) {
      projectsQuery = projectsQuery.ilike('name_default', `%${search}%`)
    }

    const { data, error } = await projectsQuery

    if (error) {
      console.error('[projects] fetch failed', error)
      throw error
    }

    const databaseProjects = Array.isArray(data)
      ? data
          .map((entry) => toProjectListItem(entry))
          .filter((entry): entry is ProjectListItem => entry !== null)
      : []

    const mockSlugs = new Set(
      mockProjects
        .map((project) => project.slug)
        .filter((slug): slug is string => typeof slug === 'string' && slug.length > 0),
    )

    const dedupedDatabaseProjects = databaseProjects.filter((project) => {
      if (!project.slug) return true
      return !mockSlugs.has(project.slug)
    })

    return [...mockProjects, ...dedupedDatabaseProjects]
  },
  ['projects-list'],
  {
    revalidate: 3600, // 1 hour fallback
    tags: ['projects-list'],
  },
)
