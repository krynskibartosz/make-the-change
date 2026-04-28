export const MAX_LIVES = 5
export const REGEN_INTERVAL_MS = 30 * 60 * 1000 // 30 min
export const SEEDS_COST = 400
export const AMBASSADOR_SEEDS_THRESHOLD = 10_000 // mock: ≥10k graines = Ambassadeur

export type LivesState = {
  remaining: number
  updatedAt: string
}

/**
 * Compute current lives accounting for regen since `updatedAt`.
 * Returns a potentially updated LivesState.
 */
export function computeRegenLives(
  lives: LivesState,
  unlimited: boolean,
  nowMs: number = Date.now(),
): LivesState {
  if (unlimited) return { remaining: MAX_LIVES, updatedAt: lives.updatedAt }
  if (lives.remaining >= MAX_LIVES) return lives
  const elapsed = nowMs - new Date(lives.updatedAt).getTime()
  const regenCount = Math.floor(elapsed / REGEN_INTERVAL_MS)
  if (regenCount <= 0) return lives
  const nextRemaining = Math.min(MAX_LIVES, lives.remaining + regenCount)
  const nextUpdatedAt = new Date(
    new Date(lives.updatedAt).getTime() + regenCount * REGEN_INTERVAL_MS,
  ).toISOString()
  return { remaining: nextRemaining, updatedAt: nextUpdatedAt }
}

/**
 * Milliseconds until the next life regenerates.
 * Returns 0 if already at max or unlimited.
 */
export function msUntilNextRegen(lives: LivesState, unlimited: boolean): number {
  if (unlimited || lives.remaining >= MAX_LIVES) return 0
  const elapsed = Date.now() - new Date(lives.updatedAt).getTime()
  return Math.max(0, REGEN_INTERVAL_MS - (elapsed % REGEN_INTERVAL_MS))
}

/**
 * Format a millisecond duration as MM:SS.
 */
export function formatMsCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Whether the user has unlimited lives.
 * Mock: ≥10 000 graines simulates Ambassador status.
 */
export function isUnlimitedLives(seedsBalance: number): boolean {
  return seedsBalance >= AMBASSADOR_SEEDS_THRESHOLD
}
