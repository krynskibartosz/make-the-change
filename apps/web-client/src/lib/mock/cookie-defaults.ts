export const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

export const mockCookieOptions = {
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: THIRTY_DAYS_IN_SECONDS,
}
