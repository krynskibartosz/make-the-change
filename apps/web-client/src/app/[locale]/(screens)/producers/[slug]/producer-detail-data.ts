/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Data layer pour la page détail producteur.
 *
 * Pattern : thin page (metadata + data fetch) + UI component pure
 * Source V1 : mocks structurés uniquement, tant que l'UX mobile est en validation.
 */

import {
  type EditorialIdentity,
  getMockProducerBySlug,
  type ImpactSummary,
  type MissionPillar,
  type MockProducerSpeciesCard,
  type PartnerCatalogOverview,
  type ProducerLocation,
  type ProofCard,
  type SectionOrder,
  type StoryBlock,
  type VisualAssets,
} from '@/app/[locale]/(site)/producers/_features/mock-producers'

// ── Types exportés ──

export type ProducerProduct = {
  id: string
  slug: string | null
  name_default: string | null
  image_url: string | null
  price_eur_equivalent: number | null
}

export type ProducerProject = {
  id: string
  slug: string | null
  name_default: string | null
  hero_image_url: string | null
  status: string | null
  type: string | null
  current_funding: number | null
  address_city: string | null
  address_country_code: string | null
}

export type ProducerSpecies = MockProducerSpeciesCard

export type PublicProducer = {
  id: string
  slug: string | null
  name_default: string
  description_default: string
  address_city: string | null
  address_country_code: string | null
  type: string | null
  images: string[]
  contact_website: string | null
  products: ProducerProduct[]
  projects: ProducerProject[]
  species: ProducerSpecies[]

  // ── Champs éditoriaux ──
  tagline?: string
  locations?: ProducerLocation
  partnerType?: string
  missionPillars?: MissionPillar[]
  proofCards?: ProofCard[]
  storyBlocks?: StoryBlock[]
  impactSummary?: ImpactSummary

  // ── Champs enrichis (Phase 1) ──
  editorialIdentity?: EditorialIdentity
  visualAssets?: VisualAssets
  sectionOrder?: SectionOrder

  // ── Gamme partenaire (informatif — pas le catalogue app) ──
  partnerCatalogOverview?: PartnerCatalogOverview
}

// ── Données prototype ──

function mapMockToPublicProducer(
  mockProducer: NonNullable<ReturnType<typeof getMockProducerBySlug>>,
): PublicProducer {
  return {
    id: mockProducer.id,
    slug: mockProducer.slug,
    name_default: mockProducer.name_default,
    description_default: mockProducer.description_default,
    address_city: mockProducer.address_city,
    address_country_code: mockProducer.address_country_code,
    type: mockProducer.type,
    images: mockProducer.images,
    contact_website: mockProducer.contact_website,
    products: mockProducer.products,
    projects: mockProducer.projects,
    species: mockProducer.species,
    tagline: mockProducer.tagline,
    locations: mockProducer.locations,
    partnerType: mockProducer.partnerType,
    missionPillars: mockProducer.missionPillars,
    proofCards: mockProducer.proofCards,
    storyBlocks: mockProducer.storyBlocks,
    impactSummary: mockProducer.impactSummary,
    editorialIdentity: mockProducer.editorialIdentity,
    visualAssets: mockProducer.visualAssets,
    sectionOrder: mockProducer.sectionOrder,
    partnerCatalogOverview: mockProducer.partnerCatalogOverview,
  }
}

export async function getCachedPublicProducerBySlug(slug: string): Promise<PublicProducer | null> {
  const mockProducer = getMockProducerBySlug(slug)
  return mockProducer ? mapMockToPublicProducer(mockProducer) : null
}

export async function getPublicProducerBySlug(slug: string): Promise<PublicProducer | null> {
  const mockProducer = getMockProducerBySlug(slug)
  return mockProducer ? mapMockToPublicProducer(mockProducer) : null
}
