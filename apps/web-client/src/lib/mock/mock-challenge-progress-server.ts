import {
  getMockCalendarDayKey,
  getMockChallengeBySlug,
  getMockCompletedChallengeSeriesIds,
  getMockDailyChallengesForDay,
  getMockDayLabel,
  getMockMonthKey,
  getMockMonthlyQuestOverview,
  type MockChallengeDetail,
  type MockMonthlyQuestOverview,
} from '@/lib/mock/mock-challenges'
import {
  MOCK_CHALLENGE_PROGRESS_COOKIE_NAME,
  parseMockChallengeProgressValue,
  mergePersistedMockChallengeStates,
  type PersistedMockChallengeState,
} from '@/lib/mock/mock-challenge-progress'
import { MOCK_EXISTING_VIEWER_ID } from '@/lib/mock/mock-ids'
import { getCurrentMockUserPreferences } from '@/lib/mock/mock-user-preferences-server'
import type { ChallengeArchetypeId, Faction } from '@/lib/mock/types'

const DEFAULT_TIMEZONE = 'Europe/Brussels'

const DEFAULT_EXISTING_VIEWER_PROGRESS: PersistedMockChallengeState[] = [
  {
    viewerId: MOCK_EXISTING_VIEWER_ID,
    dayKey: '2026-04-14',
    archetypeId: 'eco-fact',
    progress: 1,
    max: 1,
    completedAt: '2026-04-14T07:20:00.000Z',
    claimedAt: '2026-04-14T07:20:00.000Z',
    targetIds: [],
  },
  {
    viewerId: MOCK_EXISTING_VIEWER_ID,
    dayKey: '2026-04-14',
    archetypeId: 'daily-harvest',
    progress: 1,
    max: 1,
    completedAt: '2026-04-14T07:22:00.000Z',
    claimedAt: '2026-04-14T07:22:00.000Z',
    targetIds: [],
  },
  {
    viewerId: MOCK_EXISTING_VIEWER_ID,
    dayKey: '2026-04-16',
    archetypeId: 'daily-harvest',
    progress: 1,
    max: 1,
    completedAt: '2026-04-16T06:58:00.000Z',
    claimedAt: '2026-04-16T06:58:00.000Z',
    targetIds: [],
  },
  {
    viewerId: MOCK_EXISTING_VIEWER_ID,
    dayKey: '2026-04-17',
    archetypeId: 'eco-fact',
    progress: 1,
    max: 1,
    completedAt: '2026-04-17T07:30:00.000Z',
    claimedAt: '2026-04-17T07:30:00.000Z',
    targetIds: [],
  },
  {
    viewerId: MOCK_EXISTING_VIEWER_ID,
    dayKey: '2026-04-17',
    archetypeId: 'daily-harvest',
    progress: 1,
    max: 1,
    completedAt: '2026-04-17T07:32:00.000Z',
    claimedAt: '2026-04-17T07:32:00.000Z',
    targetIds: [],
  },
  {
    viewerId: MOCK_EXISTING_VIEWER_ID,
    dayKey: '2026-04-17',
    archetypeId: 'collective-bravo',
    progress: 3,
    max: 3,
    completedAt: '2026-04-17T18:30:00.000Z',
    claimedAt: '2026-04-17T18:30:00.000Z',
    targetIds: ['evt-2', 'evt-5', 'evt-7'],
  },
]

const getDefaultMockChallengeStates = (viewerId: string | null | undefined) => {
  if (!viewerId) {
    return []
  }

  if (viewerId === MOCK_EXISTING_VIEWER_ID) {
    return DEFAULT_EXISTING_VIEWER_PROGRESS
  }

  return []
}

export async function getCurrentMockChallengeTimeZone(): Promise<string> {
  const preferences = await getCurrentMockUserPreferences()
  return preferences?.timezone || DEFAULT_TIMEZONE
}

export async function getCurrentMockChallengeDayKey(): Promise<string> {
  const timeZone = await getCurrentMockChallengeTimeZone()
  return getMockCalendarDayKey(new Date(), timeZone)
}

export async function getCurrentMockChallengeStates(
  viewerId: string | null | undefined,
): Promise<PersistedMockChallengeState[]> {
  if (!viewerId) {
    return []
  }

  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const persistedStates = parseMockChallengeProgressValue(
    cookieStore.get(MOCK_CHALLENGE_PROGRESS_COOKIE_NAME)?.value,
  ).filter((entry) => entry.viewerId === viewerId)

  return mergePersistedMockChallengeStates(
    getDefaultMockChallengeStates(viewerId),
    persistedStates,
  )
}

