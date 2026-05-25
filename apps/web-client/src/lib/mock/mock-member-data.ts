import { getCurrentIsoDate } from '@/lib/date-utils'
import {
  MOCK_EXISTING_VIEWER_ID,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_ILANGA_COLLECTION_ID,
  MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
  MOCK_PRODUCT_LITCHI_ID,
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_MANAKARA_SLUG,
} from '@/lib/mock/mock-ids'
import type { SpeciesContext } from '@/types/species'

/**
 * [R2] Aliases sémantiques pour P0-3
 * Ces constantes permettent d'utiliser la nomenclature cible dans le code
 * sans modifier les données legacy.
 */

/** Alias sémantique pour les prix en Crédits Impact (legacy: price_points) */
export const IMPACT_CREDITS_PRICE = 'price_points' as const

/** Alias sémantique pour le montant en Crédits Impact (legacy: amount_points) */
export const IMPACT_CREDITS_AMOUNT = 'amount_points' as const

export type MockSupportRecord = {
  id: string
  amount_eur_equivalent: number
  amount_points: number
  returns_received_points: number
  status: 'active' | 'completed' | 'pending'
  created_at: string
  project: {
    name_default: string
    slug: string
    status: string
    cover_image_url: string | null
  }
}

export type MockOrderItemRecord = {
  id: string
  quantity: number
  unit_price_points: number
  total_price_points: number
  product_snapshot: {
    name: string
    priceEuros: number
    pricePoints: number
    cover_image_url?: string | null
  }
  product: {
    id: string
    name_default: string
    slug: string
  } | null
}

export type MockOrderRecord = {
  id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'paid'
  subtotal_points: number
  shipping_cost_points: number
  tax_points: number
  total_points: number
  subtotal_euros: number
  shipping_cost_euros: number
  tax_euros: number
  total_euros: number
  created_at: string
  tracking_number: string | null
  carrier: string | null
  shipping_address: {
    firstName: string
    lastName: string
    street: string
    postalCode: string
    city: string
    country: string
  }
  items: MockOrderItemRecord[]
}

export type MockSubscriptionRecord = {
  id: string
  plan_type: string
  status: 'active' | 'paused' | 'cancelled'
  monthly_seeds_allocation: number
  current_period_end: string | null
  next_billing_date: string | null
  monthly_price: number
  annual_price: number
}

export type MockPointsTransactionRecord = {
  id: string
  label: string
  delta: number
  impactDelta: number
  createdAt: string
}

export type MockProducerMessageRecord = {
  id: string
  subject: string
  message: string
  status: 'pending' | 'read' | 'replied' | 'archived'
  created_at: string
  producer: {
    name: string
    slug: string
  } | null
}

const BASE_SHIPPING_ADDRESS = {
  firstName: 'Bartosz',
  lastName: 'Krynski',
  street: 'Rue du Nectar 12',
  postalCode: '1000',
  city: 'Bruxelles',
  country: 'Belgique',
}

const EXISTING_VIEWER_SUPPORTS: MockSupportRecord[] = [
  {
    id: 'mock-support-antsirabe',
    amount_eur_equivalent: 395, // 1 ruche × 395 € — source: PDF cadrage MTC
    amount_points: 395,
    returns_received_points: 48,
    status: 'active',
    created_at: '2026-04-14T09:20:00.000Z',
    project: {
      name_default: "Ruchers d'apiculteurs indépendants à Antsirabe",
      slug: MOCK_PROJECT_ANTSIRABE_SLUG,
      status: 'active',
      cover_image_url: '/images/projects/antsirabe-ruchers-1.jpg',
    },
  },
  {
    id: 'mock-support-manakara',
    amount_eur_equivalent: 780,
    amount_points: 780,
    returns_received_points: 96,
    status: 'completed',
    created_at: '2026-03-28T16:45:00.000Z',
    project: {
      name_default: 'Miellerie de Manakara',
      slug: MOCK_PROJECT_MANAKARA_SLUG,
      status: 'active',
      cover_image_url: '/images/projects/miellerie-manakara.jpg',
    },
  },
]

