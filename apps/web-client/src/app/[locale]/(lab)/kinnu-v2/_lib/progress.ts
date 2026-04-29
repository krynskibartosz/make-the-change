'use client'

const STORAGE_KEY = 'mtc.kinnu-v2.progress.v1'

type ProgressShape = {
  masteredIds: string[]
}

export function loadMasteredIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as ProgressShape
    return new Set(Array.isArray(parsed.masteredIds) ? parsed.masteredIds : [])
  } catch {
    return new Set()
  }
}

export function saveMasteredIds(ids: ReadonlySet<string>): void {
  if (typeof window === 'undefined') return
  try {
    const payload: ProgressShape = { masteredIds: Array.from(ids) }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // silent
  }
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // silent
  }
}
