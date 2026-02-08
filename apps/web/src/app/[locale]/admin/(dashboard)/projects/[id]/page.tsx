import { db } from '@make-the-change/core/db'
import { projects } from '@make-the-change/core/schema'
import { eq } from 'drizzle-orm'
import { requireAdminPage } from '@/lib/auth-guards'

import { ProjectDetailController } from './components/project-detail-controller'
import type { ProjectFormData } from '@/lib/validators/project'

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params
  await requireAdminPage(locale)
  const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1)

  if (!project) {
    return <div className="p-8">Projet non trouvé</div>
  }

  const projectData: ProjectFormData & { id: string } = {
    id: project.id,
    name: project.name_default || '',
    slug: project.slug || '',
    type: project.type || 'beehive',
    target_budget: project.target_budget ?? 0,
    producer_id: project.producer_id || '',
    description: project.description_default || '',
    long_description: project.long_description_default || '',
    status: project.status || 'draft',
    featured: project.featured ?? false,
    images: Array.isArray(project.gallery_image_urls) ? project.gallery_image_urls : [],
    hero_image: project.hero_image_url || null,
    avatar_image: project.avatar_image_url || null,
    seo_title: project.seo_title || '',
    seo_description: project.seo_description || '',
    name_i18n: (project.name_i18n as Record<string, string>) || {},
    description_i18n: (project.description_i18n as Record<string, string>) || {},
    long_description_i18n: (project.long_description_i18n as Record<string, string>) || {},
    seo_title_i18n: (project.seo_title_i18n as Record<string, string>) || {},
    seo_description_i18n: (project.seo_description_i18n as Record<string, string>) || {},
  }

  return <ProjectDetailController projectData={projectData} />
}
