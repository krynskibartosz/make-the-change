'use client'

import { Lock } from 'lucide-react'
import { axialToPixel, hexCorners, type HexCoord } from '../_lib/hex-math'
import type { FogLevel, IslandTheme, PathwayStatus } from '../_lib/hex-grid-data'

type HexTileProps = {
  coord: HexCoord
  theme: IslandTheme
  status: PathwayStatus
  label?: string
  isDecorative?: boolean
  fog?: FogLevel
  onClick?: () => void
}

export function HexTile({
  coord,
  theme,
  status,
  label,
  isDecorative = false,
  fog = 'visible',
  onClick,
}: HexTileProps) {
  const { x, y } = axialToPixel(coord.q, coord.r)
  const points = hexCorners(x, y)
  const isInteractive = !isDecorative && status !== 'locked' && Boolean(onClick)

  // Couleur de fill par état
  let fill = 'rgba(255,255,255,0.04)'
  let stroke = 'rgba(255,255,255,0.08)'
  let strokeWidth = 1
  let strokeDasharray: string | undefined

  if (isDecorative) {
    fill = `${theme.primary}10`
    stroke = `${theme.primary}33`
    strokeWidth = 1
    strokeDasharray = '3 4'
  } else if (status === 'mastered') {
    fill = theme.primary
    stroke = '#FFFFFF'
    strokeWidth = 2.5
  } else if (status === 'available') {
    fill = `${theme.primary}55`
    stroke = theme.primary
    strokeWidth = 2
  } else {
    // locked
    fill = 'rgba(255,255,255,0.04)'
    stroke = 'rgba(255,255,255,0.18)'
    strokeWidth = 1
    strokeDasharray = '4 4'
  }

  // Fog of War : opacité globale du <g>
  const fogOpacity = fog === 'fogged' ? 0.18 : fog === 'discovered' ? 0.55 : 1
  const fogFilter = fog === 'fogged' ? 'blur(1.5px)' : undefined

  return (
    <g
      className={isInteractive ? 'kinnu-v2-hex-interactive' : undefined}
      style={{
        cursor: isInteractive ? 'pointer' : 'default',
        transformOrigin: `${x}px ${y}px`,
        transition: 'transform 200ms ease-out, opacity 600ms ease-out, filter 600ms ease-out',
        opacity: fogOpacity,
        filter: fogFilter,
      }}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? 'button' : undefined}
      aria-label={isInteractive ? label : undefined}
      tabIndex={isInteractive ? 0 : -1}
      onKeyDown={(e) => {
        if (!isInteractive) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {/* Glow halo pour les hex available (pulse) */}
      {status === 'available' && !isDecorative && (
        <polygon
          points={hexCorners(x, y, 48)}
          fill={theme.glow}
          opacity={0.5}
          style={{
            filter: 'blur(6px)',
            animation: 'kinnu-v2-pulse 2.4s ease-in-out infinite',
          }}
        />
      )}

      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinejoin="round"
      />

      {/* Highlight intérieur pour mastered */}
      {status === 'mastered' && !isDecorative && (
        <polygon
          points={hexCorners(x, y, 32)}
          fill="rgba(255,255,255,0.18)"
          stroke="none"
        />
      )}

      {/* Icône lock pour locked */}
      {status === 'locked' && !isDecorative && (
        <foreignObject x={x - 10} y={y - 10} width={20} height={20}>
          <div style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.35)' }}>
            <Lock size={20} />
          </div>
        </foreignObject>
      )}

      {/* Label */}
      {label && !isDecorative && status !== 'locked' && (
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          style={{
            fill: status === 'mastered' ? '#0A0A0F' : '#FFFFFF',
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: '0.02em',
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {label}
        </text>
      )}
    </g>
  )
}
