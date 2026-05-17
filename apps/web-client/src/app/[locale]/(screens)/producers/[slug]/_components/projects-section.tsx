'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Projets
 * 
 * Cards compactes avec:
 * - Micro-description
 * - Type de projet
 * - Localisation
 * 
 * Style éditorial, pas catalogue.
 */

import { Link } from '@/i18n/navigation'
import { Leaf, MapPin, TreePine, Waves } from 'lucide-react'
import { resolveLocationDisplay } from '@/lib/location'
import { getProjectImpactDisplay } from '@/lib/impact-calculator'
import { formatCompact } from '@/lib/formatters'
import type { ProducerProject } from '../producer-detail-data'

type ProjectsSectionProps = {
  projects: ProducerProject[]
  title?: string
  subtitle?: string
}

const IMPACT_ICONS: Record<string, typeof Leaf> = {
  beehive: Leaf,
  orchard: TreePine,
  reef: Waves,
}

export function ProjectsSection({ 
  projects, 
  title = "Les projets qu'ils portent",
  subtitle = "Des actions terrain liées à l'apiculture malgache"
}: ProjectsSectionProps) {
  if (projects.length === 0) return null

  return (
    <section className="mt-12">
      <div className="px-5">
        <h2 className="text-lg font-bold text-white/90">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[14px] text-white/50">
            {subtitle}
          </p>
        )}
      </div>
      
      <ul 
        className="mt-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 p-0 list-none"
        aria-label="Projets du partenaire"
      >
        {projects.map((project) => {
          const impact = getProjectImpactDisplay(project)
          const locationDisplay = project.address_country_code
            ? resolveLocationDisplay(project.address_country_code, project.address_city, 'fr')
            : null
          const ImpactIcon = impact?.kind ? IMPACT_ICONS[impact.kind] || Leaf : Leaf

          return (
            <li key={project.id} className="w-64 shrink-0 snap-start">
              <Link
                href={project.slug ? `/projects/${project.slug}` : '/projects'}
                className="group block text-left"
              >
                <article className="flex flex-col gap-3">
                  {/* Image - plus compacte */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5">
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
                  
                  {/* Contenu */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[16px] font-bold text-white leading-tight">
                      {project.name_default}
                    </h3>
                    
                    {locationDisplay && (
                      <p className="flex items-center gap-1 text-[13px] text-white/50">
                        <MapPin className="h-3.5 w-3.5" />
                        {locationDisplay.label}
                      </p>
                    )}
                    
                    {/* Impact */}
                    {impact && impact.value > 0 && (
                      <div className="mt-1 flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-${impact.kind === 'beehive' ? 'amber' : impact.kind === 'orchard' ? 'emerald' : 'sky'}-500/15`}>
                          <ImpactIcon className={`h-3 w-3 text-${impact.kind === 'beehive' ? 'amber' : impact.kind === 'orchard' ? 'emerald' : 'sky'}-400`} />
                        </div>
                        <p className="text-[13px] text-white/70">
                          <span className="font-bold text-white/90">{formatCompact(impact.value)}</span>
                          {' '}
                          <span className="text-white/50">{impact.label}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
