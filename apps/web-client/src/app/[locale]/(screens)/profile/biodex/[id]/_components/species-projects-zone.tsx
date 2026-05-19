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

function SingleProjectCard({ project, locale }: { project: LinkedProject; locale: string }) {
  const impact = getProjectImpactDisplay({ current_funding: project.current_funding, type: project.type })
  const location = resolveLocationDisplay(project.address_country_code, project.address_city, locale)
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
        {impact.value > 0 && (
          <div className='mt-2 flex items-center gap-1.5'>
            <ImpactIcon
              kind={impact.kind}
              className={`h-3.5 w-3.5 shrink-0 ${IMPACT_ICON_COLOR[impact.kind]}`}
            />
            <p className='text-xs text-white/55'>
              <span className='font-black tabular-nums text-white/85'>{formatCompact(impact.value)}</span>{' '}
              {impact.label}
            </p>
          </div>
        )}
      </div>
    </Link>
  )
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
      className='flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2.5 transition-colors active:bg-white/[0.07]'
    >
      <div className='h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/5'>
        {imageUrl ? (
          <img src={imageUrl} alt={partner.name} className='h-full w-full object-cover' loading='lazy' />
        ) : (
          <div className='h-full w-full bg-white/5' aria-hidden='true' />
        )}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-black text-white/85'>{partner.name}</p>
        {location && (
          <p className='text-[11px] text-white/35'>
            {location.flag} {location.label}
          </p>
        )}
      </div>
      <ChevronRight className='h-4 w-4 shrink-0 text-white/20' aria-hidden='true' />
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

  const firstProject = linkedProjects[0]
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
            ? "Cette espèce apparaît dans 1 projet documenté dans l'app."
            : `Cette espèce apparaît dans ${linkedProjects.length} projets documentés dans l'app.`}
          {hasStats && " Les estimations ci-dessous sont liées aux projets, pas une preuve que l'espèce est protégée."}
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
      {linkedProjects.length === 1 && firstProject ? (
        <SingleProjectCard project={firstProject} locale={locale} />
      ) : linkedProjects.length > 1 ? (
        <div className='relative'>
          <div className='flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {linkedProjects.map((project) => (
              <CarouselProjectCard key={project.id ?? project.slug} project={project} locale={locale} />
            ))}
          </div>
          <div className='pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0B0F15] to-transparent' />
        </div>
      ) : null}

      {/* Partners */}
      {linkedPartners.length > 0 && (
        <div className='space-y-2'>
          {linkedPartners.map((partner) => (
            <PartnerRow key={partner.slug} partner={partner} locale={locale} />
          ))}
        </div>
      )}
    </section>
  )
}
