'use client'

import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  constrainAtlasCamera,
  zoomAtlasCameraAtPoint,
} from '@/lib/learning/atlas-camera'
import type { AtlasCameraState } from '@/lib/learning/atlas-camera'
import type {
  AtlasKinnuMapView,
  AtlasTerritoryConfig,
  LearningDomainId,
} from '@/lib/learning/schema'
import { useViewportSize } from '@/hooks/use-viewport-size'
import { WHEEL_IDLE_MS } from '../_utils/atlas-config'
import {
  getCameraConstraints,
  getDomainTransform,
  getMapDimensions,
  getWorldTransform,
} from '../_utils/atlas-geometry'
import { useAtlasAutoView } from './use-atlas-auto-view'
import { useAtlasPointer } from './use-atlas-pointer'

// ─── Public API ──────────────────────────────────────────────────────────────

export type UseAtlasCameraResult = {
  camera: AtlasCameraState
  isInteracting: boolean
  selectedTerritoryId: LearningDomainId | null
  selectedTerritory: AtlasTerritoryConfig | null
  dimensions: { width: number; height: number }
  /** React 19 ref callback — attach to the <main> element. Owns the wheel listener. */
  mainRef: (element: HTMLElement | null) => (() => void) | void
  snapToWorld: () => void
  snapToTerritory: (domainId: LearningDomainId) => void
  handlePointerDown: (event: React.PointerEvent<HTMLElement>) => void
  handlePointerMove: (event: React.PointerEvent<HTMLElement>) => void
  handlePointerEnd: (event: React.PointerEvent<HTMLElement>) => void
}

// ─── SSR fallback viewport ───────────────────────────────────────────────────

const SSR_VIEWPORT = { width: 390, height: 844 }

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Orchestrates all Atlas map camera behaviour.
 *
 * Responsibilities:
 * - Owns camera state and the `moveCamera` updater
 * - Delegates pointer/gesture/momentum to `useAtlasPointer`
 * - Delegates auto-view territory selection to `useAtlasAutoView`
 * - Handles wheel zoom via React 19 ref callback (attached once, no re-mount on resize)
 * - Provides snap actions (snapToWorld, snapToTerritory)
 */
export function useAtlasCamera({ map }: { map: AtlasKinnuMapView }): UseAtlasCameraResult {
  const viewport = useViewportSize()
  const reduceMotion = useReducedMotion() ?? false

  const dimensions = getMapDimensions(viewport)
  const constraints = getCameraConstraints(viewport)

  // Always-current refs — prevents stale closures without adding these values to effect deps
  const viewportRef = useRef(viewport)
  const dimensionsRef = useRef(dimensions)
  const constraintsRef = useRef(constraints)
  const reduceMotionRef = useRef(reduceMotion)
  viewportRef.current = viewport
  dimensionsRef.current = dimensions
  constraintsRef.current = constraints
  reduceMotionRef.current = reduceMotion

  // ── Camera state ───────────────────────────────────────────────────────────

  const initialCamera = getWorldTransform(SSR_VIEWPORT, getMapDimensions(SSR_VIEWPORT).width)

  const [camera, setCamera] = useState<AtlasCameraState>(initialCamera)
  const [isInteracting, setIsInteracting] = useState(false)
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<LearningDomainId | null>(null)

  const cameraRef = useRef<AtlasCameraState>(initialCamera)

  const selectedTerritory =
    map.territories.find((t) => t.domain.id === selectedTerritoryId) ?? null

  // ── Core camera updater ────────────────────────────────────────────────────

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

  // ── Delegate: pointer events + momentum ───────────────────────────────────

  const { autoViewPointRef, cancelMomentum, handlePointerDown, handlePointerMove, handlePointerEnd } =
    useAtlasPointer({ cameraRef, constraintsRef, moveCamera, setIsInteracting })

  // ── Delegate: auto-view territory selection ────────────────────────────────

  useAtlasAutoView({
    camera,
    territories: map.territories,
    viewportRef,
    dimensionsRef,
    autoViewPointRef,
    setSelectedTerritoryId,
  })

  // ── Snap actions ───────────────────────────────────────────────────────────

  function snapToWorld() {
    cancelMomentum()
    setIsInteracting(false)
    setSelectedTerritoryId(null)
    moveCamera(getWorldTransform(viewportRef.current, dimensionsRef.current.width))
  }

  function snapToTerritory(domainId: LearningDomainId) {
    const territory = map.territories.find((t) => t.domain.id === domainId)
    if (!territory) return
    cancelMomentum()
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

  // ── Init at mount ──────────────────────────────────────────────────────────

  useEffect(() => {
    moveCamera(getWorldTransform(viewportRef.current, dimensionsRef.current.width))
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional mount-only init
  }, [])

  // ── Re-constrain on viewport resize ───────────────────────────────────────

  const hasMountedRef = useRef(false)
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    cancelMomentum()
    moveCamera(cameraRef.current)
  }, [viewport.width, viewport.height, cancelMomentum])

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => cancelMomentum()
  }, [cancelMomentum])

  // ── Wheel zoom via React 19 ref callback ───────────────────────────────────
  // Defined as a ref so the RAF-attached handler is always up-to-date,
  // without needing to remove/re-add the listener when deps change.

  const wheelIdleTimeoutRef = useRef<number | null>(null)
  const wheelHandlerRef = useRef<((e: WheelEvent) => void) | null>(null)

  wheelHandlerRef.current = (event: WheelEvent) => {
    event.preventDefault()

    cancelMomentum()
    setIsInteracting(true)

    const element = event.currentTarget as HTMLElement
    const rect = element.getBoundingClientRect()
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    autoViewPointRef.current = point

    const intensity = event.ctrlKey || Math.abs(event.deltaY) < 60 ? 0.0042 : 0.0018
    const rawScale = cameraRef.current.scale * Math.exp(-event.deltaY * intensity)
    const { minScale, maxScale } = constraintsRef.current
    const nextScale = Math.min(Math.max(rawScale, minScale), maxScale)

    moveCamera(zoomAtlasCameraAtPoint(cameraRef.current, point, nextScale))

    if (wheelIdleTimeoutRef.current !== null) clearTimeout(wheelIdleTimeoutRef.current)
    wheelIdleTimeoutRef.current = window.setTimeout(
      () => setIsInteracting(false),
      WHEEL_IDLE_MS,
    )
  }

  /**
   * React 19 ref callback — returns a cleanup function called at unmount.
   * The wheel listener is attached exactly once and removed on unmount.
   * No re-mounting on resize since the handler is read via wheelHandlerRef.
   */
  const mainRef = useCallback((element: HTMLElement | null): (() => void) | void => {
    if (!element) return
    const handler = (e: WheelEvent) => wheelHandlerRef.current?.(e)
    element.addEventListener('wheel', handler, { passive: false })
    return () => {
      element.removeEventListener('wheel', handler)
      if (wheelIdleTimeoutRef.current !== null) clearTimeout(wheelIdleTimeoutRef.current)
    }
  }, [])

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
