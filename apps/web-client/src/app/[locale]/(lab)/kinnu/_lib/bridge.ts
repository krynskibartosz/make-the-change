import type { KinnuNode } from './graph'

// ─── Constantes ───────────────────────────────────────────────────────────────

export const KINNU_PROGRESS_KEY = 'mtc_kinnu_progress_v2'
export const KINNU_SCORE_PER_NODE = 50
export const DEGRADATION_DAYS = 7 // Nombre de jours pour que la santé tombe à 0%

// ─── Types ────────────────────────────────────────────────────────────────────

export type KinnuNodeStatus = 'locked' | 'available' | 'mastered'

export type NodeMastery = {
  lastReviewedAt: number
}

export type KinnuWorldProgress = {
  mastery: Record<string, NodeMastery>
}

export type KinnuProgress = Record<string, KinnuWorldProgress>

export type ComputedKinnuStatus = {
  status: KinnuNodeStatus
  health: number // 0.0 à 1.0
}

// ─── Décalage temporel (Test) ────────────────────────────────────────────────

export function getTimeOffsetMs(): number {
  if (typeof window === 'undefined') return 0
  return Number(localStorage.getItem('mtc_kinnu_time_offset') ?? 0)
}

export function addTimeOffsetDays(days: number): void {
  if (typeof window === 'undefined') return
  const current = getTimeOffsetMs()
  const extra = days * 24 * 60 * 60 * 1000
  localStorage.setItem('mtc_kinnu_time_offset', String(current + extra))
}

export function resetTimeOffset(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('mtc_kinnu_time_offset')
}

// ─── Persistence ──────────────────────────────────────────────────────────────

export function loadKinnuProgress(): KinnuProgress {
  if (typeof window === 'undefined') return {}
  try {
    // Migration V1 -> V2
    const v1Raw = localStorage.getItem('mtc_kinnu_progress_v1')
    if (v1Raw && !localStorage.getItem(KINNU_PROGRESS_KEY)) {
      const v1 = JSON.parse(v1Raw) as Record<string, { masteredNodeIds: string[] }>
      const v2: KinnuProgress = {}
      for (const [worldId, data] of Object.entries(v1)) {
        v2[worldId] = { mastery: {} }
        for (const nodeId of data.masteredNodeIds) {
          v2[worldId].mastery[nodeId] = { lastReviewedAt: Date.now() }
        }
      }
      saveKinnuProgress(v2)
      return v2
    }

    const raw = localStorage.getItem(KINNU_PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as KinnuProgress) : {}
  } catch {
    return {}
  }
}

export function saveKinnuProgress(progress: KinnuProgress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KINNU_PROGRESS_KEY, JSON.stringify(progress))
}

export function loadWorldMastery(worldId: string): Record<string, NodeMastery> {
  const progress = loadKinnuProgress()
  return progress[worldId]?.mastery ?? {}
}

export function masterNode(worldId: string, nodeId: string): Record<string, NodeMastery> {
  const progress = loadKinnuProgress()
  const worldProgress = progress[worldId] ?? { mastery: {} }
  const simulatedNow = Date.now() + getTimeOffsetMs()
  worldProgress.mastery[nodeId] = { lastReviewedAt: simulatedNow }
  progress[worldId] = worldProgress
  saveKinnuProgress(progress)
  return worldProgress.mastery
}

// ─── Logique de déverrouillage & Santé ───────────────────────────────────────

export function computeNodeHealth(mastery: NodeMastery | undefined): number {
  if (!mastery) return 1.0
  const simulatedNow = Date.now() + getTimeOffsetMs()
  const msPassed = Math.max(0, simulatedNow - mastery.lastReviewedAt)
  const daysPassed = msPassed / (1000 * 60 * 60 * 24)
  const health = Math.max(0, 1 - (daysPassed / DEGRADATION_DAYS))
  return Number(health.toFixed(2))
}

export function computeKinnuStatuses(
  nodes: KinnuNode[],
  masteryRecord: Record<string, NodeMastery>,
): Record<string, ComputedKinnuStatus> {
  return Object.fromEntries(
    nodes.map((node) => {
      const mastery = masteryRecord[node.id]
      if (mastery) {
        return [node.id, { status: 'mastered', health: computeNodeHealth(mastery) }]
      }
      
      const allMet = node.requires.every((req) => Boolean(masteryRecord[req]))
      return [node.id, { status: allMet ? 'available' : 'locked', health: 1.0 }]
    }),
  )
}

export function getNewlyUnlockedIds(
  nodes: KinnuNode[],
  previousMastery: Record<string, NodeMastery>,
  newlyMasteredId: string,
): string[] {
  // Si le noeud était déjà maîtrisé, il n'y a pas de nouveaux déblocages.
  if (previousMastery[newlyMasteredId]) return []

  const simulatedNow = Date.now() + getTimeOffsetMs()
  const nextMastery = { ...previousMastery, [newlyMasteredId]: { lastReviewedAt: simulatedNow } }

  return nodes
    .filter((node) => {
      if (node.requires.length === 0) return false
      if (previousMastery[node.id] || node.id === newlyMasteredId) return false
      const waLocked = !node.requires.every((r) => Boolean(previousMastery[r]))
      const isNowAvailable = node.requires.every((r) => Boolean(nextMastery[r]))
      return waLocked && isNowAvailable
    })
    .map((n) => n.id)
}

export function computeKinnuScore(masteredCount: number): number {
  return masteredCount * KINNU_SCORE_PER_NODE
}
