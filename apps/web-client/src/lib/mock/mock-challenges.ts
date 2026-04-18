import {
  MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID,
  MOCK_CHALLENGE_DAILY_HARVEST_ID,
  MOCK_CHALLENGE_ECO_FACT_ID,
  MOCK_PRODUCT_EUCALYPTUS_SLUG,
  MOCK_PRODUCT_MANAKARA_SLUG,
  MOCK_PROJECT_ANTSIRABE_SLUG,
  MOCK_PROJECT_MANAKARA_SLUG,
  MOCK_SPECIES_BLACK_BEE_ID,
  MOCK_SPECIES_HONEY_BEE_ID,
  MOCK_SPECIES_LADYBUG_ID,
  MOCK_SPECIES_OWL_ID,
} from '@/lib/mock/mock-ids'
import type { PersistedMockChallengeState } from '@/lib/mock/mock-challenge-progress'
import type { Challenge, ChallengeArchetypeId, Faction } from '@/lib/mock/types'

export type MockChallengeProgressSnapshot = {
  progress: number
  max: number
  completedAt: string | null
  claimedAt: string | null
  targetIds: string[]
}

export type MockChallengeDetail = Challenge & {
  seriesId: ChallengeArchetypeId
  slug: string
  dayKey: string
  monthKey: string
  rewardBadge: string | null
  startDate: string
  endDate: string
  status: 'available' | 'completed' | 'claimed'
  completedAt: string | null
  claimedAt: string | null
  metadata: {
    hint: string
    nextStep: string
    themeLabel: string
    articleTitle?: string
    articleSummary?: string
    articleBody?: string[]
    ctaHref?: string
    ctaLabel?: string
    linkedSpeciesId?: string
    linkedProjectSlug?: string
    linkedProductSlug?: string
  }
}

export type MockMonthlyQuestOverview = {
  title: string
  timeLeft: string
  objective: string
  progress: number
  max: number
  completedDays: number
  currentDayKey: string
  monthKey: string
}

type TopicTheme = {
  key: string
  label: string
  articleTitle: string
  fact: string
  impact: string
  ritual: string
  socialFocus: string
  linkedSpeciesId?: string
  linkedProjectSlug?: string
  linkedProductSlug?: string
}

