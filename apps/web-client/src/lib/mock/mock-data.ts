// ============================================================
// MOCK DATA LAYER — Source de vérité pour le mode simulation
// Pour passer en mode DB : mettre mtc_mock_mode = 'false'
// dans sessionStorage ou NEXT_PUBLIC_MOCK_MODE = 'false'
// ============================================================

export type MockFaction = 'wildlife' | 'forests' | 'artisans'

export type MockUser = {
  id: string
  name: string
  email: string
  points: number
  faction: MockFaction | null
  streakDays: number
  joinedAt: string
}

export const MOCK_USER: MockUser = {
  id: 'mock-user-1',
  name: 'Bartosz',
  email: 'bartosz@makethechange.fr',
  points: 2450,
  faction: null,
  streakDays: 8,
  joinedAt: new Date().toISOString(),
}

export const MOCK_FACTIONS = [
  {
    id: 'wildlife' as MockFaction,
    label: 'Vie Sauvage',
    emoji: '🦅',
    description: 'Protège les espèces et les écosystèmes naturels',
    color: 'from-sky-500 to-blue-700',
    borderColor: 'border-sky-500/30',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-400',
  },
  {
    id: 'forests' as MockFaction,
    label: 'Terres & Forêts',
    emoji: '🌿',
    description: 'Restaure les sols et les forêts du monde',
    color: 'from-lime-500 to-emerald-700',
    borderColor: 'border-lime-500/30',
    bgColor: 'bg-lime-500/10',
    textColor: 'text-lime-400',
  },
  {
    id: 'artisans' as MockFaction,
    label: 'Artisans Locaux',
    emoji: '🍯',
    description: 'Soutient les producteurs engagés et durables',
    color: 'from-amber-500 to-orange-700',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
  },
]

export type MockProject = {
  id: string
  slug: string
  name: string
  description: string
  imageUrl: string
  category: string
  location: string
  impactPoints: number
  fundingProgress: number
  fundingGoal: number
  backers: number
  tags: string[]
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: 'mock-project-1',
    slug: 'ruchers-apiculteurs-independants',
    name: "Ruchers d'apiculteurs indépendants",
    description:
      "Soutenez des apiculteurs locaux qui pratiquent une apiculture durable, favorisant la biodiversité et la pollinisation naturelle. Chaque euro investi protège une reine et son essaim.",
    imageUrl: '/images/diorama-chouette.png',
    category: 'Biodiversité',
    location: 'Provence, France',
    impactPoints: 650,
    fundingProgress: 78,
    fundingGoal: 100,
    backers: 134,
    tags: ['Abeilles', 'Pollinisation', 'Local', 'Bio'],
  },
  {
    id: 'mock-project-2',
    slug: 'reforestation-massif-central',
    name: 'Reforestation Massif Central',
    description:
      "Programme de replantation d'essences forestières locales dans le Massif Central. Chaque arbre planté séquestre du CO2 et restaure l'habitat de la faune locale.",
    imageUrl: '/images/diorama-chouette.png',
    category: 'Forêts',
    location: 'Auvergne, France',
    impactPoints: 450,
    fundingProgress: 45,
    fundingGoal: 100,
    backers: 89,
    tags: ['Arbres', 'CO2', 'Biodiversité', 'Forêt'],
  },
]

export type MockProduct = {
  id: string
  slug: string
  name: string
  description: string
  imageUrl: string
  category: string
  producerName: string
  pricePoints: number
  priceEuros: number
  inStock: boolean
  stockQuantity: number
  tags: string[]
  certifications: string[]
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 'mock-product-1',
    slug: 'miel-eucalyptus-abeille-noire',
    name: "Miel d'Eucalyptus — Abeille Noire",
    description:
      "Récolté de manière artisanale, ce miel reflète la richesse des écosystèmes locaux et le travail des apiculteurs engagés. Au-delà de ses qualités, ce miel soutient une apiculture durable et participe à la préservation du vivant.",
    imageUrl: '/images/diorama-chouette.png',
    category: 'Miel',
    producerName: 'Les Ruchers du Luberon',
    pricePoints: 950,
    priceEuros: 9.5,
    inStock: true,
    stockQuantity: 45,
    tags: ['Miel', 'Artisanal', 'Bio', 'Abeille Noire'],
    certifications: ['AB Bio', 'Nature & Progrès'],
  },
  {
    id: 'mock-product-2',
    slug: 'savon-lavande-apicole',
    name: 'Savon Lavande & Propolis',
    description:
      "Formulé à base de propolis et d'huile essentielle de lavande fine, ce savon artisanal est produit par un apiculteur du Vaucluse. Doux, naturel et respectueux de la peau.",
    imageUrl: '/images/diorama-chouette.png',
    category: 'Cosmétique',
    producerName: 'Savonnerie Apicole de Provence',
    pricePoints: 550,
    priceEuros: 5.5,
    inStock: true,
    stockQuantity: 12,
    tags: ['Savon', 'Lavande', 'Propolis', 'Artisanal'],
    certifications: ['Cosmos Natural'],
  },
]

export type MockDailyQuest = {
  id: number
  type: 'education' | 'social' | 'daily_harvest'
  title: string
  description: string
  progress: number
  max: number
  reward: number
  href?: string
}

export const MOCK_QUESTS: MockDailyQuest[] = [
  {
    id: 1,
    type: 'education',
    title: "L'Éco-Fact du jour",
    description: "Lis l'article sur la déforestation.",
    progress: 0,
    max: 1,
    reward: 50,
  },
  {
    id: 2,
    type: 'social',
    title: "L'Esprit d'Équipe",
    description: 'Distribue 3 Bravos dans le Collectif.',
    progress: 1,
    max: 3,
    reward: 100,
    href: '/collectif',
  },
  {
    id: 3,
    type: 'daily_harvest',
    title: 'La Récolte Quotidienne',
    description: 'Récupère le nectar du jour.',
    progress: 0,
    max: 1,
    reward: 50,
  },
]

// Session storage key for mock mode toggle
export const MOCK_MODE_KEY = 'mtc_mock_mode'
export const MOCK_AUTH_KEY = 'mtc_mock_auth'
