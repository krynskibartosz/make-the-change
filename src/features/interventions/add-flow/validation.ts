import type { AddInterventionState } from './types'

export type AddInterventionValidation = {
  canSave: boolean
  blockingMessages: string[]
  warningMessages: string[]
  shouldMarkToCheck: boolean
}

export const validateAddInterventionState = (
  state: AddInterventionState,
): AddInterventionValidation => {
  const blockingMessages: string[] = []
  const warningMessages: string[] = []

  if (state.what.type === null) {
    blockingMessages.push('Choisis un type d intervention.')
  }

  if (state.what.title.trim() === '') {
    blockingMessages.push('Ajoute un titre court.')
  }

  if (state.when.date.trim() === '') {
    blockingMessages.push('Choisis une date.')
  }

  if (state.where.locationToDefine || state.where.phaseId === null || state.where.zoneId === null) {
    warningMessages.push('Zone ou phase a verifier.')
  }

  if (state.who.personIds.length === 0) {
    warningMessages.push('Personnes a verifier.')
  }

  if (state.status.isExtra === 'to_check') {
    warningMessages.push('Statut supplement a verifier.')
  }

  return {
    canSave: blockingMessages.length === 0,
    blockingMessages,
    warningMessages,
    shouldMarkToCheck: warningMessages.length > 0,
  }
}
