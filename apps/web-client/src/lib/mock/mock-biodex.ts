import {
  MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
  MOCK_CHALLENGE_DAILY_HARVEST_ID,
  MOCK_CHALLENGE_ECO_FACT_ID,
  MOCK_PRODUCT_EUCALYPTUS_ID,
  MOCK_PRODUCT_MANAKARA_ID,
  MOCK_PRODUCER_ILANGA_ID,
  MOCK_PROJECT_ANTSIRABE_ID,
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_MANAKARA_ID,
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_SPECIES_BLACK_BEE_ID,
  MOCK_SPECIES_HONEY_BEE_ID,
  MOCK_SPECIES_LADYBUG_ID,
  MOCK_SPECIES_OWL_ID,
} from '@/lib/mock/mock-ids'
import type { Faction } from '@/lib/mock/types'
import type { SpeciesContext } from '@/types/context'

const createUserStatus = (isUnlocked: boolean, level: number) => ({
  isUnlocked,
  unlockedDate: isUnlocked ? '2026-04-02T09:00:00.000Z' : null,
  unlockSource: isUnlocked ? 'mock_participation_graph' : null,
  progressionLevel: level,
})

const MOCK_SPECIES: SpeciesContext[] = [
  {
    id: MOCK_SPECIES_OWL_ID,
    name_default: 'Chouette Effraie',
    scientific_name: 'Tyto alba',
    description_default:
      'Gardienne nocturne des paysages agricoles vivants, elle aide a reguler naturellement les ecosystemes.',
    conservation_status: 'LC',
    image_url: '/images/diorama-chouette.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_ANTSIRABE_ID,
        slug: MOCK_PROJECT_ANTSIRABE_SLUG,
        name: "Ruchers d'apiculteurs independants a Antsirabe",
        type: 'beehive',
        role: 'Habitat indirect',
        impact: 'Les zones melliferes favorisent aussi les chaines ecologiques locales.',
        userParticipation: false,
      },
    ],
    associated_producers: [
      {
        id: MOCK_PRODUCER_ILANGA_ID,
        name: 'Ilanga Nature',
        location: 'Madagascar',
        relationship: 'Producteur partenaire',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: MOCK_CHALLENGE_ECO_FACT_ID,
        name: 'Eco-Fact du jour',
        type: 'education',
        difficulty: 'easy',
        rewards: ['50 graines'],
        userProgress: 0,
      },
    ],
    user_status: createUserStatus(false, 1),
    habitat: ['Bocages', 'Vergers', 'Prairies'],
    threats: ['Disparition des haies', 'Artificialisation des sols'],
  },
  {
    id: MOCK_SPECIES_HONEY_BEE_ID,
    name_default: 'Abeille mellifere',
    scientific_name: 'Apis mellifera',
    description_default:
      'Pollinisatrice essentielle, elle soutient la reproduction de nombreuses plantes cultivees et sauvages.',
    conservation_status: 'NT',
    image_url: '/images/diorama-chouette.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_MANAKARA_ID,
        slug: MOCK_PROJECT_MANAKARA_SLUG,
        name: 'Miellerie de Manakara',
        type: 'beehive',
        role: 'Pollinisation',
        impact: "Le projet structure une apiculture durable autour de l'abeille noire et du miel local.",
        userParticipation: false,
      },
    ],
    associated_producers: [
      {
        id: MOCK_PRODUCER_ILANGA_ID,
        name: 'Ilanga Nature',
        location: 'Manakara',
        relationship: 'Producteur engage',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: MOCK_CHALLENGE_DAILY_HARVEST_ID,
        name: 'Récolte quotidienne',
        type: 'daily_harvest',
        difficulty: 'easy',
        rewards: ['50 graines'],
        userProgress: 0,
      },
    ],
    user_status: createUserStatus(false, 1),
    habitat: ['Jardins', 'Prairies', 'Forets claires'],
    threats: ['Pesticides', 'Parasites', 'Uniformisation florale'],
  },
  {
    id: MOCK_SPECIES_BLACK_BEE_ID,
    name_default: 'Abeille Noire',
    scientific_name: 'Apis mellifera mellifera',
    description_default:
      'Espece emblematique des ecosystemes temperes, robuste et precieuse pour la biodiversite locale.',
    conservation_status: 'VU',
    image_url: '/images/diorama-chouette.png',
    associated_projects: [
      {
        id: MOCK_PROJECT_MANAKARA_ID,
        slug: MOCK_PROJECT_MANAKARA_SLUG,
        name: 'Miellerie de Manakara',
        type: 'beehive',
        role: 'Protection des pollinisateurs',
        impact: 'Renforce les pratiques agricoles favorables aux abeilles noires.',
        userParticipation: false,
      },
    ],
    associated_producers: [
      {
        id: MOCK_PRODUCER_ILANGA_ID,
        name: 'Ilanga Nature',
        location: 'Madagascar',
        relationship: 'Eleveur partenaire',
        projectsCount: 2,
      },
    ],
    associated_challenges: [
      {
        id: MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
        name: "L'Esprit d'Equipe",
        type: 'social',
        difficulty: 'medium',
        rewards: ['100 graines'],
        userProgress: 0,
      },
    ],
    user_status: createUserStatus(false, 1),
    habitat: ['Lisieres', 'Prairies fleuries'],
    threats: ["Perte d'habitat", 'Pathogenes'],
  },
  {
    id: MOCK_SPECIES_LADYBUG_ID,
    name_default: 'Coccinelle a 7 points',
    scientific_name: 'Coccinella septempunctata',
    description_default:
      "Predatrice naturelle des pucerons, elle contribue a l'equilibre des cultures et des jardins.",
    conservation_status: 'LC',
    image_url: '/images/diorama-chouette.png',
    associated_projects: [],
    associated_producers: [],
    associated_challenges: [],
    user_status: createUserStatus(false, 1),
    habitat: ['Cultures', 'Jardins', 'Haies'],
    threats: ["Usage intensif d'intrants"],
  },
]

