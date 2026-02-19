import type { Locale } from '@make-the-change/core/i18n'

const isLocale = (value: string): value is Locale =>
  value === 'fr' || value === 'en' || value === 'nl'

export function buildPartnerDashboardUrl(
  baseUrl: string | null | undefined,
  locale: Locale,
): string | null {
  if (!baseUrl || typeof baseUrl !== 'string') {
    return null
  }

  const normalizedBaseUrl = baseUrl.trim()
  if (!normalizedBaseUrl) {
    return null
  }

  try {
    const url = new URL(normalizedBaseUrl)
    const segments = url.pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    if (lastSegment && isLocale(lastSegment)) {
      segments.pop()
    }

    const basePath = segments.length > 0 ? `/${segments.join('/')}` : ''
    return `${url.origin}${basePath}/${locale}/partner/dashboard`
  } catch {
    return null
  }
}
