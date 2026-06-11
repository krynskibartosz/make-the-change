export type ExpenseAddFlowState = {
  step: number
  receiptAndInfo: {
    photoUrl: string | null
    titre: string
    montant: string
    fournisseur: string
  }
  linkToProject: {
    linkType: 'project' | 'zone' | 'intervention'
    zoneId: string | null
    interventionId: string | null
    isRebillable: boolean
    isToCheck: boolean
  }
}

export type ExpenseAddFlowAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_RECEIPT_AND_INFO'; payload: Partial<ExpenseAddFlowState['receiptAndInfo']> }
  | { type: 'SET_LINK_TO_PROJECT'; payload: Partial<ExpenseAddFlowState['linkToProject']> }
  | { type: 'RESET' }
