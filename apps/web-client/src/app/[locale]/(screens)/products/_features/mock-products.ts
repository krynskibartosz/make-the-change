import { HABEEBEE_PATHS } from '@/lib/media/habeebee'
import { ILANGA_PATHS } from '@/lib/media/ilanga'
import {
  MOCK_PRODUCER_HABEEBEE_ID,
  MOCK_PRODUCER_HABEEBEE_SLUG,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PRODUCT_BEE_SURPRISED_ID,
  MOCK_PRODUCT_BEE_SURPRISED_SLUG,
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_ILANGA_COLLECTION_ID,
  MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
  MOCK_PRODUCT_LITCHI_ID,
  MOCK_PRODUCT_LITCHI_SLUG,
  MOCK_PRODUCT_SAVON_DOUX_ID,
  MOCK_PRODUCT_SAVON_DOUX_SLUG,
  MOCK_PRODUCT_SHAMPOING_ID,
  MOCK_PRODUCT_SHAMPOING_SLUG,
} from '@/lib/mock/mock-ids'

export type MockProductProducer = {
  id: string
  slug: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string
  description_i18n?: Record<string, string> | null
  images: string[]
  visualAssets?: { portrait?: string }
  address_city: string
  address_country_code: string
  contact_website: string
}

export type MockProductCategory = {
  id: string
  name_default: string
  name_i18n?: Record<string, string> | null
}

export type ProductVariant = {
  id: string
  slug?: string | null
  format_label: string
  format_label_i18n?: Record<string, string> | null
  price_eur_equivalent: number
  stock_quantity: number
  image_url?: string | null
}

export type MockProductSeed = {
  id: string
  slug: string
  kind: 'bundle' | 'individual'
  name_default: string
  name_i18n?: Record<string, string> | null
  short_description_default?: string | null
  short_description_i18n?: Record<string, string> | null
  description_default: string
  description_i18n?: Record<string, string> | null
  producer_id: string
  category_id: string
  featured: boolean
  is_hero_product: boolean
  tags: string[]
  stock_quantity: number
  price_eur_equivalent: number
  fulfillment_method: 'ship'
  image_url: string
  images: string[]
  isTemporaryVisual: boolean
  eligibleDiscountIds?: string[]
  certifications: string[]
  created_at: string
  updated_at: string
  producer: MockProductProducer
  category: MockProductCategory
  variants?: ProductVariant[] | null
  composition?: { ingredients: string; origin: string } | null
  conservation?: string | null
  taste_profile?: string[] | null
  nutrition?: {
    energy_kj: number
    energy_kcal: number
    fat_g: number
    saturated_fat_g: number
    carbs_g: number
    sugars_g: number
    protein_g: number
    salt_g: number
  } | null
}

const ILANGA: MockProductProducer = {
  id: MOCK_PRODUCER_ILANGA_ID,
  slug: MOCK_PRODUCER_ILANGA_SLUG,
  name_default: 'Ilanga Nature',
  name_i18n: { fr: 'Ilanga Nature', en: 'Ilanga Nature' },
  description_default:
    'Partenaire belge valorisant des miels de Madagascar et le travail de producteurs apicoles.',
  images: ['/images/projects/miellerie-manakara.jpg'],
  visualAssets: { portrait: ILANGA_PATHS.identity.portrait },
  address_city: 'Mariembourg',
  address_country_code: 'Belgique',
  contact_website: 'https://www.ilanga-nature.com',
}

const HABEEBEE: MockProductProducer = {
  id: MOCK_PRODUCER_HABEEBEE_ID,
  slug: MOCK_PRODUCER_HABEEBEE_SLUG,
  name_default: 'Habeebee',
  name_i18n: { fr: 'Habeebee', en: 'Habeebee' },
  description_default: 'Partenaire belge proposant des soins et coffrets autour de la ruche.',
  images: ['/images/projects/habeebee.png'],
  visualAssets: { portrait: HABEEBEE_PATHS.identity.portrait },
  address_city: 'Bruxelles',
  address_country_code: 'Belgique',
  contact_website: 'https://habeebee.be',
}

