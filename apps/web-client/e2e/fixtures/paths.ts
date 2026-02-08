export const defaultLocale = process.env.E2E_LOCALE || 'fr'

export const authStoragePath = 'playwright/.auth/user.json'

export const withLocale = (path: string, locale: string = defaultLocale): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`

  if (normalized === '/') return `/${locale}`

  if (normalized === `/${locale}` || normalized.startsWith(`/${locale}/`)) {
    return normalized
  }

  return `/${locale}${normalized}`
}
