'use client'

import type { Dispatch } from 'react'

import { SelectableCard } from '@/components/ui'
import type { Person } from '@/lib/domain'

import type { AddInterventionAction } from './reducer'
import type { AddInterventionState } from './types'

export type StepWhoProps = Readonly<{
  dispatch: Dispatch<AddInterventionAction>
  people: Person[]
  state: AddInterventionState['who']
}>

export function StepWho({ dispatch, people, state }: StepWhoProps) {
  const activePeople = people.filter((person) => person.active)

  return (
    <div className="grid gap-3">
      <p className="text-sm font-semibold text-muted-foreground">Personnes actives</p>
      {activePeople.map((person) => (
        <SelectableCard
          description={
            <span className="flex flex-wrap items-center gap-2">
              <span>{person.role ?? 'Role non defini'}</span>
              <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {formatHourlyRate(person.defaultHourlyRate)}
              </span>
            </span>
          }
          key={person.id}
          onClick={() => dispatch({ type: 'togglePerson', personId: person.id })}
          selected={state.personIds.includes(person.id)}
        >
          {person.name}
        </SelectableCard>
      ))}
    </div>
  )
}

const formatHourlyRate = (hourlyRate: number): string => `${hourlyRate.toFixed(2)} EUR/h`
