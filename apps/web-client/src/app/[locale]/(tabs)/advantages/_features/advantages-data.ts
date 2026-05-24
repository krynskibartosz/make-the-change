import {
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCT_SAVON_DOUX_ID,
  MOCK_PRODUCER_HABEEBEE_SLUG,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PROJECT_MIELLERIES_MOBILE_SLUG,
} from '@/lib/mock/mock-ids'
import { getMockProducts } from '@/app/[locale]/(screens)/products/_features/mock-products'
import { ILANGA_PATHS } from '@/lib/media/ilanga'
import { HABEEBEE_PATHS } from '@/lib/media/habeebee'

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
  priceImpactCredits: number
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
      imageUrl: p.image_url ?? '',
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
      href: '/advantages/code-ilanga-coffret-10',
      priceImpactCredits: 200,
    },
    collectiveBonus: {
      title: 'Dans les ruchers Ilanga',
      partner: 'Ilanga Nature',
      description:
        'La prochaine étape débloquera le carnet terrain et la vidéo documentaire des ruchers.',
      imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80',
      currentStep: 2,
      totalSteps: 3,
      nextStepLabel: 'Carnet terrain + vidéo documentaire',
      href: `/projects/${MOCK_PROJECT_MIELLERIES_MOBILE_SLUG}`,
      cta: 'Voir le projet lié',
    },
    categories: [
      {
        id: 'harvests',
        title: 'Récoltes partenaires',
        description: 'Miels, huiles et produits sélectionnés auprès de nos partenaires.',
        href: '/advantages/catalog?type=product',
      },
      {
        id: 'partner-offers',
        title: 'Offres partenaires',
        description: 'Débloque un code, puis utilise-le directement chez le partenaire.',
        href: '/advantages/catalog?type=partner_code',
      },
      {
        id: 'experiences',
        title: 'Contenus & expériences',
        description: 'Carnets terrain, visites et ateliers pour vivre les projets autrement.',
        href: '/advantages/catalog?type=content',
      },
    ],
    partners: [
      {
        id: 'ilanga',
        name: 'Ilanga Nature',
        description: 'Récoltes, miels et contenus terrain autour de la filière apicole à Madagascar.',
        location: 'Manakara, Madagascar',
        imageUrl: ILANGA_PATHS.identity.portrait,
        href: `/producers/${MOCK_PRODUCER_ILANGA_SLUG}`,
      },
      {
        id: 'habeebee',
        name: 'Habeebee',
        description: 'Produits artisanaux, apiculture douce et expériences locales autour des abeilles.',
        location: 'Bruxelles, Belgique',
        imageUrl: HABEEBEE_PATHS.identity.portrait,
        href: `/producers/${MOCK_PRODUCER_HABEEBEE_SLUG}`,
      },
    ],
  }
}
