'use client'

import { useMemo } from 'react'
import { axialToPixel } from '../_lib/hex-math'
import {
  computePathwayStatus,
  getCrossIslandLinks,
  getIslandById,
  type Pathway,
  type PathwayStatus,
} from '../_lib/hex-grid-data'

type CrossLinkLinesProps = {
  masteredIds: ReadonlySet<string>
}

type LinkVisual = {
  id: string
  fromX: number
  fromY: number
  toX: number
  toY: number
  fromColor: string
  toColor: string
  fromStatus: PathwayStatus
  toStatus: PathwayStatus
  /** Courbe de contrôle (Bezier quadratique) */
  ctrlX: number
  ctrlY: number
}

/**
 * Lignes lumineuses entre îles, animées quand au moins un endpoint
 * est mastered. Phase 4 du prototype Kinnu V2.
 */
export function CrossLinkLines({ masteredIds }: CrossLinkLinesProps) {
  const links = useMemo<LinkVisual[]>(() => {
    return getCrossIslandLinks().map(({ from, to }, idx) => {
      const fromPx = axialToPixel(from.coord.q, from.coord.r)
      const toPx = axialToPixel(to.coord.q, to.coord.r)
      const fromStatus = computePathwayStatus(from, masteredIds)
      const toStatus = computePathwayStatus(to, masteredIds)

      // Point de contrôle perpendiculaire au milieu (courbe douce)
      const midX = (fromPx.x + toPx.x) / 2
      const midY = (fromPx.y + toPx.y) / 2
      const dx = toPx.x - fromPx.x
      const dy = toPx.y - fromPx.y
      const len = Math.hypot(dx, dy) || 1
      // Décale perpendiculairement (alternance gauche/droite via parité)
      const offset = Math.min(80, len * 0.18) * (idx % 2 === 0 ? 1 : -1)
      const perpX = -dy / len
      const perpY = dx / len
      const ctrlX = midX + perpX * offset
      const ctrlY = midY + perpY * offset

      return {
        id: `link-${from.id}-${to.id}`,
        fromX: fromPx.x,
        fromY: fromPx.y,
        toX: toPx.x,
        toY: toPx.y,
        fromColor: getIslandById(from.islandId).theme.primary,
        toColor: getIslandById(to.islandId).theme.primary,
        fromStatus,
        toStatus,
        ctrlX,
        ctrlY,
      }
    })
  }, [masteredIds])

  return (
    <g pointerEvents="none">
      <defs>
        {links.map((link) => (
          <linearGradient
            key={`grad-${link.id}`}
            id={`grad-${link.id}`}
            x1={link.fromX}
            y1={link.fromY}
            x2={link.toX}
            y2={link.toY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={link.fromColor} />
            <stop offset="100%" stopColor={link.toColor} />
          </linearGradient>
        ))}
      </defs>

      {links.map((link) => {
        const fromMastered = link.fromStatus === 'mastered'
        const toMastered = link.toStatus === 'mastered'
        const fromVisible = link.fromStatus !== 'locked'
        const toVisible = link.toStatus !== 'locked'

        // Both fogged → ne rend pas (économie visuelle)
        if (!fromVisible && !toVisible) return null

        const isActive = fromMastered || toMastered
        const isComplete = fromMastered && toMastered

        const path = `M ${link.fromX},${link.fromY} Q ${link.ctrlX},${link.ctrlY} ${link.toX},${link.toY}`

        return (
          <g key={link.id}>
            {/* Ligne de fond (toujours visible mais discrète) */}
            <path
              d={path}
              fill="none"
              stroke={`url(#grad-${link.id})`}
              strokeWidth={isComplete ? 2.5 : isActive ? 1.8 : 1}
              strokeDasharray={isActive ? undefined : '5 7'}
              strokeLinecap="round"
              opacity={isComplete ? 0.85 : isActive ? 0.55 : 0.18}
              style={{
                transition: 'opacity 600ms ease-out, stroke-width 600ms ease-out',
              }}
            />

            {/* Particule animée qui circule (uniquement si actif) */}
            {isActive && (
              <circle r={3.5} fill={isComplete ? '#FFFFFF' : link.toColor}>
                <animateMotion
                  dur={isComplete ? '2.4s' : '3.6s'}
                  repeatCount="indefinite"
                  path={path}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  dur={isComplete ? '2.4s' : '3.6s'}
                  repeatCount="indefinite"
                />
              </circle>
            )}

            {/* Halo glow sur la ligne complète */}
            {isComplete && (
              <path
                d={path}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={6}
                strokeLinecap="round"
                opacity={0.18}
                style={{ filter: 'blur(4px)' }}
              />
            )}
          </g>
        )
      })}
    </g>
  )
}
