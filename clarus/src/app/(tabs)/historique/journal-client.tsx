'use client'

import { useState } from 'react'

import { SegmentedControl } from '@/components/ui'
import { InterventionCard } from '@/features/interventions/components'
import type { InterventionListItem, Person, Phase, Zone } from '@/lib/domain'

type JournalClientProps = Readonly<{
  interventions: InterventionListItem[]
  todayDate: string
  people: Person[]
  zones: Zone[]
  phases: Phase[]
}>

type FilterType = 'all' | 'today' | 'to_check' | 'extra'

export function JournalClient({
  interventions,
  todayDate,
  people,
  zones,
  phases,
}: JournalClientProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [personFilter, setPersonFilter] = useState<string>('all')
  const [zoneFilter, setZoneFilter] = useState<string>('all')
  const [phaseFilter, setPhaseFilter] = useState<string>('all')

  const filteredInterventions = interventions.filter((item) => {
    // Filter by zone and phase using the denormalized names on InterventionListItem
    if (zoneFilter !== 'all' && item.zoneName !== zones.find((z) => z.id === zoneFilter)?.name)
      return false
    if (phaseFilter !== 'all' && item.phaseName !== phases.find((p) => p.id === phaseFilter)?.name)
      return false
    // Note: personFilter is not applicable on InterventionListItem (no personIds field)

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

  // Group by date
  const groupedByDate = filteredInterventions.reduce<Record<string, InterventionListItem[]>>(
    (acc, item) => {
      const group = acc[item.date] ?? []
      group.push(item)
      acc[item.date] = group
      return acc
    },
    {},
  )

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a))

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl
        ariaLabel="journal-filter"
        options={[
          { label: 'Tout', value: 'all' },
          { label: "Aujourd'hui", value: 'today' },
          { label: 'A verifier', value: 'to_check' },
          { label: 'Supplement', value: 'extra' },
        ]}
        value={filter}
        onValueChange={(val: string) => setFilter(val as FilterType)}
      />

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <select
          className="h-9 min-w-32 rounded-[var(--radius-input)] border border-border bg-surface px-3 text-sm"
          value={personFilter}
          onChange={(e) => setPersonFilter(e.target.value)}
        >
          <option value="all">Personne (Toutes)</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          className="h-9 min-w-32 rounded-[var(--radius-input)] border border-border bg-surface px-3 text-sm"
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
        >
          <option value="all">Zone (Toutes)</option>
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
        <select
          className="h-9 min-w-32 rounded-[var(--radius-input)] border border-border bg-surface px-3 text-sm"
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
        >
          <option value="all">Phase (Toutes)</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-6">
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-2 border border-dashed border-border rounded-[var(--radius-card)] mt-4">
            <p className="font-semibold text-foreground">Aucune activité aujourd'hui</p>
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
              <div className="flex flex-col divide-y divide-border -mx-4 px-4 sm:mx-0 sm:px-0">
                {groupedByDate[date]?.map((item) => (
                  <InterventionCard key={item.id} intervention={item} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