const EXISTING_VIEWER_ORDERS: MockOrderRecord[] = [
  {
    id: 'mock-order-eucalyptus-01',
    status: 'delivered',
    subtotal_points: 0,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 0,
    subtotal_euros: 7,
    shipping_cost_euros: 6.5,
    tax_euros: 0,
    total_euros: 13.5,
    created_at: '2026-04-11T12:30:00.000Z',
    tracking_number: 'MTC-BE-248901',
    carrier: 'Bpost',
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-eucalyptus-01',
        quantity: 1,
        unit_price_points: 0,
        total_price_points: 0,
        product_snapshot: {
          name: "Miel d'Eucalyptus 250g",
          priceEuros: 7,
          pricePoints: 0,
          cover_image_url: '/images/products/miel-eucalyptus-ilanga.png',
        },
        product: {
          id: MOCK_PRODUCT_EUCALYPTUS_ID,
          name_default: "Miel d'Eucalyptus 250g",
          slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        },
      },
    ],
  },
  {
    id: 'mock-order-collection-ilanga-01',
    status: 'delivered',
    subtotal_points: 0,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 0,
    subtotal_euros: 26.5,
    shipping_cost_euros: 6.5,
    tax_euros: 0,
    total_euros: 33,
    created_at: '2026-03-28T14:15:00.000Z',
    tracking_number: 'MTC-BE-247856',
    carrier: 'Bpost',
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-collection-ilanga-01',
        quantity: 1,
        unit_price_points: 0,
        total_price_points: 0,
        product_snapshot: {
          name: 'Collection de 3 Miels 250g',
          priceEuros: 26.5,
          pricePoints: 0,
          cover_image_url: '/images/products/miel-eucalyptus-ilanga.png',
        },
        product: {
          id: MOCK_PRODUCT_ILANGA_COLLECTION_ID,
          name_default: 'Collection de 3 Miels 250g',
          slug: MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
        },
      },
    ],
  },
  {
    id: 'mock-order-eucalyptus-02',
    status: 'processing',
    subtotal_points: 0,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 0,
    subtotal_euros: 14,
    shipping_cost_euros: 6.5,
    tax_euros: 0,
    total_euros: 20.5,
    created_at: '2026-04-16T08:10:00.000Z',
    tracking_number: null,
    carrier: null,
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-eucalyptus-02',
        quantity: 2,
        unit_price_points: 0,
        total_price_points: 0,
        product_snapshot: {
          name: "Miel d'Eucalyptus 250g",
          priceEuros: 7,
          pricePoints: 0,
          cover_image_url: '/images/products/miel-eucalyptus-ilanga.png',
        },
        product: {
          id: MOCK_PRODUCT_EUCALYPTUS_ID,
          name_default: "Miel d'Eucalyptus 250g",
          slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        },
      },
    ],
  },
  {
    id: 'mock-order-litchi-01',
    status: 'paid',
    subtotal_points: 0,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 0,
    subtotal_euros: 7,
    shipping_cost_euros: 6.5,
    tax_euros: 0,
    total_euros: 13.5,
    created_at: '2026-04-18T16:45:00.000Z',
    tracking_number: null,
    carrier: null,
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-litchi-01',
        quantity: 1,
        unit_price_points: 0,
        total_price_points: 0,
        product_snapshot: {
          name: 'Miel de Litchi 250g',
          priceEuros: 7,
          pricePoints: 0,
          cover_image_url: '/images/products/miel-eucalyptus-ilanga.png',
        },
        product: {
          id: MOCK_PRODUCT_LITCHI_ID,
          name_default: 'Miel de Litchi 250g',
          slug: 'miel-litchi-ilanga',
        },
      },
    ],
  },
  {
    id: 'mock-order-eucalyptus-euro-01',
    status: 'delivered',
    subtotal_points: 0,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 0,
    subtotal_euros: 7,
    shipping_cost_euros: 6.5,
    tax_euros: 0,
    total_euros: 13.5,
    created_at: '2026-04-05T10:15:00.000Z',
    tracking_number: 'MTC-BE-247855',
    carrier: 'Bpost',
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-eucalyptus-euro-01',
        quantity: 1,
        unit_price_points: 0,
        total_price_points: 0,
        product_snapshot: {
          name: "Miel d'Eucalyptus 250g",
          priceEuros: 7,
          pricePoints: 0,
          cover_image_url: '/images/products/miel-eucalyptus-ilanga.png',
        },
        product: {
          id: MOCK_PRODUCT_EUCALYPTUS_ID,
          name_default: "Miel d'Eucalyptus 250g",
          slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        },
      },
    ],
  },
  {
    id: 'mock-order-collection-euro-01',
    status: 'processing',
    subtotal_points: 0,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 0,
    subtotal_euros: 53,
    shipping_cost_euros: 6.5,
    tax_euros: 0,
    total_euros: 59.5,
    created_at: '2026-04-19T14:30:00.000Z',
    tracking_number: null,
    carrier: null,
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-collection-euro-01',
        quantity: 2,
        unit_price_points: 0,
        total_price_points: 0,
        product_snapshot: {
          name: 'Collection de 3 Miels 250g',
          priceEuros: 26.5,
          pricePoints: 0,
          cover_image_url: '/images/products/miel-eucalyptus-ilanga.png',
        },
        product: {
          id: MOCK_PRODUCT_ILANGA_COLLECTION_ID,
          name_default: 'Collection de 3 Miels 250g',
          slug: MOCK_PRODUCT_ILANGA_COLLECTION_SLUG,
        },
      },
    ],
  },
]

