import type {
  ProducerProduct,
  ProjectChallenge,
  ProjectImpact,
  ProjectSpecies,
} from '@/types/context'

type MockProjectProducer = {
  id: string
  slug: string | null
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string | null
  description_i18n?: Record<string, string> | null
  contact_website: string | null
  images: string[] | null
}

export type MockProjectSeed = {
  id: string
  slug: string
  status: string
  type: string
  featured: boolean
  name_default: string
  name_i18n?: Record<string, string> | null
  description_default: string
  description_i18n?: Record<string, string> | null
  long_description_default: string
  long_description_i18n?: Record<string, string> | null
  address_city: string | null
  address_country_code: string | null
  latitude?: number | null
  longitude?: number | null
  launch_date: string | null
  maturity_date: string | null
  current_funding: number
  target_budget: number
  hero_image_url: string | null
  images: string[]
  unit_price_eur?: number
  unit_label?: string | null
  producer: MockProjectProducer
  species?: ProjectSpecies[] | null
  challenges?: ProjectChallenge[] | null
  producer_products?: ProducerProduct[] | null
  expected_impact?: ProjectImpact | null
}

const antsirabeSpecies: ProjectSpecies[] = [
  {
    id: 'mock-species-abeille-noire',
    name: 'Abeille noire',
    scientificName: 'Apis mellifera mellifera',
    icon: '/images/logo-icon-bee.png',
    rarity: 7,
    status: 'NT',
    role: 'Pollinisatrice clé',
  },
]

const antsirabeProducts: ProducerProduct[] = [
  {
    id: 'mock-product-miel-eucalyptus',
    name: "Miel d'Eucalyptus",
    price: 18,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/logo-icon-bee.png',
  },
]

const manakaraSpecies: ProjectSpecies[] = [
  {
    id: 'mock-species-abeille-noire-manakara',
    name: 'Abeille noire',
    scientificName: 'Apis mellifera mellifera',
    icon: '/images/logo-icon-bee.png',
    rarity: 7,
    status: 'NT',
    role: 'Pollinisatrice clé',
  },
]

const manakaraProducts: ProducerProduct[] = [
  {
    id: 'mock-product-miel-manakara',
    name: 'Miel de Manakara',
    price: 19,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/logo-icon-bee.png',
  },
]

