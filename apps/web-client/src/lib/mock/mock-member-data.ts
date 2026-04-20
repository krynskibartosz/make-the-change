import type { SpeciesContext } from '@/types/context'
import {
  MOCK_CHALLENGE_DAILY_HARVEST_ID,
  MOCK_CHALLENGE_ECO_FACT_ID,
  MOCK_EXISTING_VIEWER_ID,
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_LITCHI_ID,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCT_MANAKARA_SLUG,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_MANAKARA_SLUG,
} from '@/lib/mock/mock-ids'

export type MockInvestmentRecord = {
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
  monthly_points_allocation: number
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

const EXISTING_VIEWER_INVESTMENTS: MockInvestmentRecord[] = [
  {
    id: 'mock-investment-antsirabe',
    amount_eur_equivalent: 390,
    amount_points: 390,
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
    id: 'mock-investment-manakara',
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
    subtotal_points: 550,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 550,
    subtotal_euros: 0,
    shipping_cost_euros: 0,
    tax_euros: 0,
    total_euros: 0,
    created_at: '2026-04-11T12:30:00.000Z',
    tracking_number: 'MTC-BE-248901',
    carrier: 'Bpost',
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-eucalyptus-01',
        quantity: 1,
        unit_price_points: 550,
        total_price_points: 550,
        product_snapshot: {
          name: "Miel d'Eucalyptus",
          priceEuros: 5.5,
          pricePoints: 550,
          cover_image_url: '/images/products/miel-eucalyptus.jpg',
        },
        product: {
          id: MOCK_PRODUCT_EUCALYPTUS_ID,
          name_default: "Miel d'Eucalyptus",
          slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        },
      },
    ],
  },
  {
    id: 'mock-order-manakara-01',
    status: 'delivered',
    subtotal_points: 650,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 650,
    subtotal_euros: 0,
    shipping_cost_euros: 0,
    tax_euros: 0,
    total_euros: 0,
    created_at: '2026-03-28T14:15:00.000Z',
    tracking_number: 'MTC-BE-247856',
    carrier: 'Bpost',
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-manakara-01',
        quantity: 1,
        unit_price_points: 650,
        total_price_points: 650,
        product_snapshot: {
          name: 'Miellerie de Manakara',
          priceEuros: 6.5,
          pricePoints: 650,
          cover_image_url: '/images/projects/miellerie-manakara.jpg',
        },
        product: {
          id: MOCK_PRODUCT_MANAKARA_ID,
          name_default: 'Miellerie de Manakara',
          slug: MOCK_PRODUCT_MANAKARA_SLUG,
        },
      },
    ],
  },
  {
    id: 'mock-order-eucalyptus-02',
    status: 'processing',
    subtotal_points: 1100,
    shipping_cost_points: 50,
    tax_points: 0,
    total_points: 1150,
    subtotal_euros: 0,
    shipping_cost_euros: 0,
    tax_euros: 0,
    total_euros: 0,
    created_at: '2026-04-16T08:10:00.000Z',
    tracking_number: null,
    carrier: null,
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-eucalyptus-02',
        quantity: 2,
        unit_price_points: 550,
        total_price_points: 1100,
        product_snapshot: {
          name: "Miel d'Eucalyptus",
          priceEuros: 5.5,
          pricePoints: 550,
          cover_image_url: '/images/products/miel-eucalyptus.jpg',
        },
        product: {
          id: MOCK_PRODUCT_EUCALYPTUS_ID,
          name_default: "Miel d'Eucalyptus",
          slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        },
      },
    ],
  },
  {
    id: 'mock-order-litchi-01',
    status: 'paid',
    subtotal_points: 750,
    shipping_cost_points: 50,
    tax_points: 0,
    total_points: 800,
    subtotal_euros: 0,
    shipping_cost_euros: 0,
    tax_euros: 0,
    total_euros: 0,
    created_at: '2026-04-18T16:45:00.000Z',
    tracking_number: null,
    carrier: null,
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-litchi-01',
        quantity: 1,
        unit_price_points: 750,
        total_price_points: 750,
        product_snapshot: {
          name: 'Miel de Litchi',
          priceEuros: 7.5,
          pricePoints: 750,
          cover_image_url: '/images/products/miel-litchi.jpg',
        },
        product: {
          id: MOCK_PRODUCT_LITCHI_ID,
          name_default: 'Miel de Litchi',
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
    subtotal_euros: 5.5,
    shipping_cost_euros: 0,
    tax_euros: 0,
    total_euros: 5.5,
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
          name: "Miel d'Eucalyptus",
          priceEuros: 5.5,
          pricePoints: 550,
          cover_image_url: '/images/products/miel-eucalyptus.jpg',
        },
        product: {
          id: MOCK_PRODUCT_EUCALYPTUS_ID,
          name_default: "Miel d'Eucalyptus",
          slug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
        },
      },
    ],
  },
  {
    id: 'mock-order-manakara-euro-01',
    status: 'processing',
    subtotal_points: 0,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 0,
    subtotal_euros: 13,
    shipping_cost_euros: 2,
    tax_euros: 0,
    total_euros: 15,
    created_at: '2026-04-19T14:30:00.000Z',
    tracking_number: null,
    carrier: null,
    shipping_address: BASE_SHIPPING_ADDRESS,
    items: [
      {
        id: 'mock-order-item-manakara-euro-01',
        quantity: 2,
        unit_price_points: 0,
        total_price_points: 0,
        product_snapshot: {
          name: 'Miellerie de Manakara',
          priceEuros: 6.5,
          pricePoints: 650,
          cover_image_url: '/images/projects/miellerie-manakara.jpg',
        },
        product: {
          id: MOCK_PRODUCT_MANAKARA_ID,
          name_default: 'Miellerie de Manakara',
          slug: MOCK_PRODUCT_MANAKARA_SLUG,
        },
      },
    ],
  },
]

