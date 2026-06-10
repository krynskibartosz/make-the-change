import type { ExpenseAddFlowAction, ExpenseAddFlowState } from './types'

export const initialExpenseAddFlowState: ExpenseAddFlowState = {
  step: 1,
  receiptAndInfo: {
    photoUrl: null,
    titre: '',
    montant: '',
    fournisseur: '',
  },
  linkToProject: {
    linkType: 'project',
    zoneId: null,
    interventionId: null,
    isRebillable: false,
    isToCheck: false,
  },
}

export function expenseAddFlowReducer(
  state: ExpenseAddFlowState,
  action: ExpenseAddFlowAction,
): ExpenseAddFlowState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 3) }
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) }
    case 'SET_RECEIPT_AND_INFO':
      return { ...state, receiptAndInfo: { ...state.receiptAndInfo, ...action.payload } }
    case 'SET_LINK_TO_PROJECT':
      return { ...state, linkToProject: { ...state.linkToProject, ...action.payload } }
    case 'RESET':
      return initialExpenseAddFlowState
    default:
      return state
  }
}
