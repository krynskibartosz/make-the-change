'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
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
    'grid h-12 w-12 place-items-center rounded-full bg-white text-[#111] shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-5 pt-[max(1.2rem,env(safe-area-inset-top))] md:px-10">
      <div className="flex items-start justify-between gap-4">
        {selectedTerritory ? (
          <button
            type="button"
            aria-label="Retour à la carte Atlas"
            onClick={onBackToWorld}
            className={cn(backClassName, 'pointer-events-auto')}
          >
            <ArrowLeft className="h-6 w-6" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href="/learn"
            aria-label="Retour à Apprendre"
            className={cn(backClassName, 'pointer-events-auto')}
          >
            <ArrowLeft className="h-6 w-6" aria-hidden="true" />
          </Link>
        )}

        <Link
          href="/learn/courses"
          aria-label="Rechercher un cours"
          className="pointer-events-auto grid h-16 w-16 place-items-center rounded-full bg-white text-[#111] shadow-[0_18px_44px_rgba(0,0,0,0.28)] transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:h-[4.5rem] md:w-[4.5rem]"
        >
          <Search className="h-8 w-8" strokeWidth={3.5} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-7 max-w-[21rem] md:mt-5 md:max-w-[28rem]">
        <h1 className="text-[3.6rem] font-black leading-[0.86] tracking-normal text-white drop-shadow-[0_16px_32px_rgba(0,0,0,0.35)] md:text-[4.7rem]">
          Atlas
        </h1>
        <p className="mt-2 text-[1.15rem] font-black leading-tight text-white/58 md:text-[1.35rem]">
          du vivant
        </p>
      </div>
    </header>
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
  onSelectTerritory,
}: {
  map: AtlasKinnuMapView
  selectedTerritoryId: LearningDomainId | null
  onSelectTerritory: (domainId: LearningDomainId) => void
}) {
  const viewport = useViewportSize()
  const reduceMotion = useReducedMotion()
  const dimensions = getMapDimensions(viewport)
  const selectedTerritory =
    map.territories.find((territory) => territory.domain.id === selectedTerritoryId) ?? null
  const transform = selectedTerritory
    ? getDomainTransform(selectedTerritory, viewport, dimensions.width, Boolean(reduceMotion))
    : getWorldTransform(viewport, dimensions.width)

  return (
    <motion.div
      className="absolute left-0 top-0"
      initial={false}
      animate={{
        x: transform.x,
        y: transform.y,
        scale: transform.scale,
      }}
      transition={{
        duration: reduceMotion ? 0.18 : 0.68,
        ease: [0.2, 0.82, 0.2, 1],
      }}
      style={{
        width: dimensions.width,
        height: dimensions.height,
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
              visible={selectedTerritoryId === territory.domain.id}
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
        {selectedTerritory?.subdomains.map((subdomain) => (
          <SubdomainLabel
            key={`${selectedTerritory.domain.id}-${subdomain.id}`}
            subdomain={subdomain}
            visible
          />
        ))}
      </div>
    </motion.div>
  )
}

export function AtlasWorldMap({ map }: { map: AtlasKinnuMapView }) {
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<LearningDomainId | null>(null)
  const selectedTerritory =
    map.territories.find((territory) => territory.domain.id === selectedTerritoryId) ?? null

  return (
    <main className="relative h-[100dvh] min-h-[40rem] overflow-hidden bg-[#202020] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_34%,rgba(255,255,255,0.055),transparent_28%),linear-gradient(180deg,#242424_0%,#202020_52%,#1f1f1f_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-72 bg-gradient-to-b from-[#202020] via-[#202020]/92 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-[#202020] via-[#202020]/90 to-transparent" />

      <AtlasCamera
        map={map}
        selectedTerritoryId={selectedTerritoryId}
        onSelectTerritory={setSelectedTerritoryId}
      />
      <AtlasHeader
        selectedTerritory={selectedTerritory}
        onBackToWorld={() => setSelectedTerritoryId(null)}
      />
      <div className="sr-only" aria-live="polite">
        {selectedTerritory
          ? `${selectedTerritory.domain.title} affiche ses sous-domaines`
          : 'Atlas du vivant prêt'}
      </div>
    </main>
  )
}
