import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getLocalizedContent } from '@/lib/utils'
import { buildPublicAppUrl } from '@/lib/public-url'
import { getProjectContext } from '../_api/project-context.service'
import { getSpeciesForProject } from '../_api/project-species.service'
import { getPublicProjectBySlug, getRelatedProjectsByType } from './project-detail-data'
import { ProjectQuickView } from './project-quick-view'

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

  const [projectContext, species, relatedProjects] = await Promise.all([
    project.is_mock ? null : getProjectContext(project.slug),
    getSpeciesForProject(project.slug, project.id),
    getRelatedProjectsByType({
      type: project.type,
      excludeProjectId: project.id,
      excludeProjectSlug: project.slug,
      limit: 3,
    }),
  ])

  const producerProducts = projectContext?.producer_products ?? project.producer_products ?? null

  const localizedTitle = getLocalizedContent(project.name_i18n, locale, project.name_default)

  const coverImage =
    project.hero_image_url ||
    (Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : null)
  const producerImage =
    project.producer?.visualAssets?.portrait ??
    (project.producer?.images &&
    Array.isArray(project.producer.images) &&
    project.producer.images.length > 0
      ? project.producer.images[0]
      : null)

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

  const producerName = project.producer
    ? getLocalizedContent(project.producer.name_i18n, locale, project.producer.name_default)
    : 'Make the Change'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: localizedTitle,
    description: localizedDesc,
    image: coverImage ? [coverImage] : [],
    url: buildPublicAppUrl(`/projects/${project.slug}`),
    location:
      project.address_city || project.address_country_code
        ? {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: project.address_city,
              addressCountry: project.address_country_code,
            },
          }
        : undefined,
    organizer: project.producer
      ? {
          '@type': 'Organization',
          name: producerName,
          url: project.producer.contact_website,
          image: producerImage,
        }
      : { '@type': 'Organization', name: 'Make the Change' },
    startDate: project.launch_date,
    endDate: project.maturity_date,
    funding: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: project.target_budget,
    },
  }
  const structuredDataJson = JSON.stringify(structuredData).replace(/</g, '\\u003c')

  return (
    <>
      <FullScreenSlideModal
        title={localizedTitle}
        fallbackHref="/projects"
        headerMode="dynamic"
        asPage
      >
        <ProjectQuickView
          project={project}
          species={species}
          producerProducts={producerProducts}
          relatedProjects={relatedProjects}
        />
      </FullScreenSlideModal>
      <script type="application/ld+json">{structuredDataJson}</script>
    </>
  )
}
