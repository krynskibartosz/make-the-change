/**
 * Utilitaires de date (Consensus 2026)
 * Permet d'encapsuler la création de dates pour éviter d'utiliser directement new Date()
 * et préparer le terrain pour la Temporal API ou des librairies immuables.
 */

import { formatISO } from 'date-fns'

/**
 * Retourne la date courante au format ISO 8601
 */
export function getCurrentIsoDate(): string {
  // Utilisation de date-fns pour garantir un formatage strict et immuable
  return formatISO(Date.now())
}

/**
 * Parse une chaîne ISO de manière sécurisée
 */
export function parseIsoDate(isoString: string): number {
  return Date.parse(isoString)
}
