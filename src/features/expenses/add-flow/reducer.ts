import type { ExpenseAddFlowAction, ExpenseAddFlowState } from './types'

export const initialExpenseAddFlowState: ExpenseAddFlowState = {
  step: 1,
  quoi: {
    titre: '',
    montant: '',
    fournisseur: '',
  },
  preuve: {
    photoUrl: null,
  },
  imputation: {
    zonePhaseId: null,
    interventionId: null,
  },
  statut: {
    isRebillable: false,
  },
}

export function expenseAddFlowReducer(
  state: ExpenseAddFlowState,
  action: ExpenseAddFlowAction,
): ExpenseAddFlowState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 5) }
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) }
    case 'SET_QUOI':
      return { ...state, quoi: { ...state.quoi, ...action.payload } }
    case 'SET_PREUVE':
      return { ...state, preuve: { ...state.preuve, ...action.payload } }
    case 'SET_IMPUTATION':
      return { ...state, imputation: { ...state.imputation, ...action.payload } }
    case 'SET_STATUT':
      return { ...state, statut: { ...state.statut, ...action.payload } }
    case 'RESET':
      return initialExpenseAddFlowState
    default:
      return state
  }
}
