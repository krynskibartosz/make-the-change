import { HIVE_ESTIMATES, HONEY_ESTIMATES } from './antsirabe-estimates'

export type ExperienceStepId =
  | 'intro'
  | 'territory'
  | 'pollination-sort'
  | 'waggle-dance'
  | 'honey-effort'
  | 'impact'

export type ExperienceStep = {
  id: ExperienceStepId
  label: string
  implemented: boolean
}

export const EXPERIENCE_STEPS: ExperienceStep[] = [
  { id: 'intro',            label: 'Intro',         implemented: true  },
  { id: 'territory',        label: 'Territoire',    implemented: true  },
  { id: 'pollination-sort', label: 'Pollinisation', implemented: true  },
  { id: 'waggle-dance',     label: 'La danse',      implemented: true  },
  { id: 'honey-effort',     label: 'Le miel',       implemented: true  },
  { id: 'impact',           label: 'Impact',        implemented: true  },
]

export const INTRO_CONTENT = {
  eyebrow: 'Ruchers Antsirabe · Ilanga Nature',
  lines: ['45 ruches.', 'Des millions de fleurs.', 'Un réseau invisible.'],
  body: "Tu as soutenu un projet. Voici ce qu'il rend possible — et pourquoi c'est plus étrange et plus beau qu'un pot de miel.",
  cta: 'Explorer',
} as const

export const TERRITORY_CONTENT = {
  title: 'Le territoire invisible',
  intro: "Une ruche ne tient pas dans une boîte. Chaque ruche rayonne sur des kilomètres à la ronde.",
  activateCta: 'Activer le réseau',
  // Valeurs tirées de antsirabe-estimates — source unique de vérité
  stats: [
    {
      value: HIVE_ESTIMATES.foragingAreaKm2.display,
      label: 'par ruche',
      note: HIVE_ESTIMATES.foragingAreaKm2.note,
    },
    {
      value: HIVE_ESTIMATES.flowersPerDayPerHive.display,
      label: 'fleurs/jour',
      note: HIVE_ESTIMATES.flowersPerDayPerHive.note,
    },
  ],
  disclaimer: 'Ordres de grandeur — pas des mesures individualisées',
  cta: 'Continuer',
  comingSoon: 'La suite arrive bientôt',
} as const

// ─── Pollination Sort ─────────────────────────────────────────────────────────

export type PollinationCategory =
  | 'strongly-bees'
  | 'benefits-bees'
  | 'other-pollinators'
  | 'no-bees'

export type PollinationCard = {
  id: string
  emoji: string
  name: string
  category: PollinationCategory
  correctFeedback: string
  incorrectFeedback: string
  explanation: string
  surprise?: boolean
}

// ─── Waggle Dance ─────────────────────────────────────────────────────────────

export const WAGGLE_DANCE_CONTENT = {
  title: 'Le GPS de la ruche',
  intro: "Dans le noir de la ruche, une butineuse peut indiquer où se trouvent des fleurs.",
  observation: "Elle ne danse pas. Elle transmet une adresse.",
  directionRule: "Angle de la danse = direction par rapport au soleil",
  distanceRule: "Durée du frétillement = distance approximative",
  success: "Tu viens de décoder une adresse biologique.",
  networkReveal: "Une découverte individuelle devient une décision collective.",
} as const

export const WAGGLE_SCENARIO = {
  flowerPatch: "Floraison d'eucalyptus",
  angleDeg: 60,
  directionLabel: 'à droite du soleil',
  distanceKm: 2,
  correctDirection: 'sun-right' as const,
  correctDistance: '2km' as const,
} as const

// ─── Pollination Sort ─────────────────────────────────────────────────────────

