import { ConservationStatus } from './types'

export const CONSERVATION_STATUS_CONFIG: Record<
  ConservationStatus,
  { label: string; color: string; bg: string }
> = {
  NE: { label: 'Non évalué', color: 'text-gray-600', bg: 'bg-gray-100' },
  DD: { label: 'Données insuffisantes', color: 'text-gray-600', bg: 'bg-gray-100' },
  LC: { label: 'Préoccupation mineure', color: 'text-green-700', bg: 'bg-green-100' },
  NT: { label: 'Quasi menacé', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  VU: { label: 'Vulnérable', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  EN: { label: 'En danger', color: 'text-orange-700', bg: 'bg-orange-100' },
  CR: { label: 'En danger critique', color: 'text-red-700', bg: 'bg-red-100' },
  EW: { label: 'Éteint à l\'état sauvage', color: 'text-purple-700', bg: 'bg-purple-100' },
  EX: { label: 'Éteint', color: 'text-black', bg: 'bg-gray-200' },
}

export function getStatusConfig(status: string | null) {
  if (!status || !CONSERVATION_STATUS_CONFIG[status as ConservationStatus]) {
    return CONSERVATION_STATUS_CONFIG.NE
  }
  return CONSERVATION_STATUS_CONFIG[status as ConservationStatus]
}

export function getLocalizedContent(
  content: Record<string, string> | null,
  locale: string,
  fallback = ''
): string {
  if (!content) return fallback
  return content[locale] || content['fr'] || content['en'] || fallback
}
