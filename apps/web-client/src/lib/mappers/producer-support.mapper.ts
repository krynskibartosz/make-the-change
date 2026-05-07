/**
 * Mapper investment → producer_support
 *
 * R2 — Phase de migration douce P0-2
 * Ce fichier fournit des helpers pour mapper les données legacy `investment`
 * vers la nomenclature cible `producer_support` sans modifier les structures
 * de données persistantes (Supabase, Stripe, mocks).
 *
 * [CIBLE_VALIDEE] P0-1 : Le soutien producteur est distinct du don pur et
 * de l'achat produit. Il représente une contribution à un producteur/partenaire
 * avec une logique économique réelle, sans rendement ni propriété.
 *
 * [ACTUEL_CODE] + [LEGACY] Les données sources restent sous le nom `investment`
 * pendant la période de compatibilité.
 */

import type { MockInvestmentRecord } from '@/lib/mock/mock-member-data'

/**
 * View-model cible pour l'affichage d'un soutien producteur.
 * Remplace progressivement l'usage direct de MockInvestmentRecord dans les UI.
 */
export type ProducerSupportViewModel = {
  id: string
  amountEuros: number
  amountImpactCredits: number
  status: 'active' | 'completed' | 'pending'
  createdAt: string
  project: {
    name: string
    slug: string
    status: string
    coverImageUrl: string | null
  }
  /** Label UI recommandé pour le type de contribution */
  contributionTypeLabel: string
  /** Label UI recommandé pour le statut */
  statusLabel: string
}

/**
 * Mappe un MockInvestmentRecord legacy vers le view-model ProducerSupport.
 *
 * @param record - Enregistrement investment legacy
 * @returns View-model adapté pour l'affichage moderne
 *
 * @example
 * const support = mapInvestmentToProducerSupport(mockInvestment)
 * // support.contributionTypeLabel === "Soutien producteur"
 */
export function mapInvestmentToProducerSupport(
  record: MockInvestmentRecord,
): ProducerSupportViewModel {
  return {
    id: record.id,
    amountEuros: record.amount_eur_equivalent,
    // R0-3 : amount_points → amountImpactCredits (Credits Impact)
    amountImpactCredits: record.amount_points,
    status: record.status,
    createdAt: record.created_at,
    project: {
      name: record.project.name_default,
      slug: record.project.slug,
      status: record.project.status,
      coverImageUrl: record.project.cover_image_url,
    },
    contributionTypeLabel: 'Soutien producteur',
    statusLabel: mapStatusToLabel(record.status),
  }
}

/**
 * Mappe un statut technique vers un label UI.
 */
function mapStatusToLabel(status: MockInvestmentRecord['status']): string {
  const labels: Record<MockInvestmentRecord['status'], string> = {
    active: 'En cours',
    completed: 'Terminé',
    pending: 'En attente',
  }
  return labels[status]
}

/**
 * Labels UI pour les écrans de soutien producteur.
 * À utiliser pour remplacer progressivement les libellés "investissement".
 */
export const PRODUCER_SUPPORT_LABELS = {
  /** CTA principal */
  ctaSupport: 'Soutenir ce producteur',
  /** CTA secondaire */
  ctaLearnMore: 'En savoir plus',
  /** Titre de section */
  sectionTitle: 'Soutien aux producteurs',
  /** Description */
  sectionDescription:
    'Contribuez à des projets concrets portés par des producteurs et partenaires engagés.',
  /** Mention légale courte */
  legalMention: 'Pas de rendement financier ni de remboursement garanti.',
  /** Montant contribué */
  contributedAmount: 'Montant contribué',
  /** Crédits reçus */
  creditsReceived: 'Credits Impact reçus',
  /** Reçu de contribution */
  receiptLabel: 'Reçu de contribution',
} as const

/**
 * Labels legacy (pour compatibilité pendant la transition).
 * [DEPRECIE] À éviter dans les nouvelles interfaces.
 */
export const INVESTMENT_LABELS_LEGACY = {
  ctaInvest: 'Investir dans ce projet',
  sectionTitle: 'Investissements',
  returnsLabel: 'Retours perçus',
} as const
