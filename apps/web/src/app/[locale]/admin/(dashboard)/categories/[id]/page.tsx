import { db } from '@make-the-change/core/db'
import { categories } from '@make-the-change/core/schema'
import { asc, eq, isNull, ne } from 'drizzle-orm'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/auth-guards'
import { CategoryForm } from '../components/category-form'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'

export async function generateMetadata(props: { params: Promise<{ locale: string; id: string }> }) {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.categories',
  })
  return {
    title: `${t('edit_category')} | Admin`,
  }
}

export default async function EditCategoryPage(props: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await props.params
  await requireAdminPage(locale)
  const t = await getTranslations('admin.categories')

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, id),
  })

  if (!category) {
    notFound()
  }

  // Fetch parents (excluding self)
  const parentCategories = await db.query.categories.findMany({
    where: and(isNull(categories.parent_id), ne(categories.id, id)),
    orderBy: asc(categories.name_default),
    columns: {
        id: true,
        name_default: true
    }
  })

  // Adapt data for form
  const formData = {
    ...category,
    slug: category.slug || '',
    name_i18n: category.name_i18n as any,
    description_i18n: category.description_i18n as any,
    metadata: category.metadata as any,
    seo_title: category.seo_title || undefined,
    seo_description: category.seo_description || undefined,
    parent_id: category.parent_id || null,
    is_active: category.is_active ?? true,
    sort_order: category.sort_order || 0,
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('edit_category')} backHref="/admin/categories" />
      <CategoryForm 
        initialData={formData}
        parents={parentCategories.map(c => ({ id: c.id, name: c.name_default || 'Sans nom' }))} 
      />
    </AdminPageContainer>
  )
}

// Helper needed because 'and' was used but not imported
import { and } from 'drizzle-orm'
