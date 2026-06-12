import { describe, expect, it } from 'vitest'
import { getReviewPriority, groupReviewDrafts } from './review-queue'

const makeDraft = (
  id: string,
  extracted: {
    status?: 'Terminé' | 'En cours' | 'Problème'
    confidence: 'Élevée' | 'Moyenne' | 'Faible'
    missingFields?: string[]
  },
) => ({ id, extracted })

describe('getReviewPriority', () => {
  it('classe un problème comme bloquant', () => {
    expect(
      getReviewPriority(
        makeDraft('blocking', {
          status: 'Problème',
          confidence: 'Élevée',
        }),
      ),
    ).toBe('blocking')
  })

  it('classe une extraction incertaine comme à valider', () => {
    expect(
      getReviewPriority(
        makeDraft('validate', {
          status: 'En cours',
          confidence: 'Moyenne',
          missingFields: ['Zone'],
        }),
      ),
    ).toBe('validate')
  })

  it('classe une extraction complète comme à traiter', () => {
    expect(
      getReviewPriority(
        makeDraft('process', {
          status: 'Terminé',
          confidence: 'Élevée',
        }),
      ),
    ).toBe('process')
  })
})

describe('groupReviewDrafts', () => {
  it('retourne les groupes dans l’ordre opérationnel', () => {
    const grouped = groupReviewDrafts([
      makeDraft('process', { status: 'Terminé', confidence: 'Élevée' }),
      makeDraft('blocking', { status: 'Problème', confidence: 'Moyenne' }),
      makeDraft('validate', { status: 'En cours', confidence: 'Faible' }),
    ])

    expect(grouped.map((group) => group.priority)).toEqual(['blocking', 'validate', 'process'])
    expect(grouped.map((group) => group.items.map((item) => item.id))).toEqual([
      ['blocking'],
      ['validate'],
      ['process'],
    ])
  })
})