const DEFAULT_TIMEZONE = 'Europe/Brussels'
const DEFAULT_LOCALE = 'fr-FR'
const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const DAY_THEME_LIBRARY: TopicTheme[] = [
  {
    key: 'vergers-pollinises',
    label: 'Pollinisation des vergers',
    articleTitle: 'Pourquoi les vergers ont besoin de butineuses visibles',
    fact: 'une pollinisation reguliere stabilise la qualite des fruits et la biodiversite locale.',
    impact: "les zones melliferes autour des vergers servent aussi d'abri a d'autres especes utiles.",
    ritual: 'observe le maillage entre fleurs, abeilles et nourriture locale.',
    socialFocus: 'les gestes qui soutiennent les pollinisateurs autour des vergers.',
    linkedSpeciesId: MOCK_SPECIES_HONEY_BEE_ID,
    linkedProjectSlug: MOCK_PROJECT_MANAKARA_SLUG,
    linkedProductSlug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
  },
  {
    key: 'haies-vivantes',
    label: 'Haies vivantes',
    articleTitle: 'Les haies, refuge discret du vivant',
    fact: 'une haie continue relie les habitats et limite la fragmentation des ecosystemes.',
    impact: 'les corridors vegetaux favorisent les insectes, les oiseaux et la regulation naturelle des cultures.',
    ritual: 'cherche le lien entre refuge, nourriture et circulation des especes.',
    socialFocus: 'les micro-actions qui rendent un paysage plus hospitalier.',
    linkedSpeciesId: MOCK_SPECIES_OWL_ID,
    linkedProjectSlug: MOCK_PROJECT_ANTSIRABE_SLUG,
  },
  {
    key: 'abeille-noire',
    label: 'Abeille noire',
    articleTitle: "L'abeille noire, une alliée robuste a proteger",
    fact: 'les souches locales sont souvent mieux adaptees aux cycles climatiques de leur territoire.',
    impact: 'preserver leur habitat aide a maintenir des pollinisations resilientes.',
    ritual: 'remarque comment la biodiversite locale renforce la resistance des colonies.',
    socialFocus: "les soutiens visibles aux pollinisateurs d'origine locale.",
    linkedSpeciesId: MOCK_SPECIES_BLACK_BEE_ID,
    linkedProjectSlug: MOCK_PROJECT_MANAKARA_SLUG,
    linkedProductSlug: MOCK_PRODUCT_MANAKARA_SLUG,
  },
  {
    key: 'predateurs-utiles',
    label: 'Predateurs utiles',
    articleTitle: 'Pourquoi les coccinelles changent tout dans un jardin',
    fact: 'les predateurs naturels limitent certains ravageurs sans intrants supplementaires.',
    impact: 'une biodiversite fonctionnelle reduit la pression sur les cultures et les sols.',
    ritual: 'pense ecosysteme complet plutot que solution isolee.',
    socialFocus: 'les bonnes pratiques qui encouragent les auxiliaires naturels.',
    linkedSpeciesId: MOCK_SPECIES_LADYBUG_ID,
  },
  {
    key: 'nectar-saison-seche',
    label: 'Nectar en saison seche',
    articleTitle: "Ce que change une floraison bien etalee pour l'apiculture",
    fact: 'la continuite des ressources florales limite les creux critiques pour les colonies.',
    impact: 'des paysages diversifies soutiennent mieux la production locale et les pollinisateurs.',
    ritual: 'repere les continuites saisonnieres dans les ressources du vivant.',
    socialFocus: 'les choix qui protègent les reserves alimentaires des colonies.',
    linkedSpeciesId: MOCK_SPECIES_HONEY_BEE_ID,
    linkedProductSlug: MOCK_PRODUCT_EUCALYPTUS_SLUG,
  },
  {
    key: 'forets-lisieres',
    label: 'Lisieres forestieres',
    articleTitle: 'Les lisieres sont des zones de passage precieuses',
    fact: 'les bordures entre milieux concentrent souvent nourriture, abri et circulation des especes.',
    impact: 'renforcer ces transitions aide autant les insectes que la petite faune.',
    ritual: 'observe les interfaces, pas seulement les zones centrales.',
    socialFocus: 'les gestes qui rendent une lisiere plus accueillante.',
    linkedSpeciesId: MOCK_SPECIES_OWL_ID,
    linkedProjectSlug: MOCK_PROJECT_ANTSIRABE_SLUG,
  },
  {
    key: 'diversite-florale',
    label: 'Diversite florale',
    articleTitle: 'Une meme prairie change tout selon sa diversite de fleurs',
    fact: 'plus les floraisons se relayent, plus les pollinisateurs trouvent de quoi durer.',
    impact: 'la diversite vegetale renforce aussi les chaines alimentaires locales.',
    ritual: 'regarde la prairie comme une succession de relais plutot qu un decor fixe.',
    socialFocus: 'les attentions quotidiennes qui favorisent les floraisons utiles.',
    linkedSpeciesId: MOCK_SPECIES_HONEY_BEE_ID,
  },
  {
    key: 'sols-humides',
    label: 'Sols vivants',
    articleTitle: 'Des sols plus vivants rendent aussi les paysages plus resistants',
    fact: 'l humidite retenue et l activite biologique des sols influencent directement la vigueur du vivant.',
    impact: 'des sols proteges soutiennent mieux les plantations, les haies et les ressources melliferes.',
    ritual: 'pense aux racines et au sol comme au premier reservoir d impact.',
    socialFocus: 'les pratiques qui aident un sol a rester couvert et fertile.',
    linkedProjectSlug: MOCK_PROJECT_ANTSIRABE_SLUG,
  },
  {
    key: 'circuits-locaux',
    label: 'Circuits locaux',
    articleTitle: 'Acheter local peut aussi renforcer des ecosystemes entiers',
    fact: 'des filieres courtes peuvent financer des pratiques plus respectueuses des habitats.',
    impact: 'quand une production locale tient, elle porte aussi des paysages vivants.',
    ritual: 'relie produit concret, producteur et ecosysteme d origine.',
    socialFocus: 'les bravos qui valorisent les producteurs engages.',
    linkedProductSlug: MOCK_PRODUCT_MANAKARA_SLUG,
    linkedProjectSlug: MOCK_PROJECT_MANAKARA_SLUG,
  },
  {
    key: 'ombre-et-microclimat',
    label: 'Ombre et microclimat',
    articleTitle: 'Pourquoi quelques arbres changent un microclimat',
    fact: 'l ombre, l humidite et la structure verticale influencent tres vite le confort du vivant.',
    impact: 'des microclimats plus stables rendent les paysages plus accueillants en periode chaude.',
    ritual: 'observe comment ombre et humidite protègent les cycles du vivant.',
    socialFocus: 'les actions qui densifient un paysage sans le figer.',
    linkedProjectSlug: MOCK_PROJECT_MANAKARA_SLUG,
  },
  {
    key: 'chaînes-du-vivant',
    label: 'Chaînes du vivant',
    articleTitle: 'Une petite action se diffuse souvent plus loin qu on le croit',
    fact: 'une action visible agit rarement seule: elle nourrit des effets en cascade dans tout le systeme.',
    impact: 'c est ce lien entre gestes individuels et benefices diffus qui rend la biodiversite si concrete.',
    ritual: 'cherche la cascade d effets plutot que le seul resultat immediat.',
    socialFocus: 'les gestes visibles qui donnent envie a d autres de participer.',
  },
  {
    key: 'ruchers-et-paysages',
    label: 'Ruchers et paysages',
    articleTitle: 'Un rucher en bonne sante depend du paysage autour de lui',
    fact: 'la qualite d un rucher se joue autant dans les fleurs autour que dans la ruche elle-meme.',
    impact: 'des paysages mieux relies soutiennent la productivite comme la biodiversite.',
    ritual: 'regarde la ruche comme la pointe visible d un ecosysteme plus large.',
    socialFocus: 'les projets et encouragements qui renforcent tout le paysage.',
    linkedSpeciesId: MOCK_SPECIES_BLACK_BEE_ID,
    linkedProjectSlug: MOCK_PROJECT_ANTSIRABE_SLUG,
  },
]

