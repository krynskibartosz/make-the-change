import { requireAdminPage } from '@/lib/auth-guards'
import ProjectsNewClient from './projects-new-client'

export default async function ProjectsNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  await requireAdminPage(locale)
  return <ProjectsNewClient />
}
