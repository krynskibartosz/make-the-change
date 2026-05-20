'use client'

import { type PointerEvent as ReactPointerEvent, useRef } from 'react'
import { zoomAtlasCameraAtPoint } from '@/lib/learning/atlas-camera'
import type { AtlasCameraConstraints, AtlasCameraState } from '@/lib/learning/atlas-camera'
import {
  MOMENTUM_DECAY,
  MOMENTUM_MIN_PX_PER_FRAME,
  TAP_MOVEMENT_THRESHOLD,
} from '../_utils/atlas-config'

// ─── Internal types ──────────────────────────────────────────────────────────

type GestureState = {
  startCamera: AtlasCameraState
  startPoint: { x: number; y: number }
  startMidpoint: { x: number; y: number }
  startDistance: number
  moved: boolean
}

// ─── Public API ──────────────────────────────────────────────────────────────

export type UseAtlasPointerOptions = {
  cameraRef: React.MutableRefObject<AtlasCameraState>
  constraintsRef: React.MutableRefObject<AtlasCameraConstraints>
  moveCamera: (camera: AtlasCameraState) => void
  setIsInteracting: (value: boolean) => void
}

export type UseAtlasPointerResult = {
  /** Shared focal point ref — written by pointer/wheel, read by auto-view. */
  autoViewPointRef: React.MutableRefObject<{ x: number; y: number } | null>
  /** Stops the in-progress momentum RAF and resets velocity. */
  cancelMomentum: () => void
  handlePointerDown: (event: ReactPointerEvent<HTMLElement>) => void
  handlePointerMove: (event: ReactPointerEvent<HTMLElement>) => void
  handlePointerEnd: (event: ReactPointerEvent<HTMLElement>) => void
  /** Checks if a drag gesture just finished (useful for blocking accidental clicks) */
  wasDragged: () => boolean
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Encapsulates all pointer interaction logic for the Atlas map:
 * - Single-pointer pan
 * - Two-pointer pinch-to-zoom
 * - Double-tap zoom
 * - Post-release momentum (inertia) with RAF-based decay
 */
export function useAtlasPointer({
  cameraRef,
  constraintsRef,
  moveCamera,
  setIsInteracting,
}: UseAtlasPointerOptions): UseAtlasPointerResult {
  // Always-current ref for moveCamera — prevents stale closures inside the RAF loop
  const moveCameraRef = useRef(moveCamera)
  moveCameraRef.current = moveCamera

  // ── Pointer tracking ───────────────────────────────────────────────────────
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const gestureRef = useRef<GestureState | null>(null)

  // ── Momentum physics ───────────────────────────────────────────────────────
  const rafRef = useRef<number | null>(null)
  const velocityRef = useRef({ x: 0, y: 0 })
  const velocityHistoryRef = useRef<Array<{ x: number; y: number; t: number }>>([])
  const lastRafTimestampRef = useRef<number>(0)

  // ── Gesture state ──────────────────────────────────────────────────────────
  const lastTapRef = useRef<{ x: number; y: number; t: number } | null>(null)
  const lastDragTimeRef = useRef<number>(0)

  // ── Shared focal point (written here, read by useAtlasAutoView) ───────────
  const autoViewPointRef = useRef<{ x: number; y: number } | null>(null)

  // ── Momentum ───────────────────────────────────────────────────────────────

  function cancelMomentum() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    velocityRef.current = { x: 0, y: 0 }
  }

  function startMomentum() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

    function tick(timestamp: number) {
      const dt = timestamp - lastRafTimestampRef.current
      lastRafTimestampRef.current = timestamp
      const decay = Math.pow(MOMENTUM_DECAY, dt / 16.67)
      velocityRef.current.x *= decay
      velocityRef.current.y *= decay

      if (Math.hypot(velocityRef.current.x, velocityRef.current.y) < MOMENTUM_MIN_PX_PER_FRAME) {
        rafRef.current = null
        setIsInteracting(false)
        return
      }

      const cam = cameraRef.current
      moveCameraRef.current({
        ...cam,
        x: cam.x + velocityRef.current.x,
        y: cam.y + velocityRef.current.y,
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    lastRafTimestampRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  function getViewportPoint(event: { clientX: number; clientY: number }, element: HTMLElement) {
    const rect = element.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  function setGestureFromPointers(nextCamera: AtlasCameraState) {
    const pointers = Array.from(pointersRef.current.values())
    const first = pointers[0] ?? { x: 0, y: 0 }
    const second = pointers[1]
    const midpoint = second
      ? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 }
      : first
    const distance = second ? Math.hypot(second.x - first.x, second.y - first.y) : 0

    gestureRef.current = {
      startCamera: nextCamera,
      startPoint: first,
      startMidpoint: midpoint,
      startDistance: distance,
      moved: false,
    }
  }

  // ── Pointer event handlers ─────────────────────────────────────────────────

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a,button')) return

    const pointer = getViewportPoint(event, event.currentTarget)
    const now = performance.now()
    const lastTap = lastTapRef.current
    const cam = cameraRef.current

    // Double-tap → zoom in
    if (
      lastTap &&
      now - lastTap.t < 300 &&
      Math.hypot(pointer.x - lastTap.x, pointer.y - lastTap.y) < 44
    ) {
      lastTapRef.current = null
      cancelMomentum()
      velocityHistoryRef.current = []
      setIsInteracting(false)
      const nextScale = Math.min(cam.scale * 1.6, constraintsRef.current.maxScale)
      moveCameraRef.current(zoomAtlasCameraAtPoint(cam, pointer, nextScale))
      return
    }

    cancelMomentum()
    velocityHistoryRef.current = []

    event.currentTarget.setPointerCapture(event.pointerId)
    pointersRef.current.set(event.pointerId, pointer)
    autoViewPointRef.current = pointer
    setIsInteracting(true)
    setGestureFromPointers(cam)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (!pointersRef.current.has(event.pointerId) || !gestureRef.current) return

    pointersRef.current.set(event.pointerId, getViewportPoint(event, event.currentTarget))
    const pointers = Array.from(pointersRef.current.values())
    const gesture = gestureRef.current
    const { minScale, maxScale } = constraintsRef.current

    // Pinch-to-zoom (two pointers)
    if (pointers.length >= 2) {
      const [first, second] = pointers as [{ x: number; y: number }, { x: number; y: number }]
      const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 }
      autoViewPointRef.current = midpoint
      const distance = Math.hypot(second.x - first.x, second.y - first.y)
      const rawScale =
        gesture.startDistance > 0
          ? gesture.startCamera.scale * (distance / gesture.startDistance)
          : gesture.startCamera.scale
      const nextScale = Math.min(Math.max(rawScale, minScale), maxScale)
      const anchored = zoomAtlasCameraAtPoint(gesture.startCamera, gesture.startMidpoint, nextScale)
      gesture.moved = true
      moveCameraRef.current({
        ...anchored,
        x: anchored.x + midpoint.x - gesture.startMidpoint.x,
        y: anchored.y + midpoint.y - gesture.startMidpoint.y,
      })
      return
    }

    // Single-pointer pan
    const pointer = pointers[0]
    if (!pointer) return

    const now = performance.now()
    velocityHistoryRef.current.push({ x: pointer.x, y: pointer.y, t: now })
    velocityHistoryRef.current = velocityHistoryRef.current.filter((p) => now - p.t < 100)

    const deltaX = pointer.x - gesture.startPoint.x
    const deltaY = pointer.y - gesture.startPoint.y
    if (Math.hypot(deltaX, deltaY) > TAP_MOVEMENT_THRESHOLD) gesture.moved = true

    moveCameraRef.current({
      ...gesture.startCamera,
      x: gesture.startCamera.x + deltaX,
      y: gesture.startCamera.y + deltaY,
    })
  }

  function handlePointerEnd(event: ReactPointerEvent<HTMLElement>) {
    pointersRef.current.delete(event.pointerId)

    if (pointersRef.current.size === 0) {
      const gesture = gestureRef.current
      gestureRef.current = null
      if (gesture?.moved) {
        lastDragTimeRef.current = performance.now()
      }

      // Compute release velocity from recent history
      const history = velocityHistoryRef.current
      if (gesture?.moved && history.length >= 2) {
        const newest = history[history.length - 1]!
        const oldest = history[0]!
        const dt = newest.t - oldest.t
        if (dt > 0 && dt < 150) {
          velocityRef.current = {
            x: ((newest.x - oldest.x) / dt) * 16.67,
            y: ((newest.y - oldest.y) / dt) * 16.67,
          }
        }
      }
      velocityHistoryRef.current = []

      const speed = Math.hypot(velocityRef.current.x, velocityRef.current.y)
      if (gesture?.moved && speed >= MOMENTUM_MIN_PX_PER_FRAME) {
        startMomentum()
      } else {
        if (gesture && !gesture.moved) {
          lastTapRef.current = {
            x: gesture.startPoint.x,
            y: gesture.startPoint.y,
            t: performance.now(),
          }
        }
        setIsInteracting(false)
      }
      return
    }

    // Second finger lifted — reset gesture anchor to current state
    velocityHistoryRef.current = []
    velocityRef.current = { x: 0, y: 0 }
    setGestureFromPointers(cameraRef.current)
  }

  return {
    autoViewPointRef,
    cancelMomentum,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    wasDragged: () => performance.now() - lastDragTimeRef.current < 100,
  }
}
