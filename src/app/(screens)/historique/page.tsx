import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { InterventionListItem } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories/mock-clarus-repository'
import { JournalClient } from './journal-client'

export default async function HistoriquePage() {
  const [interventions, people, zones, phases] = await Promise.all([
    mockClarusRepository.getInterventions(),
    mockClarusRepository.getPeople(),
    mockClarusRepository.getZones(),
    mockClarusRepository.getPhases(),
  ])

  const todayDate = new Date().toISOString().split('T')[0] as string

  // Build InterventionListItem from Intervention
  const interventionListItems: InterventionListItem[] = interventions.map((i) => ({
    id: i.id,
    title: i.title,
    date: i.date,
    type: i.type,
    status: i.status,
    isExtra: i.isExtra,
    updatedAt: i.updatedAt ?? '',
    zoneName: zones.find((z) => z.id === i.zoneId)?.name ?? '',
    phaseName: phases.find((p) => p.id === i.phaseId)?.name ?? '',
    verificationStatus: 'to_check',
    hours: 0,
    amount: 0,
  }))

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center gap-3 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <Link
          href="/menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-surface-elevated active:scale-95 transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold leading-tight truncate">
            Historique
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Toutes les interventions du chantier
          </p>
        </div>
      </header>

      <section className="px-4 pt-5">
        <JournalClient
          interventions={interventionListItems}
          todayDate={todayDate}
          people={people}
          zones={zones}
          phases={phases}
        />
      </section>
    </main>
  )
}
