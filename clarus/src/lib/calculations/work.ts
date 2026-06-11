import type { Intervention, Person, Phase, VerificationStatus, WorkEntry, Zone } from '@/lib/domain'

export type WorkEntryDurationInput = {
  startTime: string
  endTime: string
  breakMinutes?: number
  days?: number
}

export type WorkEntryAmountInput = {
  durationMinutes: number
  hourlyRate?: number
}

export type InterventionTotals = {
  interventionId: string
  durationMinutes: number
  hours: number
  amount: number
  workEntryCount: number
  personIds: string[]
}

export type PersonTotals = {
  personId: string
  name: string
  durationMinutes: number
  hours: number
  amount: number
  workEntryCount: number
}

export type GroupedInterventionTotals = {
  durationMinutes: number
  hours: number
  amount: number
  interventionCount: number
  workEntryCount: number
}

export type ZoneTotals = GroupedInterventionTotals & {
  zoneId: string
  name: string
}

export type PhaseTotals = GroupedInterventionTotals & {
  phaseId: string
  name: string
}

const DEFAULT_HOURLY_RATE = 45

export const calculateWorkEntryDuration = ({
  startTime,
  endTime,
  breakMinutes = 0,
  days = 1,
}: WorkEntryDurationInput): number => {
  const startMinutes = parseTimeToMinutes(startTime)
  const endMinutes = parseTimeToMinutes(endTime)
  const dailyDuration = endMinutes - startMinutes - breakMinutes

  if (dailyDuration < 0) {
    throw new Error('Work entry end time must be after start time and break.')
  }

  return dailyDuration * days
}

export const calculateWorkEntryAmount = ({
  durationMinutes,
  hourlyRate = DEFAULT_HOURLY_RATE,
}: WorkEntryAmountInput): number => roundMoney((durationMinutes / 60) * hourlyRate)

export const calculateInterventionTotals = ({
  interventionId,
  workEntries,
}: {
  interventionId: string
  workEntries: WorkEntry[]
}): InterventionTotals => {
  const matchingEntries = workEntries.filter((entry) => entry.interventionId === interventionId)
  const durationMinutes = sum(matchingEntries.map((entry) => entry.durationMinutes))
  const amount = roundMoney(sum(matchingEntries.map((entry) => entry.amount)))
  const personIds = [...new Set(matchingEntries.map((entry) => entry.personId))].sort()

  return {
    interventionId,
    durationMinutes,
    hours: minutesToHours(durationMinutes),
    amount,
    workEntryCount: matchingEntries.length,
    personIds,
  }
}

export const calculateTotalsByPerson = ({
  workEntries,
  people,
}: {
  workEntries: WorkEntry[]
  people: Person[]
}): PersonTotals[] =>
  people
    .map((person) => {
      const entries = workEntries.filter((entry) => entry.personId === person.id)
      const durationMinutes = sum(entries.map((entry) => entry.durationMinutes))
      const amount = roundMoney(sum(entries.map((entry) => entry.amount)))

      return {
        personId: person.id,
        name: person.name,
        durationMinutes,
        hours: minutesToHours(durationMinutes),
        amount,
        workEntryCount: entries.length,
      }
    })
    .filter((total) => total.workEntryCount > 0)

export const calculateTotalsByZone = ({
  interventions,
  workEntries,
  zones,
}: {
  interventions: Intervention[]
  workEntries: WorkEntry[]
  zones: Zone[]
}): ZoneTotals[] =>
  zones.flatMap((zone) => {
    const interventionIds = interventions
      .filter((intervention) => intervention.zoneId === zone.id)
      .map((item) => item.id)
    const entries = workEntries.filter((entry) => interventionIds.includes(entry.interventionId))

    if (entries.length === 0) {
      return []
    }

    const durationMinutes = sum(entries.map((entry) => entry.durationMinutes))

    return [
      {
        zoneId: zone.id,
        name: zone.name,
        durationMinutes,
        hours: minutesToHours(durationMinutes),
        amount: roundMoney(sum(entries.map((entry) => entry.amount))),
        interventionCount: interventionIds.length,
        workEntryCount: entries.length,
      },
    ]
  })

export const calculateTotalsByPhase = ({
  interventions,
  workEntries,
  phases,
}: {
  interventions: Intervention[]
  workEntries: WorkEntry[]
  phases: Phase[]
}): PhaseTotals[] =>
  phases.flatMap((phase) => {
    const interventionIds = interventions
      .filter((intervention) => intervention.phaseId === phase.id)
      .map((intervention) => intervention.id)
    const entries = workEntries.filter((entry) => interventionIds.includes(entry.interventionId))

    if (entries.length === 0) {
      return []
    }

    const durationMinutes = sum(entries.map((entry) => entry.durationMinutes))

    return [
      {
        phaseId: phase.id,
        name: phase.name,
        durationMinutes,
        hours: minutesToHours(durationMinutes),
        amount: roundMoney(sum(entries.map((entry) => entry.amount))),
        interventionCount: interventionIds.length,
        workEntryCount: entries.length,
      },
    ]
  })

export const getInterventionVerificationStatus = ({
  intervention,
  workEntries,
}: {
  intervention: Intervention
  workEntries: WorkEntry[]
}): VerificationStatus => {
  if (
    intervention.status === 'to_check' ||
    intervention.isExtra === 'to_check' ||
    intervention.billingStatus === 'to_check' ||
    intervention.paymentStatus === 'to_check'
  ) {
    return 'to_check'
  }

  const workTypes: Intervention['type'][] = [
    'work',
    'demolition',
    'evacuation',
    'protection',
    'structure',
    'extra',
  ]

  if (workTypes.includes(intervention.type) && workEntries.length === 0) {
    return 'to_check'
  }

  return 'complete'
}

export const minutesToHours = (durationMinutes: number): number => durationMinutes / 60

export const roundMoney = (amount: number): number => Math.round(amount * 100) / 100

const parseTimeToMinutes = (time: string): number => {
  const match = /^(?<hours>\d{2}):(?<minutes>\d{2})$/.exec(time)
  const hours = Number(match?.groups?.hours)
  const minutes = Number(match?.groups?.minutes)

  if (!match || hours > 23 || minutes > 59) {
    throw new Error(`Invalid time: ${time}`)
  }

  return hours * 60 + minutes
}

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0)
