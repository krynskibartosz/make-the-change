import { unstable_cache } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/static'
import { asNumber, asString, isRecord } from '@/lib/type-guards'

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
    featured: toNullableBoolean(value.featured),
    launch_date: toNullableString(value.launch_date),
    status: toNullableString(value.status),
    hero_image_url: toNullableString(value.hero_image_url),
    type: toNullableString(value.type),
    producer: toProducer(value.producer),
  }
}

export const getProjects = unstable_cache(
  async (options: GetProjectsOptions = {}) => {
    const supabase = createStaticClient()
    const { status = 'all', search } = options

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

    return Array.isArray(data)
      ? data
          .map((entry) => toProjectListItem(entry))
          .filter((entry): entry is ProjectListItem => entry !== null)
      : []
  },
  ['projects-list'],
  {
    revalidate: 3600, // 1 hour fallback
    tags: ['projects-list'],
  },
)
