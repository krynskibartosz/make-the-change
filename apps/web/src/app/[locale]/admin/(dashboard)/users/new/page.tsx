import { requireAdminPage } from '@/lib/auth-guards'
import UsersNewClient from './users-new-client'

export default async function UsersNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await requireAdminPage(locale)
  return <UsersNewClient />
}
