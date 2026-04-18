import type { SpeciesContext } from '@/types/context'
import { MOCK_EXISTING_VIEWER_ID } from '@/lib/mock/mock-viewer'

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
      name_default: 'Ruchers d’apiculteurs indépendants à Antsirabe',
      slug: 'ruchers-apiculteurs-independants-antsirabe',
      status: 'active',
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
      slug: 'miellerie-manakara-ilanga-nature',
      status: 'active',
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
          name: 'Miel d’Eucalyptus',
          priceEuros: 5.5,
          pricePoints: 550,
        },
        product: {
          id: 'mock-product-miel-eucalyptus-ilanga',
          name_default: 'Miel d’Eucalyptus',
          slug: 'miel-eucalyptus-ilanga',
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
          name: 'Miel d’Eucalyptus',
          priceEuros: 5.5,
          pricePoints: 550,
        },
        product: {
          id: 'mock-product-miel-eucalyptus-ilanga',
          name_default: 'Miel d’Eucalyptus',
          slug: 'miel-eucalyptus-ilanga',
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
    createdAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'mock-points-investment-antsirabe',
    label: 'Contribution projet Antsirabe',
    delta: 390,
    createdAt: '2026-04-14T09:20:00.000Z',
  },
  {
    id: 'mock-points-order-01',
    label: 'Commande Miel d’Eucalyptus',
    delta: -550,
    createdAt: '2026-04-11T12:30:00.000Z',
  },
  {
    id: 'mock-points-order-02',
    label: 'Commande Miel d’Eucalyptus',
    delta: -1150,
    createdAt: '2026-04-16T08:10:00.000Z',
  },
  {
    id: 'mock-points-referral',
    label: 'Parrainage confirmé',
    delta: 500,
    createdAt: '2026-04-17T18:00:00.000Z',
  },
]

const EXISTING_VIEWER_MESSAGES: MockProducerMessageRecord[] = [
  {
    id: 'mock-message-ilanga-stock',
    subject: 'Question sur le prochain lot de miel',
    message:
      'Bonjour, savez-vous quand le prochain lot de miel d’eucalyptus sera disponible ? J’aimerais en recommander pour offrir.',
    status: 'replied',
    created_at: '2026-04-10T10:00:00.000Z',
    producer: {
      name: 'Ilanga Nature',
      slug: 'ilanga-nature',
    },
  },
  {
    id: 'mock-message-ilanga-impact',
    subject: 'Peut-on visiter le projet à Madagascar ?',
    message:
      'Bonjour, j’aimerais savoir si vous prévoyez un format de visite ou un journal terrain plus régulier pour suivre les ruchers.',
    status: 'read',
    created_at: '2026-04-15T14:35:00.000Z',
    producer: {
      name: 'Ilanga Nature',
      slug: 'ilanga-nature',
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

export const getMockWalletBalance = (viewerId: string): number => {
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return 120
  }

  return 1680
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

  return EXISTING_VIEWER_ORDERS.map(cloneOrder)
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
          name: 'Miel d’Eucalyptus',
          priceEuros: 5.5,
          pricePoints: 550,
        },
        product: {
          id: 'mock-product-miel-eucalyptus-ilanga',
          name_default: 'Miel d’Eucalyptus',
          slug: 'miel-eucalyptus-ilanga',
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
  if (viewerId !== MOCK_EXISTING_VIEWER_ID) {
    return [
      {
        id: 'mock-points-starter',
        label: 'Bonus de départ',
        delta: 120,
        createdAt: '2026-04-17T10:00:00.000Z',
      },
    ]
  }

  return EXISTING_VIEWER_POINTS_TRANSACTIONS.map((transaction) => ({ ...transaction }))
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
