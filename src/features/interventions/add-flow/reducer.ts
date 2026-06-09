import type {
  AddInterventionState,
  AddInterventionStatusState,
  AddInterventionStepId,
} from './types'

type CreateInitialStateInput = {
  today: string
}

export type AddInterventionAction =
  | { type: 'goToStep'; step: AddInterventionStepId }
  | {
      type: 'selectType'
      interventionType: NonNullable<AddInterventionState['what']['type']>
      defaultTitle: string
    }
  | { type: 'setTitle'; title: string }
  | { type: 'setNote'; note: string }
  | { type: 'setPhase'; phaseId: string | null }
  | { type: 'setZone'; zoneId: string | null }
  | { type: 'setLocationToDefine'; value: boolean }
  | { type: 'togglePerson'; personId: string }
  | { type: 'setDate'; date: string }
  | { type: 'setStartTime'; startTime: string }
  | { type: 'setEndTime'; endTime: string }
  | { type: 'setBreakMinutes'; breakMinutes: number }
  | { type: 'setDays'; days: number }
  | { type: 'setStatus'; status: AddInterventionStatusState }
  | {
      type: 'setSaveState'
      saveState: AddInterventionState['saveState']
      saveError?: string | null
    }

export const createInitialAddInterventionState = ({
  today,
}: CreateInitialStateInput): AddInterventionState => ({
  currentStep: 'what',
  what: {
    type: null,
    title: '',
    note: '',
  },
  where: {
    phaseId: null,
    zoneId: null,
    locationToDefine: false,
  },
  who: {
    personIds: [],
  },
  when: {
    date: today,
    startTime: '08:00',
    endTime: '18:30',
    breakMinutes: 30,
    days: 1,
  },
  status: {
    isExtra: false,
    billingStatus: 'not_billable',
    paymentStatus: 'not_applicable',
  },
  saveState: 'idle',
  saveError: null,
})

export const reduceAddInterventionState = (
  state: AddInterventionState,
  action: AddInterventionAction,
): AddInterventionState => {
  switch (action.type) {
    case 'goToStep':
      return { ...state, currentStep: action.step }
    case 'selectType':
      return {
        ...state,
        what: {
          ...state.what,
          type: action.interventionType,
          title: state.what.title.trim() === '' ? action.defaultTitle : state.what.title,
        },
      }
    case 'setTitle':
      return { ...state, what: { ...state.what, title: action.title } }
    case 'setNote':
      return { ...state, what: { ...state.what, note: action.note } }
    case 'setPhase':
      return { ...state, where: { ...state.where, phaseId: action.phaseId } }
    case 'setZone':
      return { ...state, where: { ...state.where, zoneId: action.zoneId } }
    case 'setLocationToDefine':
      return {
        ...state,
        where: {
          ...state.where,
          locationToDefine: action.value,
          phaseId: action.value ? null : state.where.phaseId,
          zoneId: action.value ? null : state.where.zoneId,
        },
      }
    case 'togglePerson':
      return {
        ...state,
        who: {
          personIds: state.who.personIds.includes(action.personId)
            ? state.who.personIds.filter((personId) => personId !== action.personId)
            : [...state.who.personIds, action.personId],
        },
      }
    case 'setDate':
      return { ...state, when: { ...state.when, date: action.date } }
    case 'setStartTime':
      return { ...state, when: { ...state.when, startTime: action.startTime } }
    case 'setEndTime':
      return { ...state, when: { ...state.when, endTime: action.endTime } }
    case 'setBreakMinutes':
      return { ...state, when: { ...state.when, breakMinutes: action.breakMinutes } }
    case 'setDays':
      return { ...state, when: { ...state.when, days: action.days } }
    case 'setStatus':
      return { ...state, status: action.status }
    case 'setSaveState':
      return {
        ...state,
        saveState: action.saveState,
        saveError: action.saveError ?? null,
      }
  }
}