const ECO_FACT_OPENERS = [
  'Le saviez-vous ?',
  'Eco-Fact du jour',
  'Minute biodiversite',
  'Observation utile',
  'Zoom nature',
  'Repere du jour',
]

const HARVEST_TITLES = [
  'Rosee du vivant',
  'Butin du matin',
  'Nectar en reserve',
  'Goutte de pollen',
  'Recolte douce',
  'Reserve de la ruche',
]

const SOCIAL_TITLES = [
  'Relai de Bravos',
  'Onde collective',
  'Soutien visible',
  'Vague d encouragement',
  'Main tendue',
  'Echo du collectif',
]

const ECO_FACT_BADGES = [
  'Observateur du vivant',
  'Eclaireur des ecosystemes',
  'Messager du terrain',
  'Gardien des indices',
]

const DAILY_HARVEST_BADGES = [
  'Gardien du nectar',
  'Butineur assidu',
  'Veilleur de ruche',
  'Recolteur patient',
]

const COLLECTIVE_BADGES = [
  'Catalyseur collectif',
  'Amplificateur de bravos',
  'Relieur de la communaute',
  'Souffle du collectif',
]

const hashString = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }
  return hash
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const pickRequiredArrayValue = <T,>(entries: readonly T[], index: number): T => {
  return entries[index] ?? entries[0]!
}

export const isValidMockDayKey = (value: string | null | undefined): value is string =>
  typeof value === 'string' && DAY_KEY_PATTERN.test(value)

export const getMockCalendarDayKey = (
  date = new Date(),
  timeZone = DEFAULT_TIMEZONE,
): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value ?? '2026'
  const month = parts.find((part) => part.type === 'month')?.value ?? '01'
  const day = parts.find((part) => part.type === 'day')?.value ?? '01'

  return `${year}-${month}-${day}`
}

export const getMockMonthKey = (dayKey: string): string => dayKey.slice(0, 7)
export const getMockDayIndex = (dayKey: string): number => Math.max(0, Number(dayKey.slice(8, 10)) - 1)

export const getMockDaysInMonth = (monthKey: string): number => {
  const [yearRaw, monthRaw] = monthKey.split('-')
  const year = Number(yearRaw)
  const month = Number(monthRaw)

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return 30
  }

  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export const getMockDayLabel = (
  dayKey: string,
  locale = DEFAULT_LOCALE,
): string => {
  const date = new Date(`${dayKey}T12:00:00.000Z`)
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
  }).format(date)
}

