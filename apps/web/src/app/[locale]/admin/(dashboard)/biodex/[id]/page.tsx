import { db } from '@make-the-change/core/db'
import { species } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/auth-guards'
import { SpeciesForm } from '../components/species-form'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'
import { type SpeciesAdminFormData } from '@/lib/validators/species'

export async function generateMetadata(props: { params: Promise<{ locale: string; id: string }> }) {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.biodex',
  })
  return {
    title: `${t('edit_species')} | Admin`,
  }
}

export default async function EditSpeciesPage(props: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await props.params
  await requireAdminPage(locale)
  const t = await getTranslations('admin.biodex')

  const speciesData = await db.query.species.findFirst({
    where: eq(species.id, id),
  })

  if (!speciesData) {
    notFound()
  }

  // Adapt data for form
  const formData: SpeciesAdminFormData & { id: string } = {
    id: speciesData.id,
    scientific_name: speciesData.scientific_name || '',
    name_i18n: speciesData.name_i18n as { fr: string; en: string; nl?: string },
    description_i18n: speciesData.description_i18n as { fr?: string; en?: string; nl?: string } | undefined,
    habitat_i18n: speciesData.habitat_i18n as { fr?: string; en?: string; nl?: string } | undefined,
    content_levels: speciesData.content_levels as any,
    conservation_status: speciesData.conservation_status as any,
    is_featured: speciesData.is_featured,
    is_endemic: speciesData.is_endemic,
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('edit_species')} backHref="/admin/biodex" />
      <SpeciesForm initialData={formData} />
    </AdminPageContainer>
  )
}
