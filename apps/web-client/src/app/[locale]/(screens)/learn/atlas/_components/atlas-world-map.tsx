'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import {
  type AtlasCameraState,
  constrainAtlasCamera,
  getAtlasCameraAutoView,
  zoomAtlasCameraAtPoint,
} from '@/lib/learning/atlas-camera'
import type {
  AtlasKinnuMapView,
  AtlasSubdomainConfig,
  AtlasTerritoryConfig,
  HexCell,
  LearningDomainId,
} from '@/lib/learning/schema'
import { cn } from '@/lib/utils'

const ARTBOARD_WIDTH = 1000
const ARTBOARD_HEIGHT = 1400
const HEX_RADIUS = 27
const SUBDOMAIN_HEX_RADIUS = 20
const SQRT_3 = Math.sqrt(3)
const TAP_MOVEMENT_THRESHOLD = 8
const WORLD_AUTO_SCALE = 0.9
const DETAIL_AUTO_SCALE = 1.48
const DETAIL_AUTO_RADIUS = 230
const SUBDOMAIN_VISIBLE_SCALE = 1.1
const SUBDOMAIN_LABEL_SCALE = 1.35
const MOMENTUM_DECAY = 0.965
const MOMENTUM_MIN_PX_PER_FRAME = 0.5
const WHEEL_IDLE_MS = 150

type CameraTransform = {
  x: number
  y: number
  scale: number
}

type ViewportSize = {
  width: number
  height: number
}

