/**
 * Adapters Producer Support — R5
 *
 * Ce fichier fournit des adapters pour convertir les structures legacy
 * (`NormalizedInvestment`, `MockInvestmentRecord`) vers le view-model cible
 * `ProducerSupportViewModel` sans modifier les types source.
 *
 * [CIBLE_VALIDEE] P0-1 : Soutien producteur = contribution économique sans
 * rendement ni propriété, distinct du don pur et de l'achat produit.
 *
 * [ACTUEL_CODE] + [LEGACY] Les types sources (`NormalizedInvestment`,
 * `MockInvestmentRecord`) restent inchangés pour compatibilité.
 *
 * [ADAPTERS] Ces fonctions permettent une migration progressive vers
 * `ProducerSupportViewModel` dans les nouveaux composants UI.
 */

import type { ProducerSupportViewModel } from './producer-support.mapper'

// ============================================================================
// Types Legacy (mirroir pour éviter imports circulaires)
// ============================================================================

/**
 * Mirroir de NormalizedInvestment depuis investments/page.tsx
 * [LEGACY_COMPAT] Type local utilisé pour normaliser les données Supabase/mock
 */
type NormalizedInvestmentLegacy = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  project: {
    name_default: string | null
    slug: string | null
    status: string | null
    cover_image_url?: string | null
  } | null
  type: 'investment'
}

/**
 * Mirroir de NormalizedDonation depuis investments/page.tsx
 * [LEGACY_COMPAT] Type local pour les donations
 */
type NormalizedDonationLegacy = {
  id: string
  amount_eur: number
  amount_points: number
  status: string
  created_at: string
  project: {
    name_default: string | null
    slug: string | null
    status: string | null
    cover_image_url?: string | null
  } | null
  type: 'donation'
}

/**
 * Mirroir de MockInvestmentRecord depuis mock-member-data.ts
 * [LEGACY_COMPAT] Structure mock pour les investissements
 */
type MockInvestmentRecordLegacy = {
  id: string
  amount_eur_equivalent: number
  amount_points: number
  returns_received_points: number
  status: 'active' | 'completed' | 'pending'
  created_at: string
  project: {
    name_default: string
    slug: string
    status: string
    cover_image_url: string | null
  }
}

// ============================================================================
// Classification des champs legacy
// ============================================================================

/**
 * [CLASSIFICATION_R5] Documentation des champs sensibles
 *
 * | Champ | Type source | Classification | Signification cible |
 * |-------|-------------|--------------|---------------------|
 * | `amount_points` | NormalizedInvestment | [CREDITS_IMPACT_CLAIR] | Montant en Credits Impact reçus |
 * | `amount_eur` | NormalizedInvestment | [EUR_CLAIR] | Montant en euros contribué |
 * | `amount_eur_equivalent` | MockInvestmentRecord | [EUR_CLAIR] | Montant en euros contribué |
 * | `returns_received_points` | MockInvestmentRecord | [AMBIGU_A_CLASSIFIER] | Historique "retours" - à clarifier |
 * | `type: 'investment'` | NormalizedInvestment | [LEGACY_COMPAT] | Identifier legacy, ne pas afficher |
 * | `type: 'donation'` | NormalizedDonation | [LEGACY_COMPAT] | Identifier legacy, ne pas afficher |
 * | `price_points` | Produit/Commande | [CREDITS_IMPACT_CLAIR] | Prix en Credits Impact |
 * | `total_points` | Commande | [CREDITS_IMPACT_CLAIR] | Total en Credits Impact |
 * | `monthly_points_allocation` | Subscription | [CREDITS_IMPACT_CLAIR] | Allocation mensuelle Credits Impact |
 * | `delta` | Transaction | [AMBIGU] | Variation (peut être Credits ou Graines) |
 * | `impactDelta` | Transaction | [CREDITS_IMPACT_CLAIR] | Impact en Credits Impact |
 */

// ============================================================================
// Adapters
// ============================================================================

/**
 * Adapte un NormalizedInvestment legacy vers ProducerSupportViewModel.
 *
 * [ADAPTER_R5] Conversion sans modification du type source.
 * Utilisé pour migrer progressivement les composants UI.
 *
 * @param record - Enregistrement normalisé depuis investments/page.tsx
 * @returns View-model cible pour affichage moderne
 *
 * @example
 * const support = adaptNormalizedInvestmentToProducerSupport(normalizedInv)
 * // support.contributionTypeLabel === "Soutien producteur"
 */
