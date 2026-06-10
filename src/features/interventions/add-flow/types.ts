import type { BillingStatus, InterventionType, PaymentStatus } from '@/lib/domain'

export type AddInterventionStepId = 'quick_form' | 'summary'

export type AddInterventionFormState = {
  type: InterventionType | null
  title: string
  note: string
  phaseId: string | null
  zoneId: string | null
  locationToDefine: boolean
  personIds: string[]
  date: string
  startTime: string
  endTime: string
  breakMinutes: number
  days: number
}

export type SimplifiedStatus = 'inclus' | 'to_check' | 'extra' | 'blocked'

export type AddInterventionStatusState = {
  simplified: SimplifiedStatus
}

export type AddInterventionState = {
  currentStep: AddInterventionStepId
  form: AddInterventionFormState
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
