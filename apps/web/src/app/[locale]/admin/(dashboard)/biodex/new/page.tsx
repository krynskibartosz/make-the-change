import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { SpeciesForm } from '../components/species-form'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.biodex',
  })
  return {
    title: `${t('new_species')} | Admin`,
  }
}

export default async function NewSpeciesPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const t = await getTranslations('admin.biodex')

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('new_species')} backHref="/admin/biodex" />
      <SpeciesForm />
    </AdminPageContainer>
  )
}
