'use client'

import { ArrowLeft, Hexagon, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { LivesCounter } from '@/components/lives-counter'

type HexHudProps = {
  masteredCount: number
  totalPathways: number
  lives: number
  unlimited?: boolean
  livesUpdatedAt?: string
  onLivesClick?: () => void
}

export function HexHud({ masteredCount, totalPathways, lives, unlimited, livesUpdatedAt, onLivesClick }: HexHudProps) {
  const pct = totalPathways > 0 ? Math.round((masteredCount / totalPathways) * 100) : 0

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      {/* Retour */}
      <Link
        href="/kinnu"
        className="pointer-events-auto flex h-11 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 text-[11px] font-black uppercase tracking-[0.14em] text-white/80 backdrop-blur-md transition-colors hover:bg-black/70 hover:text-white"
        aria-label="Retour à Kinnu V1"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Retour</span>
      </Link>

      {/* Titre central */}
      <div className="pointer-events-none flex flex-col items-center text-center">
        <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/5 px-3 py-1 backdrop-blur-md">
          <Hexagon className="h-3 w-3 text-emerald-300" />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-200">
            Prototype V2 · Hex Archipel
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          La Toile
        </h1>
      </div>

      {/* Right side: lives + score */}
      <div className="pointer-events-auto flex items-center gap-2">
        <LivesCounter
          lives={lives}
          unlimited={unlimited}
          updatedAt={livesUpdatedAt}
          onClick={onLivesClick}
          className="bg-black/50 backdrop-blur-md"
        />
        <div className="flex h-11 items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/5 px-4 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span className="text-[11px] font-black tabular-nums text-amber-100">
            {masteredCount}/{totalPathways}
          </span>
          <span className="text-[10px] font-bold tabular-nums text-amber-200/70">{pct}%</span>
        </div>
      </div>
    </header>
  )
}