export const POLLINATION_CARDS: PollinationCard[] = [
  {
    id: 'almonds',
    emoji: '🌰',
    name: 'Amandes',
    category: 'strongly-bees',
    correctFeedback: "Exactement. Sans abeilles, les amandiers ne produisent presque rien.",
    incorrectFeedback: "Les amandes dépendent fortement des abeilles — quasi irremplaçables ici.",
    explanation: "En Californie, 1,5 million de ruches sont transportées chaque année juste pour polliniser les amandiers.",
  },
  {
    id: 'rice',
    emoji: '🍚',
    name: 'Riz',
    category: 'no-bees',
    correctFeedback: "Exact. Le riz est une graminée pollinisée par le vent — les abeilles ne jouent aucun rôle.",
    incorrectFeedback: "Le riz n'a pas besoin d'abeilles — il est pollinisé par le vent, comme le blé et le maïs.",
    explanation: "Les graminées libèrent leur pollen dans l'air. Aucun insecte n'est nécessaire.",
  },
  {
    id: 'strawberries',
    emoji: '🍓',
    name: 'Fraises',
    category: 'benefits-bees',
    correctFeedback: "Bonne nuance. Les fraises peuvent s'autopolliniser, mais les abeilles améliorent nettement la qualité.",
    incorrectFeedback: "Les fraises bénéficient des abeilles — mais elles ne disparaissent pas sans elles.",
    explanation: "Avec les abeilles, les fraises sont plus grosses, plus régulières et moins difformes.",
  },
  {
    id: 'avocado',
    emoji: '🥑',
    name: 'Avocat',
    category: 'benefits-bees',
    correctFeedback: "Juste. L'avocat bénéficie fortement des abeilles, mais d'autres insectes peuvent aussi le polliniser.",
    incorrectFeedback: "L'avocat bénéficie des abeilles — sa fleur complexe rend les insectes très utiles.",
    explanation: "La fleur d'avocat est femelle le matin et mâle l'après-midi — les abeilles naviguent ce mécanisme mieux que quiconque.",
  },
  {
    id: 'cacao',
    emoji: '🍫',
    name: 'Cacao / chocolat',
    category: 'other-pollinators',
    correctFeedback: "Exactement. Le cacao dépend surtout de minuscules moucherons — pas des abeilles.",
    incorrectFeedback: "Surprise : le cacao dépend surtout de minuscules moucherons (Forcipomyia), pas des abeilles.",
    explanation: "Ces moucherons de 1 mm vivent dans les feuilles mortes au pied des cacaoyers. Sans eux, pas de chocolat — les abeilles ne visitent presque pas ces fleurs.",
    surprise: true,
  },
  {
    id: 'coffee',
    emoji: '☕',
    name: 'Café',
    category: 'benefits-bees',
    correctFeedback: "Bonne réponse. Le café peut s'autopolliniser, mais les abeilles augmentent les rendements de 20 à 50 %.",
    incorrectFeedback: "Le café bénéficie des abeilles — il ne disparaîtrait pas sans elles, mais la récolte chuterait.",
    explanation: "Le café est souvent mal cité : il peut survivre sans abeilles, mais avec elles, la récolte est bien plus abondante.",
  },
  {
    id: 'wheat',
    emoji: '🌾',
    name: 'Blé',
    category: 'no-bees',
    correctFeedback: "Exact. Comme le riz, le blé est pollinisé par le vent.",
    incorrectFeedback: "Le blé se pollinise par le vent — pas d'insectes nécessaires.",
    explanation: "Le blé produit un pollen léger, conçu pour voyager dans l'air sur des centaines de mètres.",
  },
  {
    id: 'corn',
    emoji: '🌽',
    name: 'Maïs',
    category: 'no-bees',
    correctFeedback: "Oui. Le maïs est anémophile : il compte sur le vent, pas sur les insectes.",
    incorrectFeedback: "Le maïs n'a pas besoin d'abeilles — il est pollinisé par le vent.",
    explanation: "Les longues soies du maïs captent le pollen qui tombe d'en haut — un système purement aérien.",
  },
]

