import type { ExpenseAddFlowState } from './types'

export type ValidationResult = {
  isValid: boolean
  errors: string[]
}

export function validateStepReceiptAndInfo(
  state: ExpenseAddFlowState['receiptAndInfo'],
): ValidationResult {
  const errors: string[] = []
  if (!state.titre.trim()) errors.push('Le titre est requis.')
  if (!state.montant.trim()) errors.push('Le montant est requis.')
  else if (Number.isNaN(Number(state.montant)))
    errors.push('Le montant doit être un nombre valide.')
  if (!state.fournisseur.trim()) errors.push('Le fournisseur est requis.')

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateStepLinkToProject(
  state: ExpenseAddFlowState['linkToProject'],
): ValidationResult {
  const errors: string[] = []
  if (state.linkType === 'zone' && !state.zoneId) {
    errors.push('Veuillez sélectionner une zone.')
  }
  if (state.linkType === 'intervention' && !state.interventionId) {
    errors.push('Veuillez sélectionner un travail.')
  }
  return {
    isValid: errors.length === 0,
    errors,
  }
}
