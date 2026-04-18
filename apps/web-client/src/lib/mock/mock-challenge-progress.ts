import type { ChallengeArchetypeId } from '@/lib/mock/types'

export const MOCK_CHALLENGE_PROGRESS_COOKIE_NAME = 'mtc_mock_challenge_progress'

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

export const mockChallengeProgressCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: THIRTY_DAYS_IN_SECONDS,
}

export type PersistedMockChallengeState = {
  viewerId: string
  dayKey: string
  archetypeId: ChallengeArchetypeId
  progress: number
  max: number
  completedAt: string | null
  claimedAt: string | null
  targetIds: string[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getString = (value: unknown) => (typeof value === 'string' ? value : '')
const getNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const isChallengeArchetypeId = (value: unknown): value is ChallengeArchetypeId =>
  value === 'eco-fact' || value === 'collective-bravo' || value === 'daily-harvest'

const parsePersistedState = (value: unknown): PersistedMockChallengeState | null => {
  if (!isRecord(value)) {
    return null
  }

  const viewerId = getString(value.viewerId)
  const dayKey = getString(value.dayKey)
  const archetypeId = isChallengeArchetypeId(value.archetypeId) ? value.archetypeId : null

  if (!viewerId || !dayKey || !archetypeId) {
    return null
  }

  const targetIds = Array.isArray(value.targetIds)
    ? value.targetIds.filter((entry): entry is string => typeof entry === 'string')
    : []

  return {
    viewerId,
    dayKey,
    archetypeId,
    progress: Math.max(0, Math.floor(getNumber(value.progress))),
    max: Math.max(1, Math.floor(getNumber(value.max) || 1)),
    completedAt: getString(value.completedAt) || null,
    claimedAt: getString(value.claimedAt) || null,
    targetIds,
  }
}

export const serializeMockChallengeProgress = (
  entries: PersistedMockChallengeState[],
): string => encodeURIComponent(JSON.stringify(entries))

export const parseMockChallengeProgressValue = (
  value: string | null | undefined,
): PersistedMockChallengeState[] => {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((entry) => parsePersistedState(entry))
      .filter((entry): entry is PersistedMockChallengeState => entry !== null)
  } catch {
    return []
  }
}

const readCookieValue = (cookieString: string, key: string): string | null => {
  const entries = cookieString.split(';').map((entry) => entry.trim())
  const match = entries.find((entry) => entry.startsWith(`${key}=`))
  if (!match) {
    return null
  }

  return match.slice(key.length + 1)
}

const buildEntryKey = (entry: Pick<PersistedMockChallengeState, 'viewerId' | 'dayKey' | 'archetypeId'>) =>
  `${entry.viewerId}:${entry.dayKey}:${entry.archetypeId}`

export const mergePersistedMockChallengeStates = (
  baseEntries: PersistedMockChallengeState[],
  overridingEntries: PersistedMockChallengeState[],
): PersistedMockChallengeState[] => {
  const merged = new Map<string, PersistedMockChallengeState>()

  for (const entry of baseEntries) {
    merged.set(buildEntryKey(entry), {
      ...entry,
      targetIds: [...entry.targetIds],
    })
  }

  for (const entry of overridingEntries) {
    merged.set(buildEntryKey(entry), {
      ...entry,
      targetIds: [...entry.targetIds],
    })
  }

  return [...merged.values()].sort((first, second) => {
    if (first.dayKey === second.dayKey) {
      return first.archetypeId.localeCompare(second.archetypeId)
    }

    return first.dayKey.localeCompare(second.dayKey)
  })
}

export const getClientPersistedMockChallengeStates = (): PersistedMockChallengeState[] => {
  if (typeof document === 'undefined') {
    return []
  }

  return parseMockChallengeProgressValue(
    readCookieValue(document.cookie, MOCK_CHALLENGE_PROGRESS_COOKIE_NAME),
  )
}

const writeClientPersistedMockChallengeStates = (
  entries: PersistedMockChallengeState[],
): void => {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${MOCK_CHALLENGE_PROGRESS_COOKIE_NAME}=${serializeMockChallengeProgress(entries)}; path=/; max-age=${mockChallengeProgressCookieOptions.maxAge}; samesite=${mockChallengeProgressCookieOptions.sameSite}`
}

export const upsertClientPersistedMockChallengeState = (
  nextEntry: PersistedMockChallengeState,
): PersistedMockChallengeState[] => {
  const currentEntries = getClientPersistedMockChallengeStates()
  const nextEntries = mergePersistedMockChallengeStates(currentEntries, [nextEntry])
  writeClientPersistedMockChallengeStates(nextEntries)
  return nextEntries
}

export const recordClientMockChallengeCompletion = ({
  viewerId,
  dayKey,
  archetypeId,
  max,
  timestamp = new Date().toISOString(),
}: {
  viewerId: string
  dayKey: string
  archetypeId: ChallengeArchetypeId
  max: number
  timestamp?: string
}): PersistedMockChallengeState[] => {
  const currentEntries = getClientPersistedMockChallengeStates()
  const currentEntry =
    currentEntries.find(
      (entry) =>
        entry.viewerId === viewerId &&
        entry.dayKey === dayKey &&
        entry.archetypeId === archetypeId,
    ) || null

  const nextEntry: PersistedMockChallengeState = {
    viewerId,
    dayKey,
    archetypeId,
    progress: Math.max(currentEntry?.progress ?? 0, max),
    max,
    completedAt: currentEntry?.completedAt || timestamp,
    claimedAt: currentEntry?.claimedAt || timestamp,
    targetIds: currentEntry?.targetIds ? [...currentEntry.targetIds] : [],
  }

  return upsertClientPersistedMockChallengeState(nextEntry)
}

export const recordClientMockCollectiveBravo = ({
  viewerId,
  dayKey,
  targetId,
  max = 3,
  timestamp = new Date().toISOString(),
}: {
  viewerId: string
  dayKey: string
  targetId: string
  max?: number
  timestamp?: string
}): PersistedMockChallengeState[] => {
  const currentEntries = getClientPersistedMockChallengeStates()
  const currentEntry =
    currentEntries.find(
      (entry) =>
        entry.viewerId === viewerId &&
        entry.dayKey === dayKey &&
        entry.archetypeId === 'collective-bravo',
    ) || null

  const targetIds = currentEntry?.targetIds ? [...currentEntry.targetIds] : []
  if (!targetIds.includes(targetId)) {
    targetIds.push(targetId)
  }

  const progress = Math.min(targetIds.length, max)
  const isCompleted = progress >= max

  const nextEntry: PersistedMockChallengeState = {
    viewerId,
    dayKey,
    archetypeId: 'collective-bravo',
    progress,
    max,
    completedAt: isCompleted ? currentEntry?.completedAt || timestamp : currentEntry?.completedAt || null,
    claimedAt: isCompleted ? currentEntry?.claimedAt || timestamp : currentEntry?.claimedAt || null,
    targetIds,
  }

  return upsertClientPersistedMockChallengeState(nextEntry)
}
