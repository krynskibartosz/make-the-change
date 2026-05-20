'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import type { LearningDomainId } from '@/lib/learning/schema'
import type {
  AtlasKinnuMapView,
  AtlasSubdomainConfig,
  AtlasTerritoryConfig,
  HexCell,
} from '@/lib/learning/schema'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import {
  ARTBOARD_HEIGHT,
  ARTBOARD_WIDTH,
  HEX_RADIUS,
  SUBDOMAIN_HEX_RADIUS,
  SUBDOMAIN_LABEL_SCALE,
  SUBDOMAIN_VISIBLE_SCALE,
} from '../_utils/atlas-config'
import {
  getHexCenter,
  getHexPath,
  getSubdomainPoint,
  getTerritoryPoint,
} from '../_utils/atlas-geometry'
import { useAtlasCamera } from '../_hooks/use-atlas-camera'

// ─── Framer Motion variants ──────────────────────────────────────────────────
// Defined at module scope — not recreated on every render.

const TERRITORY_LABEL_VARIANTS = {
  normal: { opacity: 1, scale: 1 },
  selected: { opacity: 0, scale: 0.86 },
  dimmed: { opacity: 0.16, scale: 1 },
} as const

const SUBDOMAIN_SVG_VARIANTS = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.92 },
} as const

const SUBDOMAIN_LABEL_VARIANTS = {
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: { opacity: 0, y: 8, scale: 0.96 },
} as const

// ─── Connection graph ────────────────────────────────────────────────────────
// Pairs of domain IDs that share a visible connection line in world view.
// Chosen to form a fully connected graph matching the geographic layout.

const WORLD_CONNECTION_PAIRS: Array<[LearningDomainId, LearningDomainId]> = [
  ['alphabet-du-vivant', 'relations-du-vivant'],
  ['milieux-habitats', 'relations-du-vivant'],
  ['milieux-habitats', 'menaces'],
  ['relations-du-vivant', 'menaces'],
  ['relations-du-vivant', 'solutions'],
  ['menaces', 'lire-impact'],
  ['solutions', 'lire-impact'],
]

// ─── SVG sub-components ──────────────────────────────────────────────────────

