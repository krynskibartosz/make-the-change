'use client'

import { Info, Leaf, MapPin, TreeDeciduous, Truck, Waves } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import type { ImpactSummary } from '@/app/[locale]/(site)/producers/_features/mock-producers'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import { getProjectImpactDisplay } from '@/lib/impact-calculator'
import { resolveLocationDisplay } from '@/lib/location'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import type { ProducerProject } from '../producer-detail-data'
import { producerTypography as typo } from './producer-typography'

type ProjectsSectionProps = {
  projects: ProducerProject[]
  title?: string
  subtitle?: string
  impactSummary?: ImpactSummary
  producerName?: string
}

function HiveSilhouette({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C8.5 2 5.5 5 5.5 9.5H18.5C18.5 5 15.5 2 12 2ZM5 11H19V13.5H5ZM6.5 14.5H17.5V17H6.5ZM8 18H16V20.5H8Z" />
    </svg>
  )
}

function ImpactKindIcon({ kind, className }: { kind: string; className?: string }) {
  if (kind === 'orchard') return <TreeDeciduous className={className} />
  if (kind === 'reef') return <Waves className={className} />
  if (kind === 'equipment') return <Truck className={className} />
  return <HiveSilhouette className={className} />
}

function CarouselProjectCard({ project, locale }: { project: ProducerProject; locale: string }) {
  const impact = getProjectImpactDisplay(project)
  const locationDisplay = project.address_country_code
    ? resolveLocationDisplay(project.address_country_code, project.address_city, locale)
    : null

  return (
    <li className="w-56 shrink-0 snap-start">
      <Link
        href={project.slug ? `/projects/${project.slug}` : '/projects'}
        className="group block text-left"
      >
        <article className="flex flex-col gap-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-white/5">
            {project.hero_image_url ? (
              <img
                src={project.hero_image_url}
                alt={project.name_default || ''}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Leaf className="h-6 w-6 text-white/20" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className={`${typo.cardTitle} line-clamp-2`}>{project.name_default}</h3>

            {locationDisplay && (
              <p className={`flex items-center gap-1 ${typo.cardMeta}`}>
                <MapPin className="h-3 w-3 shrink-0" />
                {locationDisplay.label}
              </p>
            )}

            {impact && impact.value > 0 && (
              <div className="flex items-center gap-1.5">
                <ImpactKindIcon kind={impact.kind} className="h-3 w-3 shrink-0 text-white/50" />
                <p className="text-[13px] font-medium leading-snug text-white/66">
                  <span className="text-white/45">≈</span>{' '}
                  <span className="font-semibold text-white/80">
                    {formatCompact(impact.value)}
                  </span>{' '}
                  <span>{impact.label}</span>
                </p>
              </div>
            )}
          </div>
        </article>
      </Link>
    </li>
  )
}

function SingleProjectCard({ project, locale }: { project: ProducerProject; locale: string }) {
  const impact = getProjectImpactDisplay(project)
  const locationDisplay = project.address_country_code
    ? resolveLocationDisplay(project.address_country_code, project.address_city, locale)
    : null

  return (
    <div className="mt-4 px-4">
      <Link
        href={project.slug ? `/projects/${project.slug}` : '/projects'}
        className="group block text-left"
      >
        <article className="flex flex-col gap-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white/5">
            {project.hero_image_url ? (
              <img
                src={project.hero_image_url}
                alt={project.name_default || ''}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Leaf className="h-8 w-8 text-white/20" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h3 className={typo.cardTitleLarge}>{project.name_default}</h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {locationDisplay && (
                <p className={`flex items-center gap-1 ${typo.cardMeta}`}>
                  <MapPin className="h-3 w-3 shrink-0" />
                  {locationDisplay.label}
                </p>
              )}

              {impact && impact.value > 0 && (
                <div className="flex items-center gap-1.5">
                  <ImpactKindIcon kind={impact.kind} className="h-3 w-3 shrink-0 text-white/50" />
                  <p className="text-[13px] font-medium leading-snug text-white/66">
                    <span className="text-white/45">≈</span>{' '}
                    <span className="font-semibold text-white/80">
                      {formatCompact(impact.value)}
                    </span>{' '}
                    <span>{impact.label}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    </div>
  )
}

export function ProjectsSection({
  projects,
  title = "Les projets qu'ils portent",
  subtitle,
  impactSummary,
  producerName,
}: ProjectsSectionProps) {
  const locale = useLocale()
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  if (projects.length === 0) return null

  const projectCount = projects.length
  const countLabel = producerName
    ? `${projectCount} ${projectCount === 1 ? 'projet porté' : 'projets portés'} par ${producerName}`
    : `${projectCount} ${projectCount === 1 ? 'projet lié' : 'projets liés'} à ce partenaire`

  return (
    <>
      <section>
        <div className="px-4">
          <h2 className={typo.sectionTitle}>{title}</h2>
          {subtitle && <p className={`mt-1.5 ${typo.sectionSubtitle}`}>{subtitle}</p>}

          <div className="mt-2 flex flex-col gap-1">
            <p className="text-[13px] font-medium text-white/55">{countLabel}</p>
            {impactSummary?.estimate && (
              <div className="flex items-start gap-1.5">
                <p className="text-[13px] font-medium leading-snug text-white/55">
                  ≈{' '}
                  <span className="font-semibold text-amber-400/70">
                    {formatCompact(impactSummary.estimate)} {impactSummary.unit}
                  </span>{' '}
                  associées aux projets
                </p>
                <button
                  type="button"
                  onClick={() => setDisclaimerOpen(true)}
                  className="shrink-0 text-white/45 transition-colors hover:text-white/60"
                  aria-label="Méthode d'estimation"
                >
                  <Info className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {projects.length === 1 && projects[0] ? (
          <SingleProjectCard project={projects[0]} locale={locale} />
        ) : (
          <div className="relative mt-4">
            <ul
              className="flex snap-x gap-3 overflow-x-auto px-4 scroll-pl-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 list-none"
              aria-label="Projets du partenaire"
            >
              {projects.map((project) => (
                <CarouselProjectCard key={project.id} project={project} locale={locale} />
              ))}
            </ul>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0B0F15] to-transparent" />
          </div>
        )}
      </section>

      {impactSummary?.disclaimer && (
        <MobileSheet
          isOpen={disclaimerOpen}
          onClose={() => setDisclaimerOpen(false)}
          title="Méthode d'estimation"
        >
          <div className="pb-2">
            <p className={typo.modalBody}>{impactSummary.disclaimer}</p>
          </div>
        </MobileSheet>
      )}
    </>
  )
}
