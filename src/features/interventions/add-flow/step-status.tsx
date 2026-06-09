'use client'

import type { Dispatch } from 'react'

import { ChoiceCard } from '@/components/ui'
import type { BillingStatus, PaymentStatus } from '@/lib/domain'

import type { AddInterventionAction } from './reducer'
import type { AddInterventionState, AddInterventionStatusState } from './types'

export type StepStatusProps = Readonly<{
  dispatch: Dispatch<AddInterventionAction>
  state: AddInterventionState['status']
}>

type StatusOption = Readonly<{
  description: string
  label: string
  value: AddInterventionStatusState
}>

const STATUS_OPTIONS: StatusOption[] = [
  {
    label: 'Inclus chantier',
    description: 'Travail compris dans le scope initial, non facturable separement.',
    value: {
      isExtra: false,
      billingStatus: 'not_billable',
      paymentStatus: 'not_applicable',
    },
  },
  {
    label: 'Supplement',
    description: 'Hors scope initial, decision facturation a confirmer.',
    value: {
      isExtra: true,
      billingStatus: 'to_check',
      paymentStatus: 'not_applicable',
    },
  },
  {
    label: 'A verifier',
    description: 'Statut incomplet ou decision a confirmer.',
    value: {
      isExtra: 'to_check',
      billingStatus: 'to_check',
      paymentStatus: 'to_check',
    },
  },
  {
    label: 'A facturer',
    description: 'Pret pour facturation client.',
    value: {
      isExtra: true,
      billingStatus: 'to_invoice',
      paymentStatus: 'not_applicable',
    },
  },
  {
    label: 'Paye',
    description: 'Facturation et paiement termines.',
    value: {
      isExtra: true,
      billingStatus: 'paid',
      paymentStatus: 'paid',
    },
  },
]

export function StepStatus({ dispatch, state }: StepStatusProps) {
  return (
    <div className="grid gap-3">
      {STATUS_OPTIONS.map((option) => (
        <ChoiceCard
          description={
            <span className="grid gap-1">
              <span>{option.description}</span>
              <span>{formatStatusDetails(option.value)}</span>
            </span>
          }
          key={option.label}
          onClick={() => dispatch({ type: 'setStatus', status: option.value })}
          selected={isSameStatus(state, option.value)}
        >
          {option.label}
        </ChoiceCard>
      ))}
    </div>
  )
}

const isSameStatus = (
  current: AddInterventionStatusState,
  next: AddInterventionStatusState,
): boolean =>
  current.isExtra === next.isExtra &&
  current.billingStatus === next.billingStatus &&
  current.paymentStatus === next.paymentStatus

const formatStatusDetails = (status: AddInterventionStatusState): string =>
  [
    `Supplement: ${formatExtraStatus(status.isExtra)}`,
    `Facturation: ${formatBillingStatus(status.billingStatus)}`,
    `Paiement: ${formatPaymentStatus(status.paymentStatus)}`,
  ].join(' - ')

const formatExtraStatus = (isExtra: AddInterventionStatusState['isExtra']): string => {
  if (isExtra === 'to_check') {
    return 'a verifier'
  }

  return isExtra ? 'oui' : 'non'
}

const formatBillingStatus = (status: BillingStatus): string => {
  const labels: Record<BillingStatus, string> = {
    invoiced: 'facture',
    not_billable: 'non facturable',
    paid: 'paye',
    to_check: 'a verifier',
    to_invoice: 'a facturer',
  }

  return labels[status]
}

const formatPaymentStatus = (status: PaymentStatus): string => {
  const labels: Record<PaymentStatus, string> = {
    not_applicable: 'non concerne',
    paid: 'paye',
    partially_paid: 'partiel',
    to_check: 'a verifier',
    to_pay: 'a payer',
  }

  return labels[status]
}