const EXISTING_VIEWER_SUBSCRIPTION: MockSubscriptionRecord = {
  id: 'mock-subscription-pollinisateur-plus',
  plan_type: 'Pollinisateur+',
  status: 'active',
  monthly_seeds_allocation: 1200,
  current_period_end: '2026-05-02T00:00:00.000Z',
  next_billing_date: '2026-05-03T00:00:00.000Z',
  monthly_price: 12,
  annual_price: 120,
}

const EXISTING_VIEWER_POINTS_TRANSACTIONS: MockPointsTransactionRecord[] = [
  {
    id: 'mock-points-welcome-bonus',
    label: 'Bonus de bienvenue',
    delta: 250,
    impactDelta: 0, // Graines — pas de Crédits Impact sans soutien producteur
    createdAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'mock-points-allocation-february',
    label: 'Allocation mensuelle Pollinisateur+',
    delta: 1200,
    impactDelta: 0, // Graines d'abonnement — pas de Crédits Impact
    createdAt: '2026-02-03T08:00:00.000Z',
  },
  {
    id: 'mock-points-allocation-march',
    label: 'Allocation mensuelle Pollinisateur+',
    delta: 1200,
    impactDelta: 0,
    createdAt: '2026-03-03T08:00:00.000Z',
  },
  {
    id: 'mock-points-support-manakara',
    label: 'Contribution projet Manakara',
    delta: -780,
    impactDelta: 780, // Crédits Impact — soutien producteur
    createdAt: '2026-03-28T16:45:00.000Z',
  },
  {
    id: 'mock-points-allocation-april',
    label: 'Allocation mensuelle Pollinisateur+',
    delta: 1200,
    impactDelta: 0,
    createdAt: '2026-04-03T08:00:00.000Z',
  },
  {
    id: 'mock-points-order-01',
    label: "Commande Miel d'Eucalyptus",
    delta: -550,
    impactDelta: 0,
    createdAt: '2026-04-11T12:30:00.000Z',
  },
  {
    id: 'mock-points-support-antsirabe',
    label: 'Contribution projet Antsirabe',
    delta: -395,
    impactDelta: 395, // Crédits Impact — soutien producteur
    createdAt: '2026-04-14T09:20:00.000Z',
  },
  {
    id: 'mock-points-order-02',
    label: "Commande Miel d'Eucalyptus",
    delta: -1150,
    impactDelta: 0,
    createdAt: '2026-04-16T08:10:00.000Z',
  },
  {
    id: 'mock-points-eco-fact',
    label: 'Eco-Fact du jour complété',
    delta: 50,
    impactDelta: 0, // Graines — défis ne génèrent pas de Crédits Impact
    createdAt: '2026-04-17T07:30:00.000Z',
  },
  {
    id: 'mock-points-daily-harvest',
    label: 'Récolte quotidienne',
    delta: 50,
    impactDelta: 0, // Graines — défis ne génèrent pas de Crédits Impact
    createdAt: '2026-04-17T07:32:00.000Z',
  },
  {
    id: 'mock-points-referral',
    label: 'Parrainage confirme',
    delta: 500,
    impactDelta: 0, // Graines — engagement ne génère pas de Crédits Impact
    createdAt: '2026-04-17T18:00:00.000Z',
  },
  {
    id: 'mock-points-streak',
    label: 'Serie de 12 jours maintenue',
    delta: 430,
    impactDelta: 0, // Graines — streak ne génère pas de Crédits Impact
    createdAt: '2026-04-18T06:45:00.000Z',
  },
]

