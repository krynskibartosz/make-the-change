import { getProjectContext } from '@/app/[locale]/(screens)/projects/_api/project-context.service'
import { getLocalizedContent } from '@/lib/utils'
import { buildPublicAppUrl } from '@/lib/public-url'
import { ProjectQuickView } from './project-quick-view'
import { getRelatedProjectsByType, type PublicProject } from './project-detail-data'

type ProjectDetailsProps = {
  project: PublicProject
  locale: string
  includeStructuredData?: boolean
}

export async function ProjectDetails({
  project,
  locale,
  includeStructuredData = true,
}: ProjectDetailsProps) {
  const projectContext = project.is_mock ? null : await getProjectContext(project.slug)

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

  const producerName = project.producer
    ? getLocalizedContent(project.producer.name_i18n, locale, project.producer.name_default)
    : 'Make the Change'

  const relatedProjects = await getRelatedProjectsByType({
    type: project.type,
    excludeProjectId: project.id,
    excludeProjectSlug: project.slug,
    limit: 4,
  })
  const producerProducts = projectContext?.producer_products || project.producer_products || null

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
      : {
          '@type': 'Organization',
          name: 'Make the Change',
        },
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
      <ProjectQuickView
        project={project}
        mode="page"
        producerProducts={producerProducts}
        relatedProjects={relatedProjects.slice(0, 3)}
      />
      {includeStructuredData && <script type="application/ld+json">{structuredDataJson}</script>}
    </>
  )
}
