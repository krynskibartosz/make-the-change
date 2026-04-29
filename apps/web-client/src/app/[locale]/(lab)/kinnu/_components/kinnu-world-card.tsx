'use client'

import { LockKeyhole, MapPin, Sprout, TreePine, Waves, type LucideIcon } from 'lucide-react'
import { type KinnuWorld, type KinnuTheme } from '@/lib/kinnu/graph'
import { cn } from '@/lib/utils'

const THEME_ICON: Record<KinnuTheme, LucideIcon> = {
  forest: TreePine,
  marine: Waves,
  pollinators: Sprout,
}

const THEME_ACCENT: Record<KinnuTheme, { border: string; bg: string; text: string; glow: string; icon: string }> = {
  forest: {
    border: 'border-emerald-200/20',
    bg: 'from-emerald-500/8 to-transparent',
    text: 'text-emerald-100',
    glow: 'shadow-[0_0_48px_rgba(16,185,129,0.12)]',
    icon: 'border-emerald-200/25 bg-emerald-400/10 text-emerald-100',
  },
  marine: {
    border: 'border-cyan-200/20',
    bg: 'from-cyan-500/8 to-transparent',
    text: 'text-cyan-100',
    glow: 'shadow-[0_0_48px_rgba(34,211,238,0.12)]',
    icon: 'border-cyan-200/25 bg-cyan-400/10 text-cyan-100',
  },
  pollinators: {
    border: 'border-amber-200/20',
    bg: 'from-amber-500/8 to-transparent',
    text: 'text-amber-100',
    glow: 'shadow-[0_0_48px_rgba(252,211,77,0.12)]',
    icon: 'border-amber-200/25 bg-amber-400/10 text-amber-100',
  },
}

type KinnuWorldCardProps = {
  world: KinnuWorld
  masteredCount: number
  isLocked?: boolean
  onClick: () => void
}

export function KinnuWorldCard({ world, masteredCount, isLocked = false, onClick }: KinnuWorldCardProps) {
  const Icon = THEME_ICON[world.theme]
  const accent = THEME_ACCENT[world.theme]
  const pct = Math.round((masteredCount / world.nodes.length) * 100)

  return (
    <button
      type="button"
      className={cn(
        'group relative w-full overflow-hidden rounded-[2rem] border p-6 text-left transition-all duration-500',
        'bg-gradient-to-br backdrop-blur-xl',
        accent.border,
        accent.bg,
        accent.glow,
        isLocked ? 'opacity-50 grayscale' : 'hover:scale-[1.02]',
      )}
      onClick={onClick}
      disabled={isLocked}
    >
      {/* Glow radial */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.03] blur-2xl" />

      <div className="relative flex flex-col gap-5">
        {/* Icon + lock */}
        <div className="flex items-start justify-between">
          <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl border', accent.icon)}>
            {isLocked ? <LockKeyhole className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
            <MapPin className="h-3 w-3 text-white/40" />
            <span className="text-[0.6rem] font-bold text-white/40">{world.location}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <p className={cn('text-[0.6rem] font-black uppercase tracking-[0.22em]', accent.text)}>
            {world.theme === 'forest' ? 'Forêt' : world.theme === 'marine' ? 'Océan' : 'Pollinisateurs'}
          </p>
          <h2 className="mt-1 text-xl font-black leading-tight text-white">{world.shortName}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/50">{world.tagline}</p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-[0.62rem] font-bold text-white/35">
            <span className="uppercase tracking-[0.12em]">Progression</span>
            <span className="tabular-nums">{masteredCount}/{world.nodes.length} concepts</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={cn('h-full rounded-full transition-all duration-700', pct === 100 ? 'bg-amber-400' : 'bg-emerald-400')}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  )
}
