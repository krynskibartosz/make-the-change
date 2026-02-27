import { asString } from '@/lib/type-guards'

export const FALLBACK_PUBLIC_APP_URL = 'https://make-the-change-web-client.vercel.app'

export const getPublicAppUrl = () => {
  const candidate =
    asString(process.env.NEXT_PUBLIC_APP_URL).trim() ||
    asString(process.env.NEXT_PUBLIC_SITE_URL).trim() ||
    (asString(process.env.VERCEL_URL).trim()
      ? `https://${asString(process.env.VERCEL_URL).trim()}`
      : FALLBACK_PUBLIC_APP_URL)

  try {
    const url = new URL(candidate)
    return url.toString().replace(/\/$/, '')
  } catch {
    return FALLBACK_PUBLIC_APP_URL
  }
}

export const buildPublicAppUrl = (pathname: string) => {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return new URL(normalizedPath, `${getPublicAppUrl()}/`).toString()
}
