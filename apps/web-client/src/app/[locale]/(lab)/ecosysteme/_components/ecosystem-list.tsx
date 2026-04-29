'use client'

import { Button } from '@make-the-change/core/ui'
import { Layers3, LockKeyhole, type LucideIcon, Sprout, TreePine, Users, Waves } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ECOSYSTEMS, type EcosystemDefinition } from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'

const THEME_ICON: Record<EcosystemDefinition['theme'], LucideIcon> = {
  forest: TreePine,
  marine: Waves,
  pollinators: Sprout,
}

export function EcosystemList() {
  const router = useRouter()
  const [unlockedEcosystemIds, _setUnlockedEcosystemIds] = useState<Set<string>>(() => new Set())

  function handleSelectEcosystem(ecosystemId: string) {
    router.push(`/ecosysteme/${ecosystemId}`)
  }

  function handleGoToFactions() {
    router.push('/ecosysteme/factions')
  }

  function handleGoToInteractionsLab() {
    router.push('/ecosysteme/lab/interactions')
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-5">
      <div className="mx-auto w-full max-w-5xl">
        <header className="py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/60">
                Prototype autonome
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Toile vivante</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                Sélectionnez un écosystème à explorer
              </p>
            </div>

            <Button
              type="button"
              variant="glass"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
              aria-label="Explorer par faction"
              icon={<Users className="h-4 w-4" />}
              shimmer={false}
              onClick={handleGoToFactions}
            />
          </div>
        </header>

        <button
          type="button"
          className="group flex w-full items-center justify-between gap-4 rounded-[2rem] border border-cyan-200/15 bg-cyan-300/[0.06] p-4 text-left shadow-[0_0_36px_rgba(34,211,238,0.08)] transition-all duration-500 hover:border-cyan-200/25 hover:bg-cyan-300/[0.09]"
          onClick={handleGoToInteractionsLab}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
              <Layers3 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-white">Microscope des interactions</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/45">
                Filtrer la toile par habitat, symbiose, protection, predation ou menaces.
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-cyan-100">
            Labo
          </span>
        </button>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEMS.map((ecosystem) => {
            const Icon = THEME_ICON[ecosystem.theme]
            const isUnlocked =
              ecosystem.access === 'available' || unlockedEcosystemIds.has(ecosystem.id)

            return (
              <button
                key={ecosystem.id}
                type="button"
                className={cn(
                  'group relative overflow-hidden rounded-[2rem] border p-6 text-left transition-all duration-500 ease-out',
                  'border-white/8 bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl',
                  'shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.15)]',
                  'hover:border-emerald-200/20 hover:scale-[1.02] hover:from-white/[0.08] hover:to-white/[0.04]',
                  !isUnlocked && 'opacity-60 grayscale',
                )}
                onClick={() => handleSelectEcosystem(ecosystem.id)}
              >
                {/* Gradient overlay for hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative flex flex-col gap-4">
                  {/* Icon container with glass effect */}
                  <div
                    className={cn(
                      'flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border backdrop-blur-md transition-all duration-500',
                      isUnlocked
                        ? 'border-emerald-200/20 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                        : 'border-white/10 bg-white/5',
                    )}
                  >
                    {isUnlocked ? (
                      <Icon className="h-8 w-8 text-emerald-100 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    ) : (
                      <LockKeyhole className="h-8 w-8 text-white/30" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-xl font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">
                      {ecosystem.shortName}
                    </p>
                    <p className="truncate text-sm font-medium text-white/40 group-hover:text-white/50 transition-colors">
                      {ecosystem.location}
                    </p>
                  </div>

                  {/* Impact metric with modern pill design */}
                  <div className="mt-2 inline-flex items-center gap-2 self-start rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 backdrop-blur-sm">
                    <div className="h-2 w-2 rounded-full bg-emerald-400/60 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <div className="text-right">
                      <p className="text-sm font-bold text-white/90">{ecosystem.impact.value}</p>
                      <p className="text-[0.7rem] font-medium uppercase tracking-wider text-white/35">
                        {ecosystem.impact.metric}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-1 pb-2 text-[0.65rem] text-white/28">
          <span>Prototype V1</span>
          <span>•</span>
          <span>Sélection d'écosystème</span>
        </div>
      </div>
    </main>
  )
}
