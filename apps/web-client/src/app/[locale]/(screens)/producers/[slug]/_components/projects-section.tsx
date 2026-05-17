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
    <section className="mt-10">
      <div className="px-4">
        <h2 className="text-[17px] font-bold text-white/80">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[13px] text-white/50">
            {subtitle}
          </p>
        )}
      </div>
      
      <ul 
        className="mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 list-none"
        aria-label="Projets du partenaire"
      >
        {projects.map((project) => {
          const impact = getProjectImpactDisplay(project)
          const locationDisplay = project.address_country_code
            ? resolveLocationDisplay(project.address_country_code, project.address_city, 'fr')
            : null
          const ImpactIcon = impact?.kind ? IMPACT_ICONS[impact.kind] || Leaf : Leaf

          return (
            <li key={project.id} className="w-56 shrink-0 snap-start">
              <Link
                href={project.slug ? `/projects/${project.slug}` : '/projects'}
                className="group block text-left"
              >
                <article className="flex flex-col gap-2">
                  {/* Image - plus compacte */}
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
                  
                  {/* Contenu compact */}
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[15px] font-bold text-white leading-tight line-clamp-2">
                      {project.name_default}
                    </h3>
                    
                    {locationDisplay && (
                      <p className="flex items-center gap-1 text-[12px] text-white/50">
                        <MapPin className="h-3 w-3" />
                        {locationDisplay.label}
                      </p>
                    )}
                    
                    {/* Impact compact */}
                    {impact && impact.value > 0 && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <ImpactIcon className="h-3 w-3 text-white/40" />
                        <p className="text-[12px] text-white/60">
                          <span className="font-semibold text-white/80">{formatCompact(impact.value)}</span>
                          {' '}
                          <span>{impact.label}</span>
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
