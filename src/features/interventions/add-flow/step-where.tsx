'use client'

import type { Dispatch } from 'react'

import { SelectableCard } from '@/components/ui'
import type { Phase, Zone } from '@/lib/domain'

import type { AddInterventionAction } from './reducer'
import type { AddInterventionState } from './types'

export type StepWhereProps = Readonly<{
  dispatch: Dispatch<AddInterventionAction>
  phases: Phase[]
  state: AddInterventionState['where']
  zones: Zone[]
}>

export function StepWhere({ dispatch, phases, state, zones }: StepWhereProps) {
  return (
    <div className="grid gap-6">
      <SelectableCard
        description="La zone et la phase seront marquees a verifier."
        onClick={() => dispatch({ type: 'setLocationToDefine', value: !state.locationToDefine })}
        selected={state.locationToDefine}
      >
        A definir
      </SelectableCard>

      <fieldset className="grid gap-3" disabled={state.locationToDefine}>
        <legend className="text-sm font-semibold text-muted-foreground">Zone</legend>
        <div className="grid gap-2">
          {zones.map((zone) => (
            <SelectableCard
              description={getZoneDescription(zone)}
              disabled={state.locationToDefine}
              key={zone.id}
              onClick={() => dispatch({ type: 'setZone', zoneId: zone.id })}
              selected={state.zoneId === zone.id}
            >
              {zone.name}
            </SelectableCard>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-3" disabled={state.locationToDefine}>
        <legend className="text-sm font-semibold text-muted-foreground">Phase</legend>
        <div className="grid gap-2">
          {phases.map((phase) => (
            <SelectableCard
              description={phase.description}
              disabled={state.locationToDefine}
              key={phase.id}
              onClick={() => dispatch({ type: 'setPhase', phaseId: phase.id })}
              selected={state.phaseId === phase.id}
            >
              {phase.name}
            </SelectableCard>
          ))}
        </div>
      </fieldset>
    </div>
  )
}

const getZoneDescription = (zone: Zone): string | undefined => {
  if (zone.type === 'technical') {
    return [zone.technicalCode, zone.planReference].filter(Boolean).join(' - ') || 'Zone technique'
  }

  return zone.description
}