function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>({ width: 390, height: 844 })

  useEffect(() => {
    function updateSize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return size
}

function getHexCenter(cell: HexCell, radius: number) {
  return {
    x: radius * 1.5 * cell.q,
    y: radius * SQRT_3 * (cell.r + cell.q / 2),
  }
}

function getHexPath(cx: number, cy: number, radius: number) {
  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 180) * (60 * index)

    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`
  })

  return `M ${points.join(' L ')} Z`
}

function getMapDimensions(viewport: ViewportSize) {
  const width = viewport.width < 768 ? Math.max(760, viewport.width * 1.95) : viewport.width * 1.12

  return {
    width,
    height: width * (ARTBOARD_HEIGHT / ARTBOARD_WIDTH),
  }
}

function getCameraConstraints(viewport: ViewportSize) {
  return {
    minScale: viewport.width < 768 ? 0.46 : 0.55,
    maxScale: viewport.width < 768 ? 2.7 : 2.45,
    overscroll: viewport.width < 768 ? 40 : 60,
  }
}

function getWorldTransform(viewport: ViewportSize, mapWidth: number): CameraTransform {
  return {
    x: viewport.width / 2 - mapWidth * (viewport.width < 768 ? 0.43 : 0.5),
    y: viewport.width < 768 ? -52 : -82,
    scale: 1,
  }
}

function getTerritoryPoint(territory: Pick<AtlasTerritoryConfig, 'x' | 'y'>) {
  return {
    x: (territory.x / 100) * ARTBOARD_WIDTH,
    y: (territory.y / 100) * ARTBOARD_HEIGHT,
  }
}

function getSubdomainPoint(subdomain: Pick<AtlasSubdomainConfig, 'x' | 'y'>) {
  return {
    x: (subdomain.x / 100) * ARTBOARD_WIDTH,
    y: (subdomain.y / 100) * ARTBOARD_HEIGHT,
  }
}

function getDomainTransform(
  territory: AtlasTerritoryConfig,
  viewport: ViewportSize,
  mapWidth: number,
  reduceMotion: boolean,
): CameraTransform {
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

function AtlasHeader({
  selectedTerritory,
  onBackToWorld,
}: {
  selectedTerritory: AtlasTerritoryConfig | null
  onBackToWorld: () => void
}) {
  const backClassName =
    'grid h-11 w-11 place-items-center rounded-full bg-white/94 text-[#111] shadow-[0_16px_36px_rgba(0,0,0,0.26)] transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
      <div className="flex items-start justify-between gap-4">
        {selectedTerritory ? (
          <button
            type="button"
            aria-label="Retour à la carte Atlas"
            onClick={onBackToWorld}
            className={cn(backClassName, 'pointer-events-auto')}
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href="/learn"
            aria-label="Retour à Apprendre"
            className={cn(backClassName, 'pointer-events-auto')}
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </header>
  )
}

function AtlasSearchDock() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
      <button
        type="button"
        aria-label="Recherche dans l'Atlas bientôt disponible"
        className="pointer-events-auto flex h-14 min-w-0 max-w-[25rem] flex-1 items-center justify-center gap-3 rounded-full bg-white px-5 font-black text-[#111] shadow-[0_18px_48px_rgba(0,0,0,0.34)] transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:flex-none sm:px-9"
      >
        <Search className="h-5 w-5 shrink-0" strokeWidth={3.2} aria-hidden="true" />
        <span className="truncate text-[0.98rem]">Rechercher dans l'Atlas</span>
      </button>
    </div>
  )
}

function HexTerritorySvg({
  territory,
  selected,
  dimmed,
}: {
  territory: AtlasTerritoryConfig
  selected: boolean
  dimmed: boolean
}) {
  const center = getTerritoryPoint(territory)

  return (
    <g opacity={dimmed ? 0.28 : 1}>
      <g>
        {territory.cells.map((cell) => {
          const cellCenter = getHexCenter(cell, HEX_RADIUS)
          const cx = center.x + cellCenter.x
          const cy = center.y + cellCenter.y

          return (
            <path
              key={`${territory.domain.id}-${cell.q}-${cell.r}`}
              d={getHexPath(cx, cy, HEX_RADIUS)}
              fill={territory.darkColor}
              stroke="rgba(0,0,0,0.32)"
              strokeWidth="2.4"
            />
          )
        })}
      </g>
      <g opacity={selected ? 0.9 : 0.62}>
        {territory.textureCells.map((cell) => {
          const cellCenter = getHexCenter(cell, HEX_RADIUS)
          const cx = center.x + cellCenter.x
          const cy = center.y + cellCenter.y

          return (
            <path
              key={`${territory.domain.id}-texture-${cell.q}-${cell.r}`}
              d={getHexPath(cx, cy, HEX_RADIUS * 0.36)}
              fill="rgba(0,0,0,0.34)"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
            />
          )
        })}
      </g>
    </g>
  )
}

function SubdomainSvg({
  subdomain,
  visible,
}: {
  subdomain: AtlasSubdomainConfig
  visible: boolean
}) {
  const center = getSubdomainPoint(subdomain)

  return (
    <motion.g
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.92,
      }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      style={{ transformOrigin: `${center.x}px ${center.y}px` }}
    >
      {subdomain.cells.map((cell) => {
        const cellCenter = getHexCenter(cell, SUBDOMAIN_HEX_RADIUS)
        const cx = center.x + cellCenter.x
        const cy = center.y + cellCenter.y

        return (
          <path
            key={`${subdomain.id}-${cell.q}-${cell.r}`}
            d={getHexPath(cx, cy, SUBDOMAIN_HEX_RADIUS)}
            fill={subdomain.color}
            stroke="rgba(0,0,0,0.24)"
            strokeWidth="1.8"
          />
        )
      })}
    </motion.g>
  )
}

function TerritoryLabel({
  territory,
  selected,
  dimmed,
  onSelect,
}: {
  territory: AtlasTerritoryConfig
  selected: boolean
  dimmed: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      type="button"
      aria-label={`Explorer ${territory.domain.title}`}
      onClick={onSelect}
      initial={false}
      animate={{
        opacity: dimmed ? 0.16 : selected ? 0 : 1,
        scale: selected ? 0.86 : 1,
      }}
      transition={{ duration: 0.24 }}
      className="absolute z-20 min-h-12 -translate-x-1/2 -translate-y-1/2 rounded-[0.68rem] px-5 py-2.5 text-[1.18rem] font-black leading-tight text-white shadow-[0_12px_0_rgba(0,0,0,0.2),0_18px_34px_rgba(0,0,0,0.24)] transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:pointer-events-none md:text-[1.28rem]"
      disabled={selected}
      style={{
        left: `${territory.x}%`,
        top: `${territory.y}%`,
        backgroundColor: territory.color,
        color: territory.textColor,
      }}
    >
      {territory.label}
    </motion.button>
  )
}

function SubdomainLabel({
  subdomain,
  visible,
}: {
  subdomain: AtlasSubdomainConfig
  visible: boolean
}) {
  return (
    <motion.span
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 8,
        scale: visible ? 1 : 0.96,
      }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="pointer-events-none absolute z-30 max-w-[7.4rem] -translate-x-1/2 -translate-y-1/2 rounded-[0.48rem] px-2.5 py-1.5 text-center text-[0.62rem] font-black leading-tight text-white shadow-[0_7px_0_rgba(0,0,0,0.18),0_14px_28px_rgba(0,0,0,0.2)] md:max-w-[9rem] md:text-[0.72rem]"
      style={{
        left: `${subdomain.x}%`,
        top: `${subdomain.y}%`,
        backgroundColor: subdomain.color,
      }}
    >
      {subdomain.label}
    </motion.span>
  )
}

function AtlasCamera({
  map,
  selectedTerritoryId,
  camera,
  isInteracting,
  reduceMotion,
  onSelectTerritory,
}: {
  map: AtlasKinnuMapView
  selectedTerritoryId: LearningDomainId | null
  camera: AtlasCameraState
  isInteracting: boolean
  reduceMotion: boolean
  onSelectTerritory: (domainId: LearningDomainId) => void
}) {
  return (
    <motion.div
      className="absolute left-0 top-0"
      initial={false}
      animate={{
        x: camera.x,
        y: camera.y,
        scale: camera.scale,
      }}
      transition={{
        duration: isInteracting ? 0 : reduceMotion ? 0.18 : 0.42,
        ease: [0.2, 0.82, 0.2, 1],
      }}
      style={{
        width: 'var(--atlas-map-width)',
        height: 'var(--atlas-map-height)',
        transformOrigin: '0 0',
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${ARTBOARD_WIDTH} ${ARTBOARD_HEIGHT}`}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="atlas-kinnu-vignette" cx="50%" cy="44%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="52%" stopColor="rgba(255,255,255,0.015)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.34)" />
          </radialGradient>
        </defs>
        <rect width={ARTBOARD_WIDTH} height={ARTBOARD_HEIGHT} fill="transparent" />
        {map.territories.map((territory) => {
          const selected = selectedTerritoryId === territory.domain.id
          const dimmed = Boolean(selectedTerritoryId && !selected)

          return (
            <HexTerritorySvg
              key={territory.domain.id}
              territory={territory}
              selected={selected}
              dimmed={dimmed}
            />
          )
        })}
        {map.territories.flatMap((territory) =>
          territory.subdomains.map((subdomain) => (
            <SubdomainSvg
              key={`${territory.domain.id}-${subdomain.id}`}
              subdomain={subdomain}
              visible={camera.scale >= SUBDOMAIN_VISIBLE_SCALE}
            />
          )),
        )}
        <rect width={ARTBOARD_WIDTH} height={ARTBOARD_HEIGHT} fill="url(#atlas-kinnu-vignette)" />
      </svg>

      <div className="absolute inset-0">
        {map.territories.map((territory) => {
          const selected = selectedTerritoryId === territory.domain.id
          const dimmed = Boolean(selectedTerritoryId && !selected)

          return (
            <TerritoryLabel
              key={territory.domain.id}
              territory={territory}
              selected={selected}
              dimmed={dimmed}
              onSelect={() => onSelectTerritory(territory.domain.id)}
            />
          )
        })}
        {map.territories.flatMap((territory) =>
          territory.subdomains.map((subdomain) => (
            <SubdomainLabel
              key={`${territory.domain.id}-${subdomain.id}`}
              subdomain={subdomain}
              visible={camera.scale >= SUBDOMAIN_LABEL_SCALE}
            />
          )),
        )}
      </div>
    </motion.div>
  )
}

