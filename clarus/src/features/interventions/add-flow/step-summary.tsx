'use client'

import type { Dispatch } from 'react'
import { Badge } from '@/components/ui'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type { Person, Phase, Zone } from '@/lib/domain'
import type { AddInterventionAction } from './reducer'
import type { AddInterventionState, SimplifiedStatus } from './types'
import type { AddInterventionValidation } from './validation'

export type StepSummaryProps = Readonly<{
  dispatch: Dispatch<AddInterventionAction>
  people: Person[]
  phases: Phase[]
  state: AddInterventionState
  validation: AddInterventionValidation
  zones: Zone[]
}>

const STATUS_OPTIONS: { value: SimplifiedStatus; label: string; description: string }[] = [
  { value: 'inclus', label: 'Inclus chantier', description: 'Prévu dans le devis' },
  { value: 'to_check', label: 'À vérifier', description: 'Incertain, à valider' },
  { value: 'extra', label: 'Supplément probable', description: 'Hors devis, à confirmer' },
  { value: 'blocked', label: 'Bloquant / Urgent', description: 'Point critique' },
]

export function StepSummary({
  dispatch,
  people,
  phases,
  state,
  validation,
  zones,
}: StepSummaryProps) {
  const selectedPeople = people.filter((p) => state.form.personIds.includes(p.id))
  const zone = zones.find((z) => z.id === state.form.zoneId)
  const phase = phases.find((p) => p.id === state.form.phaseId)
  const warnings = [...validation.blockingMessages, ...validation.warningMessages]

  let costText = '—'
  try {
    const durationMinutes = calculateWorkEntryDuration({
      startTime: state.form.startTime,
      endTime: state.form.endTime,
      breakMinutes: state.form.breakMinutes,
    })
    const hours = Math.floor(durationMinutes / 60)
    const mins = durationMinutes % 60
    const durationStr = mins === 0 ? `${hours}h` : `${hours}h${mins}`
    const totalAmount = selectedPeople.reduce(
      (total, person) =>
        total + calculateWorkEntryAmount({ durationMinutes, hourlyRate: person.defaultHourlyRate }),
      0,
    )
    if (selectedPeople.length > 1) {
      costText = `${selectedPeople.length} pers × ${durationStr} = ${totalAmount.toFixed(0)} €`
    } else {
      costText = `${durationStr} — ${totalAmount.toFixed(0)} €`
    }
  } catch {
    costText = 'Horaires à vérifier'
  }

  return (
    <div className="grid gap-5">
      {/* Validation badges */}
      <div className="flex flex-wrap items-center gap-2">
        {validation.canSave ? (
          <Badge tone="success">Prêt à enregistrer</Badge>
        ) : (
          <Badge tone="danger">Incomplet</Badge>
        )}
        {validation.shouldMarkToCheck && <Badge tone="warning">À vérifier</Badge>}
      </div>

      {/* Summary rows */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
        <SummaryRow label="Type" value={state.form.type ?? 'À choisir'} />
        <SummaryRow label="Titre" value={state.form.title.trim() || 'Sans titre'} />
        <SummaryRow
          label="Zone"
          value={state.form.locationToDefine ? 'À définir' : (zone?.name ?? 'À définir')}
        />
        {phase && <SummaryRow label="Phase" value={phase.name} />}
        <SummaryRow
          label="Personnes"
          value={
            selectedPeople.length > 0 ? selectedPeople.map((p) => p.name).join(', ') : 'À vérifier'
          }
        />
        <SummaryRow label="Date" value={state.form.date || 'À choisir'} />
        <SummaryRow label="Horaires" value={`${state.form.startTime} – ${state.form.endTime}`} />
        <SummaryRow label="Pause" value={`${state.form.breakMinutes} min`} last />
      </div>

      {/* Cost highlight */}
      <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Coût estimé
        </span>
        <span className="text-base font-bold text-primary">{costText}</span>
      </div>

      {/* Status selection */}
      <section className="grid gap-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Statut
        </p>
        <div className="grid gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => dispatch({ type: 'setStatus', status: option.value })}
              className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left transition-colors ${
                state.status.simplified === option.value
                  ? option.value === 'blocked'
                    ? 'border-danger/50 bg-danger/10 text-danger'
                    : option.value === 'extra'
                      ? 'border-warning/50 bg-warning/10 text-warning'
                      : 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface text-foreground hover:bg-surface-elevated'
              }`}
            >
              <span className="text-sm font-bold">{option.label}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-warning/30 bg-warning/10 px-4 py-3">
          <p className="mb-1.5 text-sm font-bold text-foreground">
            À compléter avant d'enregistrer :
          </p>
          <ul className="grid gap-1 text-sm text-muted-foreground">
            {warnings.map((w) => (
              <li key={w}>• {w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={`flex items-start justify-between px-4 py-2.5 ${!last ? 'border-b border-border' : ''}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="max-w-[60%] text-right text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}
