'use client'
import { ImpactKindIcon, IMPACT_KIND_COLOR } from '@/lib/impact-icons'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { getProjectImpactDisplay } from '@/app/[locale]/(tabs)/projects/_features/project-map-data'
import { formatCompact } from '@/lib/formatters'
import { sanitizeImageUrl } from '@/lib/image-url'
import { resolveLocationDisplay } from '@/lib/location'
import { getLocalizedContent } from '@/lib/utils'

export type LinkedProject = {
  id: string | null
  slug: string | null
  name_default: string | null
  name_i18n?: Record<string, string> | null
  hero_image_url: string | null
  current_funding: number | null
  address_city: string | null
  address_country_code: string | null
  type: string | null
  species: { id: string; name: string; icon: string | null }[] | null
}


interface SpeciesLinkedProjectsProps {
  projects: LinkedProject[]
}

export function SpeciesLinkedProjects({ projects }: SpeciesLinkedProjectsProps) {
  const locale = useLocale()
  if (projects.length === 0) return null

  const sectionLabel = projects.length === 1 ? 'Projet lié' : 'Projets liés'
  const firstProject = projects[0]

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        {sectionLabel}
      </p>
      {firstProject && projects.length === 1 ? (
        <SingleProjectCard project={firstProject} locale={locale} />
      ) : (
        <ProjectCarousel projects={projects} locale={locale} />
      )}
    </section>
  )
}

function SingleProjectCard({ project, locale }: { project: LinkedProject; locale: string }) {
  const impact = getProjectImpactDisplay({
    current_funding: project.current_funding,
    type: project.type,
  })
  const location = resolveLocationDisplay(
    project.address_country_code,
    project.address_city,
    locale,
  )
  const imageUrl = sanitizeImageUrl(project.hero_image_url)
  const name = getLocalizedContent(project.name_i18n, locale, project.name_default ?? 'Projet')

  return (
    <Link
      href={`/projects/${project.slug}`}
      className='block overflow-hidden rounded-3xl border border-white/8 bg-white/[0.045] transition-colors active:bg-white/[0.07]'
    >
      <div className='aspect-[16/9] w-full overflow-hidden bg-white/5'>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className='h-full w-full object-cover' loading='lazy' />
        ) : (
          <div className='h-full w-full bg-white/5' aria-hidden='true' />
        )}
      </div>
      <div className='px-4 py-3'>
        {location && (
          <p className='mb-1 text-[11px] text-white/40'>
            {location.flag} {location.label}
          </p>
        )}
        <p className='text-sm font-black leading-snug text-white/90'>{name}</p>
        <div className='mt-2 flex items-center gap-1.5'>
          <ImpactKindIcon
            kind={impact.kind}
            className={`h-3.5 w-3.5 shrink-0 ${IMPACT_KIND_COLOR[impact.kind]}`}
          />
          {impact.value > 0 ? (
            <p className='text-xs text-white/60'>
              <span className='font-black tabular-nums text-white/88'>
                {formatCompact(impact.value)}
              </span>{' '}
              {impact.label}
            </p>
          ) : (
            <p className='text-xs text-white/40'>{impact.label}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

function ProjectCarousel({ projects, locale }: { projects: LinkedProject[]; locale: string }) {
  return (
    <div className='flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
      {projects.map((project) => {
        const impact = getProjectImpactDisplay({
          current_funding: project.current_funding,
          type: project.type,
        })
        const imageUrl = sanitizeImageUrl(project.hero_image_url)
        const name = getLocalizedContent(
          project.name_i18n,
          locale,
          project.name_default ?? 'Projet',
        )
        return (
          <Link
            key={project.id ?? project.slug}
            href={`/projects/${project.slug}`}
            className='block w-[64vw] max-w-[220px] shrink-0 snap-start transition-transform active:scale-[0.98]'
          >
            <div className='aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5'>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className='h-full w-full object-cover'
                  loading='lazy'
                />
              ) : (
                <div className='h-full w-full bg-white/5' aria-hidden='true' />
              )}
            </div>
            <div className='mt-2 px-0.5'>
              <p className='line-clamp-2 text-[13px] font-black leading-tight text-white/90'>
                {name}
              </p>
              {impact.value > 0 ? (
                <div className='mt-1.5 flex items-center gap-1.5'>
                  <ImpactKindIcon
                    kind={impact.kind}
                    className={`h-3 w-3 shrink-0 ${IMPACT_KIND_COLOR[impact.kind]}`}
                  />
                  <p className='truncate text-[11px] text-white/55'>
                    <span className='font-black tabular-nums'>{formatCompact(impact.value)}</span>{' '}
                    {impact.label}
                  </p>
                </div>
              ) : null}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
