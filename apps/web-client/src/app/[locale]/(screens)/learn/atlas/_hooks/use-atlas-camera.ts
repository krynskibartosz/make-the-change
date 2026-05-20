'use client'

import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type AtlasCameraState,
  constrainAtlasCamera,
  getAtlasCameraAutoView,
  zoomAtlasCameraAtPoint,
} from '@/lib/learning/atlas-camera'
import type {
  AtlasKinnuMapView,
  AtlasTerritoryConfig,
  LearningDomainId,
} from '@/lib/learning/schema'
import { useViewportSize } from '@/hooks/use-viewport-size'

// ─── Camera config constants ────────────────────────────────────────────────

const ARTBOARD_WIDTH = 1000
const ARTBOARD_HEIGHT = 1400
const TAP_MOVEMENT_THRESHOLD = 8
const WORLD_AUTO_SCALE = 0.9
const DETAIL_AUTO_SCALE = 1.48
const DETAIL_AUTO_RADIUS = 230
const MOMENTUM_DECAY = 0.965
const MOMENTUM_MIN_PX_PER_FRAME = 0.5
const WHEEL_IDLE_MS = 150

// ─── Pure geometry helpers ──────────────────────────────────────────────────

function getMapDimensions(viewport: { width: number; height: number }) {
  const width = viewport.width < 768 ? Math.max(760, viewport.width * 1.95) : viewport.width * 1.12
  return { width, height: width * (ARTBOARD_HEIGHT / ARTBOARD_WIDTH) }
}

function getCameraConstraints(viewport: { width: number }) {
  return {
    minScale: viewport.width < 768 ? 0.46 : 0.55,
    maxScale: viewport.width < 768 ? 2.7 : 2.45,
    overscroll: viewport.width < 768 ? 40 : 60,
  }
}

function getTerritoryPoint(territory: Pick<AtlasTerritoryConfig, 'x' | 'y'>) {
  return {
    x: (territory.x / 100) * ARTBOARD_WIDTH,
    y: (territory.y / 100) * ARTBOARD_HEIGHT,
  }
}

function getWorldTransform(
  viewport: { width: number; height: number },
  mapWidth: number,
): AtlasCameraState {
  return {
    x: viewport.width / 2 - mapWidth * (viewport.width < 768 ? 0.43 : 0.5),
    y: viewport.width < 768 ? -52 : -82,
    scale: 1,
  }
}

