import { db } from '@make-the-change/core/db'
import { categories } from '@make-the-change/core/schema'
import { asc, isNull } from 'drizzle-orm'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { CategoryForm } from '../components/category-form'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.categories',
  })
  return {
    title: `${t('new_category')} | Admin`,
  }
}

export default async function NewCategoryPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const t = await getTranslations('admin.categories')

  // Fetch only root categories as potential parents for now (2 levels max usually)
  const parentCategories = await db.query.categories.findMany({
    where: isNull(categories.parent_id),
    orderBy: asc(categories.name_default),
    columns: {
        id: true,
        name_default: true
    }
  })

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('new_category')} backHref="/admin/categories" />
      <CategoryForm 
        parents={parentCategories.map(c => ({ id: c.id, name: c.name_default || 'Sans nom' }))} 
      />
    </AdminPageContainer>
  )
}