const EXISTING_VIEWER_SUBSCRIPTION: MockSubscriptionRecord = {
  id: 'mock-subscription-pollinisateur-plus',
  plan_type: 'Pollinisateur+',
  status: 'active',
  monthly_points_allocation: 1200,
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
    impactDelta: 250,
    createdAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'mock-points-allocation-february',
    label: 'Allocation mensuelle Pollinisateur+',
    delta: 1200,
    impactDelta: 0,
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
    id: 'mock-points-investment-manakara',
    label: 'Contribution projet Manakara',
    delta: -780,
    impactDelta: 780,
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
    id: 'mock-points-investment-antsirabe',
    label: 'Contribution projet Antsirabe',
    delta: -390,
    impactDelta: 390,
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
    label: "Eco-Fact du jour complete",
    delta: 50,
    impactDelta: 50,
    createdAt: '2026-04-17T07:30:00.000Z',
  },
  {
    id: 'mock-points-daily-harvest',
    label: 'Recolte quotidienne',
    delta: 50,
    impactDelta: 50,
    createdAt: '2026-04-17T07:32:00.000Z',
  },
  {
    id: 'mock-points-referral',
    label: 'Parrainage confirme',
    delta: 500,
    impactDelta: 500,
    createdAt: '2026-04-17T18:00:00.000Z',
  },
  {
    id: 'mock-points-streak',
    label: 'Serie de 12 jours maintenue',
    delta: 430,
    impactDelta: 430,
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
    impactDelta: 120,
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

const cloneInvestment = (investment: MockInvestmentRecord): MockInvestmentRecord => ({
  ...investment,
  project: { ...investment.project },
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

export const getMockImpactPoints = (viewerId: string): number => {
  return getWalletTransactions(viewerId).reduce((sum, transaction) => {
    return sum + transaction.impactDelta
  }, 0)
}

export const getMockWalletBalance = (viewerId: string): number => {
  return getWalletTransactions(viewerId).reduce((sum, transaction) => {
    return sum + transaction.delta
  }, 0)
}

export const getMockInvestments = (viewerId: string): MockInvestmentRecord[] => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return []
  }

  return EXISTING_VIEWER_INVESTMENTS.map(cloneInvestment)
}

export const getMockOrders = (viewerId: string): MockOrderRecord[] => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return []
  }

  return EXISTING_VIEWER_ORDERS
    .map(cloneOrder)
    .sort((first, second) => second.created_at.localeCompare(first.created_at))
}

export const getMockOrderById = (
  viewerId: string,
  orderId: string,
): MockOrderRecord | null => {
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
    subtotal_points: 550,
    shipping_cost_points: 0,
    tax_points: 0,
    total_points: 550,
    subtotal_euros: 0,
    shipping_cost_euros: 0,
    tax_euros: 0,
    total_euros: 0,
    created_at: new Date().toISOString(),
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
        unit_price_points: 550,
        total_price_points: 550,
        product_snapshot: {
          name: "Miel d'Eucalyptus",
          priceEuros: 5.5,
          pricePoints: 550,
        },
        product: {
          id: MOCK_PRODUCT_EUCALYPTUS_ID,
          name_default: "Miel d'Eucalyptus",
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

export const getMockCompletedChallengeIds = (viewerId: string): string[] => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return []
  }

  return [MOCK_CHALLENGE_ECO_FACT_ID, MOCK_CHALLENGE_DAILY_HARVEST_ID]
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
