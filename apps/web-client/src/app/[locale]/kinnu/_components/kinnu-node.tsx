'use client'

import {
  Anchor,
  Bug,
  Fish,
  Flower2,
  HandHeart,
  LockKeyhole,
  Mountain,
  PawPrint,
  Skull,
  Sprout,
  type LucideIcon,
} from 'lucide-react'
import { type KinnuNode, type KinnuNodeType } from '@/lib/kinnu/graph'
import { type KinnuNodeStatus } from '@/lib/kinnu/bridge'
import { cn } from '@/lib/utils'

// ─── Icônes par type et par nom ───────────────────────────────────────────────

const TYPE_ICON: Record<KinnuNodeType, LucideIcon> = {
  base: Mountain,
  flora: Flower2,
  fauna: PawPrint,
  habitat: Anchor,
  project: HandHeart,
  threat: Skull,
}

const NAME_ICON: Record<string, LucideIcon> = {
  'Abeille noire': Bug,
  'Bourdon terrestre': Bug,
  'Osmie rousse': Bug,
  Mégachile: Bug,
  'Syrphe ceinturé': Bug,
  Acropora: Fish,
  'Poisson clown': Fish,
  'Demoiselle bleue': Fish,
  Coccinelle: Bug,
  'Sols vivants': Sprout,
  'Haies fleuries': Sprout,
}

// ─── Styles par statut ───────────────────────────────────────────────────────

const STATUS_STYLES: Record<
  KinnuNodeStatus,
  { orb: string; halo: string; label: string; badge: string }
> = {
  locked: {
    orb: 'border-white/10 bg-white/5 text-white/25 opacity-50 grayscale',
    halo: '',
    label: 'border-white/5 bg-transparent opacity-60',
    badge: 'border-white/10 text-white/30',
  },
  available: {
    orb: 'border-emerald-200/40 bg-emerald-300/15 text-emerald-100',
    halo: 'shadow-[0_0_28px_rgba(52,211,153,0.45)]',
    label: 'border-white/10 bg-[#05050A]/80',
    badge: 'border-emerald-200/30 text-emerald-100',
  },
  mastered: {
    orb: 'border-amber-200/40 bg-amber-300/15 text-amber-100',
    halo: 'shadow-[0_0_22px_rgba(252,211,77,0.35)]',
    label: 'border-white/10 bg-[#05050A]/80',
    badge: 'border-amber-200/30 text-amber-100',
  },
}

const STATUS_BADGE_LABEL: Record<KinnuNodeStatus, string> = {
  locked: '🔒',
  available: '?',
  mastered: '✦',
}

// ─── Composant ────────────────────────────────────────────────────────────────

type KinnuNodeProps = {
  node: KinnuNode
  status: KinnuNodeStatus
  isSelected: boolean
  isNewlyUnlocked: boolean
  onClick: (id: string) => void
}

export function KinnuNode({ node, status, isSelected, isNewlyUnlocked, onClick }: KinnuNodeProps) {
  const Icon = NAME_ICON[node.name] ?? TYPE_ICON[node.type]
  const styles = STATUS_STYLES[status]
  const isLocked = status === 'locked'

  return (
    <section
      className={cn(
        'absolute z-10 flex w-[6rem] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center transition-all duration-500',
        isLocked ? 'pointer-events-none cursor-default' : 'cursor-pointer',
        isNewlyUnlocked && 'animate-bounce',
      )}
      style={{ left: `${node.lane}%`, top: `${(({ 4: 8, 3: 28, 2: 50, 1: 72, 0: 92 } as Record<number,number>)[node.trophicLevel] ?? 50)}%` }}
      role={isLocked ? undefined : 'button'}
      tabIndex={isLocked ? -1 : 0}
      aria-label={`${node.name} — ${status}`}
      onClick={() => { if (!isLocked) onClick(node.id) }}
      onKeyDown={(e) => { if (!isLocked && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(node.id) } }}
    >
      {/* Orb */}
      <div
        className={cn(
          'relative flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full border backdrop-blur-md transition-all duration-500',
          styles.orb,
          styles.halo,
          isSelected && 'ring-2 ring-white/60 ring-offset-2 ring-offset-[#05050A]',
          status === 'available' && 'animate-pulse',
        )}
      >
        <Icon className="h-7 w-7" />

        {/* Badge statut */}
        <div
          className={cn(
            'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border bg-[#05050A] text-[0.55rem] font-black transition-all duration-500',
            styles.badge,
          )}
        >
          {STATUS_BADGE_LABEL[status]}
        </div>
      </div>

      {/* Label */}
      <div
        className={cn(
          'mt-2 max-w-full rounded-2xl border px-2 py-1 backdrop-blur-md transition-all duration-500',
          styles.label,
        )}
      >
        <p className="text-[0.65rem] font-black leading-tight text-white">{node.name}</p>
        <p className="mt-0.5 text-[0.5rem] font-bold uppercase tracking-[0.12em] text-white/35">
          {isLocked ? 'Verrouillé' : status === 'mastered' ? 'Maîtrisé' : 'Explorer'}
        </p>
      </div>
    </section>
  )
}
