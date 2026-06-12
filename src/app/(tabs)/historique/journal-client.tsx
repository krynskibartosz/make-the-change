'use client'

import { AlertTriangle, CheckCircle2, ChevronRight, Clock3, Send } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { SegmentedControl } from '@/components/ui'
import { type DemoSubmission, readDemoSubmissions } from '@/features/demo/demo-submissions'
import { InterventionCard } from '@/features/interventions/components'
import type { InterventionListItem, Person, Phase, Zone } from '@/lib/domain'
import {
  buildWorkerHistoryGroups,
  type WorkerHistoryItem,
  workerHistoryStatusLabels,
} from './worker-history'

type JournalClientProps = Readonly<{
  interventions: InterventionListItem[]
  isWorker?: boolean
  todayDate: string
  people: Person[]
  zones: Zone[]
  phases: Phase[]
}>

type FilterType = 'all' | 'today' | 'to_check' | 'extra'

const workerStatusStyles = {
  sent: 'bg-primary/10 text-primary',
  pending: 'bg-amber-500/10 text-amber-700',
  validated: 'bg-success/10 text-success',
  correction: 'bg-danger/10 text-danger',
} as const

function WorkerStatusIcon({ status }: Pick<WorkerHistoryItem, 'status'>) {
  if (status === 'validated') return <CheckCircle2 className="size-4" />
  if (status === 'pending') return <Clock3 className="size-4" />
  if (status === 'correction') return <AlertTriangle className="size-4" />
  return <Send className="size-4" />
}

function WorkerJournal({
  interventions,
  todayDate,
}: Pick<JournalClientProps, 'interventions' | 'todayDate'>) {
  const groups = buildWorkerHistoryGroups(interventions, todayDate)
  const [demoSubmissions, setDemoSubmissions] = useState<DemoSubmission[]>([])

  useEffect(() => {
    setDemoSubmissions(readDemoSubmissions(window.localStorage))
  }, [])

  const todayDemoSubmissions = demoSubmissions.filter(
    (submission) => submission.createdAt.slice(0, 10) === todayDate,
  )

  if (groups.length === 0 && todayDemoSubmissions.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-8 text-center">
        <Send className="size-8 text-muted-foreground" />
        <p className="font-semibold text-foreground">Aucun envoi cette semaine</p>
        <p className="text-sm text-muted-foreground">Les notes que tu envoies apparaîtront ici.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-7">
      {todayDemoSubmissions.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-foreground">Envoyé depuis ce téléphone</h2>
          <div className="flex flex-col gap-2">
            {todayDemoSubmissions.map((submission) => (
              <div
                className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3"
                key={submission.id}
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-700">
                  <Clock3 className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{submission.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{submission.summary}</p>
                  <p className="mt-1 text-xs font-semibold text-amber-700">
                    En attente de Christophe
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {groups.map((group) => (
        <section key={group.label}>
          <h2 className="mb-3 text-sm font-bold text-foreground">{group.label}</h2>
          <div className="flex flex-col gap-2">
            {group.items.map((item) => (
              <Link
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 active:bg-surface-elevated"
                href={`/interventions/${item.id}`}
                key={item.id}
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${workerStatusStyles[item.status]}`}
                >
                  <WorkerStatusIcon status={item.status} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.zoneName || 'Chantier'}
                    {group.label === 'Cette semaine'
                      ? ` · ${new Date(`${item.date}T00:00:00`).toLocaleDateString('fr-BE', {
                          weekday: 'long',
                        })}`
                      : ''}
                  </p>
                  <p
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${workerStatusStyles[item.status]}`}
                  >
                    {workerHistoryStatusLabels[item.status]}
                  </p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function FullJournal({ interventions, todayDate, people, zones, phases }: JournalClientProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [personFilter, setPersonFilter] = useState<string>('all')
  const [zoneFilter, setZoneFilter] = useState<string>('all')
  const [phaseFilter, setPhaseFilter] = useState<string>('all')

  const filteredInterventions = interventions.filter((item) => {
    if (
      zoneFilter !== 'all' &&
      item.zoneName !== zones.find((zone) => zone.id === zoneFilter)?.name
    )
      return false
    if (
      phaseFilter !== 'all' &&
      item.phaseName !== phases.find((phase) => phase.id === phaseFilter)?.name
    )
      return false

    switch (filter) {
      case 'today':
        return item.date === todayDate
      case 'to_check':
        return item.verificationStatus === 'to_check'
      case 'extra':
        return item.isExtra === true || item.isExtra === 'to_check'
      default:
        return true
    }
  })

  const groupedByDate = filteredInterventions.reduce<Record<string, InterventionListItem[]>>(
    (groups, item) => {
      const group = groups[item.date] ?? []
      group.push(item)
      groups[item.date] = group
      return groups
    },
    {},
  )
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a))

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        ariaLabel="journal-filter"
        onValueChange={(value: string) => setFilter(value as FilterType)}
        options={[
          { label: 'Tout', value: 'all' },
          { label: "Aujourd'hui", value: 'today' },
          { label: 'À vérifier', value: 'to_check' },
          { label: 'Supplément', value: 'extra' },
        ]}
        value={filter}
      />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
        <select
          className="h-9 min-w-32 rounded-[var(--radius-input)] border border-border bg-surface px-3 text-sm"
          onChange={(event) => setPersonFilter(event.target.value)}
          value={personFilter}
        >
          <option value="all">Personne (toutes)</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <select
          className="h-9 min-w-32 rounded-[var(--radius-input)] border border-border bg-surface px-3 text-sm"
          onChange={(event) => setZoneFilter(event.target.value)}
          value={zoneFilter}
        >
          <option value="all">Zone (toutes)</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
        <select
          className="h-9 min-w-32 rounded-[var(--radius-input)] border border-border bg-surface px-3 text-sm"
          onChange={(event) => setPhaseFilter(event.target.value)}
          value={phaseFilter}
        >
          <option value="all">Phase (toutes)</option>
          {phases.map((phase) => (
            <option key={phase.id} value={phase.id}>
              {phase.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-6">
        {sortedDates.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-border p-8 text-center">
            <p className="font-semibold text-foreground">Aucune activité aujourd’hui</p>
            <p className="text-sm text-muted-foreground">
              Ajoute un travail réalisé ou valide une note terrain pour alimenter le journal.
            </p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <section key={date}>
              <h2 className="mb-3 font-semibold text-foreground">
                {new Date(date).toLocaleDateString('fr-BE', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </h2>
              <div className="-mx-4 flex flex-col divide-y divide-border px-4 sm:mx-0 sm:px-0">
                {groupedByDate[date]?.map((item) => (
                  <InterventionCard intervention={item} key={item.id} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

export function JournalClient(props: JournalClientProps) {
  return props.isWorker ? (
    <WorkerJournal interventions={props.interventions} todayDate={props.todayDate} />
  ) : (
    <FullJournal {...props} />
  )
}
