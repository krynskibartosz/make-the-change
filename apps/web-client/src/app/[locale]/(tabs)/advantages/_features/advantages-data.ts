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
}

export type PartnerOffer = {
  id: string
  title: string
  partner: string
  imageUrl: string
  href: string
  costImpactCredits: number
}

export type CollectiveBonus = {
  title: string
  partner: string
  description: string
  imageUrl: string
  currentStep: number
  totalSteps: number
  nextStepLabel: string
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
  location: string
  imageUrl: string
  href: string
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
  const featuredProducts = FEATURED_PRODUCT_IDS.map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
      id: p.id,
      title: p.name_default,
      partner: p.producer.name_default || 'Partenaire du vivant',
      imageUrl: p.image_url,
      href: `/products/${p.slug || p.id}`,
      priceImpactCredits: p.price_points,
    }))

  return {
    featuredProducts,
    partnerOffer: {
      id: 'ilanga-coffret-10',
      title: '-10 % sur le coffret découverte',
      partner: 'Ilanga Nature',
      imageUrl: '/images/projects/miellerie-manakara.jpg',
      href: `/producers/${MOCK_PRODUCER_ILANGA_SLUG}`,
      costImpactCredits: 200,
    },
    collectiveBonus: {
      title: 'Live rucher Ilanga bientôt débloqué',
      partner: 'Ilanga Nature',
      description:
        'La communauté est proche de débloquer un live depuis le rucher et un carnet de récolte terrain.',
      imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
      currentStep: 2,
      totalSteps: 3,
      nextStepLabel: 'Live terrain',
      href: `/projects/${MOCK_PROJECT_MIELLERIES_MOBILE_SLUG}`,
      cta: 'Voir le projet lié',
    },
    categories: [
      {
        id: 'harvests',
        title: 'Récoltes partenaires',
        description: 'Miels, huiles et produits sélectionnés auprès de nos partenaires.',
        href: '/products?tag=Miel',
      },
      {
        id: 'partner-offers',
        title: 'Offres partenaires',
        description: 'Débloque un code, puis utilise-le directement chez le partenaire.',
        href: `/producers/${MOCK_PRODUCER_ILANGA_SLUG}`,
      },
      {
        id: 'experiences',
        title: 'Expériences & lives',
        description: 'Lives, visites et ateliers pour découvrir les projets autrement.',
        href: `/projects/${MOCK_PROJECT_MIELLERIES_MOBILE_SLUG}`,
      },
    ],
    partners: [
      {
        id: 'ilanga',
        name: 'Ilanga Nature',
        description: 'Récoltes, miels et contenus terrain autour de la filière apicole à Madagascar.',
        location: 'Manakara, Madagascar',
        imageUrl: '/images/projects/miellerie-manakara.jpg',
        href: `/producers/${MOCK_PRODUCER_ILANGA_SLUG}`,
      },
      {
        id: 'habeebee',
        name: 'Habeebee Belgique',
        description: 'Produits artisanaux, apiculture douce et expériences locales autour des abeilles.',
        location: 'Bruxelles, Belgique',
        imageUrl: '/images/products/savon-doux-habeebee.png',
        href: `/producers/${MOCK_PRODUCER_HABEEBEE_SLUG}`,
      },
    ],
  }
}
