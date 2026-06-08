import {
  calculateTotalsByPerson,
  calculateTotalsByPhase,
  calculateTotalsByZone,
  getInterventionVerificationStatus,
  roundMoney,
} from '@/lib/calculations'
import type { Intervention, Person, Phase, WorkEntry, Zone } from '@/lib/domain'

export type SelectCostsSummaryInput = {
  interventions: Intervention[]
  workEntries: WorkEntry[]
  people: Person[]
  zones: Zone[]
  phases: Phase[]
}

export type CostsSummary = {
  totals: {
    hours: number
    laborAmount: number
    toCheckAmount: number
    extraAmount: number
  }
  byPerson: ReturnType<typeof calculateTotalsByPerson>
  byZone: ReturnType<typeof calculateTotalsByZone>
  byPhase: ReturnType<typeof calculateTotalsByPhase>
  toCheckInterventions: {
    id: string
    title: string
    amount: number
    reason: string
  }[]
}

export const selectCostsSummary = ({
  interventions,
  workEntries,
  people,
  zones,
  phases,
}: SelectCostsSummaryInput): CostsSummary => {
  const toCheckInterventions = interventions
    .filter(
      (intervention) =>
        getInterventionVerificationStatus({
          intervention,
          workEntries: workEntries.filter((entry) => entry.interventionId === intervention.id),
        }) === 'to_check',
    )
    .map((intervention) => ({
      id: intervention.id,
      title: intervention.title,
      amount: getInterventionAmount(intervention.id, workEntries),
      reason: getToCheckReason(intervention),
    }))

  return {
    totals: {
      hours: sum(workEntries.map((entry) => entry.durationMinutes)) / 60,
      laborAmount: roundMoney(sum(workEntries.map((entry) => entry.amount))),
      toCheckAmount: roundMoney(
        sum(toCheckInterventions.map((intervention) => intervention.amount)),
      ),
      extraAmount: roundMoney(
        sum(
          interventions
            .filter(
              (intervention) =>
                intervention.isExtra === true || intervention.isExtra === 'to_check',
            )
            .map((intervention) => getInterventionAmount(intervention.id, workEntries)),
        ),
      ),
    },
    byPerson: calculateTotalsByPerson({ workEntries, people }).sort(
      (left, right) => right.amount - left.amount,
    ),
    byZone: calculateTotalsByZone({ interventions, workEntries, zones }).sort(
      (left, right) => right.amount - left.amount,
    ),
    byPhase: calculateTotalsByPhase({ interventions, workEntries, phases }).sort(
      (left, right) => right.amount - left.amount,
    ),
    toCheckInterventions,
  }
}

const getInterventionAmount = (interventionId: string, workEntries: WorkEntry[]): number =>
  roundMoney(
    sum(
      workEntries
        .filter((entry) => entry.interventionId === interventionId)
        .map((entry) => entry.amount),
    ),
  )

const getToCheckReason = (intervention: Intervention): string => {
  if (intervention.billingStatus === 'to_check') {
    return 'Facturation'
  }

  if (intervention.paymentStatus === 'to_check') {
    return 'Paiement'
  }

  if (intervention.isExtra === 'to_check') {
    return 'Supplement'
  }

  return 'Donnees'
}

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0)
