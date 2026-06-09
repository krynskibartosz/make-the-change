import type { BillingStatus, InterventionType, PaymentStatus } from '@/lib/domain'

export type AddInterventionStepId = 'what' | 'where' | 'who' | 'when' | 'status' | 'summary'

export type AddInterventionWhatState = {
  type: InterventionType | null
  title: string
  note: string
}

export type AddInterventionWhereState = {
  phaseId: string | null
  zoneId: string | null
  locationToDefine: boolean
}

export type AddInterventionWhoState = {
  personIds: string[]
}

export type AddInterventionWhenState = {
  date: string
  startTime: string
  endTime: string
  breakMinutes: number
  days: number
}

export type AddInterventionStatusState = {
  isExtra: boolean | 'to_check'
  billingStatus: BillingStatus
  paymentStatus: PaymentStatus
}

export type AddInterventionState = {
  currentStep: AddInterventionStepId
  what: AddInterventionWhatState
  where: AddInterventionWhereState
  who: AddInterventionWhoState
  when: AddInterventionWhenState
  status: AddInterventionStatusState
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  saveError: string | null
}

export type StepDefinition = {
  id: AddInterventionStepId
  label: string
}

export type InterventionTypeOption = {
  label: string
  shortLabel: string
  value: InterventionType
  defaultTitle: string
}

export type TimePreset = {
  label: string
  startTime: string
  endTime: string
  breakMinutes: number
}
