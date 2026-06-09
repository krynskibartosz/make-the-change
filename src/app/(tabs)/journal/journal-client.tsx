'use client'

import { useState } from 'react'

import { SegmentedControl } from '@/components/ui'
import { InterventionCard } from '@/features/interventions/components'
import type { InterventionListItem } from '@/lib/domain'

type JournalClientProps = Readonly<{
  interventions: InterventionListItem[]
  todayDate: string
}>

type FilterType = 'all' | 'today' | 'to_check' | 'extra'

export function JournalClient({ interventions, todayDate }: JournalClientProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredInterventions = interventions.filter((item) => {
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

      <div className="flex flex-col gap-6">
        {sortedDates.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            Aucune intervention ne correspond a ce filtre.
          </p>
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
              <div className="flex flex-col gap-3">
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
