'use client'

import { CheckCircle2, ChevronLeft } from 'lucide-react'
import type React from 'react'
import { Button, StickyActionBar } from '@/components/ui'
import { mockInterventions, mockZones } from '@/lib/mock'
import type { ExpenseAddFlowAction, ExpenseAddFlowState } from '../types'

type Props = {
  state: ExpenseAddFlowState
  dispatch: React.Dispatch<ExpenseAddFlowAction>
  onSave: (state: ExpenseAddFlowState) => void
}

export function StepResume({ state, dispatch, onSave }: Props) {
  const { receiptAndInfo, linkToProject } = state

  const handlePrev = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const handleSave = () => {
    onSave(state)
  }

  const getLinkText = () => {
    if (linkToProject.linkType === 'project') return 'Tout le chantier'
    if (linkToProject.linkType === 'zone') {
      const zone = mockZones.find((z) => z.id === linkToProject.zoneId)
      return zone?.name ?? 'Zone non sélectionnée'
    }
    if (linkToProject.linkType === 'intervention') {
      const inter = mockInterventions.find((i) => i.id === linkToProject.interventionId)
      return inter?.title ?? 'Travail non sélectionné'
    }
    return 'Non défini'
  }

  const montantFormatted = (() => {
    const val = Number.parseFloat(receiptAndInfo.montant)
    if (Number.isNaN(val)) return receiptAndInfo.montant
    return `${val.toFixed(2).replace('.', ',')} €`
  })()

  return (
    <div className="flex flex-col gap-5 pb-28">
      {/* Confirmation badge */}
      <div className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 px-4 py-3">
        <CheckCircle2 className="size-5 shrink-0 text-success" />
        <p className="text-sm font-bold text-success">Prêt à enregistrer</p>
      </div>

      {/* Summary */}
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
        <SummaryRow label="Article" value={receiptAndInfo.titre || '—'} />
        <SummaryRow label="Montant" value={montantFormatted} highlight />
        <SummaryRow label="Fournisseur" value={receiptAndInfo.fournisseur || '—'} />
        <SummaryRow
          label="Preuve"
          value={receiptAndInfo.photoUrl ? 'Photo jointe ✓' : 'Aucune photo'}
        />
        <SummaryRow label="Concerne" value={getLinkText()} />
        {linkToProject.isRebillable && (
          <SummaryRow label="Supplément" value="À refacturer au client" />
        )}
        {linkToProject.isToCheck && <SummaryRow label="Statut" value="À vérifier" last />}
        {!linkToProject.isRebillable && !linkToProject.isToCheck && (
          <SummaryRow label="Statut" value="Inclus chantier" last />
        )}
      </div>

      <StickyActionBar
        primaryAction={
          <Button fullWidth onClick={handleSave} leftIcon={<CheckCircle2 className="size-4" />}>
            Enregistrer la dépense
          </Button>
        }
        secondaryAction={
          <Button
            variant="secondary"
            onClick={handlePrev}
            leftIcon={<ChevronLeft className="size-4" />}
          >
            Retour
          </Button>
        }
      />
    </div>
  )
}

function SummaryRow({
  label,
  value,
  highlight,
  last,
}: {
  label: string
  value: string
  highlight?: boolean
  last?: boolean
}) {
  return (
    <div
      className={`flex items-start justify-between px-4 py-2.5 ${!last ? 'border-b border-border' : ''}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span
        className={`max-w-[60%] text-right text-sm font-semibold ${highlight ? 'text-primary' : 'text-foreground'}`}
      >
        {value}
      </span>
    </div>
  )
}
