import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { getLocalizedContent } from '@/lib/utils'
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
  const locale = await getLocale()
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    return {}
  }

  const localizedTitle = getLocalizedContent(project.name_i18n, locale, project.name_default)
  const defaultDesc = project.description_default || project.long_description_default || ''
  const localizedLongDesc = getLocalizedContent(
    project.long_description_i18n,
    locale,
    project.long_description_default || '',
  )
  const localizedDesc = getLocalizedContent(
    project.description_i18n,
    locale,
    localizedLongDesc || defaultDesc,
  )

  return {
    title: localizedTitle,
    description: localizedDesc,
    openGraph: {
      title: localizedTitle,
      description: localizedDesc || undefined,
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