const getMonthLabel = (monthKey: string, locale = DEFAULT_LOCALE) => {
  const date = new Date(`${monthKey}-01T12:00:00.000Z`)
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
  }).format(date)
}

const getTopicForDay = (dayKey: string, faction: Faction | null): TopicTheme => {
  const monthKey = getMockMonthKey(dayKey)
  const dayIndex = getMockDayIndex(dayKey)
  const offset = hashString(`${monthKey}:${faction ?? 'guest'}:topic`) % DAY_THEME_LIBRARY.length

  return DAY_THEME_LIBRARY[(offset + dayIndex) % DAY_THEME_LIBRARY.length] ?? DAY_THEME_LIBRARY[0]!
}

const getPatternIndex = (
  dayKey: string,
  faction: Faction | null,
  salt: string,
  total: number,
) => {
  const monthKey = getMockMonthKey(dayKey)
  const dayIndex = getMockDayIndex(dayKey)
  const offset = hashString(`${monthKey}:${faction ?? 'guest'}:${salt}`) % total
  return (offset + dayIndex) % total
}

const getChallengeProgressSnapshot = (
  dayKey: string,
  archetypeId: ChallengeArchetypeId,
  states: PersistedMockChallengeState[],
  max: number,
): MockChallengeProgressSnapshot => {
  const currentState =
    states.find(
      (entry) => entry.dayKey === dayKey && entry.archetypeId === archetypeId,
    ) || null

  return {
    progress: currentState ? Math.min(currentState.progress, currentState.max) : 0,
    max: currentState?.max || max,
    completedAt: currentState?.completedAt || null,
    claimedAt: currentState?.claimedAt || null,
    targetIds: currentState?.targetIds ? [...currentState.targetIds] : [],
  }
}

const toChallengeStatus = (snapshot: MockChallengeProgressSnapshot): MockChallengeDetail['status'] => {
  if (snapshot.claimedAt) {
    return 'claimed'
  }

  if (snapshot.completedAt) {
    return 'completed'
  }

  return 'available'
}

const buildChallengeSlug = (root: string, dayKey: string) => `${root}--${dayKey}`

const getTopicCta = (topic: TopicTheme) => {
  if (topic.linkedProjectSlug) {
    return {
      href: `/projects/${topic.linkedProjectSlug}`,
      label: 'Voir le projet lie',
    }
  }

  if (topic.linkedProductSlug) {
    return {
      href: '/products',
      label: 'Voir le produit associe',
    }
  }

  if (topic.linkedSpeciesId) {
    return {
      href: '/aventure?tab=biodex',
      label: 'Explorer le Biodex',
    }
  }

  return {
    href: '/projects',
    label: 'Continuer vers les projets',
  }
}

const buildEcoFactChallenge = (
  dayKey: string,
  faction: Faction | null,
  states: PersistedMockChallengeState[],
): MockChallengeDetail => {
  const topic = getTopicForDay(dayKey, faction)
  const opener = pickRequiredArrayValue(
    ECO_FACT_OPENERS,
    getPatternIndex(dayKey, faction, 'eco-opener', ECO_FACT_OPENERS.length),
  )
  const rewardBadge = pickRequiredArrayValue(
    ECO_FACT_BADGES,
    getPatternIndex(dayKey, faction, 'eco-badge', ECO_FACT_BADGES.length),
  )
  const progressSnapshot = getChallengeProgressSnapshot(dayKey, 'eco-fact', states, 1)
  const monthKey = getMockMonthKey(dayKey)
  const cta = getTopicCta(topic)

  return {
    id: `${MOCK_CHALLENGE_ECO_FACT_ID}:${dayKey}`,
    seriesId: 'eco-fact',
    slug: buildChallengeSlug(`eco-fact-${slugify(topic.key)}`, dayKey),
    dayKey,
    monthKey,
    type: 'education',
    title: `${opener} · ${topic.label}`,
    description: `Prends 30 secondes pour comprendre pourquoi ${topic.fact}`,
    progress: progressSnapshot.progress,
    max: progressSnapshot.max,
    reward: 50,
    rewardBadge,
    startDate: dayKey,
    endDate: dayKey,
    status: toChallengeStatus(progressSnapshot),
    completedAt: progressSnapshot.completedAt,
    claimedAt: progressSnapshot.claimedAt,
    metadata: {
      hint: `Observe comment ${topic.label.toLowerCase()} renforce le vivant autour de toi.`,
      nextStep: `Une fois la lecture terminee, suis la piste vers ${topic.linkedProjectSlug ? 'le projet terrain' : topic.linkedSpeciesId ? 'le Biodex' : 'les projets de la communaute'}.`,
      themeLabel: topic.label,
      articleTitle: topic.articleTitle,
      articleSummary: topic.impact,
      articleBody: [
        `Aujourd'hui, on zoome sur ${topic.label.toLowerCase()}: ${topic.fact}`,
        `C'est important parce que ${topic.impact}`,
        `Petit reflexe a retenir: ${topic.ritual}`,
      ],
      ctaHref: cta.href,
      ctaLabel: cta.label,
      linkedSpeciesId: topic.linkedSpeciesId,
      linkedProjectSlug: topic.linkedProjectSlug,
      linkedProductSlug: topic.linkedProductSlug,
    },
  }
}

