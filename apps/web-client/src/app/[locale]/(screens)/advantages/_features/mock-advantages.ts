import {
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_MANAKARA_SLUG,
  MOCK_PRODUCT_SAVON_DOUX_SLUG,
  MOCK_PRODUCT_HUILE_VISAGE_SLUG,
  MOCK_PRODUCT_SHAMPOING_SLUG,
  MOCK_PRODUCT_HUILE_LECCINO_SLUG,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PRODUCER_HABEEBEE_SLUG,
  MOCK_PROJECT_MIELLERIES_MOBILE_SLUG,
} from '@/lib/mock/mock-ids'
import { getMockProducts } from '@/app/[locale]/(screens)/products/_features/mock-products'

export type AdvantageType = 'product' | 'partner_code' | 'live' | 'experience'
export type AdvantageStatus = 'available' | 'soon' | 'sold_out'
export type RedemptionMode = 'mtc_checkout' | 'partner_code' | 'reservation'

export type Advantage = {
  id: string
  type: AdvantageType
  title: string
  partner: string
  location?: string
  imageUrl: string
  priceCredits: number
  status: AdvantageStatus
  productSlug?: string
  description?: string
  whatYouGet?: string
  howItWorks?: string[]
  conditions?: string[]
  details?: string
  externalUrl?: string
  projectSlug?: string
  producerSlug?: string
  redemption: RedemptionMode
}

const PRODUCT_SLUGS = [
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_MANAKARA_SLUG,
  MOCK_PRODUCT_SAVON_DOUX_SLUG,
  MOCK_PRODUCT_HUILE_VISAGE_SLUG,
  MOCK_PRODUCT_SHAMPOING_SLUG,
  MOCK_PRODUCT_HUILE_LECCINO_SLUG,
]

export function getMockAdvantages(): Advantage[] {
  const products = getMockProducts()

  const productAdvantages: Advantage[] = PRODUCT_SLUGS.map((slug) =>
    products.find((p) => p.slug === slug),
  )
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
      id: `product-${p.slug || p.id}`,
      type: 'product' as const,
      title: p.name_default,
      partner: p.producer.name_default || 'Partenaire du vivant',
      imageUrl: p.image_url,
      priceCredits: p.price_points,
      status: p.stock_quantity > 0 ? ('available' as const) : ('sold_out' as const),
      productSlug: p.slug || p.id,
      redemption: 'mtc_checkout' as const,
    }))

  const partnerCodes: Advantage[] = [
    {
      id: 'code-ilanga-coffret-10',
      type: 'partner_code',
      title: '-10 % sur le coffret découverte',
      partner: 'Ilanga Nature',
      location: 'Manakara, Madagascar',
      imageUrl: '/images/projects/miellerie-manakara.jpg',
      priceCredits: 200,
      status: 'available',
      description:
        'Un code de réduction de -10 % valable sur le coffret découverte Ilanga Nature, disponible sur leur site.',
      whatYouGet:
        'Un code de réduction unique, à utiliser directement sur le site Ilanga Nature lors de ta commande du coffret découverte.',
      howItWorks: [
        'Utilise 200 Credits Impact pour débloquer le code.',
        "Reçois ton code partenaire unique affiché à l'écran.",
        'Copie le code et termine ta commande sur le site Ilanga Nature.',
      ],
      conditions: ['Valable une fois', 'Non cumulable', 'Selon disponibilité partenaire'],
      externalUrl: 'https://ilanga-nature.com',
      producerSlug: MOCK_PRODUCER_ILANGA_SLUG,
      redemption: 'partner_code',
    },
    {
      id: 'code-habeebee-livraison',
      type: 'partner_code',
      title: 'Livraison offerte dès 30 €',
      partner: 'Habeebee Belgique',
      location: 'Bruxelles, Belgique',
      imageUrl: '/images/products/savon-doux-habeebee.png',
      priceCredits: 150,
      status: 'available',
      description: 'La livraison offerte sur toute commande de 30 € ou plus sur la boutique Habeebee.',
      whatYouGet:
        "Un code de livraison gratuite, valable sur la boutique Habeebee dès 30 € d'achat.",
      howItWorks: [
        'Utilise 150 Credits Impact pour débloquer le code.',
        'Reçois ton code partenaire unique.',
        'Applique-le au moment de ta commande sur la boutique Habeebee.',
      ],
      conditions: ['Valable une fois', 'Commande minimum 30 €', 'Non cumulable'],
      externalUrl: 'https://habeebee.be',
      producerSlug: MOCK_PRODUCER_HABEEBEE_SLUG,
      redemption: 'partner_code',
    },
  ]

  const lives: Advantage[] = [
    {
      id: 'live-rucher-ilanga',
      type: 'live',
      title: 'Live depuis un rucher Ilanga',
      partner: 'Ilanga Nature',
      location: 'En ligne',
      imageUrl: '/images/projects/antsirabe-ruchers-1.jpg',
      priceCredits: 900,
      status: 'soon',
      details: '45 min · En ligne · Places limitées',
      description:
        "Un apiculteur Ilanga montre le rucher, la récolte et répond à tes questions en direct.",
      whatYouGet:
        "Un accès au live en ligne avec un apiculteur Ilanga. Tu recevras le lien de connexion 24h avant le live.",
      howItWorks: [
        'Réserve ta place avec 900 Credits Impact.',
        'Reçois le lien de connexion 24h avant le live.',
        "Rejoins le live et pose tes questions directement à l'apiculteur.",
      ],
      conditions: ['Places limitées', 'Non remboursable après confirmation', 'Lien envoyé par email'],
      projectSlug: MOCK_PROJECT_MIELLERIES_MOBILE_SLUG,
      producerSlug: MOCK_PRODUCER_ILANGA_SLUG,
      redemption: 'reservation',
    },
  ]

  const experiences: Advantage[] = [
    {
      id: 'experience-visite-habeebee',
      type: 'experience',
      title: 'Visite de rucher urbain Habeebee',
      partner: 'Habeebee Belgique',
      location: 'Bruxelles, Belgique',
      imageUrl: '/images/products/savon-doux-habeebee.png',
      priceCredits: 1200,
      status: 'soon',
      details: '2h · Bruxelles, Belgique · Groupe de 8 max',
      description:
        'Une visite guidée du rucher urbain Habeebee au cœur de Bruxelles, avec dégustation de miels.',
      whatYouGet:
        "Une place pour une visite guidée de 2h avec l'équipe Habeebee. Dégustation de miels incluse.",
      howItWorks: [
        'Réserve ta place avec 1 200 Credits Impact.',
        "L'équipe Habeebee te contacte pour choisir une date.",
        "Présente-toi au rucher à l'heure convenue.",
      ],
      conditions: ['Groupe de 8 max', 'Non remboursable', 'Selon disponibilité', 'Bruxelles uniquement'],
      producerSlug: MOCK_PRODUCER_HABEEBEE_SLUG,
      redemption: 'reservation',
    },
  ]

  return [...productAdvantages, ...partnerCodes, ...lives, ...experiences]
}

export function getMockAdvantageById(id: string): Advantage | undefined {
  return getMockAdvantages().find((a) => a.id === id)
}
