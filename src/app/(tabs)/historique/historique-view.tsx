'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { InterventionListItem, Person, Phase, Zone } from '@/lib/domain'
import { useRole } from '@/lib/role-context'
import { JournalClient } from './journal-client'

export function HistoriqueView({
  interventions,
  todayDate,
  people,
  zones,
  phases,
}: {
  interventions: InterventionListItem[]
  todayDate: string
  people: Person[]
  zones: Zone[]
  phases: Phase[]
}) {
  const { role, isReady } = useRole()

  if (!isReady) return null

  const isOuvrier = role === 'ouvrier'
  const title = isOuvrier ? 'Envoyés' : 'Historique'
  const subtitle = isOuvrier
    ? 'Vos actions en attente de validation'
    : 'Toutes les interventions du chantier'

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center gap-3 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        {!isOuvrier && (
          <Link
            href="/menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-elevated active:scale-95 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold leading-tight truncate">{title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </header>

      <section className="px-4 pt-5">
        <JournalClient
          interventions={interventions}
          todayDate={todayDate}
          people={people}
          zones={zones}
          phases={phases}
        />
      </section>
    </main>
  )
}