const buildCollectiveBravoChallenge = (
  dayKey: string,
  faction: Faction | null,
  states: PersistedMockChallengeState[],
): MockChallengeDetail => {
  const topic = getTopicForDay(dayKey, faction)
  const title = pickRequiredArrayValue(
    SOCIAL_TITLES,
    getPatternIndex(dayKey, faction, 'social-title', SOCIAL_TITLES.length),
  )
  const rewardBadge = pickRequiredArrayValue(
    COLLECTIVE_BADGES,
    getPatternIndex(dayKey, faction, 'social-badge', COLLECTIVE_BADGES.length),
  )
  const progressSnapshot = getChallengeProgressSnapshot(dayKey, 'collective-bravo', states, 3)
  const monthKey = getMockMonthKey(dayKey)

  return {
    id: `${MOCK_CHALLENGE_COLLECTIVE_BRAVO_ID}:${dayKey}`,
    seriesId: 'collective-bravo',
    slug: buildChallengeSlug(`collectif-${slugify(topic.key)}`, dayKey),
    dayKey,
    monthKey,
    type: 'social',
    title: `${title} · ${topic.label}`,
    description: `Distribue 3 Bravos pour mettre en avant ${topic.socialFocus}`,
    progress: progressSnapshot.progress,
    max: progressSnapshot.max,
    reward: 100,
    rewardBadge,
    href: '/collectif',
    startDate: dayKey,
    endDate: dayKey,
    status: toChallengeStatus(progressSnapshot),
    completedAt: progressSnapshot.completedAt,
    claimedAt: progressSnapshot.claimedAt,
    metadata: {
      hint: 'Cherche les actions qui meritent d etre amplifiees aujourd hui.',
      nextStep: 'Envoie trois Bravos distincts dans le Collectif pour valider la mission.',
      themeLabel: topic.label,
      linkedSpeciesId: topic.linkedSpeciesId,
      linkedProjectSlug: topic.linkedProjectSlug,
      linkedProductSlug: topic.linkedProductSlug,
    },
  }
}

const buildDailyHarvestChallenge = (
  dayKey: string,
  faction: Faction | null,
  states: PersistedMockChallengeState[],
): MockChallengeDetail => {
  const topic = getTopicForDay(dayKey, faction)
  const title = pickRequiredArrayValue(
    HARVEST_TITLES,
    getPatternIndex(dayKey, faction, 'harvest-title', HARVEST_TITLES.length),
  )
  const rewardBadge = pickRequiredArrayValue(
    DAILY_HARVEST_BADGES,
    getPatternIndex(dayKey, faction, 'harvest-badge', DAILY_HARVEST_BADGES.length),
  )
  const progressSnapshot = getChallengeProgressSnapshot(dayKey, 'daily-harvest', states, 1)
  const monthKey = getMockMonthKey(dayKey)

  return {
    id: `${MOCK_CHALLENGE_DAILY_HARVEST_ID}:${dayKey}`,
    seriesId: 'daily-harvest',
    slug: buildChallengeSlug(`recolte-${slugify(topic.key)}`, dayKey),
    dayKey,
    monthKey,
    type: 'daily_harvest',
    title: `${title} · ${topic.label}`,
    description: `Reclame ton nectar du jour et garde en tete ${topic.ritual}`,
    progress: progressSnapshot.progress,
    max: progressSnapshot.max,
    reward: 50,
    rewardBadge,
    startDate: dayKey,
    endDate: dayKey,
    status: toChallengeStatus(progressSnapshot),
    completedAt: progressSnapshot.completedAt,
    claimedAt: progressSnapshot.claimedAt,
    metadata: {
      hint: `Ta recolte du jour te reconnecte a ${topic.label.toLowerCase()}.`,
      nextStep: 'Maintiens ta serie en revenant demain avant minuit.',
      themeLabel: topic.label,
      linkedSpeciesId: topic.linkedSpeciesId,
      linkedProjectSlug: topic.linkedProjectSlug,
      linkedProductSlug: topic.linkedProductSlug,
    },
  }
}

