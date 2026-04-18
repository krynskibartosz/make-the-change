import type { SpeciesContext } from '@/types/context'
import { MOCK_EXISTING_VIEWER_ID } from '@/lib/mock/mock-viewer'

const createUserStatus = (isUnlocked: boolean, level: number) => ({
  isUnlocked,
  unlockedDate: isUnlocked ? '2026-04-02T09:00:00.000Z' : null,
  unlockSource: isUnlocked ? 'mock_contribution_reward' : null,
  progressionLevel: level,
})

const MOCK_SPECIES: SpeciesContext[] = [
  {
    id: 'species-chouette-effraie',
    name_default: 'Chouette Effraie',
    scientific_name: 'Tyto alba',
    description_default:
      'Gardienne nocturne des paysages agricoles vivants, elle aide à réguler naturellement les écosystèmes.',
    conservation_status: 'LC',
    image_url: '/images/diorama-chouette.png',
    associated_projects: [
      {
        id: 'mock-project-ruchers-antsirabe',
        slug: 'ruchers-apiculteurs-independants-antsirabe',
        name: 'Ruchers d’apiculteurs indépendants à Antsirabe',
        type: 'beehive',
        role: 'Habitat indirect',
        impact: 'Les zones mellifères favorisent aussi les chaînes écologiques locales.',
        userParticipation: true,
      },
    ],
    associated_producers: [
      {
        id: 'mock-producer-ilanga-nature',
        name: 'Ilanga Nature',
        location: 'Madagascar',
        relationship: 'Producteur partenaire',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: 'mock-challenge-eco-fact',
        name: 'Éco-Fact du jour',
        type: 'education',
        difficulty: 'easy',
        rewards: ['50 graines'],
        userProgress: 100,
      },
    ],
    user_status: createUserStatus(true, 2),
    habitat: ['Bocages', 'Vergers', 'Prairies'],
    threats: ['Disparition des haies', 'Artificialisation des sols'],
  },
  {
    id: 'species-abeille-mellifere',
    name_default: 'Abeille mellifère',
    scientific_name: 'Apis mellifera',
    description_default:
      'Pollinisatrice essentielle, elle soutient la reproduction de nombreuses plantes cultivées et sauvages.',
    conservation_status: 'NT',
    image_url: '/images/logo-icon-bee.png',
    associated_projects: [
      {
        id: 'mock-project-miellerie-manakara',
        slug: 'miellerie-manakara-ilanga-nature',
        name: 'Miellerie de Manakara',
        type: 'beehive',
        role: 'Pollinisation',
        impact: 'Le projet structure une apiculture durable autour de l’abeille noire.',
        userParticipation: true,
      },
    ],
    associated_producers: [
      {
        id: 'mock-producer-ilanga-nature',
        name: 'Ilanga Nature',
        location: 'Manakara',
        relationship: 'Producteur engagé',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: 'mock-challenge-daily-harvest',
        name: 'Récolte quotidienne',
        type: 'daily_harvest',
        difficulty: 'easy',
        rewards: ['50 graines'],
        userProgress: 60,
      },
    ],
    user_status: createUserStatus(false, 1),
    habitat: ['Jardins', 'Prairies', 'Forêts claires'],
    threats: ['Pesticides', 'Parasites', 'Uniformisation florale'],
  },
  {
    id: 'species-abeille-noire',
    name_default: 'Abeille Noire',
    scientific_name: 'Apis mellifera mellifera',
    description_default:
      'Espèce emblématique des écosystèmes tempérés, robuste et précieuse pour la biodiversité locale.',
    conservation_status: 'VU',
    image_url: '/images/logo-icon-bee.png',
    associated_projects: [
      {
        id: 'mock-project-miellerie-manakara',
        slug: 'miellerie-manakara-ilanga-nature',
        name: 'Miellerie de Manakara',
        type: 'beehive',
        role: 'Protection des pollinisateurs',
        impact: 'Renforce les pratiques agricoles favorables aux abeilles.',
        userParticipation: false,
      },
    ],
    associated_producers: [
      {
        id: 'mock-producer-ilanga-nature',
        name: 'Ilanga Nature',
        location: 'Madagascar',
        relationship: 'Éleveur partenaire',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: 'mock-challenge-bravo',
        name: 'Esprit d’équipe',
        type: 'social',
        difficulty: 'medium',
        rewards: ['100 graines'],
        userProgress: 33,
      },
    ],
    user_status: createUserStatus(false, 1),
    habitat: ['Lisières', 'Prairies fleuries'],
    threats: ['Perte d’habitat', 'Pathogènes'],
  },
  {
    id: 'species-coccinelle-7-points',
    name_default: 'Coccinelle à 7 points',
    scientific_name: 'Coccinella septempunctata',
    description_default:
      'Prédatrice naturelle des pucerons, elle contribue à l’équilibre des cultures et des jardins.',
    conservation_status: 'LC',
    image_url: '/images/diorama-chouette.png',
    associated_projects: [],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Cultures', 'Jardins', 'Haies'],
    threats: ['Usage intensif d’intrants'],
  },
]

const cloneSpecies = (species: SpeciesContext, viewerId?: string | null): SpeciesContext => {
  const shouldUnlock = viewerId === MOCK_EXISTING_VIEWER_ID && species.id === 'species-chouette-effraie'

  return {
    ...species,
    associated_projects: species.associated_projects?.map((project) => ({ ...project })) || [],
    associated_producers: species.associated_producers?.map((producer) => ({ ...producer })) || [],
    associated_challenges: species.associated_challenges?.map((challenge) => ({ ...challenge })) || [],
    habitat: species.habitat ? [...species.habitat] : [],
    threats: species.threats ? [...species.threats] : [],
    user_status: shouldUnlock ? createUserStatus(true, 2) : species.user_status ? { ...species.user_status } : null,
  }
}

export const getMockSpeciesContextList = (viewerId?: string | null): SpeciesContext[] => {
  return MOCK_SPECIES.map((species) => cloneSpecies(species, viewerId))
}

export const getMockSpeciesContext = (
  id: string,
  viewerId?: string | null,
): SpeciesContext | null => {
  const species = MOCK_SPECIES.find((entry) => entry.id === id)
  return species ? cloneSpecies(species, viewerId) : null
}
