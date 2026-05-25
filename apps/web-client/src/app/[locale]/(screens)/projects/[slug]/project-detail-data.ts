import { unstable_cache } from 'next/cache'
import type {
  DonationOption,
  ProducerProduct,
  ProjectChallenge,
  ProjectImpact,
  ProjectSpecies,
} from '@/app/[locale]/(screens)/projects/_types/project'
import {
  getMockProjectBySlug,
  getMockProjects,
} from '@/app/[locale]/(tabs)/projects/_features/mock-projects'
import { isContributionType } from './_utils/project-type-guards'
import { getMockProjectUpdates } from '@/lib/mock/mock-project-updates'
import type { ProjectUpdate } from '@/types/project'

export type ProjectProducer = {
  id: string
  slug: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  contact_website: string | null
  images: string[] | null
  visualAssets?: { portrait?: string }
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
  latitude: number | null
  longitude: number | null
  launch_date: string | null
  maturity_date: string | null
  current_funding: number | null
  target_budget: number | null
  funding_progress?: number | null
  unit_price_eur?: number | null
  unit_label?: string | null
  hero_image_url: string | null
  images: string[] | null
  producer: ProjectProducer | null
  species?: ProjectSpecies[] | null
  challenges?: ProjectChallenge[] | null
  producer_products?: ProducerProduct[] | null
  donation_options?: DonationOption[] | null
  is_donation_project?: boolean
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

async function _getPublicProjectBySlug(slug: string): Promise<PublicProject | null> {
  const mockProject = getMockProjectBySlug(slug)
  return mockProject ? toPublicProjectFromMock(mockProject) : null
}

type GetRelatedProjectsByTypeParams = {
  type: string | null
  excludeProjectId: string
  excludeProjectSlug?: string
  limit?: number
}

async function _getRelatedProjectsByType({
  type,
  excludeProjectId,
  excludeProjectSlug,
  limit = 3,
}: GetRelatedProjectsByTypeParams): Promise<RelatedProject[]> {
  if (!type) {
    return []
  }

  return getMockProjects()
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
    .slice(0, limit)
}

function toPublicProjectFromMock(
  project: ReturnType<typeof getMockProjects>[number],
): PublicProject {
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
    latitude: project.latitude ?? null,
    longitude: project.longitude ?? null,
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
      visualAssets: project.producer.visualAssets,
    },
    species: project.species || null,
    challenges: project.challenges || null,
    producer_products: project.producer_products || null,
    donation_options: project.donation_options || null,
    is_donation_project: isContributionType(project.type),
    expected_impact: project.expected_impact || null,
  }
}

export const getPublicProjectBySlug = unstable_cache(
  _getPublicProjectBySlug,
  ['project-detail'],
  { revalidate: 3600, tags: ['projects-list'] },
)

export const getRelatedProjectsByType = unstable_cache(
  _getRelatedProjectsByType,
  ['related-projects'],
  { revalidate: 3600, tags: ['projects-list'] },
)

export function getProjectUpdates(slug: string): ProjectUpdate[] {
  return getMockProjectUpdates(slug)
}
