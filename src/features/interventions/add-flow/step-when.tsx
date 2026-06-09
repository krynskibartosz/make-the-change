'use client'

import type { Dispatch, ReactNode } from 'react'

import { Badge, Button, InfoRow, Input, NumberStepper } from '@/components/ui'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type { Person } from '@/lib/domain'

import { TIME_PRESETS } from './options'
import type { AddInterventionAction } from './reducer'
import type { AddInterventionState } from './types'

export type StepWhenProps = Readonly<{
  dispatch: Dispatch<AddInterventionAction>
  people: Person[]
  selectedPersonIds: string[]
  state: AddInterventionState['when']
}>

export function StepWhen({ dispatch, people, selectedPersonIds, state }: StepWhenProps) {
  const preview = calculatePreview({
    people,
    selectedPersonIds,
    state,
  })

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground">Presets</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TIME_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              onClick={() => {
                dispatch({ type: 'setStartTime', startTime: preset.startTime })
                dispatch({ type: 'setEndTime', endTime: preset.endTime })
                dispatch({ type: 'setBreakMinutes', breakMinutes: preset.breakMinutes })
              }}
              variant={isPresetSelected(state, preset) ? 'primary' : 'secondary'}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <Input
          label="Date"
          onChange={(event) => dispatch({ type: 'setDate', date: event.currentTarget.value })}
          type="date"
          value={state.date}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            error={preview.error}
            label="Debut"
            onChange={(event) =>
              dispatch({ type: 'setStartTime', startTime: event.currentTarget.value })
            }
            type="time"
            value={state.startTime}
          />
          <Input
            error={preview.error ? 'Verifier fin' : undefined}
            label="Fin"
            onChange={(event) =>
              dispatch({ type: 'setEndTime', endTime: event.currentTarget.value })
            }
            type="time"
            value={state.endTime}
          />
        </div>
      </div>

      <div className="grid gap-4">
        <StepperField label="Pause">
          <NumberStepper
            ariaLabel="Pause en minutes"
            formatValue={(value) => `${value} min`}
            max={240}
            min={0}
            onChange={(breakMinutes) => dispatch({ type: 'setBreakMinutes', breakMinutes })}
            step={15}
            value={state.breakMinutes}
          />
        </StepperField>
        <StepperField label="Jours">
          <NumberStepper
            ariaLabel="Nombre de jours"
            formatValue={(value) => `${value} j`}
            max={30}
            min={1}
            onChange={(days) => dispatch({ type: 'setDays', days })}
            value={state.days}
          />
        </StepperField>
      </div>

      <div className="grid gap-1 rounded-[var(--radius-card)] border border-border bg-surface px-4 py-2">
        {preview.error ? (
          <p className="py-3 text-sm font-semibold text-danger">{preview.error}</p>
        ) : (
          <>
            <InfoRow
              action={<Badge tone="info">Preview</Badge>}
              label="Duree"
              value={preview.duration}
            />
            <InfoRow
              action={<Badge tone="info">Preview</Badge>}
              label="Montant"
              value={preview.amount}
            />
          </>
        )}
      </div>
    </div>
  )
}

type StepperFieldProps = Readonly<{
  children: ReactNode
  label: string
}>

function StepperField({ children, label }: StepperFieldProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
      <span>{label}</span>
      {children}
    </div>
  )
}

type PreviewInput = Readonly<{
  people: Person[]
  selectedPersonIds: string[]
  state: AddInterventionState['when']
}>

type PreviewResult =
  | Readonly<{
      amount: string
      duration: string
      error?: undefined
    }>
  | Readonly<{
      amount?: undefined
      duration?: undefined
      error: string
    }>

const calculatePreview = ({ people, selectedPersonIds, state }: PreviewInput): PreviewResult => {
  try {
    const durationMinutes = calculateWorkEntryDuration(state)
    const selectedPeople = people.filter((person) => selectedPersonIds.includes(person.id))
    const amount = selectedPeople.reduce(
      (total, person) =>
        total +
        calculateWorkEntryAmount({
          durationMinutes,
          hourlyRate: person.defaultHourlyRate,
        }),
      0,
    )

    return {
      amount: `${amount.toFixed(2)} EUR`,
      duration: formatDuration(durationMinutes),
    }
  } catch {
    return { error: 'Horaires a verifier.' }
  }
}

const formatDuration = (durationMinutes: number): string => {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  if (minutes === 0) {
    return `${hours} h`
  }

  return `${hours} h ${minutes} min`
}

const isPresetSelected = (
  state: AddInterventionState['when'],
  preset: (typeof TIME_PRESETS)[number],
): boolean =>
  state.startTime === preset.startTime &&
  state.endTime === preset.endTime &&
  state.breakMinutes === preset.breakMinutes
