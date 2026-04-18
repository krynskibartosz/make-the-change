import { connection } from 'next/server'
import { getLocale } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { isMockDataSource } from '@/lib/mock/data-source'
import { sanitizeReturnTo } from '@/lib/mock/mock-session'
import { getCurrentViewer } from '@/lib/mock/mock-session-server'
import { SetupCarousel } from './_features/setup-carousel'

type SetupPageProps = {
  searchParams: Promise<{
    returnTo?: string
  }>
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  await connection()

  if (!isMockDataSource) {
    const locale = await getLocale()
    redirect({ href: '/dashboard/profile', locale })
  }

  const viewer = await getCurrentViewer()
  const locale = await getLocale()
  const resolvedSearchParams = await searchParams
  const returnTo = sanitizeReturnTo(resolvedSearchParams.returnTo || '', '/defis')

  if (!viewer) {
    redirect({ href: `/login?returnTo=${encodeURIComponent(returnTo)}`, locale })
  }

  const resolvedViewer = viewer as NonNullable<typeof viewer>

  if (resolvedViewer.faction) {
    redirect({ href: returnTo, locale })
  }

  return <SetupCarousel returnTo={returnTo} />
}
