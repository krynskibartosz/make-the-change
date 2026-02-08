import { db } from '@make-the-change/core/db'
import { blog_categories, blog_authors, projects } from '@make-the-change/core/schema'
import { asc } from 'drizzle-orm'
import { getTranslations } from 'next-intl/server'
import { requireAdminPage } from '@/lib/auth-guards'
import { BlogPostForm } from '../components/blog-post-form'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.blog',
  })
  return {
    title: `${t('new_post')} | Admin`,
  }
}

export default async function NewBlogPostPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  await requireAdminPage(locale)
  const t = await getTranslations('admin.blog')

  // Fetch relations
  const [authors, categories, projectList] = await Promise.all([
    db.query.blog_authors.findMany({ orderBy: asc(blog_authors.name) }),
    db.query.blog_categories.findMany({ orderBy: asc(blog_categories.name) }),
    db.query.projects.findMany({ columns: { id: true, name_default: true } }) // Assuming name_default exists on projects
  ])

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('new_post')} backHref="/admin/blog" />
      <BlogPostForm 
        authors={authors.map(a => ({ id: a.id, name: a.name }))}
        categories={categories.map(c => ({ id: c.id, name: c.name }))}
        projects={projectList.map(p => ({ id: p.id, name: p.name_default || 'Sans nom' }))}
      />
    </AdminPageContainer>
  )
}
