import { ConservationStatus } from './types'

export const CONSERVATION_STATUS_CONFIG: Record<
  ConservationStatus,
  { label: string; color: string; bg: string }
> = {
  NE: { label: 'Non évalué', color: 'text-client-gray-600', bg: 'bg-client-gray-100' },
  DD: { label: 'Données insuffisantes', color: 'text-client-gray-600', bg: 'bg-client-gray-100' },
  LC: { label: 'Préoccupation mineure', color: 'text-client-green-700', bg: 'bg-client-green-100' },
  NT: { label: 'Quasi menacé', color: 'text-client-emerald-700', bg: 'bg-client-emerald-100' },
  VU: { label: 'Vulnérable', color: 'text-client-yellow-700', bg: 'bg-client-yellow-100' },
  EN: { label: 'En danger', color: 'text-client-orange-700', bg: 'bg-client-orange-100' },
  CR: { label: 'En danger critique', color: 'text-client-red-700', bg: 'bg-client-red-100' },
  EW: { label: 'Éteint à l\'état sauvage', color: 'text-client-purple-700', bg: 'bg-client-purple-100' },
  EX: { label: 'Éteint', color: 'text-client-black', bg: 'bg-client-gray-200' },
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
