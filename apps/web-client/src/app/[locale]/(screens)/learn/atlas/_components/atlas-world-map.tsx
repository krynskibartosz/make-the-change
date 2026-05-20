'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Check, Lock, ChevronDown, Compass, Search } from 'lucide-react'
import type { LearningDomainId } from '@/lib/learning/schema'
import type {
  AtlasKinnuMapView,
  AtlasSubdomainConfig,
  AtlasTerritoryConfig,
  HexCell,
  LearningProgress,
} from '@/lib/learning/schema'
import type { MapHexCell } from '@/lib/learning/hex-generation'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import {
  ARTBOARD_HEIGHT,
  ARTBOARD_WIDTH,
  HEX_RADIUS,
  SUBDOMAIN_HEX_RADIUS,
  SUBDOMAIN_LABEL_SCALE,
  SUBDOMAIN_VISIBLE_SCALE,
  COURSE_LEVEL_SCALE,
} from '../_utils/atlas-config'
import {
  getHexCenter,
  getHexPath,
  getSubdomainPoint,
  getTerritoryPoint,
} from '../_utils/atlas-geometry'
import { useAtlasCamera } from '../_hooks/use-atlas-camera'
import { readLearningProgress } from '@/lib/learning/progress'
import {
  getSubdomainContent,
  getSubdomainMapCells,
  getSubdomainProgress,
} from '@/lib/learning/selectors'
import { AtlasSubdomainSheet } from './atlas-subdomain-sheet'
import { AtlasCourseSheet } from './atlas-course-sheet'

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
  visible: { opacity: 1, x: '-50%', y: '-50%', scale: 1 },
  hidden: { opacity: 0, x: '-50%', y: 'calc(-50% + 8px)', scale: 0.96 },
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
  highlightedDomainId,
  reduceMotion,
}: {
  territories: AtlasTerritoryConfig[]
  visible: boolean
  highlightedDomainId: LearningDomainId | null
  reduceMotion: boolean
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
        
        const isHighlighted = highlightedDomainId === fromId || highlightedDomainId === toId

        return (
          <g key={`${fromId}-${toId}`}>
            {/* The connection path itself */}
            <motion.path
              d={`M ${from.x} ${from.y} Q ${from.x + (to.x - from.x) / 2 + 50} ${from.y + (to.y - from.y) / 2 - 50} ${to.x} ${to.y}`}
              fill="transparent"
              animate={
                isHighlighted
                  ? {
                      stroke: ['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.45)', 'rgba(255,255,255,0.18)'],
                      strokeWidth: [4, 5.5, 4],
                    }
                  : {
                      stroke: 'rgba(255,255,255,0.09)',
                      strokeWidth: 4,
                    }
              }
              transition={
                isHighlighted
                  ? {
                      repeat: Infinity,
                      duration: 3,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.3 }
              }
              strokeDasharray="4 14"
              strokeLinecap="round"
            />
            {/* Sap pulse — a faint dot that travels along the path */}
            {!reduceMotion && (
              <circle r="3.5" fill="rgba(255,255,255,0.28)">
                <animateMotion
                  dur={`${7 + (fromId.length + toId.length) % 5}s`}
                  repeatCount="indefinite"
                  path={`M ${from.x} ${from.y} Q ${from.x + (to.x - from.x) / 2 + 50} ${from.y + (to.y - from.y) / 2 - 50} ${to.x} ${to.y}`}
                />
              </circle>
            )}
          </g>
        )
      })}
    </motion.g>
  )
}

