'use client'

import { useMemo } from 'react'
import { type KinnuEdge, type KinnuNode, KINNU_LEVEL_Y } from '@/lib/kinnu/graph'
import { type KinnuNodeStatus } from '@/lib/kinnu/bridge'
import { KinnuNode as KinnuNodeComponent } from './kinnu-node'
import { cn } from '@/lib/utils'

// ─── Couleur des arêtes par relation ─────────────────────────────────────────

const RELATION_STROKE: Record<string, string> = {
  nourrit: 'stroke-emerald-300/55',
  symbiose: 'stroke-lime-300/55',
  habitat: 'stroke-cyan-300/50',
  proie: 'stroke-amber-300/55',
  protege: 'stroke-emerald-400/70',
  menace: 'stroke-red-400/65',
}

type PointWithY = KinnuNode & { y: number }

type KinnuGraphCanvasProps = {
  nodes: KinnuNode[]
  edges: KinnuEdge[]
  statuses: Record<string, KinnuNodeStatus>
  selectedNodeId: string | null
  newlyUnlockedIds: Set<string>
  onNodeClick: (id: string) => void
}

export function KinnuGraphCanvas({
  nodes,
  edges,
  statuses,
  selectedNodeId,
  newlyUnlockedIds,
  onNodeClick,
}: KinnuGraphCanvasProps) {
  const points = useMemo<PointWithY[]>(
    () => nodes.map((n) => ({ ...n, y: KINNU_LEVEL_Y[n.trophicLevel] ?? 50 })),
    [nodes],
  )

  const pointById = useMemo(() => new Map(points.map((p) => [p.id, p])), [points])

  return (
    <div className="relative h-full w-full">
      {/* Arêtes SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        {edges.map((edge) => {
          const src = pointById.get(edge.source)
          const tgt = pointById.get(edge.target)
          if (!src || !tgt) return null

          const srcStatus = statuses[edge.source]
          const tgtStatus = statuses[edge.target]
          const bothVisible = srcStatus !== 'locked' && tgtStatus !== 'locked'
          const isSelected =
            selectedNodeId === edge.source || selectedNodeId === edge.target
          const controlY = (src.y + tgt.y) / 2

          return (
            <path
              key={`${edge.source}-${edge.target}`}
              d={`M ${src.lane} ${src.y} C ${src.lane} ${controlY}, ${tgt.lane} ${controlY}, ${tgt.lane} ${tgt.y}`}
              className={cn(
                'transition-all duration-700',
                RELATION_STROKE[edge.relation] ?? 'stroke-white/20',
                bothVisible
                  ? isSelected
                    ? 'opacity-100'
                    : 'opacity-60'
                  : 'opacity-8',
              )}
              fill="none"
              strokeLinecap="round"
              strokeWidth={isSelected ? '1.5' : '0.9'}
            />
          )
        })}
      </svg>

      {/* Nœuds */}
      {points.map((point) => (
        <KinnuNodeComponent
          key={point.id}
          node={point}
          status={statuses[point.id] ?? 'locked'}
          isSelected={point.id === selectedNodeId}
          isNewlyUnlocked={newlyUnlockedIds.has(point.id)}
          onClick={onNodeClick}
        />
      ))}
    </div>
  )
}
