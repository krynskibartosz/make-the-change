/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Data layer pour la page détail producteur.
 * 
 * Pattern : thin page (metadata + data fetch) + UI component pure
 * Source : mocks (getMockProducerBySlug) = source de vérité
 * Legacy : Supabase (public_producers, public_products, public_projects) = fallback
 * 
 * À terme : remplacer Supabase par les mocks structurés en DB V2
 */

import { unstable_cache } from 'next/cache'
import { isMockDataSource } from '@/lib/mock/data-source'
import { createStaticClient } from '@/lib/supabase/static'
import { asNumber, asString, asStringArray, isRecord } from '@/lib/type-guards'
import {
  getMockProducerBySlug,
  type MockProducerListProduct,
  type MockProducerListProject,
  type MockProducerSpeciesCard,
  type MissionPillar,
  type ProofCard,
  type StoryBlock,
  type ImpactSummary,
  type ProducerLocation,
  type EditorialIdentity,
  type VisualAssets,
  type SectionOrder,
  type PartnerCatalogOverview,
} from '@/app/[locale]/(site)/producers/_features/mock-producers'

// ── Types exportés ──

export type ProducerProduct = {
  id: string
  slug: string | null
  name_default: string | null
  image_url: string | null
  price_points: number | null
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

// ── Type guards ──

const toProducerProduct = (value: unknown): ProducerProduct | null => {
  if (!isRecord(value)) return null
  const id = asString(value.id)
  if (!id) return null

  return {
    id,
    slug: asString(value.slug) || null,
    name_default: asString(value.name_default) || null,
    image_url: asString(value.image_url) || null,
    price_points: typeof value.price_points === 'number' ? value.price_points : null,
  }
}

const toProducerProject = (value: unknown): ProducerProject | null => {
  if (!isRecord(value)) return null
  const id = asString(value.id)
  if (!id) return null

  return {
    id,
    slug: asString(value.slug) || null,
    name_default: asString(value.name_default) || null,
    hero_image_url: asString(value.hero_image_url) || null,
    status: asString(value.status) || null,
    type: asString(value.type) || null,
    current_funding: typeof value.current_funding === 'number' ? value.current_funding : null,
    address_city: asString(value.address_city) || null,
    address_country_code: asString(value.address_country_code) || null,
  }
}

// ── Data fetching ──

export async function getPublicProducerBySlug(slug: string): Promise<PublicProducer | null> {
  // [ACTUEL_CODE] [SOURCE_PROTOTYPE] : Mocks = source de vérité
  const mockProducer = getMockProducerBySlug(slug)
  if (mockProducer) {
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
      // ── Champs éditoriaux ──
      tagline: mockProducer.tagline,
      locations: mockProducer.locations,
      partnerType: mockProducer.partnerType,
      missionPillars: mockProducer.missionPillars,
      proofCards: mockProducer.proofCards,
      storyBlocks: mockProducer.storyBlocks,
      impactSummary: mockProducer.impactSummary,
      
      // ── Champs enrichis (Phase 1) ──
      editorialIdentity: mockProducer.editorialIdentity,
      visualAssets: mockProducer.visualAssets,
      sectionOrder: mockProducer.sectionOrder,
      
      // ── Gamme partenaire (informatif — pas le catalogue app) ──
      partnerCatalogOverview: mockProducer.partnerCatalogOverview,
    }
  }

  // [ACTUEL_CODE] [LEGACY] [A_NE_PAS_TOUCHER] : Fallback Supabase V0
  if (isMockDataSource) {
    return null
  }

  const supabase = createStaticClient()

  const { data: producerRaw } = await supabase
    .from('public_producers')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (!producerRaw) {
    return null
  }

  const producerId = asString(producerRaw.id)
  if (!producerId) {
    return null
  }

  const name = asString(producerRaw.name_default)
  const description = asString(producerRaw.description_default)
  if (!name || !description) {
    return null
  }

  // Récupération des produits liés
  const { data: productsRaw } = await supabase
    .from('public_products')
    .select('id, slug, name_default, image_url, price_points')
    .eq('producer_id', producerId)
    .order('featured', { ascending: false })
    .limit(6)

  // Récupération des projets liés
  const { data: projectsRaw } = await supabase
    .from('public_projects')
    .select('id, slug, name_default, hero_image_url, status, type, current_funding, address_city, address_country_code')
    .eq('producer_id', producerId)
    .limit(4)

  // Agrégation des espèces depuis les projets
  // [TODO_V2] : À enrichir quand la relation espèce sera consolidée en DB
  const species: ProducerSpecies[] = []
  if (Array.isArray(projectsRaw)) {
    for (const project of projectsRaw) {
      if (!isRecord(project)) continue
      const projectId = asString(project.id)
      if (!projectId) continue

      const { data: speciesRaw } = await supabase
        .from('project_species')
        .select('species:species_id(id, name_default, image_url)')
        .eq('project_id', projectId)

      if (Array.isArray(speciesRaw)) {
        for (const entry of speciesRaw) {
          if (!isRecord(entry) || !isRecord(entry.species)) continue
          const s = entry.species
          const speciesId = asString(s.id)
          const speciesName = asString(s.name_default)
          if (speciesId && speciesName) {
            species.push({
              id: speciesId,
              name: speciesName,
              image: asString(s.image_url) || '/images/diorama-chouette.png',
              unlocked: true, // [TODO_V2] : Déterminer selon les contributions réelles
            })
          }
        }
      }
    }
  }

  // Deduplication des espèces
  const uniqueSpecies = species.filter(
    (entry, index, self) => index === self.findIndex((s) => s.id === entry.id),
  )

  const products = Array.isArray(productsRaw)
    ? productsRaw.map(toProducerProduct).filter((p): p is ProducerProduct => p !== null)
    : []

  const projects = Array.isArray(projectsRaw)
    ? projectsRaw.map(toProducerProject).filter((p): p is ProducerProject => p !== null)
    : []

  return {
    id: producerId,
    slug: asString(producerRaw.slug) || null,
    name_default: name,
    description_default: description,
    address_city: asString(producerRaw.address_city) || null,
    address_country_code: asString(producerRaw.address_country_code) || null,
    type: asString(producerRaw.type) || null,
    images: asStringArray(producerRaw.images),
    contact_website: asString(producerRaw.contact_website) || null,
    products,
    projects,
    species: uniqueSpecies,
  }
}

// ── Cache wrapper ──

export const getCachedPublicProducerBySlug = unstable_cache(
  getPublicProducerBySlug,
  ['public-producer-detail'],
  { revalidate: 3600, tags: ['producers-list', 'projects-list', 'products-list'] },
)
