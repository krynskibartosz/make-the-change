import {
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCT_MANAKARA_SLUG,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PRODUCER_ILANGA_SLUG,
} from '@/lib/mock/mock-ids'

type MockProductProducer = {
  id: string
  slug: string | null
  name_default: string | null
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  images: string[] | null
  address_city: string | null
  address_country_code: string | null
  contact_website: string | null
}

type MockProductCategory = {
  id: string
  name_default: string | null
  name_i18n?: Record<string, string> | null
}

export type MockProductSeed = {
  id: string
  slug: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  short_description_default?: string | null
  short_description_i18n?: Record<string, string> | null
  description_default: string
  description_i18n?: Record<string, string> | null
  producer_id: string | null
  category_id: string | null
  featured: boolean
  is_hero_product: boolean
  tags: string[]
  stock_quantity: number
  price_points: number
  price_eur_equivalent: number
  fulfillment_method: 'ship' | 'pickup' | 'digital' | 'experience'
  image_url: string
  images: string[]
  certifications: string[]
  created_at: string
  updated_at: string
  producer: MockProductProducer
  category: MockProductCategory
}

const MOCK_PRODUCTS: MockProductSeed[] = [
  {
    id: MOCK_PRODUCT_EUCALYPTUS_ID,
    slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
    name_default: 'Miel d’Eucalyptus',
    name_i18n: {
      fr: 'Miel d’Eucalyptus',
      en: 'Eucalyptus Honey',
    },
    short_description_default:
      'Miel artisanal de Madagascar, ambré, boisé et aromatique, issu des forêts d’eucalyptus.',
    short_description_i18n: {
      fr: 'Miel artisanal de Madagascar, ambré, boisé et aromatique, issu des forêts d’eucalyptus.',
      en: 'Artisanal Madagascar honey from eucalyptus forests, with amber color and woody aromatic notes.',
    },
    description_default:
      "Issu des forêts d’eucalyptus de Madagascar, ce miel se distingue par sa robe ambrée et son goût intense, légèrement boisé avec des notes fraîches et aromatiques.\n\nRécolté de manière artisanale, il reflète la richesse des écosystèmes locaux et le travail des apiculteurs engagés. Sa texture onctueuse et son caractère unique en font un miel à la fois authentique et puissant.\n\nAu-delà de ses qualités gustatives, ce miel soutient une apiculture durable et participe à la préservation du vivant grâce à la pollinisation.\n\nInformations techniques : 140 ml (différents formats) • 5,50 € à +\nExpédition : 2-3 jours ouvrables",
    description_i18n: {
      fr: "Issu des forêts d’eucalyptus de Madagascar, ce miel se distingue par sa robe ambrée et son goût intense, légèrement boisé avec des notes fraîches et aromatiques.\n\nRécolté de manière artisanale, il reflète la richesse des écosystèmes locaux et le travail des apiculteurs engagés. Sa texture onctueuse et son caractère unique en font un miel à la fois authentique et puissant.\n\nAu-delà de ses qualités gustatives, ce miel soutient une apiculture durable et participe à la préservation du vivant grâce à la pollinisation.\n\nInformations techniques : 140 ml (différents formats) • 5,50 € à +\nExpédition : 2-3 jours ouvrables",
      en: 'Harvested in Madagascar eucalyptus forests, this honey has an amber robe and a powerful, slightly woody aromatic profile. It supports sustainable local beekeeping and biodiversity preservation through pollination.',
    },
    producer_id: MOCK_PRODUCER_ILANGA_ID,
    category_id: 'mock-category-honey',
    featured: true,
    is_hero_product: true,
    tags: ['Miel', 'Ruche', 'Abeilles', 'Abeille noire'],
    stock_quantity: 120,
    price_points: 550,
    price_eur_equivalent: 5.5,
    fulfillment_method: 'ship',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
    images: ['/images/products/miel-eucalyptus-ilanga.jpg'],
    certifications: ['Artisanal', 'Origine Madagascar'],
    created_at: '2026-04-11T08:00:00.000Z',
    updated_at: '2026-04-17T08:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_ILANGA_ID,
      slug: MOCK_PRODUCER_ILANGA_SLUG,
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: 'Coopérative engagée dans une apiculture durable à Madagascar.',
      description_i18n: {
        fr: 'Coopérative engagée dans une apiculture durable à Madagascar.',
        en: 'Cooperative committed to sustainable beekeeping in Madagascar.',
      },
      images: ['/images/logo-icon-bee.png'],
      address_city: 'Manakara',
      address_country_code: 'Madagascar',
      contact_website: 'https://ilanga.nature',
    },
    category: {
      id: 'mock-category-honey',
      name_default: 'Miel',
      name_i18n: {
        fr: 'Miel',
        en: 'Honey',
      },
    },
  },
  {
    id: MOCK_PRODUCT_MANAKARA_ID,
    slug: MOCK_PRODUCT_MANAKARA_SLUG,
    name_default: 'Miel de Manakara',
    name_i18n: {
      fr: 'Miel de Manakara',
      en: 'Manakara Honey',
    },
    short_description_default:
      'Un miel floral plus rond, issu des ruchers partenaires de Manakara et conditionne localement.',
    short_description_i18n: {
      fr: 'Un miel floral plus rond, issu des ruchers partenaires de Manakara et conditionne localement.',
      en: 'A rounder floral honey sourced from Manakara partner apiaries and packed locally.',
    },
    description_default:
      "Ce miel de Manakara prolonge l'impact du projet local en valorisant la filiere complete : collecte, extraction et mise en pot sur place.\n\nSon profil est plus floral, avec une texture souple et une longueur douce. Chaque commande soutient directement les producteurs relies a la miellerie.",
    description_i18n: {
      fr: "Ce miel de Manakara prolonge l'impact du projet local en valorisant la filiere complete : collecte, extraction et mise en pot sur place.\n\nSon profil est plus floral, avec une texture souple et une longueur douce. Chaque commande soutient directement les producteurs relies a la miellerie.",
      en: 'This Manakara honey extends the local impact by supporting the full value chain: harvesting, extraction, and local packaging.',
    },
    producer_id: MOCK_PRODUCER_ILANGA_ID,
    category_id: 'mock-category-honey',
    featured: true,
    is_hero_product: false,
    tags: ['Miel', 'Manakara', 'Abeilles', 'Madagascar'],
    stock_quantity: 64,
    price_points: 650,
    price_eur_equivalent: 6.5,
    fulfillment_method: 'ship',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
    images: ['/images/products/miel-eucalyptus-ilanga.jpg'],
    certifications: ['Artisanal', 'Impact local'],
    created_at: '2026-04-13T08:00:00.000Z',
    updated_at: '2026-04-18T08:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_ILANGA_ID,
      slug: MOCK_PRODUCER_ILANGA_SLUG,
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: 'Cooperative engagee dans une apiculture durable a Madagascar.',
      description_i18n: {
        fr: 'Cooperative engagee dans une apiculture durable a Madagascar.',
        en: 'Cooperative committed to sustainable beekeeping in Madagascar.',
      },
      images: ['/images/logo-icon-bee.png'],
      address_city: 'Manakara',
      address_country_code: 'Madagascar',
      contact_website: 'https://ilanga.nature',
    },
    category: {
      id: 'mock-category-honey',
      name_default: 'Miel',
      name_i18n: {
        fr: 'Miel',
        en: 'Honey',
      },
    },
  },
]

export const getMockProducts = (): MockProductSeed[] => MOCK_PRODUCTS

export const getMockProductById = (id: string): MockProductSeed | null =>
  MOCK_PRODUCTS.find((product) => product.id === id) || null

export const getMockProductByIdentifier = (identifier: string): MockProductSeed | null =>
  MOCK_PRODUCTS.find(
    (product) => product.id === identifier || (product.slug !== null && product.slug === identifier),
  ) || null
