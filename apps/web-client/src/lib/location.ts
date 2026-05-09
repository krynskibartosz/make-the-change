const FRENCH_TO_ISO: Record<string, string> = {
  'madagascar': 'MG', 'france': 'FR', 'belgique': 'BE', 'italie': 'IT',
  'espagne': 'ES', 'indonésie': 'ID', 'indonesie': 'ID', 'portugal': 'PT',
  'allemagne': 'DE', 'maroc': 'MA', 'sénégal': 'SN', 'senegal': 'SN',
  'kenya': 'KE', 'afrique du sud': 'ZA', 'brésil': 'BR', 'bresil': 'BR',
  'mexique': 'MX', 'inde': 'IN', 'chine': 'CN', 'japon': 'JP',
  'australie': 'AU', 'canada': 'CA', 'états-unis': 'US', 'etats-unis': 'US',
  'royaume-uni': 'GB', 'suisse': 'CH', 'pays-bas': 'NL',
  'grèce': 'GR', 'grece': 'GR',
}

export function resolveCountryCode(code: string): string | null {
  const trimmed = code.trim()
  if (/^[A-Z]{2}$/i.test(trimmed)) return trimmed.toUpperCase()
  return FRENCH_TO_ISO[trimmed.toLowerCase()] ?? null
}

export function getCountryFlag(iso: string): string {
  return [...iso.toUpperCase()].map(c => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0))).join('')
}

export function getCountryDisplayName(iso: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' }).of(iso) ?? iso
  } catch {
    return iso
  }
}

export function resolveLocationDisplay(
  code: string | null,
  city: string | null,
  locale: string,
): { flag: string; label: string } | null {
  if (!code) return null
  const iso = resolveCountryCode(code)
  if (!iso) return null
  const flag = getCountryFlag(iso)
  const countryName = getCountryDisplayName(iso, locale)
  const label = city ? `${countryName} · ${city}` : countryName
  return { flag, label }
}