export const getMockDailyChallengesForDay = ({
  dayKey,
  faction,
  states = [],
}: {
  dayKey: string
  faction: Faction | null
  states?: PersistedMockChallengeState[]
}): MockChallengeDetail[] => {
  return [
    buildEcoFactChallenge(dayKey, faction, states),
    buildCollectiveBravoChallenge(dayKey, faction, states),
    buildDailyHarvestChallenge(dayKey, faction, states),
  ]
}

export const getMockMonthlyChallengePlan = ({
  monthKey,
  faction,
  states = [],
}: {
  monthKey: string
  faction: Faction | null
  states?: PersistedMockChallengeState[]
}): MockChallengeDetail[][] => {
  const daysInMonth = getMockDaysInMonth(monthKey)

  return Array.from({ length: daysInMonth }, (_, index) => {
    const dayKey = `${monthKey}-${String(index + 1).padStart(2, '0')}`
    return getMockDailyChallengesForDay({ dayKey, faction, states })
  })
}

export const getMockMonthlyQuestOverview = ({
  dayKey,
  faction,
  states = [],
  locale = DEFAULT_LOCALE,
}: {
  dayKey: string
  faction: Faction | null
  states?: PersistedMockChallengeState[]
  locale?: string
}): MockMonthlyQuestOverview => {
  const monthKey = getMockMonthKey(dayKey)
  const uniqueCompletedDays = new Set(
    states
      .filter((entry) => entry.dayKey.startsWith(`${monthKey}-`) && (entry.completedAt || entry.claimedAt))
      .map((entry) => entry.dayKey),
  )
  const monthLabel = getMonthLabel(monthKey, locale)
  const daysInMonth = getMockDaysInMonth(monthKey)
  const currentDayNumber = getMockDayIndex(dayKey) + 1
  const remainingDays = Math.max(daysInMonth - currentDayNumber, 0)

  return {
    title: `Cycle de ${monthLabel}`,
    timeLeft: `${remainingDays} jours restants`,
    objective: 'Valide 20 jours de presence',
    progress: Math.min(uniqueCompletedDays.size, 20),
    max: 20,
    completedDays: uniqueCompletedDays.size,
    currentDayKey: dayKey,
    monthKey,
  }
}

export const getMockChallengeBySlug = ({
  slug,
  faction,
  states = [],
  fallbackDayKey,
}: {
  slug: string
  faction: Faction | null
  states?: PersistedMockChallengeState[]
  fallbackDayKey: string
}): MockChallengeDetail | null => {
  const parsedMatch = slug.match(/--(\d{4}-\d{2}-\d{2})$/)
  const dayKey = parsedMatch?.[1] && isValidMockDayKey(parsedMatch[1]) ? parsedMatch[1] : fallbackDayKey
  const dailyChallenges = getMockDailyChallengesForDay({ dayKey, faction, states })

  return (
    dailyChallenges.find((challenge) => challenge.slug === slug) ||
    dailyChallenges.find((challenge) => challenge.seriesId === slug) ||
    null
  )
}

export const getMockCompletedChallengeSeriesIds = (
  states: PersistedMockChallengeState[],
): ChallengeArchetypeId[] => {
  const completedIds = new Set<ChallengeArchetypeId>()

  for (const state of states) {
    if (state.completedAt || state.claimedAt) {
      completedIds.add(state.archetypeId)
    }
  }

  return [...completedIds]
}
