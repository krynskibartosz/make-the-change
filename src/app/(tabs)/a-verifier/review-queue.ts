export type ReviewPriority = 'blocking' | 'validate' | 'process'

export type ReviewDraftSignal = {
  id: string
  extracted: {
    status?: 'Terminé' | 'En cours' | 'Problème'
    confidence: 'Élevée' | 'Moyenne' | 'Faible'
    missingFields?: readonly string[]
  }
}

export const REVIEW_GROUPS = [
  {
    priority: 'blocking',
    label: 'Bloquant',
    description: 'Décision requise avant de poursuivre',
  },
  {
    priority: 'validate',
    label: 'À valider',
    description: 'Informations incertaines ou incomplètes',
  },
  {
    priority: 'process',
    label: 'À traiter',
    description: 'Extraction prête à être organisée',
  },
] as const satisfies readonly {
  priority: ReviewPriority
  label: string
  description: string
}[]

export function getReviewPriority(draft: ReviewDraftSignal): ReviewPriority {
  if (draft.extracted.status === 'Problème') return 'blocking'

  if (draft.extracted.confidence !== 'Élevée' || (draft.extracted.missingFields?.length ?? 0) > 0) {
    return 'validate'
  }

  return 'process'
}

export function groupReviewDrafts<T extends ReviewDraftSignal>(drafts: readonly T[]) {
  return REVIEW_GROUPS.map((group) => ({
    ...group,
    items: drafts.filter((draft) => getReviewPriority(draft) === group.priority),
  }))
}
