import { useSyncExternalStore } from 'react'

/**
 * Stable subscribe function — must be defined OUTSIDE the hook.
 * useSyncExternalStore requires a stable reference; if defined inside,
 * React re-subscribes on every render causing unnecessary recalculations.
 */
function subscribe(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

/**
 * Snapshot functions return primitives (not objects).
 * useSyncExternalStore compares snapshots by reference/value.
 * Returning { width, height } as a new object on every call
 * would cause infinite re-renders.
 */
function getWidthSnapshot() {
  return window.innerWidth
}

function getHeightSnapshot() {
  return window.innerHeight
}

/** Server-side fallback values — must match to avoid hydration mismatch. */
const SSR_WIDTH = 390
const SSR_HEIGHT = 844

export type ViewportSize = {
  width: number
  height: number
}

/**
 * SSR-safe hook to track viewport dimensions.
 *
 * Uses useSyncExternalStore (React 18/19 standard) instead of
 * useEffect + useState to avoid hydration flash and ensure
 * consistency between server and client renders.
 *
 * @see https://react.dev/reference/react/useSyncExternalStore
 */
export function useViewportSize(): ViewportSize {
  const width = useSyncExternalStore(subscribe, getWidthSnapshot, () => SSR_WIDTH)
  const height = useSyncExternalStore(subscribe, getHeightSnapshot, () => SSR_HEIGHT)

  return { width, height }
}
