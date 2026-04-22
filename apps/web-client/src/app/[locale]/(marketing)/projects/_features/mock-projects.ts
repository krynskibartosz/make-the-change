import {
  MOCK_DONATION_CORAL_12_ID,
  MOCK_DONATION_CORAL_18_ID,
  MOCK_DONATION_CORAL_3_ID,
  MOCK_DONATION_CORAL_6_ID,
  MOCK_PRODUCT_BAIES_ROSES_ID,
  MOCK_PRODUCT_CACTUS_ID,
  MOCK_PRODUCT_CORAL_12_ID,
  MOCK_PRODUCT_CORAL_18_ID,
  MOCK_PRODUCT_CORAL_3_ID,
  MOCK_PRODUCT_CORAL_6_ID,
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_EUCALYPTUS_140G_ID,
  MOCK_PRODUCT_FORETS_HUMIDES_ID,
  MOCK_PRODUCT_FORETS_PRIMAIRES_ID,
  MOCK_PRODUCT_FORETS_SECHES_ID,
  MOCK_PRODUCT_HUILE_FRANTOIO_ID,
  MOCK_PRODUCT_HUILE_LECCINO_ID,
  MOCK_PRODUCT_HUILE_LECCIO_ID,
  MOCK_PRODUCT_JUJUBIER_ID,
  MOCK_PRODUCT_LITCHI_ID,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCT_MOKARANA_ID,
  MOCK_PRODUCT_NIAOULI_ID,
  MOCK_PRODUCT_SAVON_DOUX_ID,
  MOCK_PRODUCT_HUILE_VISAGE_ID,
  MOCK_PRODUCT_SHAMPOING_ID,
  MOCK_PRODUCER_HABEEBEE_ID,
  MOCK_PRODUCER_HABEEBEE_SLUG,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PRODUCER_ILANGA_SLUG,
  MOCK_PRODUCER_SARDINIA_ID,
  MOCK_PRODUCER_SARDINIA_SLUG,
  MOCK_PRODUCER_TRILOGY_ID,
  MOCK_PRODUCER_TRILOGY_SLUG,
  MOCK_PROJECT_ANTSIRABE_ID,
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_CORAL_ID,
  MOCK_PROJECT_CORAL_SLUG,
  MOCK_PROJECT_HABEEBEE_ID,
  MOCK_PROJECT_HABEEBEE_SLUG,
  MOCK_PROJECT_MANAKARA_ID,
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_PROJECT_MIELLERIES_MOBILE_ID,
  MOCK_PROJECT_MIELLERIES_MOBILE_SLUG,
  MOCK_PROJECT_SARDINIA_ID,
  MOCK_PROJECT_SARDINIA_SLUG,
  MOCK_SPECIES_BLACK_BEE_ID,
  MOCK_SPECIES_BUMBLEBEE_ID,
  MOCK_SPECIES_BUTTERFLY_CITRON_ID,
  MOCK_SPECIES_BUTTERFLY_PEACOCK_ID,
  MOCK_SPECIES_CORAL_ID,
  MOCK_SPECIES_HEDGEHOG_ID,
  MOCK_SPECIES_HONEY_BEE_ID,
  MOCK_SPECIES_LADYBUG_ID,
  MOCK_SPECIES_MEGACHILE_ID,
  MOCK_SPECIES_OLIVE_TREE_ID,
  MOCK_SPECIES_OSMIA_ID,
  MOCK_SPECIES_OWL_ID,
  MOCK_SPECIES_SYRPHID_ID,
} from '@/lib/mock/mock-ids'
import type {
  DonationOption,
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
  donation_options?: DonationOption[] | null
  expected_impact?: ProjectImpact | null
}