const EXISTING_VIEWER_MESSAGES: MockProducerMessageRecord[] = [
  {
    id: 'mock-message-ilanga-stock',
    subject: 'Question sur le prochain lot de miel',
    message:
      "Bonjour, savez-vous quand le prochain lot de miel d'eucalyptus sera disponible ? J'aimerais en recommander pour offrir.",
    status: 'replied',
    created_at: '2026-04-10T10:00:00.000Z',
    producer: {
      name: 'Ilanga Nature',
      slug: MOCK_PRODUCER_ILANGA_SLUG,
    },
  },
  {
    id: 'mock-message-ilanga-impact',
    subject: 'Peut-on visiter le projet a Madagascar ?',
    message:
      "Bonjour, j'aimerais savoir si vous prevoyez un format de visite ou un journal terrain plus regulier pour suivre les ruchers.",
    status: 'read',
    created_at: '2026-04-15T14:35:00.000Z',
    producer: {
      name: 'Ilanga Nature',
      slug: MOCK_PRODUCER_ILANGA_SLUG,
    },
  },
]

const EMPTY_SHIPPING_ADDRESS = {
  firstName: '',
  lastName: '',
  street: '',
  postalCode: '',
  city: '',
  country: '',
}

const STARTER_POINTS_TRANSACTIONS: MockPointsTransactionRecord[] = [
  {
    id: 'mock-points-starter',
    label: 'Bonus de depart',
    delta: 120,
    impactDelta: 0, // Graines de départ — pas de Crédits Impact sans soutien producteur
    createdAt: '2026-04-17T10:00:00.000Z',
  },
]

const cloneOrder = (order: MockOrderRecord): MockOrderRecord => ({
  ...order,
  shipping_address: { ...order.shipping_address },
  items: order.items.map((item) => ({
    ...item,
    product_snapshot: { ...item.product_snapshot },
    product: item.product ? { ...item.product } : null,
  })),
})

const cloneSupport = (record: MockSupportRecord): MockSupportRecord => ({
  ...record,
  project: { ...record.project },
})

const cloneSubscription = (
  subscription: MockSubscriptionRecord | null,
): MockSubscriptionRecord | null => (subscription ? { ...subscription } : null)

const cloneMessage = (message: MockProducerMessageRecord): MockProducerMessageRecord => ({
  ...message,
  producer: message.producer ? { ...message.producer } : null,
})

