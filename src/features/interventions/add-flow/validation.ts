import { calculateWorkEntryDuration } from '@/lib/calculations'

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

  if (state.form.type === null) {
    blockingMessages.push('Choisis un type de travail.')
  }

  if (state.form.title.trim() === '') {
    blockingMessages.push('Ajoute un titre court.')
  }

  if (state.form.date.trim() === '') {
    blockingMessages.push('Choisis une date.')
  }

  try {
    calculateWorkEntryDuration({
      startTime: state.form.startTime,
      endTime: state.form.endTime,
      breakMinutes: state.form.breakMinutes,
    })
  } catch {
    blockingMessages.push('Vérifie les horaires.')
  }

  if (state.form.locationToDefine || state.form.phaseId === null || state.form.zoneId === null) {
    warningMessages.push('Zone ou phase à vérifier.')
  }

  if (state.form.personIds.length === 0) {
    warningMessages.push('Personnes à vérifier.')
  }

  if (state.status.simplified === 'to_check') {
    warningMessages.push('Statut à vérifier.')
  }

  return {
    canSave: blockingMessages.length === 0,
    blockingMessages,
    warningMessages,
    shouldMarkToCheck: warningMessages.length > 0,
  }
}