export function AtlasWorldMap({ map }: { map: AtlasKinnuMapView }) {
  const viewport = useViewportSize()
  const dimensions = useMemo(() => getMapDimensions(viewport), [viewport])
  const constraints = useMemo(() => getCameraConstraints(viewport), [viewport])
  const reduceMotion = useReducedMotion() ?? false
  const mainRef = useRef<HTMLElement | null>(null)
  const pointersRef = useRef(new Map<number, { x: number; y: number }>())
  const autoViewPointRef = useRef<{ x: number; y: number } | null>(null)
  const gestureRef = useRef<{
    startCamera: AtlasCameraState
    startPoint: { x: number; y: number }
    startMidpoint: { x: number; y: number }
    startDistance: number
    moved: boolean
  } | null>(null)
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<LearningDomainId | null>(null)
  const [camera, setCamera] = useState<AtlasCameraState>(() =>
    getWorldTransform(
      { width: 390, height: 844 },
      getMapDimensions({ width: 390, height: 844 }).width,
    ),
  )
  const cameraRef = useRef<AtlasCameraState>(camera)
  const wheelIdleTimeoutRef = useRef<number | null>(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const rafRef = useRef<number | null>(null)
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const velocityHistoryRef = useRef<Array<{ x: number; y: number; t: number }>>([])
  const lastRafTimestampRef = useRef<number>(0)
  const hasInitializedRef = useRef(false)
  const lastTapRef = useRef<{ x: number; y: number; t: number } | null>(null)
  const constraintsRef = useRef(constraints)
  const selectedTerritory =
    map.territories.find((territory) => territory.domain.id === selectedTerritoryId) ?? null
  const autoViewTargets = useMemo(
    () =>
      map.territories.map((territory) => ({
        id: territory.domain.id,
        ...getTerritoryPoint(territory),
      })),
    [map.territories],
  )
  const constrainCamera = useCallback(
    (nextCamera: AtlasCameraState) =>
      constrainAtlasCamera(nextCamera, viewport, dimensions, constraints),
    [viewport, dimensions, constraints],
  )
  const moveCamera = useCallback(
    (nextCamera: AtlasCameraState) => {
      const constrainedCamera = constrainCamera(nextCamera)

      cameraRef.current = constrainedCamera
      setCamera(constrainedCamera)
    },
    [constrainCamera],
  )
  const getViewportPoint = useCallback((event: { clientX: number; clientY: number }) => {
    const rect = mainRef.current?.getBoundingClientRect()

    return {
      x: event.clientX - (rect?.left ?? 0),
      y: event.clientY - (rect?.top ?? 0),
    }
  }, [])
  const setGestureFromPointers = useCallback((nextCamera: AtlasCameraState) => {
    const pointers = Array.from(pointersRef.current.values())
    const firstPointer = pointers[0] ?? { x: 0, y: 0 }
    const secondPointer = pointers[1]
    const midpoint = secondPointer
      ? {
          x: (firstPointer.x + secondPointer.x) / 2,
          y: (firstPointer.y + secondPointer.y) / 2,
        }
      : firstPointer
    const distance = secondPointer
      ? Math.hypot(secondPointer.x - firstPointer.x, secondPointer.y - firstPointer.y)
      : 0

    gestureRef.current = {
      startCamera: nextCamera,
      startPoint: firstPointer,
      startMidpoint: midpoint,
      startDistance: distance,
      moved: false,
    }
  }, [])
  const snapToWorld = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    velocityRef.current = { x: 0, y: 0 }
    setIsInteracting(false)
    setSelectedTerritoryId(null)
    moveCamera(getWorldTransform(viewport, dimensions.width))
  }, [dimensions.width, moveCamera, viewport])
  const snapToTerritory = useCallback(
    (domainId: LearningDomainId) => {
      const territory = map.territories.find((item) => item.domain.id === domainId)

      if (!territory) return

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      velocityRef.current = { x: 0, y: 0 }
      setIsInteracting(false)
      setSelectedTerritoryId(domainId)
      moveCamera(getDomainTransform(territory, viewport, dimensions.width, reduceMotion))
    },
    [dimensions.width, map.territories, moveCamera, reduceMotion, viewport],
  )
  const startMomentum = useCallback(() => {
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
  }, [moveCamera])

  useEffect(() => {
    constraintsRef.current = constraints
  }, [constraints])

  // Init world view on first real viewport; re-constrain on subsequent resize/rotation
  useEffect(() => {
    if (hasInitializedRef.current) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        velocityRef.current = { x: 0, y: 0 }
      }
      moveCamera(cameraRef.current)
      return
    }
    hasInitializedRef.current = true
    moveCamera(getWorldTransform(viewport, dimensions.width))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveCamera])

  const applyAutoView = useCallback(
    (nextCamera: AtlasCameraState) => {
      const autoView = getAtlasCameraAutoView(
        nextCamera,
        viewport,
        dimensions,
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
        return
      }

      if (autoView.mode === 'domain') {
        setSelectedTerritoryId(autoView.targetId as LearningDomainId)
      }
    },
    [autoViewTargets, dimensions, viewport],
  )

  useEffect(() => {
    applyAutoView(camera)
  }, [applyAutoView, camera])

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    const element = mainRef.current

    if (!element) return

    const wheelElement = element

    function handleNativeWheel(event: WheelEvent) {
      event.preventDefault()

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      velocityRef.current = { x: 0, y: 0 }

      setIsInteracting(true)

      const rect = wheelElement.getBoundingClientRect()
      const point = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
      autoViewPointRef.current = point
      const wheelIntensity = event.ctrlKey || Math.abs(event.deltaY) < 60 ? 0.0042 : 0.0018
      const rawWheelScale = cameraRef.current.scale * Math.exp(-event.deltaY * wheelIntensity)
      const { minScale, maxScale } = constraintsRef.current
      const nextScale = Math.min(Math.max(rawWheelScale, minScale), maxScale)

      moveCamera(zoomAtlasCameraAtPoint(cameraRef.current, point, nextScale))

      if (wheelIdleTimeoutRef.current) {
        window.clearTimeout(wheelIdleTimeoutRef.current)
      }

      wheelIdleTimeoutRef.current = window.setTimeout(() => {
        setIsInteracting(false)
      }, WHEEL_IDLE_MS)
    }

    wheelElement.addEventListener('wheel', handleNativeWheel, { passive: false })

    return () => {
      wheelElement.removeEventListener('wheel', handleNativeWheel)

      if (wheelIdleTimeoutRef.current) {
        window.clearTimeout(wheelIdleTimeoutRef.current)
      }
    }
  }, [moveCamera])

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a,button')) {
      return
    }

    const pointer = getViewportPoint(event)
    const now = performance.now()
    const lastTap = lastTapRef.current

    if (
      lastTap &&
      now - lastTap.t < 300 &&
      Math.hypot(pointer.x - lastTap.x, pointer.y - lastTap.y) < 44
    ) {
      lastTapRef.current = null
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      velocityRef.current = { x: 0, y: 0 }
      velocityHistoryRef.current = []
      setIsInteracting(false)
      const nextScale = Math.min(cameraRef.current.scale * 1.6, constraints.maxScale)
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

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (!pointersRef.current.has(event.pointerId) || !gestureRef.current) {
      return
    }

    pointersRef.current.set(event.pointerId, getViewportPoint(event))
    const pointers = Array.from(pointersRef.current.values())
    const gesture = gestureRef.current

    if (pointers.length >= 2) {
      const firstPointer = pointers[0]
      const secondPointer = pointers[1]

      if (!firstPointer || !secondPointer) {
        return
      }

      const midpoint = {
        x: (firstPointer.x + secondPointer.x) / 2,
        y: (firstPointer.y + secondPointer.y) / 2,
      }
      autoViewPointRef.current = midpoint
      const distance = Math.hypot(
        secondPointer.x - firstPointer.x,
        secondPointer.y - firstPointer.y,
      )
      const rawNextScale =
        gesture.startDistance > 0
          ? gesture.startCamera.scale * (distance / gesture.startDistance)
          : gesture.startCamera.scale
      const nextScale = Math.min(Math.max(rawNextScale, constraints.minScale), constraints.maxScale)
      const anchoredCamera = zoomAtlasCameraAtPoint(
        gesture.startCamera,
        gesture.startMidpoint,
        nextScale,
      )

      gesture.moved = true
      moveCamera({
        ...anchoredCamera,
        x: anchoredCamera.x + midpoint.x - gesture.startMidpoint.x,
        y: anchoredCamera.y + midpoint.y - gesture.startMidpoint.y,
      })
      return
    }

    const pointer = pointers[0]

    if (!pointer) {
      return
    }

    const now = performance.now()
    velocityHistoryRef.current.push({ x: pointer.x, y: pointer.y, t: now })
    velocityHistoryRef.current = velocityHistoryRef.current.filter((p) => now - p.t < 100)

    const deltaX = pointer.x - gesture.startPoint.x
    const deltaY = pointer.y - gesture.startPoint.y

    if (Math.hypot(deltaX, deltaY) > TAP_MOVEMENT_THRESHOLD) {
      gesture.moved = true
    }

    moveCamera({
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
          lastTapRef.current = { x: gesture.startPoint.x, y: gesture.startPoint.y, t: performance.now() }
        }
        setIsInteracting(false)
      }
      return
    }

    velocityHistoryRef.current = []
    velocityRef.current = { x: 0, y: 0 }
    setGestureFromPointers(cameraRef.current)
  }

  return (
    <main
      ref={mainRef}
      className="relative h-[100dvh] min-h-[40rem] touch-none overflow-hidden bg-[#202020] text-white"
      style={
        {
          '--atlas-map-width': `${dimensions.width}px`,
          '--atlas-map-height': `${dimensions.height}px`,
        } as CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerEnd}
      onPointerUp={handlePointerEnd}
    >
      <h1 className="sr-only">Atlas du vivant</h1>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_34%,rgba(255,255,255,0.055),transparent_28%),linear-gradient(180deg,#242424_0%,#202020_52%,#1f1f1f_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-72 bg-gradient-to-b from-[#202020] via-[#202020]/92 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-[#202020] via-[#202020]/90 to-transparent" />

      <AtlasCamera
        map={map}
        selectedTerritoryId={selectedTerritoryId}
        camera={camera}
        isInteracting={isInteracting}
        reduceMotion={reduceMotion}
        onSelectTerritory={snapToTerritory}
      />
      <AtlasHeader selectedTerritory={selectedTerritory} onBackToWorld={snapToWorld} />
      <AtlasSearchDock />
      <div className="sr-only" aria-live="polite">
        {selectedTerritory
          ? `${selectedTerritory.domain.title} affiche ses sous-domaines`
          : 'Atlas du vivant prêt'}
      </div>
    </main>
  )
}
