import { db } from '@make-the-change/core/db'
import { profiles } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import { requireAdminPage } from '@/lib/auth-guards'

import { UserEditClient } from './user-edit-client'

export default async function AdminUserEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  await requireAdminPage(locale)
  const [user] = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1)

  if (!user) {
    return <div className="p-8">Utilisateur non trouvé</div>
  }

  const userData = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    user_level: user.user_level ?? 'explorateur',
    kyc_status: user.kyc_status ?? 'pending',
    address_country_code: user.address_country_code,
  }

  return <UserEditClient initialUser={userData} />
}
