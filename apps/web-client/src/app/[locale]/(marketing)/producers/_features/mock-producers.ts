import { getMockProducts } from '../../products/_features/mock-products'
import { getMockProjects } from '../../projects/_features/mock-projects'

export type MockProducerListProduct = {
  id: string
  slug: string | null
  name_default: string
  image_url: string | null
  price_points: number | null
}

export type MockProducerListProject = {
  id: string
  slug: string | null
  name_default: string
  hero_image_url: string | null
  status: string | null
  type: string | null
}

export type MockProducerSpeciesCard = {
  id: string
  name: string
  image: string
  unlocked: boolean
}

export type MockProducerSeed = {
  id: string
  slug: string
  name_default: string
  description_default: string
  address_city: string | null
  address_country_code: string | null
  type: string
  images: string[]
  certifications: string[]
  contact_website: string | null
  projects: MockProducerListProject[]
  products: MockProducerListProduct[]
  species: MockProducerSpeciesCard[]
}

const dedupeById = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>()

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false
    }

    seen.add(item.id)
    return true
  })
}

export const getMockProducers = (): MockProducerSeed[] => {
  const mockProducts = getMockProducts()
  const mockProjects = getMockProjects()

  const producerIds = new Set<string>()
  for (const product of mockProducts) {
    if (product.producer.id) {
      producerIds.add(product.producer.id)
    }
  }

  for (const project of mockProjects) {
    if (project.producer.id) {
      producerIds.add(project.producer.id)
    }
  }

  return Array.from(producerIds).map((producerId) => {
    const producerProjects = mockProjects.filter((project) => project.producer.id === producerId)
    const producerProducts = mockProducts.filter((product) => product.producer.id === producerId)
    const producerMeta = producerProducts[0]?.producer ?? producerProjects[0]?.producer
    const addressCity =
      producerProducts[0]?.producer.address_city ?? producerProjects[0]?.address_city ?? null
    const addressCountryCode =
      producerProducts[0]?.producer.address_country_code ??
      producerProjects[0]?.address_country_code ??
      null

    const species = dedupeById(
      producerProjects.flatMap((project) =>
        (project.species || []).map((species) => ({
          id: species.id,
          name: species.name,
          image: species.icon || '/images/diorama-chouette.png',
          unlocked: true,
        })),
      ),
    )

    const products = producerProducts.map((product) => ({
      id: product.id,
      slug: product.slug,
      name_default: product.name_default,
      image_url: product.image_url,
      price_points: product.price_points,
    }))

    const projects = producerProjects.map((project) => ({
      id: project.id,
      slug: project.slug,
      name_default: project.name_default,
      hero_image_url: project.hero_image_url,
      status: project.status,
      type: project.type,
    }))

    return {
      id: producerId,
      slug: producerMeta?.slug || producerId,
      name_default: producerMeta?.name_default || 'Producteur partenaire',
      description_default:
        producerMeta?.description_default ||
        "Partenaire local engage dans des projets a impact positif et des productions artisanales.",
      address_city: addressCity,
      address_country_code: addressCountryCode,
      type: 'partenaire',
      images: producerMeta?.images || [],
      certifications: dedupeById(
        producerProducts.flatMap((product, index) =>
          (product.certifications || []).map((certification) => ({
            id: `${index}-${certification}`,
            value: certification,
          })),
        ),
      ).map((entry) => entry.value),
      contact_website: producerMeta?.contact_website || null,
      projects,
      products,
      species,
    }
  })
}

export const getMockProducerBySlug = (slug: string): MockProducerSeed | null =>
  getMockProducers().find((producer) => producer.slug === slug) || null