// ─── Honey Effort ─────────────────────────────────────────────────────────────

export type HoneyTierId = '1tsp' | '250g' | '500g'

export type HoneyTier = {
  id: HoneyTierId
  label: string
  flowers: { display: string; note: string }
  flight:  { display: string; context: string }
  bees:    { display: string; note: string }
  wow:     string
}

export const HONEY_EFFORT_CONTENT = {
  title:     'Le prix d\'un pot',
  subtitle:  "Derrière chaque gramme de miel : un effort collectif invisible.",
  disclaimer: HONEY_ESTIMATES.flowersPer500g.note,
  workerFact: HONEY_ESTIMATES.honeyPerWorkerLifetimeTsp.display,
  workerNote: HONEY_ESTIMATES.honeyPerWorkerLifetimeTsp.note,
} as const

export const HONEY_TIERS: HoneyTier[] = [
  {
    id: '1tsp',
    label: '1 cuillère',
    flowers: {
      display: '≈ 28 000',
      note: 'Proportionnel à 2 M de fleurs / 500 g',
    },
    flight: {
      display: '≈ 1 120 km',
      context: '≈ Paris – Barcelone',
    },
    bees: {
      display: '≈ 12 abeilles',
      note: "Chacune a produit 1/12 de cuillère à café — soit l'intégralité de sa vie de butineuse.",
    },
    wow: 'Toute la vie de 12 abeilles. Pour une cuillère.',
  },
  {
    id: '250g',
    label: '250 g',
    flowers: {
      display: '≈ 1 million',
      note: HONEY_ESTIMATES.flowersPer500g.note,
    },
    flight: {
      display: '≈ 40 000 km',
      context: '≈ 1 tour de la Terre',
    },
    bees: {
      display: '≈ 430 abeilles',
      note: 'Estimation : 250 g ÷ 0,58 g par abeille (1/12 cuillère à café ≈ 0,58 g)',
    },
    wow: 'Un demi-pot : 430 vies de butineuses.',
  },
  {
    id: '500g',
    label: '500 g',
    flowers: {
      display: HONEY_ESTIMATES.flowersPer500g.display,
      note: HONEY_ESTIMATES.flowersPer500g.note,
    },
    flight: {
      display: HONEY_ESTIMATES.collectiveFlightKmPer500g.display,
      context: HONEY_ESTIMATES.collectiveFlightKmPer500g.note,
    },
    bees: {
      display: '≈ 860 abeilles',
      note: 'Estimation collective — jamais mesurable individuellement.',
    },
    wow: '2 tours de la Terre en vol collectif. Pour un seul pot.',
  },
]

// ─── Final Impact ─────────────────────────────────────────────────────────────

export const IMPACT_CONTENT = {
  label:    'Récapitulatif',
  title:    'Ce que tes ruches rendent possible',
  subtitle: "Autour d'Antsirabe, 45 ruches ne produisent pas seulement du miel. Elles relient fleurs, cultures, abeilles et apiculteurs.",
  pillars: [
    {
      icon:  '🌸',
      title: 'Pollinisation',
      body:  'Des millions de visites florales chaque jour autour des 45 ruches.',
    },
    {
      icon:  '🌿',
      title: 'Biodiversité',
      body:  "Un réseau d'interactions locales entre espèces végétales et pollinisateurs.",
    },
    {
      icon:  '🍯',
      title: 'Miel',
      body:  "Une récolte issue d'un effort collectif — des centaines de vies de butineuses.",
    },
    {
      icon:  '👨‍🌾',
      title: 'Revenus locaux',
      body:  'Un projet porté par Andraina et Ilanga Nature, ancré à Antsirabe.',
    },
  ],
  closing: "Le plus précieux n'est pas le pot. C'est le réseau vivant derrière lui.",
  cta:     "Terminer l'expérience",
  restart: 'Revoir depuis le début',
} as const
