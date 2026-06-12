import type { Phase } from '@/lib/domain'

export function sortPhasesByOrder(phases: readonly Phase[]) {
  return [...phases].sort((left, right) => left.order - right.order)
}

export function getPhaseStatusLabel(status: Phase['status']) {
  if (status === 'completed') return 'Terminée'
  if (status === 'in_progress') return 'En cours'
  if (status === 'delayed') return 'En retard'
  return 'À venir'
}