const CATEGORIES = {
  bundle: {
    id: 'coffrets',
    name_default: 'Coffrets',
    name_i18n: { fr: 'Coffrets', en: 'Bundles' },
  },
  honey: { id: 'miels', name_default: 'Miels', name_i18n: { fr: 'Miels', en: 'Honey' } },
  care: { id: 'soins', name_default: 'Soins', name_i18n: { fr: 'Soins', en: 'Care' } },
} satisfies Record<string, MockProductCategory>

const common = {
  fulfillment_method: 'ship' as const,
  certifications: ['Produit partenaire'],
  created_at: '2026-05-20T08:00:00.000Z',
  updated_at: '2026-05-25T08:00:00.000Z',
}

const MOCK_PRODUCTS: MockProductSeed[] = [
  {
    ...common,
    id: MOCK_PRODUCT_ILANGA_COLLECTION_ID,
    slug: MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
    kind: 'bundle',
    name_default: 'Collection de 3 Miels 250g',
    name_i18n: { fr: 'Collection de 3 Miels 250g', en: 'Collection of 3 Honeys 250g' },
    short_description_default: 'Trois miels Ilanga dans un coffret cadeau sélectionné.',
    description_default:
      'Un coffret Ilanga réunissant trois pots de miel de 250 g. Offre partenaire officielle présentée pour un achat direct en euros.',
    producer_id: ILANGA.id,
    category_id: CATEGORIES.bundle.id,
    featured: true,
    is_hero_product: true,
    tags: ['Coffret', 'Miel', 'Ilanga'],
    stock_quantity: 30,
    price_eur_equivalent: 26.5,
    image_url: '/images/producteurs/illanga-nature/media/produits-miels-trio.jpg',
    images: ['/images/producteurs/illanga-nature/media/produits-miels-trio.jpg'],
    isTemporaryVisual: true,
    eligibleDiscountIds: ['code-ilanga-coffret-10'],
    producer: ILANGA,
    category: CATEGORIES.bundle,
  },
  {
    ...common,
    id: MOCK_PRODUCT_BEE_SURPRISED_ID,
    slug: MOCK_PRODUCT_BEE_SURPRISED_SLUG,
    kind: 'bundle',
    name_default: 'BEE SURPRISED',
    name_i18n: { fr: 'BEE SURPRISED', en: 'BEE SURPRISED' },
    short_description_default: 'Coffret cadeau Habeebee autour des soins de la ruche.',
    description_default:
      'Un coffret partenaire Habeebee sélectionné pour offrir des produits issus de leur univers apicole.',
    producer_id: HABEEBEE.id,
    category_id: CATEGORIES.bundle.id,
    featured: true,
    is_hero_product: true,
    tags: ['Coffret', 'Soins', 'Habeebee'],
    stock_quantity: 22,
    price_eur_equivalent: 29,
    image_url: '/images/producteurs/habeebee/media/hero.jpg',
    images: ['/images/producteurs/habeebee/media/hero.jpg'],
    isTemporaryVisual: true,
    producer: HABEEBEE,
    category: CATEGORIES.bundle,
  },
  {
    ...common,
    id: MOCK_PRODUCT_EUCALYPTUS_ID,
    slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
    kind: 'individual',
    name_default: 'Miel d’Eucalyptus 250g',
    name_i18n: { fr: 'Miel d’Eucalyptus 250g', en: 'Eucalyptus Honey 250g' },
    short_description_default: 'Miel Ilanga aux notes aromatiques et boisées.',
    description_default:
      'Miel d’Eucalyptus de Madagascar conditionné en pot de 250 g et proposé par Ilanga Nature.',
    producer_id: ILANGA.id,
    category_id: CATEGORIES.honey.id,
    featured: false,
    is_hero_product: false,
    tags: ['Miel', 'Eucalyptus', 'Ilanga'],
    stock_quantity: 120,
    price_eur_equivalent: 7,
    image_url: '/images/products/miel-eucalyptus-ilanga.png',
    images: ['/images/products/miel-eucalyptus-ilanga.png'],
    isTemporaryVisual: true,
    producer: ILANGA,
    category: CATEGORIES.honey,
    composition: { ingredients: '100% miel d’Eucalyptus', origin: 'Madagascar' },
    taste_profile: ['Ambré', 'Boisé', 'Aromatique'],
  },
  {
    ...common,
    id: MOCK_PRODUCT_LITCHI_ID,
    slug: MOCK_PRODUCT_LITCHI_SLUG,
    kind: 'individual',
    name_default: 'Miel de Litchi 250g',
    name_i18n: { fr: 'Miel de Litchi 250g', en: 'Lychee Honey 250g' },
    short_description_default: 'Miel Ilanga floral et délicat.',
    description_default: 'Miel de Litchi en pot de 250 g, proposé par Ilanga Nature.',
    producer_id: ILANGA.id,
    category_id: CATEGORIES.honey.id,
    featured: false,
    is_hero_product: false,
    tags: ['Miel', 'Litchi', 'Ilanga'],
    stock_quantity: 90,
    price_eur_equivalent: 7,
    image_url: '/images/producteurs/illanga-nature/media/produits-miels-trio.jpg',
    images: ['/images/producteurs/illanga-nature/media/produits-miels-trio.jpg'],
    isTemporaryVisual: true,
    producer: ILANGA,
    category: CATEGORIES.honey,
    composition: { ingredients: '100% miel de Litchi', origin: 'Madagascar' },
    taste_profile: ['Floral', 'Doux'],
  },
  {
    ...common,
    id: MOCK_PRODUCT_SAVON_DOUX_ID,
    slug: MOCK_PRODUCT_SAVON_DOUX_SLUG,
    kind: 'individual',
    name_default: 'Savon DOUX',
    name_i18n: { fr: 'Savon DOUX', en: 'DOUX Soap' },
    short_description_default: 'Savon Habeebee doux pour le corps.',
    description_default: 'Savon DOUX vendu et expédié par Habeebee depuis la Belgique.',
    producer_id: HABEEBEE.id,
    category_id: CATEGORIES.care.id,
    featured: false,
    is_hero_product: false,
    tags: ['Soin', 'Savon', 'Habeebee'],
    stock_quantity: 80,
    price_eur_equivalent: 7.1,
    image_url: '/images/products/savon-doux-habeebee.png',
    images: ['/images/products/savon-doux-habeebee.png'],
    isTemporaryVisual: true,
    producer: HABEEBEE,
    category: CATEGORIES.care,
  },
  {
    ...common,
    id: MOCK_PRODUCT_SHAMPOING_ID,
    slug: MOCK_PRODUCT_SHAMPOING_SLUG,
    kind: 'individual',
    name_default: 'Shampoing solide',
    name_i18n: { fr: 'Shampoing solide', en: 'Solid Shampoo' },
    short_description_default: 'Shampoing solide moussant Habeebee.',
    description_default: 'Shampoing solide vendu et expédié par Habeebee depuis la Belgique.',
    producer_id: HABEEBEE.id,
    category_id: CATEGORIES.care.id,
    featured: false,
    is_hero_product: false,
    tags: ['Soin', 'Shampoing', 'Habeebee'],
    stock_quantity: 65,
    price_eur_equivalent: 11,
    image_url: '/images/products/shampoing-solide-habeebee.png',
    images: ['/images/products/shampoing-solide-habeebee.png'],
    isTemporaryVisual: true,
    producer: HABEEBEE,
    category: CATEGORIES.care,
  },
]

export const getMockProducts = (): MockProductSeed[] => MOCK_PRODUCTS

export const getMockProductById = (id: string): MockProductSeed | null =>
  MOCK_PRODUCTS.find((product) => product.id === id) ?? null

export const getMockProductByIdentifier = (identifier: string): MockProductSeed | null =>
  MOCK_PRODUCTS.find((product) => product.id === identifier || product.slug === identifier) ?? null

export const getMockProductVariantById = (
  id: string,
): { product: MockProductSeed; variant: ProductVariant } | null => {
  for (const product of MOCK_PRODUCTS) {
    const variant = product.variants?.find((entry) => entry.id === id)
    if (variant) return { product, variant }
  }
  return null
}
