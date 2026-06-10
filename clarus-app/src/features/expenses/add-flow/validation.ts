import type { ExpenseAddFlowState } from './types'

export type ValidationResult = {
  isValid: boolean
  errors: string[]
}

export function validateStepQuoi(state: ExpenseAddFlowState['quoi']): ValidationResult {
  const errors: string[] = []
  if (!state.titre.trim()) errors.push('Le titre est requis.')
  if (!state.montant.trim()) errors.push('Le montant est requis.')
  else if (isNaN(Number(state.montant))) errors.push('Le montant doit être un nombre valide.')
  if (!state.fournisseur.trim()) errors.push('Le fournisseur est requis.')

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateStepPreuve(state: ExpenseAddFlowState['preuve']): ValidationResult {
  const errors: string[] = []
  // Preuve might be optional or "to_check", but let's make it optional for now or just warn
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateStepImputation(state: ExpenseAddFlowState['imputation']): ValidationResult {
  const errors: string[] = []
  // At least one imputation is typically required
  if (!state.zonePhaseId && !state.interventionId) {
    errors.push('Veuillez sélectionner une zone/phase ou une intervention.')
  }
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateStepStatut(state: ExpenseAddFlowState['statut']): ValidationResult {
  return { isValid: true, errors: [] }
}
