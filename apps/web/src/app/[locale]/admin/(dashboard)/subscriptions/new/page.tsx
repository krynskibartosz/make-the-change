import { requireAdminPage } from '@/lib/auth-guards'
import SubscriptionsNewClient from './subscriptions-new-client'

export default async function SubscriptionsNewPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAdminPage(locale)
  return <SubscriptionsNewClient />
}
