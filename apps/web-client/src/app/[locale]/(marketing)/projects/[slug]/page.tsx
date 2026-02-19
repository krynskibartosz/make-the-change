import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicProjectBySlug } from './project-detail-data'
import { ProjectDetails } from './project-details'

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    return {}
  }

  return {
    title: project.name_default,
    description: project.description_default,
    openGraph: {
      title: project.name_default,
      description: project.description_default || undefined,
      images: project.hero_image_url ? [project.hero_image_url] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug, locale } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetails project={project} locale={locale} />
}