export async function getCurrentMockDailyChallenges({
  viewerId,
  faction,
  dayKey,
}: {
  viewerId: string | null | undefined
  faction: Faction | null
  dayKey?: string
}): Promise<MockChallengeDetail[]> {
  const resolvedDayKey = dayKey || (await getCurrentMockChallengeDayKey())
  const states = await getCurrentMockChallengeStates(viewerId)

  return getMockDailyChallengesForDay({
    dayKey: resolvedDayKey,
    faction,
    states,
  })
}

export async function getCurrentMockMonthlyQuest({
  viewerId,
  faction,
  dayKey,
}: {
  viewerId: string | null | undefined
  faction: Faction | null
  dayKey?: string
}): Promise<MockMonthlyQuestOverview> {
  const resolvedDayKey = dayKey || (await getCurrentMockChallengeDayKey())
  const states = await getCurrentMockChallengeStates(viewerId)

  return getMockMonthlyQuestOverview({
    dayKey: resolvedDayKey,
    faction,
    states,
  })
}

export async function getCurrentMockChallengeSurface({
  viewerId,
  faction,
  dayKey,
}: {
  viewerId: string | null | undefined
  faction: Faction | null
  dayKey?: string
}) {
  const resolvedDayKey = dayKey || (await getCurrentMockChallengeDayKey())

  const [dailyChallenges, monthlyQuest] = await Promise.all([
    getCurrentMockDailyChallenges({ viewerId, faction, dayKey: resolvedDayKey }),
    getCurrentMockMonthlyQuest({ viewerId, faction, dayKey: resolvedDayKey }),
  ])

  return {
    dayKey: resolvedDayKey,
    dayLabel: getMockDayLabel(resolvedDayKey),
    monthKey: getMockMonthKey(resolvedDayKey),
    dailyChallenges,
    monthlyQuest,
  }
}

export async function getCurrentMockChallengeBySlug({
  slug,
  viewerId,
  faction,
  fallbackDayKey,
}: {
  slug: string
  viewerId: string | null | undefined
  faction: Faction | null
  fallbackDayKey?: string
}): Promise<MockChallengeDetail | null> {
  const resolvedDayKey = fallbackDayKey || (await getCurrentMockChallengeDayKey())
  const states = await getCurrentMockChallengeStates(viewerId)

  return getMockChallengeBySlug({
    slug,
    faction,
    states,
    fallbackDayKey: resolvedDayKey,
  })
}

export async function getCurrentMockCompletedChallengeSeriesIds(
  viewerId: string | null | undefined,
): Promise<ChallengeArchetypeId[]> {
  const states = await getCurrentMockChallengeStates(viewerId)
  return getMockCompletedChallengeSeriesIds(states)
}

export async function getCurrentMockChallengeTransactions(
  viewerId: string | null | undefined,
  faction: Faction | null = null,
): Promise<
  Array<{
    id: string
    label: string
    delta: number
    impactDelta: number
    createdAt: string
    archetypeId: ChallengeArchetypeId
    dayKey: string
  }>
> {
  type ChallengeTransaction = {
    id: string
    label: string
    delta: number
    impactDelta: number
    createdAt: string
    archetypeId: ChallengeArchetypeId
    dayKey: string
  }

  const states = await getCurrentMockChallengeStates(viewerId)

  const claimedStates = states.filter((entry) => entry.claimedAt)
  if (claimedStates.length === 0) {
    return []
  }

  const monthCache = new Map<string, MockChallengeDetail[]>()

  const getChallengeForState = (state: PersistedMockChallengeState) => {
    const cacheKey = `${state.dayKey}:${faction ?? 'guest'}`
    const cachedChallenges = monthCache.get(cacheKey)
    if (cachedChallenges) {
      return cachedChallenges.find((challenge) => challenge.seriesId === state.archetypeId) || null
    }

    const challenges = getMockDailyChallengesForDay({
      dayKey: state.dayKey,
      faction,
      states,
    })
    monthCache.set(cacheKey, challenges)
    return challenges.find((challenge) => challenge.seriesId === state.archetypeId) || null
  }

  return claimedStates
    .map((state) => {
      const challenge = getChallengeForState(state)
      if (!challenge || !state.claimedAt) {
        return null
      }

      return {
        id: `mock-challenge-${state.archetypeId}-${state.dayKey}`,
        label: `${challenge.title} (${getMockDayLabel(state.dayKey)})`,
        delta: challenge.reward,
        impactDelta: challenge.reward,
        createdAt: state.claimedAt,
        archetypeId: state.archetypeId,
        dayKey: state.dayKey,
      }
    })
    .filter((entry): entry is ChallengeTransaction => entry !== null)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
}
