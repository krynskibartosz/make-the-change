'use client'

import { Badge, InfoRow } from '@/components/ui'
import { calculateWorkEntryAmount, calculateWorkEntryDuration } from '@/lib/calculations'
import type { Person, Phase, Zone } from '@/lib/domain'
import type { AddInterventionState, AddInterventionStatusState } from './types'
import type { AddInterventionValidation } from './validation'

export type StepSummaryProps = Readonly<{
  people: Person[]
  phases: Phase[]
  state: AddInterventionState
  validation: AddInterventionValidation
  zones: Zone[]
}>

export function StepSummary({ people, phases, state, validation, zones }: StepSummaryProps) {
  const selectedPeople = people.filter((person) => state.who.personIds.includes(person.id))
  const zone = zones.find((candidate) => candidate.id === state.where.zoneId)
  const phase = phases.find((candidate) => candidate.id === state.where.phaseId)
  const preview = calculateSummaryPreview(state, selectedPeople)
  const warnings = [...validation.blockingMessages, ...validation.warningMessages]

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-2">
        {validation.shouldMarkToCheck ? <Badge tone="warning">A verifier</Badge> : null}
        {validation.canSave ? (
          <Badge tone="success">Pret</Badge>
        ) : (
          <Badge tone="danger">Incomplet</Badge>
        )}
      </div>

      <div className="grid gap-1 rounded-[var(--radius-card)] border border-border bg-surface px-4 py-2">
        <InfoRow label="Titre" value={state.what.title.trim() || 'Sans titre'} />
        <InfoRow label="Type" value={state.what.type ?? 'A choisir'} />
        <InfoRow
          label="Zone"
          value={state.where.locationToDefine ? 'A definir' : (zone?.name ?? 'A definir')}
        />
        <InfoRow
          label="Phase"
          value={state.where.locationToDefine ? 'A definir' : (phase?.name ?? 'A definir')}
        />
        <InfoRow label="Personnes" value={formatPeople(selectedPeople)} />
        <InfoRow label="Date" value={state.when.date || 'A choisir'} />
        <InfoRow label="Heures" value={`${state.when.startTime} - ${state.when.endTime}`} />
        <InfoRow
          label="Pause / jours"
          value={`${state.when.breakMinutes} min / ${state.when.days} j`}
        />
        <InfoRow label="Montant" value={preview} />
        <InfoRow label="Statut" value={formatStatus(state.status)} />
      </div>

      {warnings.length > 0 ? (
        <div className="grid gap-2 rounded-[var(--radius-card)] border border-warning/30 bg-warning/10 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Points a verifier</p>
          <ul className="grid gap-1 text-sm text-muted-foreground">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

const calculateSummaryPreview = (state: AddInterventionState, selectedPeople: Person[]): string => {
  try {
    const durationMinutes = calculateWorkEntryDuration(state.when)
    const amount = selectedPeople.reduce(
      (total, person) =>
        total +
        calculateWorkEntryAmount({
          durationMinutes,
          hourlyRate: person.defaultHourlyRate,
        }),
      0,
    )

    return `${amount.toFixed(2)} EUR`
  } catch {
    return 'Horaires a verifier'
  }
}

const formatPeople = (people: Person[]): string => {
  if (people.length === 0) {
    return 'A verifier'
  }

  return people.map((person) => person.name).join(', ')
}

const formatStatus = (status: AddInterventionStatusState): string => {
  if (status.isExtra === 'to_check') {
    return 'A verifier'
  }

  if (status.billingStatus === 'paid' || status.paymentStatus === 'paid') {
    return 'Paye'
  }

  if (status.billingStatus === 'to_invoice') {
    return status.isExtra ? 'Supplement - a facturer' : 'A facturer'
  }

  return status.isExtra ? 'Supplement' : 'Inclus chantier'
}