const antsirabeSpecies: ProjectSpecies[] = [
  {
    id: MOCK_SPECIES_HONEY_BEE_ID,
    name: 'Abeille mellifere',
    scientificName: 'Apis mellifera',
    icon: '/images/diorama-chouette.png',
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
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
]

const manakaraSpecies: ProjectSpecies[] = [
  {
    id: MOCK_SPECIES_BLACK_BEE_ID,
    name: 'Abeille noire',
    scientificName: 'Apis mellifera mellifera',
    icon: '/images/diorama-chouette.png',
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
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
]

const mielleriesMobileSpecies: ProjectSpecies[] = [
  {
    id: MOCK_SPECIES_BLACK_BEE_ID,
    name: 'Abeille noire',
    scientificName: 'Apis mellifera mellifera',
    icon: '/images/diorama-chouette.png',
    rarity: 7,
    status: 'NT',
    role: 'Pollinisatrice cle',
  },
]

const mielleriesMobileProducts: ProducerProduct[] = [
  {
    id: MOCK_PRODUCT_EUCALYPTUS_ID,
    name: 'Miel Eucalyptus 250g',
    price: 18,
    category: 'Miel',
    impactPercentage: 35,
    size: '250g',
    type: 'impact',
    format: 'bocal',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_EUCALYPTUS_140G_ID,
    name: 'Miel Eucalyptus 140g',
    price: 12,
    category: 'Miel',
    impactPercentage: 35,
    size: '140g',
    type: 'impact',
    format: 'bocal',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_LITCHI_ID,
    name: 'Miel de Litchi',
    price: 20,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_NIAOULI_ID,
    name: 'Miel de Niaouli',
    price: 19,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_MOKARANA_ID,
    name: 'Miel de Mokarana',
    price: 22,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_FORETS_SECHES_ID,
    name: 'Miel de Forêts Sèches',
    price: 21,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_FORETS_HUMIDES_ID,
    name: 'Miel de Forêts Humides',
    price: 23,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_CACTUS_ID,
    name: 'Miel de Cactus',
    price: 20,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_JUJUBIER_ID,
    name: 'Miel de Jujubier',
    price: 19,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_BAIES_ROSES_ID,
    name: 'Miel de Baies Roses',
    price: 24,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_FORETS_PRIMAIRES_ID,
    name: 'Miel de Forêts Primaires',
    price: 25,
    category: 'Miel',
    impactPercentage: 35,
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
]

const sardiniaSpecies: ProjectSpecies[] = [
  {
    id: MOCK_SPECIES_OLIVE_TREE_ID,
    name: 'Olivier',
    scientificName: 'Olea europaea',
    icon: '/images/diorama-chouette.png',
    rarity: 6,
    status: 'LC',
    role: 'Arbre emblematique mediterraneen',
  },
]

const habeebeeSpecies: ProjectSpecies[] = [
  {
    id: MOCK_SPECIES_BUMBLEBEE_ID,
    name: 'Bourdon terrestre',
    scientificName: 'Bombus terrestris',
    icon: '/images/diorama-chouette.png',
    rarity: 5,
    status: 'NT',
    role: 'Pollinisateur cle',
  },
  {
    id: MOCK_SPECIES_OSMIA_ID,
    name: 'Osmie rousse',
    scientificName: 'Osmia rufa',
    icon: '/images/diorama-chouette.png',
    rarity: 5,
    status: 'NT',
    role: 'Pollinisateur cle',
  },
  {
    id: MOCK_SPECIES_MEGACHILE_ID,
    name: 'Mégachile',
    scientificName: 'Megachile sp.',
    icon: '/images/diorama-chouette.png',
    rarity: 5,
    status: 'NT',
    role: 'Pollinisateur cle',
  },
  {
    id: MOCK_SPECIES_SYRPHID_ID,
    name: 'Syrphe ceinturé',
    scientificName: 'Syrphus ribesii',
    icon: '/images/diorama-chouette.png',
    rarity: 4,
    status: 'LC',
    role: 'Pollinisateur',
  },
  {
    id: MOCK_SPECIES_BUTTERFLY_CITRON_ID,
    name: 'Papillon citron',
    scientificName: 'Gonepteryx rhamni',
    icon: '/images/diorama-chouette.png',
    rarity: 4,
    status: 'LC',
    role: 'Pollinisateur',
  },
  {
    id: MOCK_SPECIES_BUTTERFLY_PEACOCK_ID,
    name: 'Paon-du-jour',
    scientificName: 'Aglais io',
    icon: '/images/diorama-chouette.png',
    rarity: 4,
    status: 'LC',
    role: 'Pollinisateur',
  },
  {
    id: MOCK_SPECIES_LADYBUG_ID,
    name: 'Coccinelle',
    scientificName: 'Coccinella septempunctata',
    icon: '/images/diorama-chouette.png',
    rarity: 3,
    status: 'LC',
    role: 'Auxiliaire',
  },
  {
    id: MOCK_SPECIES_OWL_ID,
    name: 'Chouette effraie',
    scientificName: 'Tyto alba',
    icon: '/images/diorama-chouette.png',
    rarity: 6,
    status: 'LC',
    role: 'Faune associee',
  },
  {
    id: MOCK_SPECIES_HEDGEHOG_ID,
    name: 'Hérisson européen',
    scientificName: 'Erinaceus europaeus',
    icon: '/images/diorama-chouette.png',
    rarity: 5,
    status: 'LC',
    role: 'Faune associee',
  },
]

const habeebeeProducts: ProducerProduct[] = [
  {
    id: MOCK_PRODUCT_SAVON_DOUX_ID,
    name: 'Savon DOUX',
    price: 12,
    category: 'Cosmetique',
    impactPercentage: 30,
    type: 'impact',
    format: 'savon',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_HUILE_VISAGE_ID,
    name: 'Huile visage',
    price: 25,
    category: 'Cosmetique',
    impactPercentage: 30,
    type: 'impact',
    format: 'flacon',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_SHAMPOING_ID,
    name: 'Shampoing solide',
    price: 15,
    category: 'Cosmetique',
    impactPercentage: 30,
    type: 'impact',
    format: 'shampoing',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
]

const sardiniaProducts: ProducerProduct[] = [
  {
    id: MOCK_PRODUCT_HUILE_LECCINO_ID,
    name: "Huile d'olive Leccino",
    price: 28,
    category: 'Huile',
    impactPercentage: 40,
    type: 'impact',
    format: 'bouteille',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_HUILE_FRANTOIO_ID,
    name: "Huile d'olive Frantoio",
    price: 32,
    category: 'Huile',
    impactPercentage: 40,
    type: 'impact',
    format: 'bouteille',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
  {
    id: MOCK_PRODUCT_HUILE_LECCIO_ID,
    name: "Huile d'olive Leccio del Corno",
    price: 35,
    category: 'Huile',
    impactPercentage: 40,
    type: 'impact',
    format: 'bouteille',
    image_url: '/images/products/miel-eucalyptus-ilanga.jpg',
  },
]

const coralSpecies: ProjectSpecies[] = [
  {
    id: MOCK_SPECIES_CORAL_ID,
    name: 'Coraux tropicaux',
    scientificName: 'Scleractinia',
    icon: '/images/diorama-chouette.png',
    rarity: 9,
    status: 'CR',
    role: 'Fondateurs des recifs coralliens',
  },
]

const coralProducts: ProducerProduct[] = [
  {
    id: MOCK_PRODUCT_CORAL_3_ID,
    name: 'Pack 3 coraux',
    price: 55,
    category: 'Corail',
    impactPercentage: 25,
    image_url: '/coral-karimunjawa.jpg',
  },
  {
    id: MOCK_PRODUCT_CORAL_6_ID,
    name: 'Pack 6 coraux',
    price: 100,
    category: 'Corail',
    impactPercentage: 25,
    image_url: '/coral-karimunjawa.jpg',
  },
  {
    id: MOCK_PRODUCT_CORAL_12_ID,
    name: 'Pack 12 coraux (mini araignée)',
    price: 180,
    category: 'Corail',
    impactPercentage: 25,
    image_url: '/coral-karimunjawa.jpg',
  },
  {
    id: MOCK_PRODUCT_CORAL_18_ID,
    name: 'Pack 18 coraux (araignée complète)',
    price: 250,
    category: 'Corail',
    impactPercentage: 25,
    image_url: '/coral-karimunjawa.jpg',
  },
]

const coralDonationOptions: DonationOption[] = [
  {
    id: MOCK_DONATION_CORAL_3_ID,
    projectId: MOCK_PROJECT_CORAL_ID,
    name: 'Pack 3 coraux',
    price: 55,
    quantity: 3,
    unitLabel: 'corail',
    rewards: {
      points: 55,
      certificate: true,
      photo: true,
      location: true,
      updates: true,
    },
    impact: {
      unitsRestored: 3,
      unitsLabel: 'corail',
      survivalRate: '60-85%',
      areaRestored: '0,06 m²',
      habitatCreated: 3,
      description: 'Micro-habitats créés pour poissons tropicaux',
    },
  },
  {
    id: MOCK_DONATION_CORAL_6_ID,
    projectId: MOCK_PROJECT_CORAL_ID,
    name: 'Pack 6 coraux',
    price: 100,
    quantity: 6,
    unitLabel: 'corail',
    rewards: {
      points: 100,
      certificate: true,
      photo: true,
      location: true,
      updates: true,
    },
    impact: {
      unitsRestored: 6,
      unitsLabel: 'corail',
      survivalRate: '60-85%',
      areaRestored: '0,12 m²',
      habitatCreated: 6,
      description: 'Micro-habitats créés pour poissons tropicaux',
    },
  },
  {
    id: MOCK_DONATION_CORAL_12_ID,
    projectId: MOCK_PROJECT_CORAL_ID,
    name: 'Pack 12 coraux (mini araignée)',
    price: 180,
    quantity: 12,
    unitLabel: 'corail',
    rewards: {
      points: 180,
      certificate: true,
      photo: true,
      location: true,
      updates: true,
    },
    impact: {
      unitsRestored: 12,
      unitsLabel: 'corail',
      survivalRate: '60-85%',
      areaRestored: '0,24 m²',
      habitatCreated: 12,
      description: 'Structure récifale partielle',
    },
  },
  {
    id: MOCK_DONATION_CORAL_18_ID,
    projectId: MOCK_PROJECT_CORAL_ID,
    name: 'Pack 18 coraux (araignée complète)',
    price: 250,
    quantity: 18,
    unitLabel: 'corail',
    rewards: {
      points: 250,
      certificate: true,
      photo: true,
      location: true,
      updates: true,
    },
    impact: {
      unitsRestored: 18,
      unitsLabel: 'corail',
      survivalRate: '60-85%',
      areaRestored: '0,30-0,50 m²',
      habitatCreated: 18,
      description: 'Structure récifale complète',
    },
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
      images: ['/images/projects/miellerie-manakara.jpg'],
    },
    species: antsirabeSpecies,
    challenges: [],
    producer_products: antsirabeProducts,
    expected_impact: {
      co2Absorbed: 50,
      biodiversityGain: 32,
      jobsCreated: 2,
      timeline: 12,
      beesPerEur: 152,
      honeyGramsPerEur: 7.7,
      flowersPerEur: 1154,
      propolisGramsPerEur: 0.0385,
      waxGramsPerEur: 0.92,
      pollenGramsPerEur: 7.7,
      nectarGramsPerEur: 19.2,
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
      images: ['/images/projects/miellerie-manakara.jpg'],
    },
    species: manakaraSpecies,
    challenges: [],
    producer_products: manakaraProducts,
    expected_impact: {
      co2Absorbed: 42,
      biodiversityGain: 28,
      jobsCreated: 2,
      timeline: 12,
      beesPerEur: 152,
      honeyGramsPerEur: 7.7,
      flowersPerEur: 1154,
      propolisGramsPerEur: 0.0385,
      waxGramsPerEur: 0.92,
      pollenGramsPerEur: 7.7,
      nectarGramsPerEur: 19.2,
    },
  },
  {
    id: MOCK_PROJECT_MIELLERIES_MOBILE_ID,
    slug: MOCK_PROJECT_MIELLERIES_MOBILE_SLUG,
    status: 'active',
    type: 'equipment',
    featured: true,
    name_default: 'Mielleries mobiles',
    name_i18n: {
      fr: 'Mielleries mobiles',
      en: 'Mobile Honey Houses',
    },
    description_default:
      'Véritables ateliers de récolte itinérants, nos mielleries mobiles tout-terrain permettent de collecter le miel directement auprès des apiculteurs, même dans les régions les plus isolées de Madagascar.',
    description_i18n: {
      fr: 'Véritables ateliers de récolte itinérants, nos mielleries mobiles tout-terrain permettent de collecter le miel directement auprès des apiculteurs, même dans les régions les plus isolées de Madagascar.',
      en: 'True itinerant harvesting workshops, our all-terrain mobile honey houses allow us to collect honey directly from beekeepers, even in the most remote regions of Madagascar.',
    },
    long_description_default:
      "Les mielleries mobiles sont un concept innovant utilisé par notre société pour accéder aux ruchers difficiles d'accès dans les différentes régions de Madagascar. Il s'agit de camions tout-terrain aménagés en mielleries permettant la récolte directement sur place, à l'abri de la poussière et de l'humidité, selon les bonnes pratiques apicoles modernes.\n\nCes unités sont équipées d'un matériel de récolte professionnel, tel que des extracteurs de miel électriques, des cuves d'assèchement, une cuve de filtration, des centrifugeuses, des filtres à miel et un compartiment de stockage à basse température pour conserver le miel brut jusqu'à la miellerie. Elles sont également équipées de générateurs pour alimenter les machines et de réservoirs d'eau pour le lavage des équipements.\n\nCela permet aux apiculteurs d'Ilanga Nature d'accéder à des ruchers situés dans des zones difficiles d'accès - comme les forêts tropicales ou les montagnes - où les abeilles récoltent un nectar rare et de grande qualité. Les apiculteurs peuvent ainsi récolter un miel de la plus haute qualité et maximiser les rendements tout en réduisant les coûts de transport et de main-d'œuvre.\n\nNotre école les utilise également pour former les apiculteurs locaux. Les formateurs peuvent se rendre directement dans les ruchers pour faire la démonstration des techniques de récolte et de traitement du miel, et les participants peuvent immédiatement mettre en pratique les compétences qu'ils ont acquises.\n\nCes unités d'extraction/récolte sont approuvées par le ministère de l'élevage pour l'exportation vers l'Union européenne.",
    long_description_i18n: {
      fr: "Les mielleries mobiles sont un concept innovant utilisé par notre société pour accéder aux ruchers difficiles d'accès dans les différentes régions de Madagascar. Il s'agit de camions tout-terrain aménagés en mielleries permettant la récolte directement sur place, à l'abri de la poussière et de l'humidité, selon les bonnes pratiques apicoles modernes.\n\nCes unités sont équipées d'un matériel de récolte professionnel, tel que des extracteurs de miel électriques, des cuves d'assèchement, une cuve de filtration, des centrifugeuses, des filtres à miel et un compartiment de stockage à basse température pour conserver le miel brut jusqu'à la miellerie. Elles sont également équipées de générateurs pour alimenter les machines et de réservoirs d'eau pour le lavage des équipements.\n\nCela permet aux apiculteurs d'Ilanga Nature d'accéder à des ruchers situés dans des zones difficiles d'accès - comme les forêts tropicales ou les montagnes - où les abeilles récoltent un nectar rare et de grande qualité. Les apiculteurs peuvent ainsi récolter un miel de la plus haute qualité et maximiser les rendements tout en réduisant les coûts de transport et de main-d'œuvre.\n\nNotre école les utilise également pour former les apiculteurs locaux. Les formateurs peuvent se rendre directement dans les ruchers pour faire la démonstration des techniques de récolte et de traitement du miel, et les participants peuvent immédiatement mettre en pratique les compétences qu'ils ont acquises.\n\nCes unités d'extraction/récolte sont approuvées par le ministère de l'élevage pour l'exportation vers l'Union européenne.",
      en: 'Mobile honey houses are an innovative concept used by our company to access hard-to-reach apiaries in different regions of Madagascar. These are all-terrain trucks converted into honey houses allowing on-site harvesting, protected from dust and humidity, following modern beekeeping practices.\n\nThese units are equipped with professional harvesting equipment, such as electric honey extractors, settling tanks, filtration tanks, centrifuges, honey filters and a low-temperature storage compartment to keep raw honey until the honey house. They are also equipped with generators to power the machines and water tanks for washing equipment.\n\nThis allows Ilanga Nature beekeepers to access hives located in hard-to-reach areas - such as tropical forests or mountains - where bees collect rare and high-quality nectar. Beekeepers can thus harvest honey of the highest quality and maximize yields while reducing transport and labor costs.\n\nOur school also uses them to train local beekeepers. Trainers can go directly to the apiaries to demonstrate honey harvesting and processing techniques, and participants can immediately put into practice the skills they have acquired.\n\nThese extraction/harvesting units are approved by the Ministry of Livestock for export to the European Union.',
    },
    address_city: 'Antsirabe',
    address_country_code: 'Madagascar',
    latitude: -19.8659,
    longitude: 47.0335,
    launch_date: '2026-04-01',
    maturity_date: null,
    current_funding: 5500,
    target_budget: 16500,
    hero_image_url: '/miellerie-mobile.png',
    images: ['/miellerie-mobile.png'],
    unit_price_eur: 75000,
    unit_label: 'camion',
    updated_at: '2026-04-19T10:00:00.000Z',
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
      images: ['/images/projects/miellerie-manakara.jpg'],
    },
    species: mielleriesMobileSpecies,
    challenges: [],
    producer_products: mielleriesMobileProducts,
    expected_impact: {
      co2Absorbed: 65,
      biodiversityGain: 40,
      jobsCreated: 3,
      timeline: 18,
      beesPerEur: 152,
      honeyGramsPerEur: 7.7,
      flowersPerEur: 1154,
      propolisGramsPerEur: 0.0385,
      waxGramsPerEur: 0.92,
      pollenGramsPerEur: 7.7,
      nectarGramsPerEur: 19.2,
    },
  },
  {
    id: MOCK_PROJECT_SARDINIA_ID,
    slug: MOCK_PROJECT_SARDINIA_SLUG,
    status: 'active',
    type: 'orchard',
    featured: true,
    name_default: 'Oliviers en Sardaigne',
    name_i18n: {
      fr: 'Oliviers en Sardaigne',
      en: 'Olive Trees in Sardinia',
    },
    description_default:
      '10 000 oliviers issus de plusieurs variétés toscanes (Leccino, Frantoio, Leccio del Corno) avec un moulin pour le pressage directement sur le site.',
    description_i18n: {
      fr: '10 000 oliviers issus de plusieurs variétés toscanes (Leccino, Frantoio, Leccio del Corno) avec un moulin pour le pressage directement sur le site.',
      en: '10,000 olive trees from several Tuscan varieties (Leccino, Frantoio, Leccio del Corno) with a mill for pressing directly on site.',
    },
    long_description_default:
      "Notre projet en Sardaigne compte 10 000 oliviers issus de plusieurs variétés toscanes prestigieuses : Leccino, Frantoio et Leccio del Corno. Ces variétés sont réputées pour produire des huiles d'olive de haute qualité aux arômes complexes et équilibrés.\n\nUn moulin à huile moderne est installé directement sur le site, permettant le pressage des olives immédiatement après la récolte. Cette approche de 'ferme à bouteille' garantit une fraîcheur optimale et préserve les qualités organoleptiques de l'huile.\n\nLe projet s'inscrit dans une démarche d'agriculture durable, respectant les cycles naturels des oliviers et minimisant l'impact environnemental. Les techniques culturales privilégient la biodiversité et la santé des sols, sans utilisation de produits chimiques de synthèse.\n\nCette exploitation contribue à la préservation du paysage oléicole traditionnel sard, tout en innovant avec des méthodes modernes de production et de transformation.",
    long_description_i18n: {
      fr: "Notre projet en Sardaigne compte 10 000 oliviers issus de plusieurs variétés toscanes prestigieuses : Leccino, Frantoio et Leccio del Corno. Ces variétés sont réputées pour produire des huiles d'olive de haute qualité aux arômes complexes et équilibrés.\n\nUn moulin à huile moderne est installé directement sur le site, permettant le pressage des olives immédiatement après la récolte. Cette approche de 'ferme à bouteille' garantit une fraîcheur optimale et préserve les qualités organoleptiques de l'huile.\n\nLe projet s'inscrit dans une démarche d'agriculture durable, respectant les cycles naturels des oliviers et minimisant l'impact environnemental. Les techniques culturales privilégient la biodiversité et la santé des sols, sans utilisation de produits chimiques de synthèse.\n\nCette exploitation contribue à la préservation du paysage oléicole traditionnel sard, tout en innovant avec des méthodes modernes de production et de transformation.",
      en: "Our project in Sardinia features 10,000 olive trees from several prestigious Tuscan varieties: Leccino, Frantoio and Leccio del Corno. These varieties are renowned for producing high-quality olive oils with complex and balanced aromas.\n\nA modern oil mill is installed directly on site, allowing olives to be pressed immediately after harvest. This 'farm-to-bottle' approach ensures optimal freshness and preserves the organoleptic qualities of the oil.\n\nThe project follows sustainable farming practices, respecting natural olive tree cycles and minimizing environmental impact. Cultivation techniques prioritize biodiversity and soil health, without the use of synthetic chemicals.\n\nThis operation contributes to the preservation of the traditional Sardinian olive landscape, while innovating with modern production and transformation methods.",
    },
    address_city: 'Sassari',
    address_country_code: 'Italie',
    latitude: 40.7259,
    longitude: 8.5546,
    launch_date: '2026-05-01',
    maturity_date: null,
    current_funding: 12000,
    target_budget: 25000,
    hero_image_url: '/images/projects/miellerie-manakara.jpg',
    images: ['/images/projects/miellerie-manakara.jpg'],
    unit_price_eur: 150,
    unit_label: 'olivier',
    updated_at: '2026-04-19T10:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_SARDINIA_ID,
      slug: MOCK_PRODUCER_SARDINIA_SLUG,
      name_default: 'Oliviers de Sardaigne',
      name_i18n: {
        fr: 'Oliviers de Sardaigne',
        en: 'Sardinia Olive Trees',
      },
      description_default: 'Production d\'huile d\'olive premium en Sardaigne.',
      description_i18n: {
        fr: 'Production d\'huile d\'olive premium en Sardaigne.',
        en: 'Premium olive oil production in Sardinia.',
      },
      contact_website: 'https://oliviers-sardaigne.it',
      images: ['/images/projects/miellerie-manakara.jpg'],
    },
    species: sardiniaSpecies,
    challenges: [],
    producer_products: sardiniaProducts,
    expected_impact: {
      co2Absorbed: 50,
      biodiversityGain: 60,
      jobsCreated: 8,
      timeline: 24,
      olivesSupported: 1,
      oilGeneratedLiters: 4,
      co2SequesteredPerOlive: 10,
    },
  },
  {
    id: MOCK_PROJECT_CORAL_ID,
    slug: MOCK_PROJECT_CORAL_SLUG,
    status: 'active',
    type: 'reef',
    featured: true,
    name_default: 'Restauration des récifs coralliens',
    name_i18n: {
      fr: 'Restauration des récifs coralliens',
      en: 'Coral Reef Restoration',
    },
    description_default:
      'Restaurer les récifs coralliens en implantant de nouveaux fragments de corail et en recréant des zones de biodiversité active.',
    description_i18n: {
      fr: 'Restaurer les récifs coralliens en implantant de nouveaux fragments de corail et en recréant des zones de biodiversité active.',
      en: 'Restore coral reefs by planting new coral fragments and recreating active biodiversity zones.',
    },
    long_description_default:
      'Notre projet de restauration des récifs coralliens se déroule à Karimunjawa, en Indonésie, où nous implantons de nouveaux fragments de corail pour recréer des zones de biodiversité marine active. Les coraux sont les fondements des écosystèmes tropicaux, fournissant un habitat essentiel à des milliers d\'espèces marines.\n\nLes coraux restaurés ont 60 à 85% de chance de survie sur 12 mois, créant des micro-habitats pour les poissons tropicaux et régénérant 0,02 m² de récif par corail. Chaque structure complète (18 coraux) restaure 0,3 à 0,5 m² de récif.\n\nCe projet a un impact environnemental majeur : recréation d\'habitats marins, augmentation de la biodiversité, retour des poissons tropicaux, développement d\'écosystèmes complets et protection des côtes contre l\'érosion.\n\nSur le plan social et économique, nous employons des plongeurs et des équipes locales, développons un tourisme durable et sensibilisons les populations locales à l\'importance de la conservation marine.',
    long_description_i18n: {
      fr: 'Notre projet de restauration des récifs coralliens se déroule à Karimunjawa, en Indonésie, où nous implantons de nouveaux fragments de corail pour recréer des zones de biodiversité marine active. Les coraux sont les fondements des écosystèmes tropicaux, fournissant un habitat essentiel à des milliers d\'espèces marines.\n\nLes coraux restaurés ont 60 à 85% de chance de survie sur 12 mois, créant des micro-habitats pour les poissons tropicaux et régénérant 0,02 m² de récif par corail. Chaque structure complète (18 coraux) restaure 0,3 à 0,5 m² de récif.\n\nCe projet a un impact environnemental majeur : recréation d\'habitats marins, augmentation de la biodiversité, retour des poissons tropicaux, développement d\'écosystèmes complets et protection des côtes contre l\'érosion.\n\nSur le plan social et économique, nous employons des plongeurs et des équipes locales, développons un tourisme durable et sensibilisons les populations locales à l\'importance de la conservation marine.',
      en: 'Our coral reef restoration project takes place in Karimunjawa, Indonesia, where we plant new coral fragments to recreate active marine biodiversity zones. Corals are the foundation of tropical ecosystems, providing essential habitat for thousands of marine species.\n\nRestored corals have a 60-85% survival rate over 12 months, creating micro-habitats for tropical fish and regenerating 0.02 m² of reef per coral. Each complete structure (18 corals) restores 0.3 to 0.5 m² of reef.\n\nThis project has major environmental impact: marine habitat recreation, biodiversity increase, return of tropical fish, complete ecosystem development and coastal protection against erosion.\n\nSocially and economically, we employ divers and local teams, develop sustainable tourism and raise local awareness about the importance of marine conservation.',
    },
    address_city: 'Karimunjawa',
    address_country_code: 'Indonésie',
    latitude: -5.8333,
    longitude: 110.45,
    launch_date: '2026-06-01',
    maturity_date: null,
    current_funding: 8500,
    target_budget: 15000,
    hero_image_url: '/coral-karimunjawa.jpg',
    images: ['/coral-karimunjawa.jpg'],
    unit_price_eur: 30,
    unit_label: 'corail',
    updated_at: '2026-04-19T10:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_TRILOGY_ID,
      slug: MOCK_PRODUCER_TRILOGY_SLUG,
      name_default: 'Trilogy Ocean Restoration',
      name_i18n: {
        fr: 'Trilogy Ocean Restoration',
        en: 'Trilogy Ocean Restoration',
      },
      description_default: 'Restauration des récifs coralliens en Indonésie.',
      description_i18n: {
        fr: 'Restauration des récifs coralliens en Indonésie.',
        en: 'Coral reef restoration in Indonesia.',
      },
      contact_website: 'https://linktr.ee/underwatergardeners',
      images: ['/coral-karimunjawa.jpg'],
    },
    species: coralSpecies,
    challenges: [],
    producer_products: null,
    donation_options: coralDonationOptions,
    expected_impact: {
      co2Absorbed: null,
      biodiversityGain: null,
      jobsCreated: null,
      timeline: null,
      fishShelterCapacity: 3,
      blueCarbonPotential: 0.5,
      biodiversityPoints: 5,
    },
  },
  {
    id: MOCK_PROJECT_HABEEBEE_ID,
    slug: MOCK_PROJECT_HABEEBEE_SLUG,
    status: 'active',
    type: 'beehive',
    featured: true,
    name_default: 'Habeebee Belgique',
    name_i18n: {
      fr: 'Habeebee Belgique',
      en: 'Habeebee Belgium',
    },
    description_default:
      'Projet d\'apiculture urbaine en Belgique pour soutenir les pollinisateurs locaux et développer des produits écologiques.',
    description_i18n: {
      fr: 'Projet d\'apiculture urbaine en Belgique pour soutenir les pollinisateurs locaux et développer des produits écologiques.',
      en: 'Urban beekeeping project in Belgium to support local pollinators and develop ecological products.',
    },
    long_description_default:
      'Habeebee est un projet d\'apiculture urbaine basé en Belgique, dédié à la protection des pollinisateurs locaux et à la production de cosmétiques écologiques. Nos ruches sont installées dans des zones urbaines et périurbaines, permettant aux abeilles de butiner dans les jardins et espaces verts locaux.\n\nLe projet vise à créer un réseau de ruches urbaines connectées, chaque ruche hébergeant environ 50 000 abeilles. Ces abeilles pollinisent les plantes locales, contribuant à la biodiversité urbaine et à la production de fruits et légumes dans les jardins alentour.\n\nLes produits dérivés de notre miel sont transformés localement en cosmétiques naturels : savons doux, huiles visage et shampoings solides. Chaque produit est conçu avec des ingrédients respectueux de l\'environnement et sans produits chimiques.\n\nCe projet s\'inscrit dans une démarche d\'ancrage écologique, reconnectant les citadens à la nature et sensibilisant à l\'importance des pollinisateurs dans nos écosystèmes.',
    long_description_i18n: {
      fr: 'Habeebee est un projet d\'apiculture urbaine basé en Belgique, dédié à la protection des pollinisateurs locaux et à la production de cosmétiques écologiques. Nos ruches sont installées dans des zones urbaines et périurbaines, permettant aux abeilles de butiner dans les jardins et espaces verts locaux.\n\nLe projet vise à créer un réseau de ruches urbaines connectées, chaque ruche hébergeant environ 50 000 abeilles. Ces abeilles pollinisent les plantes locales, contribuant à la biodiversité urbaine et à la production de fruits et légumes dans les jardins alentour.\n\nLes produits dérivés de notre miel sont transformés localement en cosmétiques naturels : savons doux, huiles visage et shampoings solides. Chaque produit est conçu avec des ingrédients respectueux de l\'environnement et sans produits chimiques.\n\nCe projet s\'inscrit dans une démarche d\'ancrage écologique, reconnectant les citadens à la nature et sensibilisant à l\'importance des pollinisateurs dans nos écosystèmes.',
      en: 'Habeebee is an urban beekeeping project based in Belgium, dedicated to protecting local pollinators and producing ecological cosmetics. Our hives are installed in urban and peri-urban areas, allowing bees to forage in local gardens and green spaces.\n\nThe project aims to create a network of connected urban hives, each hive housing approximately 50,000 bees. These bees pollinate local plants, contributing to urban biodiversity and fruit and vegetable production in surrounding gardens.\n\nProducts derived from our honey are locally processed into natural cosmetics: gentle soaps, facial oils and solid shampoos. Each product is designed with environmentally friendly ingredients and without chemicals.\n\nThis project is part of an ecological approach, reconnecting city dwellers with nature and raising awareness about the importance of pollinators in our ecosystems.',
    },
    address_city: 'Bruxelles',
    address_country_code: 'Belgique',
    latitude: 50.8503,
    longitude: 4.3517,
    launch_date: '2026-07-01',
    maturity_date: null,
    current_funding: 8500,
    target_budget: 20000,
    hero_image_url: '/images/projects/miellerie-manakara.jpg',
    images: ['/images/projects/miellerie-manakara.jpg'],
    unit_price_eur: 1300,
    unit_label: 'ruche',
    updated_at: '2026-04-22T10:00:00.000Z',
    producer: {
      id: MOCK_PRODUCER_HABEEBEE_ID,
      slug: MOCK_PRODUCER_HABEEBEE_SLUG,
      name_default: 'Habeebee',
      name_i18n: {
        fr: 'Habeebee',
        en: 'Habeebee',
      },
      description_default: 'Apiculture urbaine et cosmétiques écologiques en Belgique.',
      description_i18n: {
        fr: 'Apiculture urbaine et cosmétiques écologiques en Belgique.',
        en: 'Urban beekeeping and ecological cosmetics in Belgium.',
      },
      contact_website: 'https://habeebee.be',
      images: ['/images/projects/miellerie-manakara.jpg'],
    },
    species: habeebeeSpecies,
    challenges: [],
    producer_products: habeebeeProducts,
    expected_impact: {
      co2Absorbed: 25,
      biodiversityGain: 40,
      jobsCreated: 3,
      timeline: 12,
      beesPerEur: 38,
      honeyGramsPerEur: 7.7,
      flowersPerEur: 290,
      propolisGramsPerEur: 0.0385,
      waxGramsPerEur: 0.92,
      pollenGramsPerEur: 7.7,
      nectarGramsPerEur: 19.2,
    },
  },
]

export const getMockProjects = (): MockProjectSeed[] => MOCK_PROJECTS

export const getMockProjectBySlug = (slug: string): MockProjectSeed | null =>
  MOCK_PROJECTS.find((project) => project.slug === slug) || null