type MockParticipationGraph = {
  investedProjectSlugs: Set<string>
  orderedProductIds: Set<string>
  completedChallengeIds: Set<string>
  currentChallengeProgress: Map<string, number>
}

const getParticipationGraph = async (
  viewerId?: string | null,
  faction?: Faction | null,
): Promise<MockParticipationGraph> => {
  if (!viewerId) {
    return {
      investedProjectSlugs: new Set<string>(),
      orderedProductIds: new Set<string>(),
      completedChallengeIds: new Set<string>(),
      currentChallengeProgress: new Map<string, number>(),
    }
  }

  // Import server-only modules only when this function is called
  const { getCurrentMockCompletedChallengeSeriesIds, getCurrentMockDailyChallenges } = await import('@/lib/mock/mock-challenge-progress-server')
  const { getMockInvestments } = await import('@/lib/mock/mock-member-data')
  const { getCurrentMockOrders } = await import('@/lib/mock/mock-order-history-server')

  const [orders, completedChallengeIds, currentDailyChallenges] = await Promise.all([
    getCurrentMockOrders(viewerId),
    getCurrentMockCompletedChallengeSeriesIds(viewerId),
    getCurrentMockDailyChallenges({ viewerId, faction: faction ?? null }),
  ])

  const investedProjectSlugs = new Set(
    getMockInvestments(viewerId).map((investment) => investment.project.slug),
  )
  const orderedProductIds = new Set(
    orders.flatMap((order) =>
      order.items
        .map((item) => item.product?.id || null)
        .filter((productId): productId is string => Boolean(productId)),
    ),
  )

  return {
    investedProjectSlugs,
    orderedProductIds,
    completedChallengeIds: new Set(completedChallengeIds),
    currentChallengeProgress: new Map(
      currentDailyChallenges.map((challenge) => [challenge.seriesId, challenge.progress]),
    ),
  }
}

const cloneSpecies = async (
  species: SpeciesContext,
  viewerId?: string | null,
  faction?: Faction | null,
): Promise<SpeciesContext> => {
  const graph = await getParticipationGraph(viewerId, faction)

  const associatedProjects =
    species.associated_projects?.map((project) => ({
      ...project,
      userParticipation: graph.investedProjectSlugs.has(project.slug || ''),
    })) || []

  const associatedChallenges =
    species.associated_challenges?.map((challenge) => ({
      ...challenge,
      userProgress: graph.currentChallengeProgress.get(challenge.id) ?? null,
    })) || []

  let isUnlocked = false
  let progressionLevel = 1

  if (species.id === MOCK_SPECIES_OWL_ID) {
    isUnlocked =
      graph.investedProjectSlugs.has(MOCK_PROJECT_ANTSIRABE_SLUG) ||
      graph.completedChallengeIds.has(MOCK_CHALLENGE_ECO_FACT_ID)
    progressionLevel = graph.investedProjectSlugs.has(MOCK_PROJECT_ANTSIRABE_SLUG) ? 2 : 1
  } else if (species.id === MOCK_SPECIES_HONEY_BEE_ID) {
    isUnlocked =
      graph.investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG) &&
      graph.orderedProductIds.has(MOCK_PRODUCT_EUCALYPTUS_ID)
    progressionLevel = graph.completedChallengeIds.has(MOCK_CHALLENGE_DAILY_HARVEST_ID) ? 2 : 1
  } else if (species.id === MOCK_SPECIES_BLACK_BEE_ID) {
    isUnlocked =
      graph.investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG) &&
      graph.completedChallengeIds.has(MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID)
    progressionLevel =
      graph.investedProjectSlugs.has(MOCK_PROJECT_MANAKARA_SLUG) ||
      graph.orderedProductIds.has(MOCK_PRODUCT_MANAKARA_ID)
        ? 2
        : 1
  }

  return {
    ...species,
    associated_projects: associatedProjects,
    associated_producers: species.associated_producers?.map((producer) => ({ ...producer })) || [],
    associated_challenges: associatedChallenges,
    habitat: species.habitat ? [...species.habitat] : [],
    threats: species.threats ? [...species.threats] : [],
    user_status: createUserStatus(isUnlocked, progressionLevel),
  }
}

export const getMockSpeciesContextList = async (
  viewerId?: string | null,
  faction?: Faction | null,
): Promise<SpeciesContext[]> => {
  return Promise.all(MOCK_SPECIES.map((species) => cloneSpecies(species, viewerId, faction)))
}

export const getMockSpeciesContext = async (
  id: string,
  viewerId?: string | null,
  faction?: Faction | null,
): Promise<SpeciesContext | null> => {
  const species = MOCK_SPECIES.find((entry) => entry.id === id)
  return species ? cloneSpecies(species, viewerId, faction) : null
}

// Client-safe version that doesn't use server-only imports
export const getMockSpeciesContextClient = async (
  id: string,
): Promise<{ name_default: string } | null> => {
  const species = MOCK_SPECIES.find((entry) => entry.id === id)
  return species ? { name_default: species.name_default } : null
}
