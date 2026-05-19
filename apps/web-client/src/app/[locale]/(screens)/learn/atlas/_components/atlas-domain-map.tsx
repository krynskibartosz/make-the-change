'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GitBranch,
  Network,
  Play,
  Sparkles,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import type {
  AtlasDomainMapEdge,
  AtlasDomainMapNode,
  AtlasDomainMapView,
} from '@/lib/learning/schema'
import { cn } from '@/lib/utils'

function getNodeIcon(kind: AtlasDomainMapNode['kind']) {
  if (kind === 'chapter') return BookOpen
  if (kind === 'living_web') return Network
  if (kind === 'micro_course') return Sparkles
  return Play
}

function getNodeLabel(kind: AtlasDomainMapNode['kind']) {
  if (kind === 'chapter') return 'Module guide'
  if (kind === 'living_web') return 'Toile vivante'
  if (kind === 'micro_course') return 'Micro-cours'
  return 'Cours libre'
}

function getNodeCta(kind: AtlasDomainMapNode['kind']) {
  if (kind === 'chapter') return 'Ouvrir le module'
  if (kind === 'living_web') return 'Explorer la Toile'
  return 'Voir le cours'
}

function getTerrainBackground(map: AtlasDomainMapView) {
  const color = map.visual.color
  const terrain = map.visual.terrain

  if (terrain === 'water') {
    return `radial-gradient(circle at 70% 22%, ${color}33, transparent 28%), radial-gradient(circle at 18% 78%, rgba(83,214,255,0.16), transparent 26%), linear-gradient(145deg, #041018, #06202a 48%, #03070a)`
  }

  if (terrain === 'network') {
    return `radial-gradient(circle at 45% 35%, ${color}2e, transparent 31%), radial-gradient(circle at 78% 62%, rgba(255,220,135,0.14), transparent 25%), linear-gradient(145deg, #111007, #07100c 54%, #03070a)`
  }

  if (terrain === 'threat') {
    return `radial-gradient(circle at 72% 26%, ${color}28, transparent 30%), radial-gradient(circle at 18% 75%, rgba(255,128,104,0.14), transparent 26%), linear-gradient(145deg, #160807, #100b10 52%, #03070a)`
  }

  if (terrain === 'proof') {
    return `radial-gradient(circle at 78% 24%, ${color}2c, transparent 29%), radial-gradient(circle at 22% 72%, rgba(125,189,255,0.14), transparent 28%), linear-gradient(145deg, #071120, #071019 52%, #03070a)`
  }

  return `radial-gradient(circle at 36% 28%, ${color}30, transparent 31%), radial-gradient(circle at 74% 72%, rgba(120,255,170,0.13), transparent 27%), linear-gradient(145deg, #07130d, #06120f 52%, #03070a)`
}

function getNodeStyle(
  node: AtlasDomainMapNode,
  selected: boolean,
  color: string,
  glow: string,
): CSSProperties {
  return {
    left: `${node.x}%`,
    top: `${node.y}%`,
    '--node-color': selected ? '#FFFFFF' : color,
    '--node-glow': glow,
  } as CSSProperties
}

function getEdgePath(from: AtlasDomainMapNode, to: AtlasDomainMapNode) {
  const controlY = Math.min(from.y, to.y) - 8
  const controlX = (from.x + to.x) / 2

  return `M ${from.x} ${from.y} C ${controlX} ${controlY}, ${controlX} ${Math.max(from.y, to.y) + 8}, ${to.x} ${to.y}`
}

