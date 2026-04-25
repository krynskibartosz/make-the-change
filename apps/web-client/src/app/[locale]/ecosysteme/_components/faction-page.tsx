'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@make-the-change/core/ui'
import {
  ECOSYSTEMS,
  FACTION_COPY,
  type EcosystemFactionKey,
} from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'

export function FactionPage({ factionKey }: { factionKey: EcosystemFactionKey }) {
  const router = useRouter()
  const faction = FACTION_COPY[factionKey]
  const factionEcosystems = ECOSYSTEMS.filter((eco) => eco.factionFocus === factionKey)

  function handleSelectEcosystem(ecosystemId: string) {
    router.push(`/ecosysteme/${ecosystemId}`)
  }

  function handleBack() {
    router.back()
  }

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-5">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header fix avec bouton retour */}
        <header className="py-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glass"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
              aria-label="Retour"
              icon={<ChevronLeft className="h-4 w-4" />}
              shimmer={false}
              onClick={handleBack}
            />
            
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/60">
                Faction
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-white">{faction.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                {faction.description}
              </p>
            </div>
          </div>
        </header>

        {/* Liste des écosystèmes de la faction */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {factionEcosystems.map((ecosystem) => (
            <button
              key={ecosystem.id}
              type="button"
              className={cn(
                'flex flex-col items-start gap-3 rounded-3xl border p-4 text-left transition-all duration-300',
                'border-white/10 bg-white/[0.035] text-white/55 hover:bg-white/[0.07] hover:border-white/15',
              )}
              onClick={() => handleSelectEcosystem(ecosystem.id)}
            >
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
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-1 pb-2 text-[0.65rem] text-white/28">
          <span>Prototype V1</span>
          <span>•</span>
          <span>Vue faction</span>
        </div>
      </div>
    </main>
  )
}
