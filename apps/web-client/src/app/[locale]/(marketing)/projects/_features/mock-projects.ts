import {
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PROJECT_ANTSIRABE_ID,
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_MANAKARA_ID,
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_SPECIES_BLACK_BEE_ID,
  MOCK_SPECIES_HONEY_BEE_ID,
} from '@/lib/mock/mock-ids'
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
  updated_at?: string | null
  producer: MockProjectProducer
  species?: ProjectSpecies[] | null
  challenges?: ProjectChallenge[] | null
  producer_products?: ProducerProduct[] | null
  expected_impact?: ProjectImpact | null
}

const antsirabeSpecies: ProjectSpecies[] = [
  {
    id: MOCK_SPECIES_HONEY_BEE_ID,
    name: 'Abeille mellifere',
    scientificName: 'Apis mellifera',
    icon: '/images/logo-icon-bee.png',
    rarity: 7,
    status: 'NT',
    role: 'Pollinisatrice cle',
  },
]

const antsirabeProducts: ProducerProduct[] = [
  {
    id: MOCK_PRODUCT_EUCALYPTUS_ID,
    name: "Miel d'Eucalyptus",
    price: 18,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/logo-icon-bee.png',
  },
]

const manakaraSpecies: ProjectSpecies[] = [
  {
    id: MOCK_SPECIES_BLACK_BEE_ID,
    name: 'Abeille noire',
    scientificName: 'Apis mellifera mellifera',
    icon: '/images/logo-icon-bee.png',
    rarity: 7,
    status: 'NT',
    role: 'Pollinisatrice cle',
  },
]

const manakaraProducts: ProducerProduct[] = [
  {
    id: MOCK_PRODUCT_MANAKARA_ID,
    name: 'Miel de Manakara',
    price: 19,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/logo-icon-bee.png',
  },
]

export const MOCK_PROJECTS: MockProjectSeed[] = [
  {
    id: MOCK_PROJECT_ANTSIRABE_ID,
    slug: MOCK_PROJECT_ANTSIRABE_SLUG,
    status: 'active',
    type: 'beehive',
    featured: true,
    name_default: "Ruchers d'apiculteurs independants a Antsirabe",
    name_i18n: {
      fr: "Ruchers d'apiculteurs independants a Antsirabe",
      en: 'Independent Beekeepers Apiaries in Antsirabe',
    },
    description_default:
      "Affilie a la cooperative, ce rucher de 45 colonies pres d'Analamazoatra soutient une apiculture locale durable a Antsirabe.",
    description_i18n: {
      fr: "Affilie a la cooperative, ce rucher de 45 colonies pres d'Analamazoatra soutient une apiculture locale durable a Antsirabe.",
      en: 'Andraina and his assistant manage 45 hives near the Analamazoatra reserve to support sustainable local beekeeping.',
    },
    long_description_default:
      "Andraina et son assistant gerent 45 ruches reparties sur un site situe derriere son habitation, a quelques metres de la reserve speciale d'Analamazoatra.\n\nCette foret tropicale est un hotspot de biodiversite, abritant de nombreuses especes de lemuriens, dont l'Indri, ainsi que des cameleons, plus de 100 especes d'oiseaux et une grande diversite d'amphibiens et de plantes endemiques.\n\nLes ruches sont fournies par Ilanga Nature, qui soutient le developpement d'une apiculture locale durable.",
    long_description_i18n: {
      fr: "Andraina et son assistant gerent 45 ruches reparties sur un site situe derriere son habitation, a quelques metres de la reserve speciale d'Analamazoatra.\n\nCette foret tropicale est un hotspot de biodiversite, abritant de nombreuses especes de lemuriens, dont l'Indri, ainsi que des cameleons, plus de 100 especes d'oiseaux et une grande diversite d'amphibiens et de plantes endemiques.\n\nLes ruches sont fournies par Ilanga Nature, qui soutient le developpement d'une apiculture locale durable.",
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
    updated_at: '2026-04-17T10:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_ILANGA_ID,
      slug: MOCK_PRODUCER_ILANGA_SLUG,
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: 'Produits naturels et ethiques de Madagascar.',
      description_i18n: {
        fr: 'Produits naturels et ethiques de Madagascar.',
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
    id: MOCK_PROJECT_MANAKARA_ID,
    slug: MOCK_PROJECT_MANAKARA_SLUG,
    status: 'active',
    type: 'beehive',
    featured: true,
    name_default: 'Miellerie de Manakara',
    name_i18n: {
      fr: 'Miellerie de Manakara',
      en: 'Manakara Honey House',
    },
    description_default:
      "Projet Ilanga Nature a Madagascar pour structurer une miellerie locale durable autour de l'abeille noire.",
    description_i18n: {
      fr: "Projet Ilanga Nature a Madagascar pour structurer une miellerie locale durable autour de l'abeille noire.",
      en: 'Ilanga Nature project in Madagascar to scale a sustainable local honey house around black bees.',
    },
    long_description_default:
      "La miellerie de Manakara est portee par Ilanga Nature a Madagascar. Ce projet vise a renforcer la chaine locale de production et de valorisation du miel en s'appuyant sur une apiculture durable.\n\nLes donnees terrain detaillees sont progressivement consolidees a partir du referentiel operationnel.",
    long_description_i18n: {
      fr: "La miellerie de Manakara est portee par Ilanga Nature a Madagascar. Ce projet vise a renforcer la chaine locale de production et de valorisation du miel en s'appuyant sur une apiculture durable.\n\nLes donnees terrain detaillees sont progressivement consolidees a partir du referentiel operationnel.",
      en: 'The Manakara honey house is led by Ilanga Nature in Madagascar. The project strengthens local honey production and value chain through sustainable beekeeping.',
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
    updated_at: '2026-04-18T10:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_ILANGA_ID,
      slug: MOCK_PRODUCER_ILANGA_SLUG,
      name_default: 'Ilanga Nature',
      name_i18n: {
        fr: 'Ilanga Nature',
        en: 'Ilanga Nature',
      },
      description_default: 'Produits naturels et ethiques de Madagascar.',
      description_i18n: {
        fr: 'Produits naturels et ethiques de Madagascar.',
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
