import { createClient } from '@/lib/supabase/server'
import { asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'
import type {
  ProducerProduct,
  ProjectChallenge,
  ProjectImpact,
  ProjectSpecies,
} from '@/types/context'
import { getMockProjectBySlug, getMockProjects } from '../_features/mock-projects'

export type ProjectProducer = {
  id: string
  slug: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  contact_website: string | null
  images: string[] | null
}

export type PublicProject = {
  id: string
  slug: string
  is_mock?: boolean
  status: string | null
  type: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  long_description_default: string | null
  long_description_i18n?: Record<string, string> | null
  address_city: string | null
  address_country_code: string | null
  launch_date: string | null
  maturity_date: string | null
  current_funding: number | null
  target_budget: number | null
  unit_price_eur?: number | null
  unit_label?: string | null
  hero_image_url: string | null
  images: string[] | null
  producer: ProjectProducer | null
  species?: ProjectSpecies[] | null
  challenges?: ProjectChallenge[] | null
  producer_products?: ProducerProduct[] | null
  expected_impact?: ProjectImpact | null
}

export type RelatedProject = {
  id: string
  slug: string
  type: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  hero_image_url: string | null
  current_funding: number | null
  target_budget: number | null
}

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

const toProducer = (value: unknown): ProjectProducer | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const nameDefault = asString(value.name_default)
  if (!id || !nameDefault) {
    return null
  }

  return {
    id,
    slug: toNullableString(value.slug),
    name_default: nameDefault,
    name_i18n: toLocalizedRecord(value.name_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    contact_website: toNullableString(value.contact_website),
    images: asStringArray(value.images),
  }
}

const toPublicProject = (value: unknown): PublicProject | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const slug = asString(value.slug)
  const nameDefault = asString(value.name_default)
  if (!id || !slug || !nameDefault) {
    return null
  }

  return {
    id,
    slug,
    is_mock: false,
    status: toNullableString(value.status),
    type: toNullableString(value.type),
    name_default: nameDefault,
    name_i18n: toLocalizedRecord(value.name_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    long_description_default: toNullableString(value.long_description_default),
    long_description_i18n: toLocalizedRecord(value.long_description_i18n),
    address_city: toNullableString(value.address_city),
    address_country_code: toNullableString(value.address_country_code),
    launch_date: toNullableString(value.launch_date),
    maturity_date: toNullableString(value.maturity_date),
    current_funding: toNullableNumber(value.current_funding),
    target_budget: toNullableNumber(value.target_budget),
    hero_image_url: toNullableString(value.hero_image_url),
    images: asStringArray(value.images),
    producer: toProducer(value.producer),
  }
}

const toPublicProjectFromMock = (
  project: ReturnType<typeof getMockProjects>[number],
): PublicProject => {
  return {
    id: project.id,
    slug: project.slug,
    is_mock: true,
    status: project.status,
    type: project.type,
    name_default: project.name_default,
    name_i18n: project.name_i18n || null,
    description_default: project.description_default,
    description_i18n: project.description_i18n || null,
    long_description_default: project.long_description_default,
    long_description_i18n: project.long_description_i18n || null,
    address_city: project.address_city,
    address_country_code: project.address_country_code,
    launch_date: project.launch_date,
    maturity_date: project.maturity_date,
    current_funding: project.current_funding,
    target_budget: project.target_budget,
    unit_price_eur: project.unit_price_eur || null,
    unit_label: project.unit_label || null,
    hero_image_url: project.hero_image_url,
    images: project.images || null,
    producer: {
      id: project.producer.id,
      slug: project.producer.slug,
      name_default: project.producer.name_default,
      name_i18n: project.producer.name_i18n || null,
      description_default: project.producer.description_default,
      description_i18n: project.producer.description_i18n || null,
      contact_website: project.producer.contact_website,
      images: project.producer.images || null,
    },
    species: project.species || null,
    challenges: project.challenges || null,
    producer_products: project.producer_products || null,
    expected_impact: project.expected_impact || null,
  }
}

const toRelatedProject = (value: unknown): RelatedProject | null => {
  if (!isRecord(value)) {
    return null
  }

  const id = asString(value.id)
  const slug = asString(value.slug)
  const nameDefault = asString(value.name_default)
  if (!id || !slug || !nameDefault) {
    return null
  }

  return {
    id,
    slug,
    type: toNullableString(value.type),
    name_default: nameDefault,
    name_i18n: toLocalizedRecord(value.name_i18n),
    description_default: toNullableString(value.description_default),
    description_i18n: toLocalizedRecord(value.description_i18n),
    hero_image_url: toNullableString(value.hero_image_url),
    current_funding: toNullableNumber(value.current_funding),
    target_budget: toNullableNumber(value.target_budget),
  }
}

export async function getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  const mockProject = getMockProjectBySlug(slug)
  if (mockProject) {
    return toPublicProjectFromMock(mockProject)
  }

  const supabase = await createClient()

  const { data } = await supabase
    .from('public_projects')
    .select(
      `
      *,
      producer:public_producers!producer_id(*)
    `,
    )
    .eq('slug', slug)
    .single()

  return toPublicProject(data)
}

type GetRelatedProjectsByTypeParams = {
  type: string | null
  excludeProjectId: string
  excludeProjectSlug?: string
  limit?: number
}

export async function getRelatedProjectsByType({
  type,
  excludeProjectId,
  excludeProjectSlug,
  limit = 3,
}: GetRelatedProjectsByTypeParams): Promise<RelatedProject[]> {
  if (!type) {
    return []
  }

  const mockRelatedProjects = getMockProjects()
    .filter((project) => project.type === type)
    .filter((project) => project.id !== excludeProjectId)
    .filter((project) => project.slug !== excludeProjectSlug)
    .map((project) => ({
      id: project.id,
      slug: project.slug,
      type: project.type,
      name_default: project.name_default,
      name_i18n: project.name_i18n || null,
      description_default: project.description_default,
      description_i18n: project.description_i18n || null,
      hero_image_url: project.hero_image_url,
      current_funding: project.current_funding,
      target_budget: project.target_budget,
    }))

  const supabase = await createClient()
  let projectsQuery = supabase
    .from('public_projects')
    .select(
      'id, slug, type, name_default, name_i18n, description_default, description_i18n, hero_image_url, current_funding, target_budget',
    )
    .eq('type', type)
    .in('status', ['active', 'funded', 'completed'])
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (isUuid(excludeProjectId)) {
    projectsQuery = projectsQuery.neq('id', excludeProjectId)
  }

  const { data, error } = await projectsQuery.limit(limit)

  if (error) {
    console.error('[project-detail] failed to fetch related projects', error)
    return mockRelatedProjects.slice(0, limit)
  }

  const databaseProjects = Array.isArray(data)
    ? data
        .map((entry) => toRelatedProject(entry))
        .filter((entry): entry is RelatedProject => entry !== null)
    : []

  const mockSlugs = new Set(mockRelatedProjects.map((project) => project.slug))
  const dedupedDatabaseProjects = databaseProjects.filter((project) => !mockSlugs.has(project.slug))

  return [...mockRelatedProjects, ...dedupedDatabaseProjects].slice(0, limit)
}

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
