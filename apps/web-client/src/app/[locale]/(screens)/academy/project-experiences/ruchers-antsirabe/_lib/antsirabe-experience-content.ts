import { HIVE_ESTIMATES } from './antsirabe-estimates'

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
  { id: 'pollination-sort', label: 'Pollinisation', implemented: false },
  { id: 'waggle-dance',     label: 'La danse',      implemented: false },
  { id: 'honey-effort',     label: 'Le miel',       implemented: false },
  { id: 'impact',           label: 'Impact',        implemented: false },
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