export function adaptNormalizedInvestmentToProducerSupport(
  record: NormalizedInvestmentLegacy,
): ProducerSupportViewModel {
  return {
    id: record.id,
    amountEuros: record.amount_eur,
    // P0-3 : amount_points → amountImpactCredits (Credits Impact)
    amountImpactCredits: record.amount_points,
    status: normalizeStatus(record.status),
    createdAt: record.created_at,
    project: {
      name: record.project?.name_default ?? 'Projet',
      slug: record.project?.slug ?? '',
      status: record.project?.status ?? 'unknown',
      coverImageUrl: record.project?.cover_image_url ?? null,
    },
    contributionTypeLabel: 'Soutien producteur',
    statusLabel: mapLegacyStatusToLabel(record.status),
  }
}

/**
 * Adapte un MockInvestmentRecord legacy vers ProducerSupportViewModel.
 *
 * [ADAPTER_R5] Conversion depuis la structure mock.
 * Alias de mapInvestmentToProducerSupport pour cohérence API.
 *
 * @param record - Enregistrement mock depuis mock-member-data.ts
 * @returns View-model cible pour affichage moderne
 */
export function adaptMockInvestmentToProducerSupport(
  record: MockInvestmentRecordLegacy,
): ProducerSupportViewModel {
  return {
    id: record.id,
    amountEuros: record.amount_eur_equivalent,
    // P0-3 : amount_points → amountImpactCredits (Credits Impact)
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
    statusLabel: mapLegacyStatusToLabel(record.status),
  }
}

/**
 * Adapte une NormalizedDonation legacy vers un view-model de don.
 *
 * [ADAPTER_R5] Le don pur n'est PAS un producer_support selon P0-1.
 * Cet adapter crée un view-model spécifique pour les donations.
 *
 * @param record - Enregistrement de donation normalisé
 * @returns View-model pour affichage de don
 */
export function adaptNormalizedDonationToViewModel(
  record: NormalizedDonationLegacy,
): {
  id: string
  amountEuros: number
  seedsReward: number
  status: 'active' | 'completed' | 'pending'
  createdAt: string
  project: {
    name: string
    slug: string
    status: string
    coverImageUrl: string | null
  }
  contributionTypeLabel: string
  statusLabel: string
} {
  return {
    id: record.id,
    amountEuros: record.amount_eur,
    // P0-1 : Don pur → Graines (pas Credits Impact)
    seedsReward: record.amount_points,
    status: normalizeStatus(record.status),
    createdAt: record.created_at,
    project: {
      name: record.project?.name_default ?? 'Projet',
      slug: record.project?.slug ?? '',
      status: record.project?.status ?? 'unknown',
      coverImageUrl: record.project?.cover_image_url ?? null,
    },
    // P0-1 : Don pur = contribution sans contrepartie économique directe
    contributionTypeLabel: 'Don',
    statusLabel: mapLegacyStatusToLabel(record.status),
  }
}

// ============================================================================
// Helpers internes
// ============================================================================

/**
 * Normalise un statut string vers le type union valide.
 */
function normalizeStatus(
  status: string,
): 'active' | 'completed' | 'pending' {
  if (status === 'active' || status === 'completed' || status === 'pending') {
    return status
  }
  return 'pending'
}

/**
 * Mappe un statut legacy vers un label UI.
 */
function mapLegacyStatusToLabel(
  status: string,
): string {
  const labels: Record<string, string> = {
    active: 'En cours',
    completed: 'Terminé',
    pending: 'En attente',
    paid: 'Payé',
    delivered: 'Livré',
    processing: 'En cours',
  }
  return labels[status] ?? status
}

// ============================================================================
// Arrays Adapters (pour listes)
// ============================================================================

/**
 * Adapte une liste de NormalizedInvestment vers ProducerSupportViewModel[].
 */
export function adaptNormalizedInvestmentsToProducerSupports(
  records: NormalizedInvestmentLegacy[],
): ProducerSupportViewModel[] {
  return records.map(adaptNormalizedInvestmentToProducerSupport)
}

/**
 * Adapte une liste de MockInvestmentRecord vers ProducerSupportViewModel[].
 */
export function adaptMockInvestmentsToProducerSupports(
  records: MockInvestmentRecordLegacy[],
): ProducerSupportViewModel[] {
  return records.map(adaptMockInvestmentToProducerSupport)
}

// ============================================================================
// Re-export pour compatibilité
// ============================================================================

export type { NormalizedInvestmentLegacy, MockInvestmentRecordLegacy }

// Re-export du view-model cible depuis le mapper original
export type { ProducerSupportViewModel } from './producer-support.mapper'