const sortByCreatedAtDesc = <T extends { createdAt: string }>(entries: T[]): T[] => {
  return [...entries].sort((first, second) => second.createdAt.localeCompare(first.createdAt))
}

const getWalletTransactions = (viewerId: string): MockPointsTransactionRecord[] => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return STARTER_POINTS_TRANSACTIONS.map((transaction) => ({ ...transaction }))
  }

  return sortByCreatedAtDesc(
    EXISTING_VIEWER_POINTS_TRANSACTIONS.map((transaction) => ({ ...transaction })),
  )
}

export const getMockImpactCreditsBalance = (viewerId: string): number => {
  return getWalletTransactions(viewerId).reduce((sum, transaction) => {
    return sum + transaction.impactDelta
  }, 0)
}

export const getMockWalletBalance = (viewerId: string): number => {
  return getWalletTransactions(viewerId).reduce((sum, transaction) => {
    return sum + transaction.delta
  }, 0)
}

export const getMockSupports = (viewerId: string): MockSupportRecord[] => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return []
  }

  return EXISTING_VIEWER_SUPPORTS.map(cloneSupport)
}

export const getMockOrders = (viewerId: string): MockOrderRecord[] => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return []
  }

  return EXISTING_VIEWER_ORDERS.map(cloneOrder).sort((first, second) =>
    second.created_at.localeCompare(first.created_at),
  )
}

export const getMockOrderById = (viewerId: string, orderId: string): MockOrderRecord | null => {
  const order = getMockOrders(viewerId).find((entry) => entry.id === orderId)
  return order || null
}

export const buildSyntheticMockOrder = (
  orderId: string,
  profile?: {
    displayName?: string | null
    addressStreet?: string | null
    addressPostalCode?: string | null
    city?: string | null
    country?: string | null
  } | null,
): MockOrderRecord => {
  const firstName = profile?.displayName?.split(' ')[0] || ''
  const lastName = profile?.displayName?.split(' ').slice(1).join(' ') || ''

  return {
    id: orderId,
    status: 'paid',
    subtotal_points: 0,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 0,
    subtotal_euros: 7,
    shipping_cost_euros: 6.5,
    tax_euros: 0,
    total_euros: 13.5,
    created_at: getCurrentIsoDate(),
    tracking_number: null,
    carrier: null,
    shipping_address: {
      ...EMPTY_SHIPPING_ADDRESS,
      firstName,
      lastName,
      street: profile?.addressStreet || '',
      postalCode: profile?.addressPostalCode || '',
      city: profile?.city || '',
      country: profile?.country || '',
    },
    items: [
      {
        id: `${orderId}-item-1`,
        quantity: 1,
        unit_price_points: 0,
        total_price_points: 0,
        product_snapshot: {
          name: "Miel d'Eucalyptus 250g",
          priceEuros: 7,
          pricePoints: 0,
        },
        product: {
          id: MOCK_PRODUCT_EUCALYPTUS_ID,
          name_default: "Miel d'Eucalyptus 250g",
          slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        },
      },
    ],
  }
}

export const getMockSubscription = (viewerId: string): MockSubscriptionRecord | null => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return null
  }

  return cloneSubscription(EXISTING_VIEWER_SUBSCRIPTION)
}

export const getMockPointsTransactions = (viewerId: string): MockPointsTransactionRecord[] => {
  return getWalletTransactions(viewerId)
}

export const getMockSentMessages = (viewerId: string): MockProducerMessageRecord[] => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return []
  }

  return EXISTING_VIEWER_MESSAGES.map(cloneMessage)
}

export const getMockSpeciesUnlockPoints = (viewerId: string): SpeciesContext['user_status'] => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return null
  }

  return {
    isUnlocked: true,
    unlockedDate: '2026-04-02T09:00:00.000Z',
    unlockSource: 'mock_contribution_reward',
    progressionLevel: 2,
  }
}
