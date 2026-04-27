'use client'

import { ArrowLeft, Brain, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type KinnuWorld } from '@/lib/kinnu/graph'
import { computeKinnuScore } from '@/lib/kinnu/bridge'

type KinnuHudProps = {
  world: KinnuWorld
  masteredCount: number
  totalNodes: number
}

export function KinnuHud({ world, masteredCount, totalNodes }: KinnuHudProps) {
  const router = useRouter()
  const score = computeKinnuScore(masteredCount)
  const maxScore = computeKinnuScore(totalNodes)
  const pct = totalNodes > 0 ? Math.round((masteredCount / totalNodes) * 100) : 0

  return (
    <header className="absolute inset-x-0 top-0 z-50 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        {/* Back */}
        <button
          type="button"
          aria-label="Retour"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#05050A]/70 text-white backdrop-blur-xl transition-colors hover:bg-white/10"
          onClick={() => router.push('/kinnu')}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Monde info */}
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-[#05050A]/70 px-4 py-2 backdrop-blur-xl">
          <MapPin className="h-4 w-4 shrink-0 text-emerald-300" />
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">{world.shortName}</p>
            <p className="truncate text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white/40">
              {world.location}
            </p>
          </div>
        </div>

        {/* Knowledge Bank */}
        <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-[#05050A]/70 px-3 py-2 backdrop-blur-xl">
          <Brain className="h-4 w-4 shrink-0 text-amber-300" />
          <div className="text-right">
            <p className="text-sm font-black tabular-nums text-white">{score}</p>
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-white/35">
              / {maxScore}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-auto mt-2 max-w-5xl">
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-right text-[0.55rem] font-bold uppercase tracking-[0.14em] text-white/30">
          {masteredCount}/{totalNodes} concepts
        </p>
      </div>
    </header>
  )
}
