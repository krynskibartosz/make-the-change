'use client'
import { ChevronRight, Leaf, TreePine, Waves } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import {
  getProducerAggregatedImpact,
  type ImpactKind,
} from '@/lib/impact-calculator'
import {
  getProjectImpactDisplay,
  type ProjectMapImpactKind,
} from '@/app/[locale]/(tabs)/projects/_features/project-map-data'
import { resolveLocationDisplay } from '@/lib/location'
import { sanitizeImageUrl } from '@/lib/image-url'
import { getLocalizedContent } from '@/lib/utils'
import type { LinkedProject } from './species-linked-projects'
import type { SpeciesLinkedPartnerData } from './species-linked-partners'

const IMPACT_ICON_COLOR: Record<ImpactKind, string> = {
  beehive: 'text-amber-300',
  orchard: 'text-emerald-300',
  reef: 'text-sky-300',
}

function ImpactIcon({ kind, className }: { kind: ProjectMapImpactKind; className?: string }) {
  if (kind === 'orchard') return <TreePine className={className} aria-hidden='true' />
  if (kind === 'reef') return <Waves className={className} aria-hidden='true' />
  return <Leaf className={className} aria-hidden='true' />
}


function CarouselProjectCard({ project, locale }: { project: LinkedProject; locale: string }) {
  const impact = getProjectImpactDisplay({ current_funding: project.current_funding, type: project.type })
  const imageUrl = sanitizeImageUrl(project.hero_image_url)
  const name = getLocalizedContent(project.name_i18n, locale, project.name_default ?? 'Projet')

  return (
    <Link
      href={`/projects/${project.slug}`}
      className='block w-[64vw] max-w-[220px] shrink-0 snap-start transition-transform active:scale-[0.98]'
    >
      <div className='aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5'>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className='h-full w-full object-cover' loading='lazy' />
        ) : (
          <div className='h-full w-full bg-white/5' aria-hidden='true' />
        )}
      </div>
      <div className='mt-2 px-0.5'>
        <p className='line-clamp-2 text-[13px] font-black leading-tight text-white/90'>{name}</p>
        {impact.value > 0 && (
          <div className='mt-1.5 flex items-center gap-1.5'>
            <ImpactIcon
              kind={impact.kind}
              className={`h-3 w-3 shrink-0 ${IMPACT_ICON_COLOR[impact.kind]}`}
            />
            <p className='truncate text-[11px] text-white/55'>
              <span className='font-black tabular-nums'>{formatCompact(impact.value)}</span>{' '}
              {impact.label}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
}

function PartnerRow({ partner, locale }: { partner: SpeciesLinkedPartnerData; locale: string }) {
  const location = resolveLocationDisplay(partner.addressCountryCode, partner.addressCity, locale)
  const imageUrl = sanitizeImageUrl(partner.imageUrl)

  return (
    <Link
      href={`/producers/${partner.slug}`}
      className='flex gap-4 py-4 transition-opacity active:opacity-60'
    >
      <div className='h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/5'>
        {imageUrl ? (
          <img src={imageUrl} alt={partner.name} className='h-full w-full object-cover' loading='lazy' />
        ) : (
          <div className='h-full w-full bg-white/5' aria-hidden='true' />
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <p className='text-[15px] font-semibold leading-tight text-white'>{partner.name}</p>
          <ChevronRight className='mt-0.5 h-4 w-4 shrink-0 text-white/28' aria-hidden='true' />
        </div>
        {location && (
          <p className='mt-0.5 text-[11px] font-bold uppercase tracking-wider text-white/32'>
            {location.flag} {location.label}
          </p>
        )}
        {partner.tagline && (
          <p className='mt-1 text-[13px] font-medium leading-snug text-white/50'>{partner.tagline}</p>
        )}
      </div>
    </Link>
  )
}

interface SpeciesProjectsZoneProps {
  linkedProjects: LinkedProject[]
  linkedPartners: SpeciesLinkedPartnerData[]
}

export function SpeciesProjectsZone({ linkedProjects, linkedPartners }: SpeciesProjectsZoneProps) {
  const locale = useLocale()

  if (linkedProjects.length === 0 && linkedPartners.length === 0) return null

  const impactStats = getProducerAggregatedImpact(
    linkedProjects.map((p) => ({ current_funding: p.current_funding, type: p.type })),
  )
  const hasStats = impactStats.length > 0

  const projectsLabel = linkedProjects.length === 1 ? 'Projet lié' : 'Projets liés'
  const partnersLabel = linkedPartners.length === 1 ? 'Partenaire associé' : 'Partenaires associés'

  return (
    <section className='mx-5 space-y-4'>
      <p className='text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Liens avec les projets
      </p>

      {/* Intro + stats inline */}
      <div>
        <p className='text-[12px] leading-relaxed text-white/40'>
          {linkedProjects.length === 1
            ? 'Cette espèce est liée à 1 projet Make the Change.'
            : `Cette espèce est liée à ${linkedProjects.length} projets Make the Change.`}
          {hasStats && " Ces liens aident à comprendre son rôle dans l'écosystème, sans constituer une preuve de protection."}
        </p>

        {hasStats && (
          <div className='mt-3 flex flex-wrap gap-x-5 gap-y-2.5'>
            {impactStats.map((stat) => (
              <div key={stat.kind}>
                <p className='text-lg font-black tabular-nums text-white/90'>
                  ≈ {formatCompact(stat.value)}
                </p>
                <p className='text-[11px] capitalize text-white/40'>{stat.label}</p>
              </div>
            ))}
            {linkedProjects.length > 0 && (
              <div>
                <p className='text-lg font-black tabular-nums text-white/90'>{linkedProjects.length}</p>
                <p className='text-[11px] text-white/40'>{projectsLabel}</p>
              </div>
            )}
            {linkedPartners.length > 0 && (
              <div>
                <p className='text-lg font-black tabular-nums text-white/90'>{linkedPartners.length}</p>
                <p className='text-[11px] text-white/40'>{partnersLabel}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project carousel */}
      {linkedProjects.length > 0 && (
        <div className='relative'>
          <div className='flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {linkedProjects.map((project) => (
              <CarouselProjectCard key={project.id ?? project.slug} project={project} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Partners */}
      {linkedPartners.length > 0 && (
        <ul className='m-0 list-none divide-y divide-white/[0.07] p-0'>
          {linkedPartners.map((partner) => (
            <li key={partner.slug}>
              <PartnerRow partner={partner} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