function AtlasDomainEdgeLayer({
  nodes,
  edges,
  selectedNodeId,
}: {
  nodes: AtlasDomainMapNode[]
  edges: AtlasDomainMapEdge[]
  selectedNodeId: string | null
}) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]))

  return (
    <svg
      className="absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="atlas-domain-edge-glow">
          <feGaussianBlur stdDeviation="0.9" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {edges.map((edge) => {
        const from = nodeById.get(edge.fromNodeId)
        const to = nodeById.get(edge.toNodeId)

        if (!from || !to) {
          return null
        }

        const active = selectedNodeId === from.id || selectedNodeId === to.id
        const recommended = edge.kind === 'recommended_path'

        return (
          <path
            key={edge.id}
            d={getEdgePath(from, to)}
            fill="none"
            stroke={
              active
                ? 'rgba(255,255,255,0.76)'
                : recommended
                  ? 'rgba(210,255,220,0.45)'
                  : 'rgba(210,255,240,0.2)'
            }
            strokeDasharray={recommended ? undefined : '1.2 2.6'}
            strokeLinecap="round"
            strokeWidth={active ? 0.86 : recommended ? 0.62 : 0.36}
            filter={active || recommended ? 'url(#atlas-domain-edge-glow)' : undefined}
          />
        )
      })}
    </svg>
  )
}

