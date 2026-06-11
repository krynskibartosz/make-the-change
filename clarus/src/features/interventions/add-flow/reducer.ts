import type { Intervention, WorkEntry } from '@/lib/domain'
import type { AddInterventionState, AddInterventionStepId, SimplifiedStatus } from './types'

type CreateInitialStateInput = {
  today: string
}

export type AddInterventionAction =
  | { type: 'goToStep'; step: AddInterventionStepId }
  | { type: 'updateForm'; payload: Partial<AddInterventionState['form']> }
  | { type: 'setStatus'; status: SimplifiedStatus }
  | {
      type: 'setSaveState'
      saveState: AddInterventionState['saveState']
      saveError?: string | null
    }

export const createInitialAddInterventionState = ({
  today,
}: CreateInitialStateInput): AddInterventionState => ({
  currentStep: 'quick_form',
  form: {
    type: null,
    title: '',
    note: '',
    phaseId: null,
    zoneId: null,
    locationToDefine: false,
    personIds: [],
    date: today,
    startTime: '08:00',
    endTime: '18:30',
    breakMinutes: 30,
    days: 1,
  },
  status: {
    simplified: 'inclus',
  },
  saveState: 'idle',
  saveError: null,
})

export const createEditInterventionState = (
  intervention: Intervention,
  workEntries: WorkEntry[],
): AddInterventionState => {
  const firstWe = workEntries[0]
  
  let simplifiedStatus: SimplifiedStatus = 'inclus'
  if (intervention.status === 'blocked') {
    simplifiedStatus = 'blocked'
  } else if (intervention.isExtra === true) {
    simplifiedStatus = 'extra'
  } else if (intervention.isExtra === 'to_check') {
    simplifiedStatus = 'to_check'
  }

  return {
    currentStep: 'summary',
    form: {
      type: intervention.type,
      title: intervention.title,
      note: intervention.sourceNote ?? '',
      phaseId: intervention.phaseId,
      zoneId: intervention.zoneId,
      locationToDefine: false,
      personIds: workEntries.map((we) => we.personId),
      date: intervention.date,
      startTime: firstWe?.startTime ?? '08:00',
      endTime: firstWe?.endTime ?? '18:30',
      breakMinutes: firstWe?.breakMinutes ?? 30,
      days: firstWe?.days ?? 1,
    },
    status: {
      simplified: simplifiedStatus,
    },
    saveState: 'idle',
    saveError: null,
  }
}

export const reduceAddInterventionState = (
  state: AddInterventionState,
  action: AddInterventionAction,
): AddInterventionState => {
  switch (action.type) {
    case 'goToStep':
      return { ...state, currentStep: action.step }
    case 'updateForm':
      return { ...state, form: { ...state.form, ...action.payload } }
    case 'setStatus':
      return { ...state, status: { simplified: action.status } }
    case 'setSaveState':
      return {
        ...state,
        saveState: action.saveState,
        saveError: action.saveError ?? null,
      }
    default:
      return state
  }
}
