import { requireAdminPage } from '@/lib/auth-guards'
import PartnersNewClient from './partners-new-client'

export default async function PartnersNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await requireAdminPage(locale)
  return <PartnersNewClient />
}
