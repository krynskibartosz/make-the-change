'use client'

import type { Dispatch } from 'react'

import { ChoiceCard, Input, Textarea } from '@/components/ui'

import { INTERVENTION_TYPE_OPTIONS } from './options'
import type { AddInterventionAction } from './reducer'
import type { AddInterventionState } from './types'

export type StepWhatProps = Readonly<{
  dispatch: Dispatch<AddInterventionAction>
  state: AddInterventionState['what']
}>

export function StepWhat({ dispatch, state }: StepWhatProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground">Type d intervention</p>
        <div className="grid gap-2">
          {INTERVENTION_TYPE_OPTIONS.map((option) => (
            <ChoiceCard
              description={option.defaultTitle}
              key={option.value}
              onClick={() =>
                dispatch({
                  type: 'selectType',
                  interventionType: option.value,
                  defaultTitle: option.defaultTitle,
                })
              }
              selected={state.type === option.value}
            >
              {option.label}
            </ChoiceCard>
          ))}
        </div>
      </div>

      <Input
        label="Titre"
        onChange={(event) => dispatch({ type: 'setTitle', title: event.currentTarget.value })}
        placeholder="Ex: Demolition garage"
        value={state.title}
      />

      <Textarea
        label="Note optionnelle"
        onChange={(event) => dispatch({ type: 'setNote', note: event.currentTarget.value })}
        placeholder="Details utiles, source WhatsApp, remarque chantier..."
        value={state.note}
      />
    </div>
  )
}
