import { requireProducerOrAdminPage } from '@/lib/auth-guards'
import PartnerDashboardClient from './dashboard-client'

export default async function PartnerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireProducerOrAdminPage(locale)
  return <PartnerDashboardClient />
}
