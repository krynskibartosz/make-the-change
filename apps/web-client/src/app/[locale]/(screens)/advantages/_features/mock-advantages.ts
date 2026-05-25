import { HABEEBEE_PATHS } from '@/lib/media/habeebee'
import { ILANGA_PATHS } from '@/lib/media/ilanga'
import {
  MOCK_PRODUCER_HABEEBEE_SLUG,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
} from '@/lib/mock/mock-ids'

export type AdvantageType = 'discount' | 'experience'
export type AdvantageStatus = 'available' | 'coming_soon'
export type RedemptionMode = 'mtc_checkout_discount' | 'reservation_request'

export type Advantage = {
  id: string
  type: AdvantageType
  title: string
  partner: string
  location: string
  imageUrl: string
  imageBadge?: string
  isTemporaryVisual: boolean
  priceCredits: number
  status: AdvantageStatus
  productSlug?: string
  description: string
  whatYouGet: string
  howItWorks: string[]
  conditions: string[]
  details?: string
  producerSlug: string
  redemption: RedemptionMode
}

const ADVANTAGES: Advantage[] = [
  {
    id: 'code-ilanga-coffret-10',
    type: 'discount',
    title: 'Collection de 3 Miels Ilanga',
    partner: 'Ilanga Nature',
    location: 'Mariembourg, Belgique',
    imageUrl: ILANGA_PATHS.media.advantageCollection3MielsReduction,
    imageBadge: '-10 %',
    isTemporaryVisual: true,
    priceCredits: 200,
    status: 'available',
    productSlug: MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
    description:
      'Débloque une réduction partenaire utilisable directement dans le checkout Make the Change.',
    whatYouGet:
      'Une réduction de 10 % appliquée automatiquement au coffret Ilanga éligible dans ton panier.',
    howItWorks: [
      'Confirme l’utilisation de 200 Crédits Impact.',
      'Ajoute la Collection de 3 Miels Ilanga à ton panier.',
      'La réduction est appliquée avant la validation de la commande.',
    ],
    conditions: ['Valable une fois', 'Sur le coffret éligible uniquement', 'Non cumulable'],
    producerSlug: MOCK_PRODUCER_ILANGA_SLUG,
    redemption: 'mtc_checkout_discount',
  },
  {
    id: 'experience-visite-habeebee',
    type: 'experience',
    title: 'Visite de rucher urbain Habeebee',
    partner: 'Habeebee',
    location: 'Bruxelles, Belgique',
    imageUrl: HABEEBEE_PATHS.media.advantageVisiteRucherUrbain,
    isTemporaryVisual: true,
    priceCredits: 1200,
    status: 'coming_soon',
    details: '2h · Bruxelles · Disponibilités à confirmer',
    description: 'Une future visite guidée du rucher urbain Habeebee avec l’équipe partenaire.',
    whatYouGet:
      'Une demande de réservation, activée ultérieurement lorsque les créneaux seront confirmés.',
    howItWorks: [
      'Les dates seront publiées avant toute réservation.',
      'Aucun Crédit Impact ne sera débité sans créneau confirmé.',
    ],
    conditions: [
      'Bientôt disponible',
      'Selon disponibilités partenaire',
      'Aucun débit actuellement',
    ],
    producerSlug: MOCK_PRODUCER_HABEEBEE_SLUG,
    redemption: 'reservation_request',
  },
]

export const getMockAdvantages = (): Advantage[] => ADVANTAGES

export function filterAdvantagesByType(
  advantages: Advantage[],
  type: string | undefined,
): Advantage[] {
  if (type === 'discount' || type === 'experience') {
    return advantages.filter((advantage) => advantage.type === type)
  }
  return advantages
}

export function getMockAdvantageById(id: string): Advantage | undefined {
  return ADVANTAGES.find((advantage) => advantage.id === id)
}
