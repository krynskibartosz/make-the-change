'use client'

import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import {
  axialToPixel,
  computeBoundingBox,
  type HexCoord,
} from '../_lib/hex-math'
import {
  ISLANDS,
  computePathwayStatus,
  type Pathway,
} from '../_lib/hex-grid-data'
import { HexTile } from './hex-tile'

type HexGridCanvasProps = {
  masteredIds: ReadonlySet<string>
  onPathwayClick: (pathway: Pathway) => void
}

const PADDING = 80
const MIN_SCALE = 0.4
const MAX_SCALE = 2.4
const SCALE_STEP = 0.18

export function HexGridCanvas({ masteredIds, onPathwayClick }: HexGridCanvasProps) {
  // Bounding box global (toutes les coords)
  const viewBox = useMemo(() => {
    const allCoords: HexCoord[] = ISLANDS.flatMap((island) => [
      ...island.decorativeHexes,
      ...island.pathways.map((p) => p.coord),
    ])
    const bb = computeBoundingBox(allCoords)
    return {
      minX: bb.minX - PADDING,
      minY: bb.minY - PADDING,
      width: bb.width + PADDING * 2,
      height: bb.height + PADDING * 2,
    }
  }, [])

  // ─── Pan & Zoom (custom, gestes pointer + wheel) ───────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)

  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    startTx: number
    startTy: number
  } | null>(null)
  const pinchRef = useRef<{
    pointers: Map<number, { x: number; y: number }>
    startDist: number
    startScale: number
  } | null>(null)

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    containerRef.current.setPointerCapture(e.pointerId)

    if (pinchRef.current) {
      pinchRef.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    } else if (dragRef.current) {
      // 2e doigt → pinch
      const first = dragRef.current
      const pointers = new Map<number, { x: number; y: number }>()
      pointers.set(first.pointerId, { x: first.startX, y: first.startY })
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      const ptArr = Array.from(pointers.values())
      const dx = ptArr[0]!.x - ptArr[1]!.x
      const dy = ptArr[0]!.y - ptArr[1]!.y
      pinchRef.current = {
        pointers,
        startDist: Math.hypot(dx, dy),
        startScale: scale,
      }
      dragRef.current = null
    } else {
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startTx: tx,
        startTy: ty,
      }
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pinchRef.current && pinchRef.current.pointers.has(e.pointerId)) {
      pinchRef.current.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      const ptArr = Array.from(pinchRef.current.pointers.values())
      if (ptArr.length >= 2) {
        const dx = ptArr[0]!.x - ptArr[1]!.x
        const dy = ptArr[0]!.y - ptArr[1]!.y
        const dist = Math.hypot(dx, dy)
        const ratio = dist / pinchRef.current.startDist
        setScale(clampScale(pinchRef.current.startScale * ratio))
      }
      return
    }

    if (dragRef.current && e.pointerId === dragRef.current.pointerId) {
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      setTx(dragRef.current.startTx + dx)
      setTy(dragRef.current.startTy + dy)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (containerRef.current?.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId)
    }
    if (pinchRef.current) {
      pinchRef.current.pointers.delete(e.pointerId)
      if (pinchRef.current.pointers.size < 2) {
        pinchRef.current = null
      }
    }
    if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
      dragRef.current = null
    }
  }

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1 + SCALE_STEP : 1 - SCALE_STEP
      setScale((s) => clampScale(s * factor))
    },
    [],
  )

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    node.addEventListener('wheel', handleWheel, { passive: false })
    return () => node.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const resetView = () => {
    setScale(1)
    setTx(0)
    setTy(0)
  }

  // ─── Détermine le set de Pathways (pour calcul du statut) ──────────────
  const pathwayStatusMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computePathwayStatus>>()
    for (const island of ISLANDS) {
      for (const p of island.pathways) {
        map.set(p.id, computePathwayStatus(p, masteredIds))
      }
    }
    return map
  }, [masteredIds])

  // Position pixel du centre de chaque île (pour les labels)
  const islandLabelPositions = useMemo(() => {
    return ISLANDS.map((island) => {
      const allCoords = [
        ...island.decorativeHexes,
        ...island.pathways.map((p) => p.coord),
      ]
      const bb = computeBoundingBox(allCoords)
      return {
        id: island.id,
        name: island.name,
        tagline: island.tagline,
        color: island.theme.label,
        cx: (bb.minX + bb.maxX) / 2,
        cy: bb.minY - 18,
      }
    })
  }, [])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        touchAction: 'none',
        cursor: dragRef.current ? 'grabbing' : 'grab',
      }}
    >
      {/* Reset view button */}
      <button
        type="button"
        onClick={resetView}
        className="absolute bottom-6 right-6 z-30 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/70 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
      >
        Recentrer
      </button>

      <svg
        viewBox={`${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: '100%',
          height: '100%',
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: 'center',
          transition: dragRef.current || pinchRef.current ? 'none' : 'transform 180ms ease-out',
        }}
      >
        <defs>
          <radialGradient id="kinnu-v2-bg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.05)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <rect
          x={viewBox.minX}
          y={viewBox.minY}
          width={viewBox.width}
          height={viewBox.height}
          fill="url(#kinnu-v2-bg-glow)"
        />

        {/* Îles */}
        {ISLANDS.map((island) => (
          <g key={island.id}>
            {/* Hexagones décoratifs */}
            {island.decorativeHexes.map((coord, i) => (
              <HexTile
                key={`${island.id}-deco-${i}`}
                coord={coord}
                theme={island.theme}
                status="locked"
                isDecorative
              />
            ))}

            {/* Pathways */}
            {island.pathways.map((pathway) => {
              const status = pathwayStatusMap.get(pathway.id) ?? 'locked'
              return (
                <HexTile
                  key={pathway.id}
                  coord={pathway.coord}
                  theme={island.theme}
                  status={status}
                  label={pathway.shortLabel}
                  onClick={() => onPathwayClick(pathway)}
                />
              )
            })}
          </g>
        ))}

        {/* Labels d'île */}
        {islandLabelPositions.map((label) => {
          const { x: lx, y: ly } = { x: label.cx, y: label.cy }
          return (
            <g key={`label-${label.id}`} pointerEvents="none">
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                style={{
                  fill: label.color,
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {label.name}
              </text>
            </g>
          )
        })}
      </svg>

      <style>{`
        @keyframes kinnu-v2-pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.95); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .kinnu-v2-hex-interactive {
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1), filter 200ms ease-out;
        }
        .kinnu-v2-hex-interactive:hover {
          transform: scale(1.08);
          filter: brightness(1.18);
        }
        .kinnu-v2-hex-interactive:focus-visible {
          outline: none;
          filter: brightness(1.25) drop-shadow(0 0 8px rgba(255,255,255,0.4));
        }
      `}</style>
    </div>
  )
}
