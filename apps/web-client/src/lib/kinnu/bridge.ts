import type { KinnuNode } from './graph'

// ─── Constantes ───────────────────────────────────────────────────────────────

export const KINNU_PROGRESS_KEY = 'mtc_kinnu_progress_v1'
export const KINNU_SCORE_PER_NODE = 50

// ─── Types ────────────────────────────────────────────────────────────────────

export type KinnuNodeStatus = 'locked' | 'available' | 'mastered'

export type KinnuWorldProgress = {
  masteredNodeIds: string[]
}

export type KinnuProgress = Record<string, KinnuWorldProgress>

// ─── Persistence ──────────────────────────────────────────────────────────────

export function loadKinnuProgress(): KinnuProgress {
  if (typeof window === 'undefined') return {}
  try {
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

export function loadWorldMasteredIds(worldId: string): Set<string> {
  const progress = loadKinnuProgress()
  return new Set(progress[worldId]?.masteredNodeIds ?? [])
}

export function addMasteredNode(worldId: string, nodeId: string): Set<string> {
  const progress = loadKinnuProgress()
  const current = new Set(progress[worldId]?.masteredNodeIds ?? [])
  current.add(nodeId)
  progress[worldId] = { masteredNodeIds: [...current] }
  saveKinnuProgress(progress)
  return current
}

// ─── Logique de déverrouillage (le cœur Kinnu) ───────────────────────────────

/**
 * Calcule le statut de chaque nœud en fonction des nœuds maîtrisés.
 *
 * - `mastered`  : le nœud est dans masteredIds
 * - `available` : tous ses `requires` sont maîtrisés (ou vide)
 * - `locked`    : au moins un `requires` n'est pas encore maîtrisé
 */
export function computeKinnuStatuses(
  nodes: KinnuNode[],
  masteredIds: Set<string>,
): Record<string, KinnuNodeStatus> {
  return Object.fromEntries(
    nodes.map((node) => {
      if (masteredIds.has(node.id)) return [node.id, 'mastered']
      const allMet = node.requires.every((req) => masteredIds.has(req))
      return [node.id, allMet ? 'available' : 'locked']
    }),
  )
}

/** Retourne les IDs des nœuds qui viennent de se débloquer après un nouveau maîtrisé. */
export function getNewlyUnlockedIds(
  nodes: KinnuNode[],
  previousMastered: Set<string>,
  newlyMasteredId: string,
): string[] {
  const next = new Set(previousMastered)
  next.add(newlyMasteredId)

  return nodes
    .filter((node) => {
      if (node.requires.length === 0) return false
      if (previousMastered.has(node.id) || node.id === newlyMasteredId) return false
      const waLocked = !node.requires.every((r) => previousMastered.has(r))
      const isNowAvailable = node.requires.every((r) => next.has(r))
      return waLocked && isNowAvailable
    })
    .map((n) => n.id)
}

/** Score total d'un monde. */
export function computeKinnuScore(masteredCount: number): number {
  return masteredCount * KINNU_SCORE_PER_NODE
}