function HexTerritorySvg({
  territory,
  selected,
  dimmed,
  hasProgress,
}: {
  territory: AtlasTerritoryConfig
  selected: boolean
  dimmed: boolean
  hasProgress: boolean
}) {
  const center = getTerritoryPoint(territory)

  return (
    <g opacity={dimmed ? 0.45 : 1}>
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
      <g opacity={selected ? 0.9 : hasProgress ? 0.82 : 0.62}>
        {territory.textureCells.map((cell: HexCell) => {
          const { x: cellX, y: cellY } = getHexCenter(cell, HEX_RADIUS)
          return (
            <path
              key={`${territory.domain.id}-texture-${cell.q}-${cell.r}`}
              d={getHexPath(center.x + cellX, center.y + cellY, HEX_RADIUS * 0.36)}
              fill={hasProgress ? territory.color : "rgba(0,0,0,0.34)"}
              opacity={hasProgress ? 0.5 : 1}
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
  progressRatio,
  onClick,
  mapCells,
  isDeepZoom,
}: {
  subdomain: AtlasSubdomainConfig
  visible: boolean
  progressRatio: number
  onClick?: () => void
  /** Enriched cells with course/module metadata (available at deep zoom). */
  mapCells: MapHexCell[]
  /** True when the camera is zoomed deep enough to show per-cell detail. */
  isDeepZoom: boolean
}) {
  const center = getSubdomainPoint(subdomain)

  const isCompleted = progressRatio === 1
  const hasProgress = progressRatio > 0

  const filter = isCompleted
    ? `drop-shadow(0 0 10px ${subdomain.color})`
    : hasProgress
      ? `drop-shadow(0 0 5px ${subdomain.color}80)`
      : undefined

  // Build a lookup from cell (q,r) to enriched MapHexCell for per-cell rendering
  const cellLookup = useMemo(() => {
    const map = new Map<string, MapHexCell>()
    for (const mc of mapCells) {
      map.set(`${mc.q},${mc.r}`, mc)
    }
    return map
  }, [mapCells])

  return (
    <motion.g
      initial={false}
      variants={SUBDOMAIN_SVG_VARIANTS}
      animate={visible ? 'visible' : 'hidden'}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      style={{
        transformOrigin: `${center.x}px ${center.y}px`,
        filter,
      }}
      className={cn(visible ? 'cursor-pointer' : 'pointer-events-none')}
      onClick={(e) => {
        if (!visible) return
        e.stopPropagation()
        onClick?.()
      }}
    >
      {subdomain.cells.map((cell: HexCell) => {
        const { x: cellX, y: cellY } = getHexCenter(cell, SUBDOMAIN_HEX_RADIUS)
        const mc = cellLookup.get(`${cell.q},${cell.r}`)
        const cx = center.x + cellX
        const cy = center.y + cellY

        // ─── Cell fill & stroke based on type and status ───
        let cellFill = subdomain.color
        let cellOpacity = 1
        let cellStroke = 'rgba(0,0,0,0.24)'
        let cellStrokeWidth = 1.8

        if (mc) {
          if (mc.kind === 'module') {
            // "Blob" materialization for guided paths: strong border glow
            cellStroke = 'rgba(255,215,0,0.8)' // A warm glow color
            cellStrokeWidth = 3.5
          }

          // Status-based fill
          if (mc.status === 'not-started') {
            cellFill = subdomain.color
            cellOpacity = 0.35
          } else if (mc.status === 'in-progress') {
            cellFill = subdomain.color
            cellOpacity = 0.72
          } else {
            // completed
            cellFill = subdomain.color
            cellOpacity = 1
          }
        } else {
          // Empty cell — visually muted to avoid confusion with content cells
          cellFill = subdomain.color
          cellOpacity = 0.08
          cellStroke = 'rgba(255,255,255,0.04)'
          cellStrokeWidth = 1
        }

        return (
          <g key={`${subdomain.id}-${cell.q}-${cell.r}`}>
            <path
              d={getHexPath(cx, cy, SUBDOMAIN_HEX_RADIUS)}
              fill={cellFill}
              opacity={cellOpacity}
              stroke={cellStroke}
              strokeWidth={cellStrokeWidth}
            />

            {/* Completed checkmark per cell */}
            {mc?.status === 'completed' && (
              <g transform={`translate(${cx - 5}, ${cy - 5})`} className="pointer-events-none">
                <circle cx="5" cy="5" r="5.5" fill="#FFFFFF" />
                <path
                  d="M3 5.1 L4.5 6.6 L7 3.4"
                  fill="none"
                  stroke={subdomain.color}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* In-progress pulse indicator */}
            {mc?.status === 'in-progress' && (
              <circle
                cx={cx}
                cy={cy}
                r={SUBDOMAIN_HEX_RADIUS * 0.25}
                fill={subdomain.color}
                opacity={0.9}
                className="pointer-events-none"
              >
                <animate
                  attributeName="opacity"
                  values="0.9;0.4;0.9"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Module badge icon (small diamond/star shape in center) */}
            {mc?.kind === 'module' && mc.status !== 'completed' && isDeepZoom && (
              <g transform={`translate(${cx}, ${cy})`} className="pointer-events-none">
                <polygon
                  points="0,-4 3.5,0 0,4 -3.5,0"
                  fill="rgba(255,215,0,0.85)"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="0.6"
                />
              </g>
            )}
          </g>
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
  isDeepZoom,
  onClick,
}: {
  subdomain: AtlasSubdomainConfig
  visible: boolean
  /** When true, the global label fades out to reveal per-cell labels. */
  isDeepZoom: boolean
  onClick?: () => void
}) {
  // At deep zoom, fade the global label to let per-cell course labels show
  const shouldShow = visible && !isDeepZoom

  return (
    <motion.button
      type="button"
      initial={false}
      variants={SUBDOMAIN_LABEL_VARIANTS}
      animate={shouldShow ? 'visible' : 'hidden'}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={cn(
        'absolute z-30 max-w-[7.4rem] rounded-[0.48rem] px-2.5 py-1.5 text-center text-[0.62rem] font-black leading-tight text-white shadow-[0_7px_0_rgba(0,0,0,0.18),0_14px_28px_rgba(0,0,0,0.2)] active:scale-95 transition-transform duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:max-w-[9rem] md:text-[0.72rem]',
        shouldShow ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none',
      )}
      disabled={!shouldShow}
      style={{
        left: `${subdomain.x}%`,
        top: `${subdomain.y}%`,
        backgroundColor: subdomain.color,
      }}
      onClick={(e) => {
        if (!shouldShow) return
        e.stopPropagation()
        onClick?.()
      }}
    >
      {subdomain.label}
    </motion.button>
  )
}

/**
 * Per-cell course/module labels rendered at deep zoom inside the subdomain.
 * Each cell shows a short title when the user zooms close enough.
 */
function CourseCellLabels({
  subdomain,
  territoryColor,
  mapCells,
  visible,
  onCellClick,
}: {
  subdomain: AtlasSubdomainConfig
  territoryColor: string
  mapCells: MapHexCell[]
  visible: boolean
  onCellClick: (contentId: string, kind: 'module' | 'course', color: string) => void
}) {
  const center = getSubdomainPoint(subdomain)

  if (!visible || mapCells.length === 0) return null

  return (
    <>
      {mapCells.map((mc) => {
        const { x: cellX, y: cellY } = getHexCenter(mc, SUBDOMAIN_HEX_RADIUS)
        const cx = center.x + cellX
        const cy = center.y + cellY

        const isModule = mc.kind === 'module'
        const status = mc.status
        const isCompleted = status === 'completed'
        const isInProgress = status === 'in-progress'
        const isNotStarted = status === 'not-started'
        
        const Icon = isModule ? Compass : BookOpen
        // Modules are primary — full size. Courses are secondary — 75% size.
        const buttonSize = isModule ? SUBDOMAIN_HEX_RADIUS * 1.3 : SUBDOMAIN_HEX_RADIUS * 0.95
        const iconSize = isModule ? 14 : 10

        return (
          <motion.div
            key={`cell-label-${mc.contentId}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute z-40 pointer-events-none flex flex-col items-center"
            style={{
              left: `${(cx / ARTBOARD_WIDTH) * 100}%`,
              top: `${(cy / ARTBOARD_HEIGHT) * 100}%`,
              transform: 'translate(-50%, -100%)', // Anchor bottom to cell center
            }}
          >
            {/* The Label/Button */}
            <button
              type="button"
              className={cn(
                'pointer-events-auto flex items-center gap-1.5 rounded-full px-2.5 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-95 transition-transform min-w-[3rem]',
                isModule
                  ? 'bg-white text-amber-600 font-bold ring-1 ring-black/10'
                  : 'bg-[#1a1a1a]/80 backdrop-blur-md text-white font-medium ring-1 ring-white/10',
                isNotStarted ? 'opacity-80' : '',
                isInProgress ? 'ring-2 ring-white/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : '',
                isCompleted ? 'opacity-100' : ''
              )}
              onClick={(e) => {
                e.stopPropagation()
                onCellClick(mc.contentId, mc.kind, territoryColor)
              }}
            >
              <div className="relative flex items-center justify-center shrink-0">
                <Icon size={12} strokeWidth={2.5} />
                {isCompleted && (
                  <div className="absolute -bottom-1 -right-1 z-20 bg-green-500 rounded-full text-white ring-[1.5px] ring-white">
                    <CheckCircle2 size={8} strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className="text-[0.72rem] leading-none whitespace-nowrap pt-0.5">
                {mc.title}
              </span>
            </button>

            {/* The Anchor Pin */}
            <div className="flex flex-col items-center pointer-events-none">
              <div className={cn("w-px h-3", isModule ? "bg-amber-500/70" : "bg-white/40")} />
              <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm ring-1 ring-black/20", isModule ? "bg-amber-500" : "bg-white/60")} />
            </div>
          </motion.div>
        )
      })}
    </>
  )
}

// ─── Header / Dock sub-components ────────────────────────────────────────────

const ICON_BUTTON_CLASS =
  // Warm-tinted glass buttons that harmonize with the new forest-black background
  'grid h-9 w-9 place-items-center rounded-full bg-[#f5f0e8]/90 text-[#1a1a14] shadow-[0_8px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'

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

        {/* Micro-Header for selected territory */}
        {selectedTerritory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 text-center mt-1"
          >
            <h1 className="text-[1.05rem] font-black text-white/95 leading-tight tracking-tight drop-shadow-md">
              {selectedTerritory.domain.title}
            </h1>
            {selectedTerritory.domain.shortDescription && (
              <p className="mt-0.5 text-[0.75rem] font-medium text-white/70 drop-shadow-sm max-w-[200px] mx-auto leading-snug">
                {selectedTerritory.domain.shortDescription}
              </p>
            )}
          </motion.div>
        )}

        <button
          type="button"
          aria-label="Rechercher"
          className={cn(ICON_BUTTON_CLASS, 'pointer-events-auto', !selectedTerritory && 'ml-auto')}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}

function AtlasActionDock() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
      <button
        type="button"
        aria-label="Me guider dans l'Atlas"
        className="pointer-events-auto flex h-14 min-w-0 max-w-[25rem] flex-1 items-center justify-center gap-3 rounded-full bg-[#f5f0e8]/95 px-5 font-black text-[#1a1a14] shadow-[0_12px_40px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-transform active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:flex-none sm:px-9"
      >
        <Compass className="h-5 w-5 shrink-0 text-amber-700" strokeWidth={2.8} aria-hidden="true" />
        <span className="truncate text-[0.98rem]">Me guider dans l’Atlas</span>
      </button>
    </div>
  )
}

function AtlasCamera({
  map,
  selectedTerritoryId,
  camera,
  isInteracting,
  isWorldView,
  reduceMotion,
  onSelectTerritory,
  progress,
  onSelectSubdomain,
  selectedSubdomainDomainId,
  onSelectCell,
}: {
  map: AtlasKinnuMapView
  selectedTerritoryId: LearningDomainId | null
  camera: { x: number; y: number; scale: number }
  isInteracting: boolean
  /** True when camera is at world zoom level — shows connection lines. */
  isWorldView: boolean
  reduceMotion: boolean
  onSelectTerritory: (domainId: LearningDomainId) => void
  progress: LearningProgress | null
  onSelectSubdomain: (domainId: LearningDomainId, subdomainId: string) => void
  selectedSubdomainDomainId: LearningDomainId | null
  onSelectCell: (contentId: string, kind: 'module' | 'course', color: string) => void
}) {
  const isDeepZoom = camera.scale >= COURSE_LEVEL_SCALE

  // Compute map cells for all subdomains (memoized by progress reference)
  const allMapCells = useMemo(() => {
    const cells = new Map<string, MapHexCell[]>()
    for (const territory of map.territories) {
      for (const subdomain of territory.subdomains) {
        const key = `${territory.domain.id}:${subdomain.id}`
        cells.set(key, getSubdomainMapCells(territory.domain.id, subdomain.id, progress))
      }
    }
    return cells
  }, [map.territories, progress])

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
        <WorldConnectionLines 
          territories={map.territories} 
          visible={isWorldView} 
          highlightedDomainId={selectedSubdomainDomainId}
          reduceMotion={reduceMotion}
        />

        {map.territories.map((territory) => {
          const hasProgress = territory.subdomains.some(
            (s) => getSubdomainProgress(territory.domain.id, s.id, progress) > 0
          )
          return (
            <HexTerritorySvg
              key={territory.domain.id}
              territory={territory}
              selected={selectedTerritoryId === territory.domain.id}
              dimmed={Boolean(selectedTerritoryId && selectedTerritoryId !== territory.domain.id)}
              hasProgress={hasProgress}
            />
          )
        })}

        {map.territories.flatMap((territory) =>
          territory.subdomains.map((subdomain) => {
            const ratio = getSubdomainProgress(territory.domain.id, subdomain.id, progress)
            const key = `${territory.domain.id}:${subdomain.id}`
            const mapCells = allMapCells.get(key) ?? []
            return (
              <SubdomainSvg
                key={`${territory.domain.id}-${subdomain.id}`}
                subdomain={subdomain}
                visible={camera.scale >= SUBDOMAIN_VISIBLE_SCALE}
                progressRatio={ratio}
                onClick={() => onSelectSubdomain(territory.domain.id, subdomain.id)}
                mapCells={mapCells}
                isDeepZoom={isDeepZoom}
              />
            )
          }),
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
          territory.subdomains.map((subdomain) => {
            const key = `${territory.domain.id}:${subdomain.id}`
            const mapCells = allMapCells.get(key) ?? []
            return (
              <SubdomainLabel
                key={`label-${territory.domain.id}-${subdomain.id}`}
                subdomain={subdomain}
                visible={camera.scale >= SUBDOMAIN_LABEL_SCALE}
                isDeepZoom={isDeepZoom}
                onClick={() => onSelectSubdomain(territory.domain.id, subdomain.id)}
              />
            )
          }),
        )}

        {/* Per-cell course labels at deep zoom */}
        {isDeepZoom &&
          map.territories.flatMap((territory) =>
            territory.subdomains.map((subdomain) => {
              const key = `${territory.domain.id}:${subdomain.id}`
              const mapCells = allMapCells.get(key) ?? []
              if (mapCells.length === 0) return null
              return (
                <CourseCellLabels
                  key={`cells-${territory.domain.id}-${subdomain.id}`}
                  subdomain={subdomain}
                  territoryColor={territory.color}
                  mapCells={mapCells}
                  visible={isDeepZoom}
                  onCellClick={onSelectCell}
                />
              )
            }),
          )}
      </div>
    </motion.div>
  )
}

// ─── Root component ──────────────────────────────────────────────────────────

export function AtlasWorldMap({ map }: { map: AtlasKinnuMapView }) {
  const reduceMotion = useReducedMotion() ?? false

  const [progress, setProgress] = useState<LearningProgress | null>(null)
  const [selectedSubdomain, setSelectedSubdomain] = useState<{
    domainId: LearningDomainId
    subdomainId: string
  } | null>(null)
  const [selectedCell, setSelectedCell] = useState<{
    contentId: string
    kind: 'module' | 'course'
    color: string
  } | null>(null)

  useEffect(() => {
    setProgress(readLearningProgress('default'))
  }, [])

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
    wasDragged,
  } = useAtlasCamera({ map })

  // Connection lines and top gradient adjust based on whether we're in world or territory view
  const isWorldView = !selectedTerritoryId

  const handleSelectSubdomain = (domainId: LearningDomainId, subdomainId: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12)
      } catch (e) {
        // ignore vibrate error
      }
    }
    setSelectedCell(null)
    setSelectedSubdomain({ domainId, subdomainId })
  }

  const handleSelectCell = (contentId: string, kind: 'module' | 'course', color: string) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(12)
      } catch (e) {
        // ignore vibrate error
      }
    }
    setSelectedSubdomain(null)
    setSelectedCell({ contentId, kind, color })
  }

  const subdomainContent = selectedSubdomain
    ? getSubdomainContent(selectedSubdomain.domainId, selectedSubdomain.subdomainId, progress)
    : null

  return (
    <main
      ref={mainRef}
      className="relative h-[100dvh] min-h-[40rem] touch-none overflow-hidden bg-[#161A12] text-white"
      style={{
        '--atlas-map-width': `${dimensions.width}px`,
        '--atlas-map-height': `${dimensions.height}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerCancel={handlePointerEnd}
      onPointerUp={handlePointerEnd}
      onClickCapture={(e) => {
        // Prevent accidental clicks on domains/cells when finishing a map pan/zoom gesture
        if (wasDragged()) {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
    >
      <h1 className="sr-only">Atlas du vivant</h1>

      {/* Organic grain texture — SVG feTurbulence overlay */}
      <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.038]" xmlns="http://www.w3.org/2000/svg">
        <filter id="atlas-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#atlas-grain)" />
      </svg>

      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_34%,rgba(255,255,255,0.04),transparent_28%),linear-gradient(180deg,#191C17_0%,#161A12_52%,#141810_100%)]" />

      {/* Top gradient: smaller in world view (h-36) to not eat island space, taller in territory view (h-72) for header separation */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-[#161A12] via-[#161A12]/92 to-transparent"
        animate={{ height: isWorldView ? '9rem' : '18rem' }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      />

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-36 bg-gradient-to-t from-[#161A12] via-[#161A12]/90 to-transparent" />

      {/* Left / right edge gradients — prevent map boundary visibility when panning */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-40 w-16 bg-gradient-to-r from-[#161A12] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-40 w-16 bg-gradient-to-l from-[#161A12] to-transparent" />

      {/* Domain vignette — semantic color identity per territory when zoomed */}
      {selectedTerritory && (
        <motion.div
          key={selectedTerritory.domain.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${selectedTerritory.color}18 0%, transparent 70%),
                         radial-gradient(ellipse at 50% 0%,   ${selectedTerritory.color}10 0%, transparent 60%)`,
          }}
        />
      )}

      <AtlasCamera
        map={map}
        selectedTerritoryId={selectedTerritoryId}
        camera={camera}
        isInteracting={isInteracting}
        isWorldView={isWorldView}
        reduceMotion={reduceMotion}
        onSelectTerritory={snapToTerritory}
        progress={progress}
        onSelectSubdomain={handleSelectSubdomain}
        selectedSubdomainDomainId={selectedSubdomain?.domainId ?? null}
        onSelectCell={handleSelectCell}
      />

      <AtlasHeader selectedTerritory={selectedTerritory} onBackToWorld={snapToWorld} />
      <AtlasActionDock />

      <AtlasSubdomainSheet
        isOpen={selectedSubdomain !== null}
        onClose={() => setSelectedSubdomain(null)}
        content={subdomainContent}
        territoryColor={subdomainContent?.territory.color ?? '#A7F36B'}
        territoryTextColor={subdomainContent?.territory.textColor ?? '#111'}
        progress={progress}
      />

      <AtlasCourseSheet
        isOpen={selectedCell !== null}
        onClose={() => setSelectedCell(null)}
        contentId={selectedCell?.contentId ?? null}
        kind={selectedCell?.kind ?? null}
        territoryColor={selectedCell?.color ?? '#A7F36B'}
        progress={progress}
      />

      <div className="sr-only" aria-live="polite">
        {selectedTerritory
          ? `${selectedTerritory.domain.title} affiche ses sous-domaines`
          : 'Atlas du vivant prêt'}
      </div>
    </main>
  )
}

