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

export type SlotStatus = 'available' | 'almost_full' | 'full'

export type ExperienceSlot = {
  id: string
  dateLabel: string
  timeLabel: string
  remainingSpots: number
  totalSpots: number
  status: SlotStatus
}

export type Advantage = {
  id: string
  type: AdvantageType
  title: string
  partner: string
  partnerImageUrl: string
  location: string
  address?: string
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
  slots?: ExperienceSlot[]
}

const ADVANTAGES: Advantage[] = [
  {
    id: 'code-ilanga-coffret-10',
    type: 'discount',
    title: 'Collection de 3 Miels Ilanga',
    partner: 'Ilanga Nature',
    partnerImageUrl: ILANGA_PATHS.identity.portrait,
    location: 'Mariembourg, Belgique',
    imageUrl: ILANGA_PATHS.media.advantageCollection3MielsReduction,
    imageBadge: '-10 % à débloquer',
    isTemporaryVisual: true,
    priceCredits: 200,
    status: 'available',
    productSlug: MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
    description:
      "Débloque une réduction partenaire utilisable directement dans le checkout Make the Change.",
    whatYouGet:
      "Une réduction de 10 % appliquée automatiquement au coffret Ilanga éligible dans ton panier.",
    howItWorks: [
      "Confirme l’utilisation de 200 Crédits Impact.",
      "Ajoute la Collection de 3 Miels Ilanga à ton panier.",
      "La réduction est appliquée avant la validation de la commande.",
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
    partnerImageUrl: HABEEBEE_PATHS.identity.portrait,
    location: 'Bruxelles, Belgique',
    address: 'Rue Vanderstichelen 24, 1080 Molenbeek-Saint-Jean',
    imageUrl: HABEEBEE_PATHS.media.advantageVisiteRucherUrbain,
    isTemporaryVisual: true,
    priceCredits: 1200,
    status: 'available',
    details: '2h · Bruxelles',
    description: "Une visite guidée du rucher urbain Habeebee avec l’équipe partenaire.",
    whatYouGet:
      "Une visite guidée de 2h avec l’équipe Habeebee : découverte du rucher urbain, explication de la filière apicole et dégustation de miels.",
    howItWorks: [
      'Choisis un créneau disponible ci-dessous.',
      "Confirme l’utilisation de 1 200 Crédits Impact.",
      'Reçois ta confirmation de réservation par email.',
    ],
    conditions: [
      "Annulation possible jusqu’à 48h avant la visite",
      '1 réservation par compte',
      'Selon disponibilités partenaire',
    ],
    producerSlug: MOCK_PRODUCER_HABEEBEE_SLUG,
    redemption: 'reservation_request',
    slots: [
      {
        id: 'slot-habeebee-2025-06-14',
        dateLabel: 'Samedi 14 juin 2025',
        timeLabel: '10h00 – 12h00',
        remainingSpots: 6,
        totalSpots: 8,
        status: 'available',
      },
      {
        id: 'slot-habeebee-2025-06-21',
        dateLabel: 'Samedi 21 juin 2025',
        timeLabel: '10h00 – 12h00',
        remainingSpots: 1,
        totalSpots: 8,
        status: 'almost_full',
      },
      {
        id: 'slot-habeebee-2025-07-05',
        dateLabel: 'Samedi 5 juillet 2025',
        timeLabel: '14h00 – 16h00',
        remainingSpots: 8,
        totalSpots: 8,
        status: 'available',
      },
    ],
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

export function filterAdvantagesByProducerSlug(
  advantages: Advantage[],
  producerSlug: string | null | undefined,
): Advantage[] {
  if (!producerSlug) return []
  return advantages.filter((advantage) => advantage.producerSlug === producerSlug)
}

export function getMockAdvantageById(id: string): Advantage | undefined {
  return ADVANTAGES.find((advantage) => advantage.id === id)
}

export function getMockSlotById(advantageId: string, slotId: string): ExperienceSlot | undefined {
  const advantage = getMockAdvantageById(advantageId)
  return advantage?.slots?.find((slot) => slot.id === slotId)
}
