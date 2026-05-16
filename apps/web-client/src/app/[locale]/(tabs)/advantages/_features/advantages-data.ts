import {
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCT_SAVON_DOUX_ID,
  MOCK_PRODUCER_HABEEBEE_SLUG,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PROJECT_MIELLERIES_MOBILE_SLUG,
} from '@/lib/mock/mock-ids'
import { getMockProducts } from '@/app/[locale]/(screens)/products/_features/mock-products'

export type AdvantageProduct = {
  id: string
  title: string
  partner: string
  imageUrl: string
  href: string
  priceImpactCredits: number
  badge: string
  stockLabel: string
}

export type PartnerOffer = {
  id: string
  title: string
  partner: string
  description: string
  href: string
  costImpactCredits: number
  badge: string
}

export type CollectiveBonus = {
  title: string
  partner: string
  description: string
  progress: number
  href: string
  cta: string
}

export type AdvantageCategory = {
  id: string
  title: string
  description: string
  href: string
}

export type AdvantagePartner = {
  id: string
  name: string
  description: string
  href: string
  badge: string
}

export type AdvantagesData = {
  featuredProducts: AdvantageProduct[]
  partnerOffer: PartnerOffer
  collectiveBonus: CollectiveBonus
  categories: AdvantageCategory[]
  partners: AdvantagePartner[]
}

const FEATURED_PRODUCT_IDS = [
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCT_SAVON_DOUX_ID,
]

export function getAdvantagesData(): AdvantagesData {
  const products = getMockProducts()
  const featuredProducts = FEATURED_PRODUCT_IDS.map((id) => products.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .map((product) => ({
      id: product.id,
      title: product.name_default,
      partner: product.producer.name_default || 'Partenaire du vivant',
      imageUrl: product.image_url,
      href: `/products/${product.slug || product.id}`,
      priceImpactCredits: product.price_points,
      badge: product.category.name_default || 'Produit partenaire',
      stockLabel: product.stock_quantity > 12 ? 'Disponible' : 'Stock limité',
    }))

  return {
    featuredProducts,
    partnerOffer: {
      id: 'ilanga-coffret-10',
      title: '-10 % coffret Ilanga',
      partner: 'Ilanga Nature',
      description: 'Débloque un code partenaire simple, puis finalise la commande directement chez le partenaire.',
      href: `/producers/${MOCK_PRODUCER_ILANGA_SLUG}`,
      costImpactCredits: 200,
      badge: 'Code partenaire',
    },
    collectiveBonus: {
      title: 'Live rucher Ilanga',
      partner: 'Ilanga Nature',
      description: 'La communauté est proche de débloquer un live terrain et un carnet de récolte.',
      progress: 83,
      href: `/projects/${MOCK_PROJECT_MIELLERIES_MOBILE_SLUG}`,
      cta: 'Voir le projet lié',
    },
    categories: [
      {
        id: 'harvests',
        title: 'Récoltes partenaires',
        description: 'Miels, huiles et produits issus des partenaires suivis par Make The Change.',
        href: '/products?tag=Miel',
      },
      {
        id: 'partner-offers',
        title: 'Offres partenaires',
        description: 'Codes simples à débloquer, sans stock ni SAV géré dans l’application.',
        href: `/producers/${MOCK_PRODUCER_ILANGA_SLUG}`,
      },
      {
        id: 'experiences',
        title: 'Expériences & lives',
        description: 'Lives terrain, ateliers et contenus réservés pour mieux comprendre les projets.',
        href: `/projects/${MOCK_PROJECT_MIELLERIES_MOBILE_SLUG}`,
      },
    ],
    partners: [
      {
        id: 'ilanga',
        name: 'Ilanga Nature',
        description: 'Récoltes, miels et contenus terrain autour de la filière apicole à Madagascar.',
        href: `/producers/${MOCK_PRODUCER_ILANGA_SLUG}`,
        badge: 'Récoltes & lives',
      },
      {
        id: 'habeebee',
        name: 'Habeebee Belgique',
        description: 'Produits artisanaux, apiculture douce et expériences locales autour des abeilles.',
        href: `/producers/${MOCK_PRODUCER_HABEEBEE_SLUG}`,
        badge: 'Produits & ateliers',
      },
    ],
  }
}
