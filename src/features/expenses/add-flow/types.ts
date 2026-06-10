export type ExpenseAddFlowState = {
  step: number
  quoi: {
    titre: string
    montant: string
    fournisseur: string
  }
  preuve: {
    photoUrl: string | null
  }
  imputation: {
    zonePhaseId: string | null
    interventionId: string | null
  }
  statut: {
    isRebillable: boolean
  }
}

export type ExpenseAddFlowAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_QUOI'; payload: Partial<ExpenseAddFlowState['quoi']> }
  | { type: 'SET_PREUVE'; payload: Partial<ExpenseAddFlowState['preuve']> }
  | { type: 'SET_IMPUTATION'; payload: Partial<ExpenseAddFlowState['imputation']> }
  | { type: 'SET_STATUT'; payload: Partial<ExpenseAddFlowState['statut']> }
  | { type: 'RESET' }
