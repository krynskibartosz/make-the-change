'use client'

import { ChevronLeft } from 'lucide-react'
import { Button } from '@make-the-change/core/ui'
import { FACTION_COPY, type EcosystemFactionKey } from '@/lib/ecosystem/graph'
import { cn } from '@/lib/utils'

function FactionCard({ 
  factionKey, 
  onSelect 
}: { 
  factionKey: EcosystemFactionKey
  onSelect: (factionKey: EcosystemFactionKey) => void 
}) {
  const faction = FACTION_COPY[factionKey]

  return (
    <button
      type="button"
      className={cn(
        'flex flex-col items-start gap-3 rounded-3xl border p-4 text-left transition-all duration-300',
        'border-white/10 bg-white/[0.035] text-white/55 hover:bg-white/[0.07] hover:border-white/15',
      )}
      onClick={() => onSelect(factionKey)}
    >
      <div className="min-w-0 flex-1">
        <p className="text-lg font-black text-white">{faction.name}</p>
        <p className="mt-1 text-sm text-white/40">{faction.mascot}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/48">{faction.description}</p>
      </div>
    </button>
  )
}

export default function FactionsPage() {
  const factionKeys = Object.keys(FACTION_COPY) as EcosystemFactionKey[]

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#05050A] px-3 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-5">
      <div className="mx-auto w-full max-w-5xl">
        <header className="py-4">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="glass"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-2xl border border-white/10 bg-white/5 text-white"
              aria-label="Retour à la liste des écosystèmes"
              icon={<ChevronLeft className="h-4 w-4" />}
              shimmer={false}
              onClick={() => window.history.back()}
            />
            
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/60">
                Factions
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-normal text-white">
                Explorer par faction
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                Découvrez les écosystèmes organisés par faction
              </p>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {factionKeys.map((factionKey) => (
            <FactionCard
              key={factionKey}
              factionKey={factionKey}
              onSelect={(key) => {
                window.location.href = `/ecosysteme/faction/${key}`
              }}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-1 pb-2 text-[0.65rem] text-white/28">
          <span>Prototype V1</span>
          <span>•</span>
          <span>Liste des factions</span>
        </div>
      </div>
    </main>
  )
}
