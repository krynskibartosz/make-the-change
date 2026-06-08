import {
  calculateInterventionTotals,
  getInterventionVerificationStatus,
  roundMoney,
} from '@/lib/calculations'
import type {
  Intervention,
  InterventionListItem,
  Person,
  Phase,
  TodayAlert,
  TodaySummary,
  WorkEntry,
  Zone,
} from '@/lib/domain'

export type SelectTodaySummaryInput = {
  date: string
  interventions: Intervention[]
  workEntries: WorkEntry[]
  people: Person[]
  zones: Zone[]
  phases: Phase[]
}

export const selectTodaySummary = ({
  date,
  interventions,
  workEntries,
  zones,
  phases,
}: SelectTodaySummaryInput): TodaySummary => {
  const todayInterventions = interventions.filter((intervention) => intervention.date === date)
  const todayInterventionIds = new Set(todayInterventions.map((intervention) => intervention.id))
  const todayWorkEntries = workEntries.filter((entry) =>
    todayInterventionIds.has(entry.interventionId),
  )
  const latestInterventions = todayInterventions
    .map((intervention) => toInterventionListItem(intervention, workEntries, zones, phases))
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 5)
  const alerts = todayInterventions
    .filter(
      (intervention) =>
        getInterventionVerificationStatus({
          intervention,
          workEntries: workEntries.filter((entry) => entry.interventionId === intervention.id),
        }) === 'to_check',
    )
    .map<TodayAlert>((intervention) => ({
      id: `alert-${intervention.id}`,
      title: intervention.title,
      description: buildToCheckDescription(intervention),
      severity: 'warning',
      interventionId: intervention.id,
    }))

  return {
    date,
    metrics: {
      interventionCount: todayInterventions.length,
      hours: sum(todayWorkEntries.map((entry) => entry.durationMinutes)) / 60,
      estimatedAmount: roundMoney(sum(todayWorkEntries.map((entry) => entry.amount))),
      toCheckCount: alerts.length,
    },
    latestInterventions,
    alerts,
  }
}

export const toInterventionListItem = (
  intervention: Intervention,
  workEntries: WorkEntry[],
  zones: Zone[],
  phases: Phase[],
): InterventionListItem => {
  const totals = calculateInterventionTotals({ interventionId: intervention.id, workEntries })
  const matchingEntries = workEntries.filter((entry) => entry.interventionId === intervention.id)

  return {
    id: intervention.id,
    title: intervention.title,
    date: intervention.date,
    type: intervention.type,
    status: intervention.status,
    verificationStatus: getInterventionVerificationStatus({
      intervention,
      workEntries: matchingEntries,
    }),
    isExtra: intervention.isExtra,
    zoneName: zones.find((zone) => zone.id === intervention.zoneId)?.name ?? 'Zone a verifier',
    phaseName:
      phases.find((phase) => phase.id === intervention.phaseId)?.name ?? 'Phase a verifier',
    hours: totals.hours,
    amount: totals.amount,
    updatedAt: intervention.updatedAt,
  }
}

const buildToCheckDescription = (intervention: Intervention): string => {
  if (intervention.billingStatus === 'to_check') {
    return 'Facturation a verifier'
  }

  if (intervention.isExtra === 'to_check' || intervention.isExtra === true) {
    return 'Supplement a confirmer'
  }

  return 'Informations chantier a verifier'
}

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0)
