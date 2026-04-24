'use client'

import { Button } from '@make-the-change/core/ui'
import {
  Bug,
  Flower2,
  HeartPulse,
  type LucideIcon,
  Mountain,
  PawPrint,
  RotateCcw,
  Skull,
  Sprout,
} from 'lucide-react'
import { useMemo } from 'react'
import { useEcosystem } from '@/hooks/use-ecosystem'
import type { EcosystemEdge, EcosystemNode, EcosystemNodeType } from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'

type NodeVisual = {
  icon: LucideIcon
  label: string
  halo: string
  orb: string
}

type PathPoint = EcosystemNode & {
  y: number
}

const NODE_VISUALS: Record<EcosystemNodeType, NodeVisual> = {
  base: {
    icon: Mountain,
    label: 'Base',
    halo: 'shadow-[0_0_34px_rgba(252,211,77,0.2)]',
    orb: 'border-amber-200/35 bg-amber-300/15 text-amber-100',
  },
  flora: {
    icon: Flower2,
    label: 'Flore',
    halo: 'shadow-[0_0_34px_rgba(52,211,153,0.22)]',
    orb: 'border-emerald-200/35 bg-emerald-300/15 text-emerald-100',
  },
  fauna: {
    icon: PawPrint,
    label: 'Faune',
    halo: 'shadow-[0_0_34px_rgba(103,232,249,0.18)]',
    orb: 'border-cyan-200/35 bg-cyan-300/15 text-cyan-100',
  },
}

const NODE_ICON_BY_ID: Record<string, LucideIcon> = {
  insecte: Bug,
  mycelium: Sprout,
}

const LEVEL_Y: Record<number, number> = {
  4: 8,
  3: 28,
  2: 50,
  1: 72,
  0: 92,
}

function getNodeVisual(node: EcosystemNode) {
  const visual = NODE_VISUALS[node.type]
  return {
    ...visual,
    icon: NODE_ICON_BY_ID[node.id] ?? visual.icon,
  }
}

function buildPathPoints(nodes: readonly EcosystemNode[]): PathPoint[] {
  return nodes.map((node) => ({
    ...node,
    y: LEVEL_Y[node.trophicLevel] ?? 50,
  }))
}

function getEdgeStatus(edge: EcosystemEdge, nodeById: Map<string, PathPoint>) {
  const source = nodeById.get(edge.source)
  const target = nodeById.get(edge.target)
  return source?.status === 'dead' || target?.status === 'dead' ? 'dead' : 'healthy'
}

function EcosystemLines({
  edges,
  points,
}: {
  edges: readonly EcosystemEdge[]
  points: readonly PathPoint[]
}) {
  const pointById = useMemo(() => new Map(points.map((point) => [point.id, point])), [points])

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <path
        d="M 50 93 C 50 80, 50 66, 50 52 C 50 39, 52 24, 62 8"
        className="stroke-white/10"
        fill="none"
        strokeLinecap="round"
        strokeWidth="1.4"
      />

      {edges.map((edge) => {
        const source = pointById.get(edge.source)
        const target = pointById.get(edge.target)

        if (!source || !target) {
          return null
        }

        const status = getEdgeStatus(edge, pointById)
        const controlY = (source.y + target.y) / 2

        return (
          <path
            key={`${edge.source}-${edge.target}`}
            d={`M ${source.lane} ${source.y} C ${source.lane} ${controlY}, ${target.lane} ${controlY}, ${target.lane} ${target.y}`}
            className={cn(
              'transition-all duration-700 ease-in-out',
              status === 'dead'
                ? 'stroke-red-950/80'
                : 'stroke-emerald-300/45 drop-shadow-[0_0_10px_rgba(110,231,183,0.35)]',
            )}
            fill="none"
            strokeLinecap="round"
            strokeWidth="0.95"
          />
        )
      })}
    </svg>
  )
}

