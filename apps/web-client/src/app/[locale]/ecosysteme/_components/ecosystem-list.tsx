'use client'

import { LockKeyhole, Sprout, TreePine, Waves, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ECOSYSTEMS,
  type EcosystemDefinition,
  type EcosystemFactionKey,
} from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'

const THEME_ICON: Record<EcosystemDefinition['theme'], LucideIcon> = {
  forest: TreePine,
  marine: Waves,
  pollinators: Sprout,
}

export function EcosystemList() {
  const router = useRouter()
  const [unlockedEcosystemIds, setUnlockedEcosystemIds] = useState<Set<string>>(() => new Set())

  function handleSelectEcosystem(ecosystemId: string) {
    router.push(`/ecosysteme/${ecosystemId}`)
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-5">
      <div className="mx-auto w-full max-w-5xl">
        <header className="py-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/60">
            Prototype autonome
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-white">Toile vivante</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
            Sélectionnez un écosystème à explorer
          </p>
        </header>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEMS.map((ecosystem) => {
            const Icon = THEME_ICON[ecosystem.theme]
            const isUnlocked = ecosystem.access === 'available' || unlockedEcosystemIds.has(ecosystem.id)

            return (
              <button
                key={ecosystem.id}
                type="button"
                className={cn(
                  'flex flex-col items-start gap-3 rounded-3xl border p-4 text-left transition-all duration-300',
                  'border-white/10 bg-white/[0.035] text-white/55 hover:bg-white/[0.07] hover:border-white/15',
                )}
                onClick={() => handleSelectEcosystem(ecosystem.id)}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  {isUnlocked ? <Icon className="h-6 w-6 text-emerald-100" /> : <LockKeyhole className="h-6 w-6 text-white/35" />}
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-black text-white">{ecosystem.shortName}</p>
                  <p className="truncate text-sm text-white/40">{ecosystem.location}</p>
                </div>

                <div className="mt-2 rounded-2xl border border-white/10 bg-[#05050A]/50 px-3 py-2 text-right">
                  <p className="text-sm font-black text-white">{ecosystem.impact.value}</p>
                  <p className="max-w-24 text-[0.65rem] leading-tight text-white/35">
                    {ecosystem.impact.metric}
                  </p>
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