function AtlasDomainNode({
  node,
  selected,
  visual,
  onSelect,
}: {
  node: AtlasDomainMapNode
  selected: boolean
  visual: AtlasDomainMapView['visual']
  onSelect: () => void
}) {
  const Icon = getNodeIcon(node.kind)
  const completed = node.status === 'completed'
  const recommended = node.status === 'recommended'

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${node.title}, ${getNodeLabel(node.kind)}`}
      onClick={onSelect}
      className={cn(
        'group absolute z-20 -translate-x-1/2 -translate-y-1/2 touch-manipulation text-center transition-[filter] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
        selected && 'z-30',
      )}
      style={getNodeStyle(node, selected, visual.color, visual.glow)}
    >
      <motion.span
        initial={false}
        animate={{ scale: selected ? 1.08 : 1 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className={cn(
          'relative grid place-items-center border border-white/16 bg-black/38 text-[var(--node-color)] shadow-[0_0_34px_var(--node-glow)] backdrop-blur-md',
          node.kind === 'chapter' &&
            'h-[5.6rem] w-[7.6rem] rounded-[48%_52%_45%_55%/50%_44%_56%_50%] md:h-[6.2rem] md:w-[8.8rem]',
          node.kind === 'course' &&
            'h-[4.35rem] w-[4.35rem] rounded-full md:h-[4.9rem] md:w-[4.9rem]',
          node.kind === 'micro_course' && 'h-8 w-8 rounded-full md:h-9 md:w-9',
          node.kind === 'living_web' && 'h-[4.8rem] w-[4.8rem] md:h-[5.4rem] md:w-[5.4rem]',
          selected && 'border-white/48 bg-white/[0.16]',
        )}
        style={
          node.kind === 'living_web'
            ? { clipPath: 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)' }
            : undefined
        }
      >
        {selected && (
          <span className="absolute inset-[-12px] -z-10 rounded-full bg-[var(--node-glow)] blur-2xl" />
        )}
        <Icon
          className={cn(
            node.kind === 'chapter'
              ? 'h-8 w-8'
              : node.kind === 'micro_course'
                ? 'h-3.5 w-3.5'
                : 'h-6 w-6',
          )}
          aria-hidden="true"
        />
        {completed && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[#06130d]">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        )}
        {recommended && (
          <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border border-amber-100/50 bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,0.7)]" />
        )}
      </motion.span>

      <span
        className={cn(
          'pointer-events-none absolute left-1/2 top-[calc(100%+0.55rem)] max-w-[8rem] -translate-x-1/2 text-[11px] font-black leading-tight text-white drop-shadow-[0_7px_12px_rgba(0,0,0,0.85)] transition-opacity md:text-[12px]',
          node.kind === 'micro_course' && !selected
            ? 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
            : 'opacity-100',
        )}
      >
        {node.shortLabel}
      </span>
    </button>
  )
}

function AtlasNodeDock({
  node,
  visual,
}: {
  node: AtlasDomainMapNode
  visual: AtlasDomainMapView['visual']
}) {
  const Icon = getNodeIcon(node.kind)

  return (
    <motion.aside
      key={node.id}
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="fixed inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 rounded-[1.4rem] border border-white/12 bg-[#071018]/92 p-4 shadow-[0_24px_72px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:inset-x-auto md:bottom-8 md:right-8 md:w-[24rem]"
    >
      <div className="flex items-start gap-3">
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-[1rem] border border-white/14 bg-white/[0.06]"
          style={{ color: visual.color, boxShadow: `0 0 28px ${visual.glow}` }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/42">
            {getNodeLabel(node.kind)}
          </p>
          <h2 className="mt-1 text-[19px] font-black leading-tight text-white">{node.title}</h2>
          <p className="mt-1 text-[13px] font-semibold leading-relaxed text-white/52">
            {node.subtitle}
          </p>
        </div>
      </div>
      <Link
        href={node.href}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[1rem] bg-white px-4 text-[14px] font-black text-[#061018] transition-transform active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        {getNodeCta(node.kind)}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </motion.aside>
  )
}

export function AtlasDomainMap({ map }: { map: AtlasDomainMapView }) {
  const reduceMotion = useReducedMotion()
  const firstNode = map.nodes.find((node) => node.kind === 'chapter') ?? map.nodes[0] ?? null
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(firstNode?.id ?? null)
  const selectedNode = useMemo(
    () => map.nodes.find((node) => node.id === selectedNodeId) ?? firstNode,
    [firstNode, map.nodes, selectedNodeId],
  )
  const focusX = selectedNode ? (50 - selectedNode.x) * 0.1 : 0
  const focusY = selectedNode ? (50 - selectedNode.y) * 0.08 : 0

  return (
    <main className="relative h-[100dvh] min-h-[40rem] overflow-hidden text-white">
      <div className="absolute inset-0" style={{ background: getTerrainBackground(map) }} />
      <svg
        className="absolute inset-0 h-full w-full opacity-55"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`domain-current-${map.domain.id}`}
            width="13"
            height="13"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 8 C 5 4, 9 12, 13 7"
              fill="none"
              stroke="rgba(235,255,240,0.075)"
              strokeWidth="0.28"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#domain-current-${map.domain.id})`} />
      </svg>

      <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8">
        <Link
          href="/learn/atlas"
          aria-label="Retour a la carte monde"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-black/28 text-white/78 shadow-[0_14px_38px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
        <div className="min-w-0 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/48">
            Ile pedagogique
          </p>
          <h1 className="truncate text-[22px] font-black tracking-tight md:text-[28px]">
            {map.domain.title}
          </h1>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-black/22 text-white/64">
          <GitBranch className="h-5 w-5" aria-hidden="true" />
        </div>
      </header>

      <motion.section
        className="absolute inset-x-0 bottom-[8.5rem] top-[6rem] md:bottom-0 md:top-[5.4rem]"
        aria-label={`Carte de ${map.domain.title}`}
        initial={false}
        animate={
          reduceMotion
            ? {}
            : {
                x: `${focusX}%`,
                y: `${focusY}%`,
                scale: selectedNode ? 1.02 : 1,
              }
        }
        transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="relative mx-auto h-full w-full max-w-6xl">
          <div
            className="absolute rounded-full blur-[80px]"
            style={{
              left: `${(selectedNode?.x ?? 50) - 18}%`,
              top: `${(selectedNode?.y ?? 50) - 16}%`,
              width: '24rem',
              height: '24rem',
              background: map.visual.glow,
            }}
          />
          <AtlasDomainEdgeLayer
            nodes={map.nodes}
            edges={map.edges}
            selectedNodeId={selectedNode?.id ?? null}
          />
          {map.nodes.map((node) => (
            <AtlasDomainNode
              key={node.id}
              node={node}
              selected={selectedNode?.id === node.id}
              visual={map.visual}
              onSelect={() => setSelectedNodeId(node.id)}
            />
          ))}
        </div>
      </motion.section>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#03070A] to-transparent" />
      <AnimatePresence>
        {selectedNode && <AtlasNodeDock node={selectedNode} visual={map.visual} />}
      </AnimatePresence>
    </main>
  )
}
