import type { PropsWithChildren } from 'react'
import { requireAdminWithRedirect } from '@/app/[locale]/(auth)/_features/auth-guards'

export default async function AdminLayout({ children }: PropsWithChildren) {
  await requireAdminWithRedirect()
  return children
}
