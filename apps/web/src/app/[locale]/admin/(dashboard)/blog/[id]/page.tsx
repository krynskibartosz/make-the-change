import { db } from '@make-the-change/core/db'
import { blogPosts, blogCategories, blogAuthors, projects } from '@make-the-change/core/schema'
import { asc, eq } from 'drizzle-orm'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { requireAdminPage } from '@/lib/auth-guards'
import { BlogPostForm } from '../components/blog-post-form'
import { AdminPageContainer } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-container'
import { AdminPageHeader } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-page-header'

export async function generateMetadata(props: { params: Promise<{ locale: string; id: string }> }) {
  const t = await getTranslations({
    locale: (await props.params).locale,
    namespace: 'admin.blog',
  })
  return {
    title: `${t('edit_post')} | Admin`,
  }
}

export default async function EditBlogPostPage(props: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await props.params
  await requireAdminPage(locale)
  const t = await getTranslations('admin.blog')

  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, id),
  })

  if (!post) {
    notFound()
  }

  // Fetch relations
  const [authors, categories, projectList] = await Promise.all([
    db.query.blogAuthors.findMany({ orderBy: asc(blogAuthors.name) }),
    db.query.blogCategories.findMany({ orderBy: asc(blogCategories.name) }),
    db.query.projects.findMany({ columns: { id: true, name_default: true } })
  ])

  const formData = {
    ...post,
    status: post.status as 'draft' | 'published' | 'archived',
    excerpt: post.excerpt || undefined,
    content: post.content || undefined,
    cover_image: post.cover_image || undefined,
    seo_title: post.seo_title || undefined,
    seo_description: post.seo_description || undefined,
    author_id: post.author_id || null,
    category_id: post.category_id || null,
    project_id: post.project_id || null,
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader title={t('edit_post')} backHref="/admin/blog" />
      <BlogPostForm 
        initialData={formData}
        authors={authors.map(a => ({ id: a.id, name: a.name || 'Sans nom' }))}
        categories={categories.map(c => ({ id: c.id, name: c.name }))}
        projects={projectList.map(p => ({ id: p.id, name: p.name_default || 'Sans nom' }))}
      />
    </AdminPageContainer>
  )
}