function WorldConnectionLines({
  territories,
  visible,
}: {
  territories: AtlasTerritoryConfig[]
  visible: boolean
}) {
  const centerMap = new Map(territories.map((t) => [t.domain.id, getTerritoryPoint(t)]))

  return (
    <motion.g
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      {WORLD_CONNECTION_PAIRS.map(([fromId, toId]) => {
        const from = centerMap.get(fromId)
        const to = centerMap.get(toId)
        if (!from || !to) return null
        return (
          <line
            key={`${fromId}-${toId}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="4"
            strokeDasharray="10 16"
            strokeLinecap="round"
          />
        )
      })}
    </motion.g>
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
        {territory.cells.map((cell: HexCell) => {
          const { x: cellX, y: cellY } = getHexCenter(cell, HEX_RADIUS)
          return (
            <path
              key={`${territory.domain.id}-${cell.q}-${cell.r}`}
              d={getHexPath(center.x + cellX, center.y + cellY, HEX_RADIUS)}
              fill={territory.darkColor}
              stroke="rgba(0,0,0,0.32)"
              strokeWidth="2.4"
            />
          )
        })}
      </g>
      <g opacity={selected ? 0.9 : 0.62}>
        {territory.textureCells.map((cell: HexCell) => {
          const { x: cellX, y: cellY } = getHexCenter(cell, HEX_RADIUS)
          return (
            <path
              key={`${territory.domain.id}-texture-${cell.q}-${cell.r}`}
              d={getHexPath(center.x + cellX, center.y + cellY, HEX_RADIUS * 0.36)}
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
      variants={SUBDOMAIN_SVG_VARIANTS}
      animate={visible ? 'visible' : 'hidden'}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      style={{ transformOrigin: `${center.x}px ${center.y}px` }}
    >
      {subdomain.cells.map((cell: HexCell) => {
        const { x: cellX, y: cellY } = getHexCenter(cell, SUBDOMAIN_HEX_RADIUS)
        return (
          <path
            key={`${subdomain.id}-${cell.q}-${cell.r}`}
            d={getHexPath(center.x + cellX, center.y + cellY, SUBDOMAIN_HEX_RADIUS)}
            fill={subdomain.color}
            stroke="rgba(0,0,0,0.24)"
            strokeWidth="1.8"
          />
        )
      })}
    </motion.g>
  )
}

// ─── Label sub-components ────────────────────────────────────────────────────

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
  const variant = dimmed ? 'dimmed' : selected ? 'selected' : 'normal'

  return (
    <motion.button
      type="button"
      aria-label={`Explorer ${territory.domain.title}`}
      onClick={onSelect}
      initial={false}
      variants={TERRITORY_LABEL_VARIANTS}
      animate={variant}
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
      variants={SUBDOMAIN_LABEL_VARIANTS}
      animate={visible ? 'visible' : 'hidden'}
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

// ─── Header / Dock sub-components ────────────────────────────────────────────

const ICON_BUTTON_CLASS =
  // Reduced from h-11 w-11 (44px) to h-9 w-9 (36px) — back button is secondary in world view
  'grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#111] shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

function AtlasHeader({
  selectedTerritory,
  onBackToWorld,
}: {
  selectedTerritory: AtlasTerritoryConfig | null
  onBackToWorld: () => void
}) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
      <div className="flex items-start justify-between gap-4">
        {selectedTerritory ? (
          <button
            type="button"
            aria-label="Retour à la carte Atlas"
            onClick={onBackToWorld}
            className={cn(ICON_BUTTON_CLASS, 'pointer-events-auto')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href="/learn"
            aria-label="Retour à Apprendre"
            className={cn(ICON_BUTTON_CLASS, 'pointer-events-auto')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
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
        // bg-white/95: slightly transparent, less visually dominant against the dark map
        // shadow reduced to blend more naturally
        className="pointer-events-auto flex h-14 min-w-0 max-w-[25rem] flex-1 items-center justify-center gap-3 rounded-full bg-white/95 px-5 font-black text-[#111] shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:flex-none sm:px-9"
      >
        <Search className="h-5 w-5 shrink-0" strokeWidth={3.2} aria-hidden="true" />
        <span className="truncate text-[0.98rem]">Rechercher dans l'Atlas</span>
      </button>
    </div>
  )
}

// ─── Camera canvas ───────────────────────────────────────────────────────────

function AtlasCamera({
  map,
  selectedTerritoryId,
  camera,
  isInteracting,
  isWorldView,
  reduceMotion,
  onSelectTerritory,
}: {
  map: AtlasKinnuMapView
  selectedTerritoryId: LearningDomainId | null
  camera: { x: number; y: number; scale: number }
  isInteracting: boolean
  /** True when camera is at world zoom level — shows connection lines. */
  isWorldView: boolean
  reduceMotion: boolean
  onSelectTerritory: (domainId: LearningDomainId) => void
}) {
  return (
    <motion.div
      className="absolute left-0 top-0 bg-[#202020]"
      initial={false}
      animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
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
            {/* Transparent at edges — avoids visible container boundary against the screen bg */}
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <rect width={ARTBOARD_WIDTH} height={ARTBOARD_HEIGHT} fill="transparent" />

        {/* World view connection lines — drawn below hex territories */}
        <WorldConnectionLines territories={map.territories} visible={isWorldView} />

        {map.territories.map((territory) => (
          <HexTerritorySvg
            key={territory.domain.id}
            territory={territory}
            selected={selectedTerritoryId === territory.domain.id}
            dimmed={Boolean(selectedTerritoryId && selectedTerritoryId !== territory.domain.id)}
          />
        ))}

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
        {map.territories.map((territory) => (
          <TerritoryLabel
            key={territory.domain.id}
            territory={territory}
            selected={selectedTerritoryId === territory.domain.id}
            dimmed={Boolean(selectedTerritoryId && selectedTerritoryId !== territory.domain.id)}
            onSelect={() => onSelectTerritory(territory.domain.id)}
          />
        ))}

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

// ─── Root component ──────────────────────────────────────────────────────────

export function AtlasWorldMap({ map }: { map: AtlasKinnuMapView }) {
  const reduceMotion = useReducedMotion() ?? false

  const {
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
  } = useAtlasCamera({ map })

  // Connection lines and top gradient adjust based on whether we're in world or territory view
  const isWorldView = !selectedTerritoryId

  return (
    <main
      ref={mainRef}
      className="relative h-[100dvh] min-h-[40rem] touch-none overflow-hidden bg-[#202020] text-white"
      style={{
        '--atlas-map-width': `${dimensions.width}px`,
        '--atlas-map-height': `${dimensions.height}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerEnd}
      onPointerUp={handlePointerEnd}
    >
      <h1 className="sr-only">Atlas du vivant</h1>

      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_34%,rgba(255,255,255,0.055),transparent_28%),linear-gradient(180deg,#242424_0%,#202020_52%,#1f1f1f_100%)]" />

      {/* Top gradient: smaller in world view (h-36) to not eat island space, taller in territory view (h-72) for header separation */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-[#202020] via-[#202020]/92 to-transparent"
        animate={{ height: isWorldView ? '9rem' : '18rem' }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      />

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-[#202020] via-[#202020]/90 to-transparent" />

      {/* Left / right edge gradients — prevent map boundary visibility when panning */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-40 w-16 bg-gradient-to-r from-[#202020] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-40 w-16 bg-gradient-to-l from-[#202020] to-transparent" />

      <AtlasCamera
        map={map}
        selectedTerritoryId={selectedTerritoryId}
        camera={camera}
        isInteracting={isInteracting}
        isWorldView={isWorldView}
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