function getDomainTransform(
  territory: AtlasTerritoryConfig,
  viewport: { width: number; height: number },
  mapWidth: number,
  reduceMotion: boolean,
): AtlasCameraState {
  const scale = reduceMotion
    ? 1.16
    : viewport.width < 768
      ? Math.min(territory.camera.scale, 1.74)
      : territory.camera.scale
  const scaleFactor = mapWidth / ARTBOARD_WIDTH
  const point = getTerritoryPoint(territory)

  return {
    x: viewport.width / 2 - point.x * scaleFactor * scale,
    y: viewport.height * (viewport.width < 768 ? 0.54 : 0.48) - point.y * scaleFactor * scale,
    scale,
  }
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export type UseAtlasCameraResult = {
  camera: AtlasCameraState
  isInteracting: boolean
  selectedTerritoryId: LearningDomainId | null
  selectedTerritory: AtlasTerritoryConfig | null
  dimensions: { width: number; height: number }
  /** React 19 ref callback — attach to the <main> element. Handles wheel events. */
  mainRef: (element: HTMLElement | null) => (() => void) | void
  snapToWorld: () => void
  snapToTerritory: (domainId: LearningDomainId) => void
  handlePointerDown: (event: React.PointerEvent<HTMLElement>) => void
  handlePointerMove: (event: React.PointerEvent<HTMLElement>) => void
  handlePointerEnd: (event: React.PointerEvent<HTMLElement>) => void
}

export function useAtlasCamera({ map }: { map: AtlasKinnuMapView }): UseAtlasCameraResult {
  const viewport = useViewportSize()
  const reduceMotion = useReducedMotion() ?? false

  const dimensions = getMapDimensions(viewport)
  const constraints = getCameraConstraints(viewport)

  // ── Mutable refs (imperative state that must not trigger re-renders) ──────
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const autoViewPointRef = useRef<{ x: number; y: number } | null>(null)
  const gestureRef = useRef<{
    startCamera: AtlasCameraState
    startPoint: { x: number; y: number }
    startMidpoint: { x: number; y: number }
    startDistance: number
    moved: boolean
  } | null>(null)
  const cameraRef = useRef<AtlasCameraState>(
    getWorldTransform({ width: 390, height: 844 }, getMapDimensions({ width: 390, height: 844 }).width),
  )
  const wheelIdleTimeoutRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const velocityHistoryRef = useRef<Array<{ x: number; y: number; t: number }>>([])
  const lastRafTimestampRef = useRef<number>(0)
  const lastTapRef = useRef<{ x: number; y: number; t: number } | null>(null)
  const constraintsRef = useRef(constraints)
  const dimensionsRef = useRef(dimensions)
  const viewportRef = useRef(viewport)
  const reduceMotionRef = useRef(reduceMotion)

  // Keep mutable refs up to date each render (no stale closure issues)
  constraintsRef.current = constraints
  dimensionsRef.current = dimensions
  viewportRef.current = viewport
  reduceMotionRef.current = reduceMotion

  // ── React state (triggers re-renders) ────────────────────────────────────
  const [camera, setCamera] = useState<AtlasCameraState>(() =>
    getWorldTransform(
      { width: 390, height: 844 },
      getMapDimensions({ width: 390, height: 844 }).width,
    ),
  )
  const [isInteracting, setIsInteracting] = useState(false)
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<LearningDomainId | null>(null)

  const selectedTerritory =
    map.territories.find((t) => t.domain.id === selectedTerritoryId) ?? null

  // ── Core camera updater ───────────────────────────────────────────────────
  function moveCamera(nextCamera: AtlasCameraState) {
    const constrained = constrainAtlasCamera(
      nextCamera,
      viewportRef.current,
      dimensionsRef.current,
      constraintsRef.current,
    )
    cameraRef.current = constrained
    setCamera(constrained)
  }

  // ── Snap actions ──────────────────────────────────────────────────────────
  function snapToWorld() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    velocityRef.current = { x: 0, y: 0 }
    setIsInteracting(false)
    setSelectedTerritoryId(null)
    moveCamera(getWorldTransform(viewportRef.current, dimensionsRef.current.width))
  }

  function snapToTerritory(domainId: LearningDomainId) {
    const territory = map.territories.find((t) => t.domain.id === domainId)
    if (!territory) return

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    velocityRef.current = { x: 0, y: 0 }
    setIsInteracting(false)
    setSelectedTerritoryId(domainId)
    moveCamera(
      getDomainTransform(
        territory,
        viewportRef.current,
        dimensionsRef.current.width,
        reduceMotionRef.current,
      ),
    )
  }

  // ── Momentum (inertia after pan release) ──────────────────────────────────
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

      moveCamera({
        ...cameraRef.current,
        x: cameraRef.current.x + velocityRef.current.x,
        y: cameraRef.current.y + velocityRef.current.y,
      })
      rafRef.current = requestAnimationFrame(tick)
    }

    lastRafTimestampRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }

  // ── Init at mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    moveCamera(getWorldTransform(viewportRef.current, dimensionsRef.current.width))
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only init
  }, [])

  // ── Re-constrain on resize/orientation change ─────────────────────────────
  const isMountedRef = useRef(false)
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      velocityRef.current = { x: 0, y: 0 }
    }
    moveCamera(cameraRef.current)
  }, [viewport.width, viewport.height])

  // ── Auto-view (select territory based on zoom + position) ─────────────────
  useEffect(() => {
    const autoViewTargets = map.territories.map((territory) => ({
      id: territory.domain.id as LearningDomainId,
      ...getTerritoryPoint(territory),
    }))

    const autoView = getAtlasCameraAutoView<LearningDomainId>(
      camera,
      viewportRef.current,
      dimensionsRef.current,
      { width: ARTBOARD_WIDTH, height: ARTBOARD_HEIGHT },
      autoViewTargets,
      {
        worldScale: WORLD_AUTO_SCALE,
        detailScale: DETAIL_AUTO_SCALE,
        detailRadius: DETAIL_AUTO_RADIUS,
        viewportPoint: autoViewPointRef.current ?? undefined,
      },
    )

    if (autoView.mode === 'world') {
      setSelectedTerritoryId(null)
    } else if (autoView.mode === 'domain') {
      setSelectedTerritoryId(autoView.targetId) // no cast needed — typed as LearningDomainId
    }
  }, [camera, map.territories])

  // ── Cleanup RAF on unmount ────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      if (wheelIdleTimeoutRef.current !== null) clearTimeout(wheelIdleTimeoutRef.current)
    }
  }, [])

  // ── Wheel event via React 19 ref callback (attached once, cleaned up on unmount) ──
  const wheelHandlerRef = useRef<((e: WheelEvent) => void) | null>(null)

  // Always up-to-date handler — uses refs, never stale
  wheelHandlerRef.current = (event: WheelEvent) => {
    event.preventDefault()

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    velocityRef.current = { x: 0, y: 0 }
    setIsInteracting(true)

    const element = event.currentTarget as HTMLElement
    const rect = element.getBoundingClientRect()
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    autoViewPointRef.current = point

    const wheelIntensity = event.ctrlKey || Math.abs(event.deltaY) < 60 ? 0.0042 : 0.0018
    const rawScale = cameraRef.current.scale * Math.exp(-event.deltaY * wheelIntensity)
    const { minScale, maxScale } = constraintsRef.current
    const nextScale = Math.min(Math.max(rawScale, minScale), maxScale)

    moveCamera(zoomAtlasCameraAtPoint(cameraRef.current, point, nextScale))

    if (wheelIdleTimeoutRef.current !== null) clearTimeout(wheelIdleTimeoutRef.current)
    wheelIdleTimeoutRef.current = window.setTimeout(() => setIsInteracting(false), WHEEL_IDLE_MS)
  }

  /**
   * React 19 ref callback — returns a cleanup function.
   * The wheel listener is attached once at mount and removed at unmount.
   * No useEffect dependency on moveCamera → no listener churn on resize.
   */
  const mainRef = useCallback((element: HTMLElement | null): (() => void) | void => {
    if (!element) return
    const handler = (e: WheelEvent) => wheelHandlerRef.current?.(e)
    element.addEventListener('wheel', handler, { passive: false })
    return () => element.removeEventListener('wheel', handler)
  }, [])

  // ── Pointer helpers ───────────────────────────────────────────────────────
  function getViewportPoint(
    event: { clientX: number; clientY: number },
    element: HTMLElement,
  ) {
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

  // ── Pointer event handlers ────────────────────────────────────────────────
  function handlePointerDown(event: React.PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a,button')) return

    const pointer = getViewportPoint(event, event.currentTarget)
    const now = performance.now()
    const lastTap = lastTapRef.current

    if (lastTap && now - lastTap.t < 300 && Math.hypot(pointer.x - lastTap.x, pointer.y - lastTap.y) < 44) {
      lastTapRef.current = null
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      velocityRef.current = { x: 0, y: 0 }
      velocityHistoryRef.current = []
      setIsInteracting(false)
      const nextScale = Math.min(
        cameraRef.current.scale * 1.6,
        constraintsRef.current.maxScale,
      )
      moveCamera(zoomAtlasCameraAtPoint(cameraRef.current, pointer, nextScale))
      return
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    velocityRef.current = { x: 0, y: 0 }
    velocityHistoryRef.current = []

    event.currentTarget.setPointerCapture(event.pointerId)
    pointersRef.current.set(event.pointerId, pointer)
    autoViewPointRef.current = pointer
    setIsInteracting(true)
    setGestureFromPointers(cameraRef.current)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!pointersRef.current.has(event.pointerId) || !gestureRef.current) return

    pointersRef.current.set(event.pointerId, getViewportPoint(event, event.currentTarget))
    const pointers = Array.from(pointersRef.current.values())
    const gesture = gestureRef.current

    if (pointers.length >= 2) {
      const [first, second] = pointers as [{ x: number; y: number }, { x: number; y: number }]
      const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 }
      autoViewPointRef.current = midpoint
      const distance = Math.hypot(second.x - first.x, second.y - first.y)
      const rawScale =
        gesture.startDistance > 0
          ? gesture.startCamera.scale * (distance / gesture.startDistance)
          : gesture.startCamera.scale
      const nextScale = Math.min(
        Math.max(rawScale, constraintsRef.current.minScale),
        constraintsRef.current.maxScale,
      )
      const anchored = zoomAtlasCameraAtPoint(gesture.startCamera, gesture.startMidpoint, nextScale)
      gesture.moved = true
      moveCamera({
        ...anchored,
        x: anchored.x + midpoint.x - gesture.startMidpoint.x,
        y: anchored.y + midpoint.y - gesture.startMidpoint.y,
      })
      return
    }

    const pointer = pointers[0]
    if (!pointer) return

    const now = performance.now()
    velocityHistoryRef.current.push({ x: pointer.x, y: pointer.y, t: now })
    velocityHistoryRef.current = velocityHistoryRef.current.filter((p) => now - p.t < 100)

    const deltaX = pointer.x - gesture.startPoint.x
    const deltaY = pointer.y - gesture.startPoint.y

    if (Math.hypot(deltaX, deltaY) > TAP_MOVEMENT_THRESHOLD) gesture.moved = true

    moveCamera({
      ...gesture.startCamera,
      x: gesture.startCamera.x + deltaX,
      y: gesture.startCamera.y + deltaY,
    })
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLElement>) {
    pointersRef.current.delete(event.pointerId)

    if (pointersRef.current.size === 0) {
      const gesture = gestureRef.current
      gestureRef.current = null

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

    velocityHistoryRef.current = []
    velocityRef.current = { x: 0, y: 0 }
    setGestureFromPointers(cameraRef.current)
  }

  return {
    camera,
    isInteracting,
    selectedTerritoryId,
    selectedTerritory,
    dimensions,
    mainRef,
    snapToWorld,
    snapToTerritory,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  }
}
