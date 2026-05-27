import { HABEEBEE_PATHS } from '@/lib/media/habeebee'
import { ILANGA_PATHS } from '@/lib/media/ilanga'
import {
  MOCK_PRODUCER_HABEEBEE_ID,
  MOCK_PRODUCER_HABEEBEE_SLUG,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PRODUCT_BEE_SURPRISED_ID,
  MOCK_PRODUCT_BEE_SURPRISED_SLUG,
  MOCK_PRODUCT_EUCALYPTUS_140G_ID,
  MOCK_PRODUCT_EUCALYPTUS_140G_SLUG,
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_ILANGA_COLLECTION_ID,
  MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
  MOCK_PRODUCT_LITCHI_140G_ID,
  MOCK_PRODUCT_LITCHI_140G_SLUG,
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

export type ProductNutrition = {
  energy_kj: number
  energy_kcal: number
  fat_g: number
  saturated_fat_g: number
  carbs_g: number
  sugars_g: number
  protein_g: number
  salt_g: number
}

export type ProductInformation = {
  sourceUrl: string
  sourceLabel: string
  verifiedAt: string
  formatLabel: string
  ingredients?: string
  origin?: string
  packaging?: string
  certification?: string
  conservation?: string
  sensoryNotes?: string[]
  nutrition?: ProductNutrition
  contents?: string[]
  useInstructions?: string
  precautions?: string[]
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
  productInformation: ProductInformation
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
      'Un coffret Ilanga réunissant trois pots de miel de 250 g pour découvrir plusieurs nuances aromatiques de Madagascar ou offrir une sélection prête à partager.',
    producer_id: ILANGA.id,
    category_id: CATEGORIES.bundle.id,
    featured: true,
    is_hero_product: true,
    tags: ['Coffret', 'Miel', 'Ilanga'],
    stock_quantity: 30,
    price_eur_equivalent: 26.5,
    image_url: ILANGA_PATHS.media.shopCollection3Miels,
    images: [ILANGA_PATHS.media.shopCollection3Miels],
    isTemporaryVisual: true,
    eligibleDiscountIds: ['code-ilanga-coffret-10'],
    producer: ILANGA,
    category: CATEGORIES.bundle,
    productInformation: {
      sourceUrl:
        'https://www.ilanga-nature.com/en/shop/5903902-the-3-honeys-collection-250g-organic-1511',
      sourceLabel: 'Ilanga Nature',
      verifiedAt: '2026-05-26',
      formatLabel: '3 pots de 250 g',
      origin: 'Madagascar',
      contents: ['Trois miels Ilanga en pots de 250 g'],
    },
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
      'Un coffret cadeau Habeebee composé de quatre formats miniatures pour découvrir leurs soins autour de la cire d’abeille et de la propolis.',
    producer_id: HABEEBEE.id,
    category_id: CATEGORIES.bundle.id,
    featured: true,
    is_hero_product: true,
    tags: ['Coffret', 'Soins', 'Habeebee'],
    stock_quantity: 22,
    price_eur_equivalent: 29,
    image_url: HABEEBEE_PATHS.media.shopBeeSurprised,
    images: [HABEEBEE_PATHS.media.shopBeeSurprised],
    isTemporaryVisual: true,
    producer: HABEEBEE,
    category: CATEGORIES.bundle,
    productInformation: {
      sourceUrl: 'https://habeebee.be/products/cadeau-eco-responsable',
      sourceLabel: 'Habeebee',
      verifiedAt: '2026-05-26',
      formatLabel: '4 miniatures',
      contents: [
        'Mini Visage Waouw',
        'P’tit Beezou',
        'Mini Savon Tonic',
        'Mini Shampoing L’abeille s’en mêle',
      ],
      precautions: [
        'Ce coffret contient des produits à la propolis ou aux huiles essentielles : consulte les ingrédients avant utilisation.',
      ],
    },
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
      'Un miel ambré de Madagascar au caractère boisé et aromatique, avec une note légèrement mentholée. Il accompagne boissons chaudes, marinades et desserts.',
    producer_id: ILANGA.id,
    category_id: CATEGORIES.honey.id,
    featured: false,
    is_hero_product: false,
    tags: ['Miel', 'Eucalyptus', 'Ilanga'],
    stock_quantity: 120,
    price_eur_equivalent: 7,
    image_url: ILANGA_PATHS.media.shopMielEucalyptus,
    images: [ILANGA_PATHS.media.shopMielEucalyptus],
    isTemporaryVisual: true,
    producer: ILANGA,
    category: CATEGORIES.honey,
    variants: [
      {
        id: MOCK_PRODUCT_EUCALYPTUS_140G_ID,
        slug: MOCK_PRODUCT_EUCALYPTUS_140G_SLUG,
        format_label: '140 g',
        price_eur_equivalent: 5.5,
        stock_quantity: 45,
        image_url: ILANGA_PATHS.media.shopMielEucalyptus,
      },
      {
        id: MOCK_PRODUCT_EUCALYPTUS_ID,
        slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        format_label: '250 g',
        price_eur_equivalent: 7,
        stock_quantity: 120,
        image_url: ILANGA_PATHS.media.shopMielEucalyptus,
      },
    ],
    productInformation: {
      sourceUrl: 'https://www.ilanga-nature.com/shop/eucalyptus-honey-3345',
      sourceLabel: 'Ilanga Nature',
      verifiedAt: '2026-05-26',
      formatLabel: '250 g',
      ingredients: '100% miel d’Eucalyptus',
      origin: 'Madagascar',
      packaging: 'Bocal en verre',
      certification: 'Non certifié biologique',
      conservation: 'À conserver à l’abri de l’humidité et de la chaleur, à température ambiante.',
      sensoryNotes: ['Boisé', 'Aromatique', 'Légèrement mentholé'],
      nutrition: {
        energy_kj: 1374,
        energy_kcal: 328,
        fat_g: 0.22,
        saturated_fat_g: 0,
        carbs_g: 81,
        sugars_g: 74,
        protein_g: 0.8,
        salt_g: 0,
      },
    },
  },
  {
    ...common,
    id: MOCK_PRODUCT_LITCHI_ID,
    slug: MOCK_PRODUCT_LITCHI_SLUG,
    kind: 'individual',
    name_default: 'Miel de Litchi 250g',
    name_i18n: { fr: 'Miel de Litchi 250g', en: 'Lychee Honey 250g' },
    short_description_default: 'Miel Ilanga floral et délicat.',
    description_default:
      'Un miel de Madagascar doux et floral, aux notes délicatement fruitées. Sa texture et son parfum en font un miel agréable pour les tartines, boissons et desserts.',
    producer_id: ILANGA.id,
    category_id: CATEGORIES.honey.id,
    featured: false,
    is_hero_product: false,
    tags: ['Miel', 'Litchi', 'Ilanga'],
    stock_quantity: 90,
    price_eur_equivalent: 7,
    image_url: ILANGA_PATHS.media.shopMielLitchi,
    images: [ILANGA_PATHS.media.shopMielLitchi],
    isTemporaryVisual: true,
    producer: ILANGA,
    category: CATEGORIES.honey,
    variants: [
      {
        id: MOCK_PRODUCT_LITCHI_140G_ID,
        slug: MOCK_PRODUCT_LITCHI_140G_SLUG,
        format_label: '140 g',
        price_eur_equivalent: 5.5,
        stock_quantity: 35,
        image_url: ILANGA_PATHS.media.shopMielLitchi,
      },
      {
        id: MOCK_PRODUCT_LITCHI_ID,
        slug: MOCK_PRODUCT_LITCHI_SLUG,
        format_label: '250 g',
        price_eur_equivalent: 7,
        stock_quantity: 90,
        image_url: ILANGA_PATHS.media.shopMielLitchi,
      },
    ],
    productInformation: {
      sourceUrl: 'https://www.ilanga-nature.com/shop/miel-de-litchi-3341',
      sourceLabel: 'Ilanga Nature',
      verifiedAt: '2026-05-26',
      formatLabel: '250 g',
      ingredients: '100% miel de Litchi',
      origin: 'Madagascar',
      packaging: 'Bocal en verre',
      certification: 'Non certifié biologique',
      conservation: 'À conserver à l’abri de l’humidité et de la chaleur, à température ambiante.',
      sensoryNotes: ['Floral', 'Doux', 'Fruité'],
      nutrition: {
        energy_kj: 1393,
        energy_kcal: 332,
        fat_g: 0.33,
        saturated_fat_g: 0,
        carbs_g: 81,
        sugars_g: 70,
        protein_g: 0.8,
        salt_g: 0,
      },
    },
  },
  {
    ...common,
    id: MOCK_PRODUCT_SAVON_DOUX_ID,
    slug: MOCK_PRODUCT_SAVON_DOUX_SLUG,
    kind: 'individual',
    name_default: 'Savon DOUX',
    name_i18n: { fr: 'Savon DOUX', en: 'DOUX Soap' },
    short_description_default: 'Savon Habeebee doux pour le corps.',
    description_default:
      'Savon surgras saponifié à froid et pressé à la main par Habeebee. Sans parfum, il associe cire d’abeille et huiles végétales pour une toilette douce.',
    producer_id: HABEEBEE.id,
    category_id: CATEGORIES.care.id,
    featured: false,
    is_hero_product: false,
    tags: ['Soin', 'Savon', 'Habeebee'],
    stock_quantity: 80,
    price_eur_equivalent: 7.1,
    image_url: HABEEBEE_PATHS.media.shopSavonDoux,
    images: [HABEEBEE_PATHS.media.shopSavonDoux],
    isTemporaryVisual: true,
    producer: HABEEBEE,
    category: CATEGORIES.care,
    productInformation: {
      sourceUrl: 'https://habeebee.be/products/savon-doux',
      sourceLabel: 'Habeebee',
      verifiedAt: '2026-05-26',
      formatLabel: '100 g',
      ingredients:
        'Olea Europaea Fruit Oil*, Aqua, Cocos Nucifera Oil*, Butyrospermum Parkii Butter*, Sodium Hydroxide, Cera Alba*. *Issu de l’agriculture biologique.',
      packaging: 'Boîte en carton',
      certification: 'Saponifié à froid, surgras 8%',
      precautions: ['Sans parfum.'],
    },
  },
  {
    ...common,
    id: MOCK_PRODUCT_SHAMPOING_ID,
    slug: MOCK_PRODUCT_SHAMPOING_SLUG,
    kind: 'individual',
    name_default: 'Shampoing solide',
    name_i18n: { fr: 'Shampoing solide', en: 'Solid Shampoo' },
    short_description_default: 'Shampoing solide moussant Habeebee.',
    description_default:
      'Shampoing solide Habeebee à la cire d’abeille et au rhassoul. Il mousse facilement et se rince sans résidu, pour un usage quotidien plus compact.',
    producer_id: HABEEBEE.id,
    category_id: CATEGORIES.care.id,
    featured: false,
    is_hero_product: false,
    tags: ['Soin', 'Shampoing', 'Habeebee'],
    stock_quantity: 65,
    price_eur_equivalent: 11,
    image_url: HABEEBEE_PATHS.media.shopShampoingSolide,
    images: [HABEEBEE_PATHS.media.shopShampoingSolide],
    isTemporaryVisual: true,
    producer: HABEEBEE,
    category: CATEGORIES.care,
    productInformation: {
      sourceUrl: 'https://habeebee.be/products/shampoing-solide-moussant-sans-residus',
      sourceLabel: 'Habeebee',
      verifiedAt: '2026-05-26',
      formatLabel: '75 g',
      ingredients:
        'Sodium Cocoyl Isethionate, Hydrogenated Vegetable Oil, Aqua, Polyglyceryl-4 Laurate, Glycerin, Moroccan Lava Clay, Lavandula Hybrida Clone Grosso Oil, Cera Alba, Cocos Nucifera Oil*, Ricinus Communis Seed Oil*, Tetrasodium Glutamate Diacetate, Inulin, Panthenol, Tocopherol, Helianthus Annuus Seed Oil.',
      packaging: 'Boîte en carton',
      useInstructions:
        'Faire mousser entre les mains ou appliquer sur cheveux mouillés, puis rincer.',
      conservation: 'Laisser sécher sur un porte-savon sec entre chaque utilisation.',
      precautions: ['Contient de l’huile essentielle de lavande.'],
    },
  },
]

