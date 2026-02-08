import { db } from '@make-the-change/core/db'
import { producers } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { requireProducer, requireProducerOrAdminPage } from '@/lib/auth-guards'
import { ProfileForm } from './profile-form'

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const params = await props.params
  const t = await getTranslations({ locale: params.locale, namespace: 'partner.profile' })
  return { title: `${t('title')} | Partner` }
}

export default async function PartnerProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireProducerOrAdminPage(locale)
  const { producer, user } = await requireProducer()

  if (!producer) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Profil producteur non configuré</h1>
        <p className="text-muted-foreground">
          Votre compte n'est pas encore associé à un profil producteur.
        </p>
      </div>
    )
  }

  // Get full producer data
  const [producerData] = await db
    .select()
    .from(producers)
    .where(eq(producers.id, producer.id))
    .limit(1)

  if (!producerData) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold mb-2">Profil introuvable</h1>
      </div>
    )
  }

  const profileData = {
    id: producerData.id,
    name: producerData.name_default || '',
    description: producerData.description_default || '',
    website: producerData.contact_website || '',
    contact_email: producerData.contact_email || '',
    location: producerData.location || '',
    status: producerData.status || 'pending',
  }

  return <ProfileForm initialData={profileData} userEmail={user.email || ''} />
}