export const MOCK_PROJECTS: MockProjectSeed[] = [
  {
    id: 'mock-project-ruchers-antsirabe',
    slug: 'ruchers-apiculteurs-independants-antsirabe',
    status: 'active',
    type: 'beehive',
    featured: true,
    name_default: "Ruchers d’apiculteurs indépendants à Antsirabe",
    name_i18n: {
      fr: "Ruchers d’apiculteurs indépendants à Antsirabe",
      en: 'Independent Beekeepers Apiaries in Antsirabe',
    },
    description_default:
      "Affilié à la coopérative, ce rucher de 45 colonies près d’Analamazoatra soutient une apiculture locale durable à Antsirabe.",
    description_i18n: {
      fr: "Affilié à la coopérative, ce rucher de 45 colonies près d’Analamazoatra soutient une apiculture locale durable à Antsirabe.",
      en: 'Andraina and his assistant manage 45 hives near the Analamazoatra reserve to support sustainable local beekeeping.',
    },
    long_description_default:
      "Andraina et son assistant gèrent 45 ruches réparties sur un site situé derrière son habitation, à quelques mètres de la réserve spéciale d’Analamazoatra.\n\nCette forêt tropicale est un hotspot de biodiversité, abritant de nombreuses espèces de lémuriens, dont l’Indri (le plus grand lémur de Madagascar), mais aussi des caméléons, plus de 100 espèces d’oiseaux et une grande diversité d’amphibiens et de plantes endémiques.\n\nCet environnement offre aux abeilles une ressource florale riche, principalement composée d’eucalyptus, donnant un miel au profil aromatique caractéristique.\n\nLes ruches sont fournies par Ilanga Nature, qui soutient le développement d’une apiculture locale durable. Suite à une infestation de varroa, une partie des ruches a été remplacée afin de relancer l’activité et renforcer l’impact sur le vivant.\n\nLocalisation : https://maps.app.goo.gl/DVLWnSu9cGoi7evw5?g_st=ic",
    long_description_i18n: {
      fr: "Andraina et son assistant gèrent 45 ruches réparties sur un site situé derrière son habitation, à quelques mètres de la réserve spéciale d’Analamazoatra.\n\nCette forêt tropicale est un hotspot de biodiversité, abritant de nombreuses espèces de lémuriens, dont l’Indri (le plus grand lémur de Madagascar), mais aussi des caméléons, plus de 100 espèces d’oiseaux et une grande diversité d’amphibiens et de plantes endémiques.\n\nCet environnement offre aux abeilles une ressource florale riche, principalement composée d’eucalyptus, donnant un miel au profil aromatique caractéristique.\n\nLes ruches sont fournies par Ilanga Nature, qui soutient le développement d’une apiculture locale durable. Suite à une infestation de varroa, une partie des ruches a été remplacée afin de relancer l’activité et renforcer l’impact sur le vivant.\n\nLocalisation : https://maps.app.goo.gl/DVLWnSu9cGoi7evw5?g_st=ic",
    },
    address_city: 'Antsirabe',
    address_country_code: 'Madagascar',
    latitude: -19.8659,
    longitude: 47.0335,
    launch_date: '2026-02-10',
    maturity_date: null,
    current_funding: 7640,
    target_budget: 17550,
    hero_image_url: '/images/projects/antsirabe-ruchers-1.jpg',
    images: [
      '/images/projects/antsirabe-ruchers-1.jpg',
      '/images/projects/antsirabe-ruchers-1.mov',
      '/images/projects/antsirabe-ruchers-2.mov',
    ],
    unit_price_eur: 390,
    unit_label: 'ruche',
    producer: {
      id: 'mock-producer-ilanga-nature',
      slug: 'ilanga-nature',
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: 'Produits naturels et éthiques de Madagascar.',
      description_i18n: {
        fr: 'Produits naturels et éthiques de Madagascar.',
        en: 'Natural and ethical products from Madagascar.',
      },
      contact_website: 'https://ilanga.nature',
      images: ['/images/logo-icon-bee.png'],
    },
    species: antsirabeSpecies,
    challenges: [],
    producer_products: antsirabeProducts,
    expected_impact: {
      co2Absorbed: 50,
      biodiversityGain: 32,
      jobsCreated: 2,
      timeline: 12,
    },
  },
  {
    id: 'mock-project-miellerie-manakara',
    slug: 'miellerie-manakara-ilanga-nature',
    status: 'active',
    type: 'beehive',
    featured: true,
    name_default: 'Miellerie de Manakara',
    name_i18n: {
      fr: 'Miellerie de Manakara',
      en: 'Manakara Honey House',
    },
    description_default:
      'Projet Ilanga Nature à Madagascar pour structurer une miellerie locale durable autour de l’abeille noire.',
    description_i18n: {
      fr: 'Projet Ilanga Nature à Madagascar pour structurer une miellerie locale durable autour de l’abeille noire.',
      en: 'Ilanga Nature project in Madagascar to scale a sustainable local honey house around black bees.',
    },
    long_description_default:
      'La miellerie de Manakara est portée par Ilanga Nature à Madagascar. Ce projet vise à renforcer la chaîne locale de production et de valorisation du miel en s’appuyant sur une apiculture durable.\n\nLes données terrain détaillées (production, rendement, impact) sont progressivement consolidées à partir du référentiel opérationnel.',
    long_description_i18n: {
      fr: 'La miellerie de Manakara est portée par Ilanga Nature à Madagascar. Ce projet vise à renforcer la chaîne locale de production et de valorisation du miel en s’appuyant sur une apiculture durable.\n\nLes données terrain détaillées (production, rendement, impact) sont progressivement consolidées à partir du référentiel opérationnel.',
      en: 'The Manakara honey house is led by Ilanga Nature in Madagascar. The project strengthens local honey production and value chain through sustainable beekeeping.\n\nDetailed field metrics (production, yield, impact) are being progressively consolidated from the operational dataset.',
    },
    address_city: 'Manakara',
    address_country_code: 'Madagascar',
    latitude: -22.1427,
    longitude: 48.0106,
    launch_date: '2026-03-01',
    maturity_date: null,
    current_funding: 3510,
    target_budget: 15600,
    hero_image_url: '/images/projects/miellerie-manakara.jpg',
    images: ['/images/projects/miellerie-manakara.jpg'],
    unit_price_eur: 390,
    unit_label: 'ruche',
    producer: {
      id: 'mock-producer-ilanga-nature',
      slug: 'ilanga-nature',
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: 'Produits naturels et éthiques de Madagascar.',
      description_i18n: {
        fr: 'Produits naturels et éthiques de Madagascar.',
        en: 'Natural and ethical products from Madagascar.',
      },
      contact_website: 'https://ilanga.nature',
      images: ['/images/logo-icon-bee.png'],
    },
    species: manakaraSpecies,
    challenges: [],
    producer_products: manakaraProducts,
    expected_impact: {
      co2Absorbed: 42,
      biodiversityGain: 28,
      jobsCreated: 2,
      timeline: 12,
    },
  },
]

export const getMockProjects = (): MockProjectSeed[] => MOCK_PROJECTS

export const getMockProjectBySlug = (slug: string): MockProjectSeed | null =>
  MOCK_PROJECTS.find((project) => project.slug === slug) || null
