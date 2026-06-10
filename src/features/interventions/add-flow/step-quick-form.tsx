'use client'

import type { Dispatch } from 'react'
import { User2 } from 'lucide-react'

import { Badge, Button, Input, NumberStepper, SelectableCard, Textarea } from '@/components/ui'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type { Person, Phase, Zone } from '@/lib/domain'

import { INTERVENTION_TYPE_OPTIONS, TIME_PRESETS } from './options'
import type { AddInterventionAction } from './reducer'
import type { AddInterventionState } from './types'

export type StepQuickFormProps = Readonly<{
  dispatch: Dispatch<AddInterventionAction>
  people: Person[]
  phases: Phase[]
  state: AddInterventionState
  zones: Zone[]
}>

export function StepQuickForm({ dispatch, people, phases, state, zones }: StepQuickFormProps) {
  const form = state.form
  const activePeople = people.filter((p) => p.active)

  const selectedPeople = activePeople.filter((p) => form.personIds.includes(p.id))

  // Calculate preview
  let previewText: string | null = null
  try {
    const durationMinutes = calculateWorkEntryDuration({
      startTime: form.startTime,
      endTime: form.endTime,
      breakMinutes: form.breakMinutes,
    })
    const totalAmount = selectedPeople.reduce(
      (total, person) =>
        total + calculateWorkEntryAmount({ durationMinutes, hourlyRate: person.defaultHourlyRate }),
      0,
    )
    const hours = Math.floor(durationMinutes / 60)
    const mins = durationMinutes % 60
    const durationStr = mins === 0 ? `${hours}h` : `${hours}h${mins}`
    if (selectedPeople.length > 1) {
      previewText = `${selectedPeople.length} pers × ${durationStr} = ${totalAmount.toFixed(0)} €`
    } else if (selectedPeople.length === 1) {
      previewText = `${durationStr} — ${totalAmount.toFixed(0)} €`
    } else {
      previewText = `Durée : ${durationStr}`
    }
  } catch {
    previewText = null
  }

  const togglePerson = (personId: string) => {
    const current = form.personIds
    const next = current.includes(personId)
      ? current.filter((id) => id !== personId)
      : [...current, personId]
    dispatch({ type: 'updateForm', payload: { personIds: next } })
  }

  const setOnlyMe = (personId: string) => {
    dispatch({ type: 'updateForm', payload: { personIds: [personId] } })
  }

  return (
    <div className="grid gap-6 pb-2">

      {/* 1. Type de travail */}
      <section className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Type de travail</p>
        <div className="grid grid-cols-2 gap-2">
          {INTERVENTION_TYPE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                dispatch({
                  type: 'updateForm',
                  payload: {
                    type: option.value,
                    title: form.title || option.defaultTitle,
                  },
                })
              }
              className={`rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                form.type === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Titre */}
      <section>
        <Input
          label="Titre court"
          onChange={(e) => dispatch({ type: 'updateForm', payload: { title: e.currentTarget.value } })}
          placeholder="Ex: Démolition garage nord"
          value={form.title}
        />
      </section>

      {/* 3. Zone */}
      <section className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Zone</p>
        <div className="grid gap-1.5 max-h-60 overflow-y-auto pr-1">
          {zones
            .filter((z) => z.type === 'simple')
            .map((zone) => (
              <button
                key={zone.id}
                onClick={() =>
                  dispatch({ type: 'updateForm', payload: { zoneId: zone.id, locationToDefine: false } })
                }
                className={`flex items-center rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  form.zoneId === zone.id && !form.locationToDefine
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
                }`}
              >
                {zone.name}
                {zone.description && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground truncate">{zone.description}</span>
                )}
              </button>
            ))}
          <button
            onClick={() =>
              dispatch({ type: 'updateForm', payload: { locationToDefine: true, zoneId: null } })
            }
            className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
              form.locationToDefine
                ? 'border-warning/60 bg-warning/10 text-warning'
                : 'border-border bg-surface text-muted-foreground hover:bg-surface-elevated'
            }`}
          >
            À définir plus tard
          </button>
        </div>
      </section>

      {/* 4. Phase (optionnel, compact) */}
      {!form.locationToDefine && (
        <section className="grid gap-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Phase (optionnel)</p>
          <div className="flex flex-wrap gap-2">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() =>
                  dispatch({ type: 'updateForm', payload: { phaseId: form.phaseId === phase.id ? null : phase.id } })
                }
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  form.phaseId === phase.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
                }`}
              >
                {phase.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 5. Qui */}
      <section className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Qui a travaillé ?</p>
        <div className="grid gap-1.5">
          {activePeople.map((person) => {
            const isSelected = form.personIds.includes(person.id)
            return (
              <button
                key={person.id}
                onClick={() => togglePerson(person.id)}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                    isSelected ? 'border-primary bg-primary' : 'border-border bg-background'
                  }`}
                >
                  {isSelected && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="flex-1">{person.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{person.role ?? ''}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); setOnlyMe(person.id) }}
                  className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <User2 className="size-3" />
                  Moi seul
                </button>
              </button>
            )
          })}
        </div>
      </section>

      {/* 6. Durée */}
      <section className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quand & durée</p>
        <Input
          label="Date"
          onChange={(e) => dispatch({ type: 'updateForm', payload: { date: e.currentTarget.value } })}
          type="date"
          value={form.date}
        />
        <div className="grid grid-cols-3 gap-2">
          {TIME_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() =>
                dispatch({
                  type: 'updateForm',
                  payload: {
                    startTime: preset.startTime,
                    endTime: preset.endTime,
                    breakMinutes: preset.breakMinutes,
                  },
                })
              }
              className={`rounded-xl border py-2 text-sm font-semibold transition-colors ${
                form.startTime === preset.startTime &&
                form.endTime === preset.endTime &&
                form.breakMinutes === preset.breakMinutes
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Début"
            onChange={(e) => dispatch({ type: 'updateForm', payload: { startTime: e.currentTarget.value } })}
            type="time"
            value={form.startTime}
          />
          <Input
            label="Fin"
            onChange={(e) => dispatch({ type: 'updateForm', payload: { endTime: e.currentTarget.value } })}
            type="time"
            value={form.endTime}
          />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground">
          <span>Pause</span>
          <NumberStepper
            ariaLabel="Pause en minutes"
            formatValue={(v) => `${v} min`}
            max={240}
            min={0}
            onChange={(breakMinutes) => dispatch({ type: 'updateForm', payload: { breakMinutes } })}
            step={15}
            value={form.breakMinutes}
          />
        </div>

        {/* Cost preview */}
        {previewText && (
          <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Coût estimé</span>
            <span className="text-base font-bold text-primary">{previewText}</span>
          </div>
        )}
      </section>

      {/* 7. Note optionnelle */}
      <section>
        <Textarea
          label="Note (optionnelle)"
          onChange={(e) => dispatch({ type: 'updateForm', payload: { note: e.currentTarget.value } })}
          placeholder="Détails utiles, source WhatsApp, remarque chantier…"
          value={form.note}
        />
      </section>
    </div>
  )
}