function EcosystemPathNode({
  point,
  onExtinction,
}: {
  point: PathPoint
  onExtinction: (nodeId: string) => void
}) {
  const isDead = point.status === 'dead'
  const visual = getNodeVisual(point)
  const Icon = visual.icon

  return (
    <section
      className="absolute z-10 flex w-[6.25rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center sm:w-[7rem]"
      style={{ left: `${point.lane}%`, top: `${point.y}%` }}
      aria-label={`${point.name} - ${isDead ? 'eteint' : 'vivant'}`}
    >
      <div
        className={cn(
          'relative flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border backdrop-blur-md transition-all duration-700 ease-in-out sm:h-20 sm:w-20',
          isDead
            ? 'border-white/10 bg-white/5 text-white/35 opacity-50 grayscale'
            : cn('opacity-100', visual.orb, visual.halo),
        )}
      >
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
        <div
          className={cn(
            'absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-[#05050A] transition-all duration-700',
            isDead ? 'border-red-300/20 text-red-200/70' : 'border-emerald-200/25 text-emerald-200',
          )}
        >
          {isDead ? <Skull className="h-3.5 w-3.5" /> : <HeartPulse className="h-3.5 w-3.5" />}
        </div>
      </div>

      <div
        className={cn(
          'mt-2 rounded-2xl border bg-[#05050A]/80 px-2 py-1 backdrop-blur-md transition-all duration-700',
          isDead ? 'border-white/5 opacity-50 grayscale' : 'border-white/10',
        )}
      >
        <p className="text-[0.7rem] font-black leading-tight text-white sm:text-xs">{point.name}</p>
        <p className="mt-0.5 text-[0.52rem] font-bold uppercase tracking-[0.13em] text-white/35">
          {visual.label}
        </p>
      </div>

      {!isDead ? (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="mt-2 h-8 w-8 rounded-full bg-red-500/15 text-red-100 shadow-none ring-1 ring-red-300/20 hover:bg-red-500/25"
          aria-label={`Extinction ${point.name}`}
          icon={<Skull className="h-3 w-3" />}
          shimmer={false}
          onClick={() => onExtinction(point.id)}
        />
      ) : null}
    </section>
  )
}

export function EcosystemPathV1() {
  const { nodes, edges, triggerExtinction, healEcosystem, hasDeadNodes } = useEcosystem()

  const points = useMemo(() => buildPathPoints(nodes), [nodes])
  const deadCount = useMemo(() => nodes.filter((node) => node.status === 'dead').length, [nodes])

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-2 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-4">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-4xl flex-col">
        <header className="shrink-0 px-2 py-4 sm:px-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/60">
                Simulateur V1
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Arbre de Vie</h1>
            </div>

            {hasDeadNodes ? (
              <Button
                type="button"
                variant="glass"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-2xl border border-emerald-200/20 bg-emerald-300/10 text-emerald-100"
                aria-label="Restaurer rapidement l'ecosysteme"
                icon={<RotateCcw className="h-4 w-4" />}
                shimmer={false}
                onClick={healEcosystem}
              />
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-between border-y border-white/10 py-3">
            <span className="text-sm font-medium text-white/55">Cascade ecologique</span>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-black tabular-nums',
                hasDeadNodes ? 'bg-red-400/10 text-red-100' : 'bg-emerald-300/10 text-emerald-100',
              )}
            >
              {deadCount} / {nodes.length}
            </span>
          </div>
        </header>

        <div className="relative flex flex-1 items-center justify-center py-4">
          <div className="relative h-[58rem] w-full max-w-[44rem] overflow-visible sm:h-[62rem]">
            <EcosystemLines edges={edges} points={points} />

            {points.map((point) => (
              <EcosystemPathNode key={point.id} point={point} onExtinction={triggerExtinction} />
            ))}
          </div>
        </div>

        {hasDeadNodes ? (
          <div className="sticky bottom-0 mt-auto border-t border-white/10 bg-[#05050A]/88 px-2 py-3 backdrop-blur-xl sm:px-0">
            <Button
              type="button"
              variant="success"
              size="lg"
              className="h-12 w-full rounded-2xl bg-emerald-300 text-[#05050A] shadow-[0_0_28px_rgba(110,231,183,0.22)]"
              aria-label="Restaurer l'ecosysteme"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={healEcosystem}
            >
              Restaurer l'ecosysteme
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  )
}