export const getMockProducts = (): MockProductSeed[] => MOCK_PRODUCTS

export const getMockProductVariantById = (
  id: string,
): { product: MockProductSeed; variant: ProductVariant } | null => {
  for (const product of MOCK_PRODUCTS) {
    const variant = product.variants?.find((entry) => entry.id === id)
    if (variant) return { product, variant }
  }
  return null
}

function materializeVariant(product: MockProductSeed, variant: ProductVariant): MockProductSeed {
  const replaceFormatSuffix = (name: string) =>
    name.replace(/\s*250\s?g$/i, ` ${variant.format_label}`)

  return {
    ...product,
    id: variant.id,
    slug: variant.slug ?? product.slug,
    name_default: replaceFormatSuffix(product.name_default),
    name_i18n: product.name_i18n
      ? Object.fromEntries(
          Object.entries(product.name_i18n).map(([locale, name]) => [
            locale,
            replaceFormatSuffix(name),
          ]),
        )
      : null,
    price_eur_equivalent: variant.price_eur_equivalent,
    stock_quantity: variant.stock_quantity,
    image_url: variant.image_url ?? product.image_url,
    productInformation: {
      ...product.productInformation,
      formatLabel: variant.format_label,
    },
  }
}

export const getMockProductById = (id: string): MockProductSeed | null => {
  const product = MOCK_PRODUCTS.find((entry) => entry.id === id)
  if (product) return product
  const variantResult = getMockProductVariantById(id)
  return variantResult ? materializeVariant(variantResult.product, variantResult.variant) : null
}

export const getMockProductByIdentifier = (identifier: string): MockProductSeed | null => {
  const product = MOCK_PRODUCTS.find(
    (entry) => entry.id === identifier || entry.slug === identifier,
  )
  if (product) return product

  for (const entry of MOCK_PRODUCTS) {
    const variant = entry.variants?.find(
      (option) => option.id === identifier || option.slug === identifier,
    )
    if (variant) return materializeVariant(entry, variant)
  }
  return null
}
