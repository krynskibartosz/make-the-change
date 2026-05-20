'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type {
  AtlasKinnuMapView,
  AtlasSubdomainConfig,
  AtlasTerritoryConfig,
  HexCell,
  LearningDomainId,
} from '@/lib/learning/schema'
import { cn } from '@/lib/utils'
import {
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

// ─── SVG sub-components ──────────────────────────────────────────────────────

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
  'grid h-11 w-11 place-items-center rounded-full bg-white/94 text-[#111] shadow-[0_16px_36px_rgba(0,0,0,0.26)] transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

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
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        ) : (
          <Link
            href="/learn"
            aria-label="Retour à Apprendre"
            className={cn(ICON_BUTTON_CLASS, 'pointer-events-auto')}
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

// ─── Camera canvas ───────────────────────────────────────────────────────────

const ARTBOARD_WIDTH = 1000
const ARTBOARD_HEIGHT = 1400

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
  camera: { x: number; y: number; scale: number }
  isInteracting: boolean
  reduceMotion: boolean
  onSelectTerritory: (domainId: LearningDomainId) => void
}) {
  return (
    <motion.div
      className="absolute left-0 top-0"
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
            <stop offset="100%" stopColor="rgba(0,0,0,0.34)" />
          </radialGradient>
        </defs>

        <rect width={ARTBOARD_WIDTH} height={ARTBOARD_HEIGHT} fill="transparent" />

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
