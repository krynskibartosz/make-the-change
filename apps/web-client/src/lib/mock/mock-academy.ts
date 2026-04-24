// ─────────────────────────────────────────────────────────────
// Academy Mock Data — lib/mock/mock-academy.ts
// Aligned with the app's mock data architecture in lib/mock/
// ─────────────────────────────────────────────────────────────

export type UnitStatus = 'completed' | 'active' | 'locked'
export type MascotteKey = 'ondine' | 'sylva' | 'abeille-transparente'

export type AcademyUnit = {
  id: string
  title: string
  status: UnitStatus
  reward: string
  mascotte: MascotteKey
  description?: string
}

export type AcademyChapter = {
  title: string
  subtitle: string
}

export type AcademySyllabus = {
  chapter: AcademyChapter
  units: AcademyUnit[]
}

const MOCK_ACADEMY_SYLLABUS: AcademySyllabus = {
  chapter: {
    title: "L'Alphabet Originel",
    subtitle: "Maîtrisez les éléments fondamentaux de la nature.",
  },
  units: [
    {
      id: '1.1',
      title: 'Les Forges de la Vie',
      status: 'completed',
      reward: '10 💧',
      mascotte: 'ondine',
      description: 'Soleil, eau, sols... Découvre les 3 éléments qui créent l\'énergie de notre planète.',
    },
    {
      id: '1.2',
      title: 'Le Peuple Émeraude',
      status: 'completed',
      reward: '10 🍃',
      mascotte: 'sylva',
      description: 'Les plantes sont les usines magiques de notre monde. Explore leurs secrets.',
    },
    {
      id: '1.3',
      title: 'Le Bestiaire Sauvage',
      status: 'active',
      reward: '15 🐾',
      mascotte: 'abeille-transparente',
      description: 'Découvre les animaux fascinants qui peuplent nos écosystèmes.',
    },
    {
      id: '2.1',
      title: 'Le Festin des Prédateurs',
      status: 'locked',
      reward: '20 🐺',
      mascotte: 'ondine',
      description: 'Dans la nature, tout le monde mange ou est mangé. Explore la chaîne alimentaire.',
    },
  ],
}

export function getMockAcademySyllabus(): AcademySyllabus {
  return MOCK_ACADEMY_SYLLABUS
}
