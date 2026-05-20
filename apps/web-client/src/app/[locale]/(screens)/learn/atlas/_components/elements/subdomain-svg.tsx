import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { AtlasSubdomainConfig, HexCell } from '@/lib/learning/schema'
import type { MapHexCell } from '@/lib/learning/hex-generation'
import { SUBDOMAIN_HEX_RADIUS } from '../_utils/atlas-config'
import { getHexCenter, getHexPath, getSubdomainPoint } from '../_utils/atlas-geometry'

const SUBDOMAIN_SVG_VARIANTS = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.92 },
} as const

export function SubdomainSvg({
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
      {/* Radiating pulse for completed subdomains */}
      {isCompleted && (
        <circle
          cx={center.x}
          cy={center.y}
          r={70}
          fill={subdomain.color}
          opacity={0.15}
          filter="blur(24px)"
        >
          <animate attributeName="opacity" values="0.05;0.2;0.05" dur="4s" repeatCount="indefinite" />
        </circle>
      )}

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
            {/* Draw a faint question mark on empty cells to suggest "coming soon" instead of just empty space */}
            {!mc && isDeepZoom && (
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#ffffff"
                opacity={0.12}
                fontSize={SUBDOMAIN_HEX_RADIUS * 0.7}
                fontWeight="800"
                className="pointer-events-none select-none font-sans"
              >
                ?
              </text>
            )}

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
