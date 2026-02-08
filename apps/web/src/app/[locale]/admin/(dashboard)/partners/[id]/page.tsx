import { db } from '@make-the-change/core/db'
import { producers } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import { requireAdminPage } from '@/lib/auth-guards'

import { PartnerEditClient } from './partner-edit-client'

export default async function AdminPartnerEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  await requireAdminPage(locale)
  const [partner] = await db.select().from(producers).where(eq(producers.id, id)).limit(1)

  if (!partner) {
    return <div className="p-8">Partenaire non trouvé</div>
  }

  const partnerData = {
    id: partner.id,
    name: partner.name_default || 'Unknown Business',
    slug: partner.slug || '',
    description: partner.description_default || '',
    contact_website: partner.contact_website || '',
    contact_email: partner.contact_email || '',
    status: partner.status || 'pending',
  }

  return <PartnerEditClient initialPartner={partnerData} />
}
