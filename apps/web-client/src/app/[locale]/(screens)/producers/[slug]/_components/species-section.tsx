'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Espèces
 * 
 * Cards plus larges, moins denses.
 * Contexte éditorial: pourquoi ces espèces sont là.
 */

import type { ProducerSpecies } from '../producer-detail-data'

type SpeciesSectionProps = {
  species: ProducerSpecies[]
  title?: string
  subtitle?: string
}

export function SpeciesSection({ 
  species,
  title = "Espèces liées à leurs écosystèmes",
  subtitle = "Ces espèces vivent dans les environnements des projets apicoles"
}: SpeciesSectionProps) {
  if (species.length === 0) return null

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
        className="mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 p-0 list-none"
        aria-label="Espèces liées au partenaire"
      >
        {species.map((entry) => (
          <li
            key={entry.id}
            className="w-28 shrink-0 snap-start first:pl-0"
          >
            <article className="flex flex-col items-center gap-2">
              {/* Image compacte */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5 p-2">
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="h-full w-full object-contain"
                />
              </div>
              
              {/* Nom compact */}
              <div className="text-center">
                <p className="text-[13px] font-semibold text-white/90 leading-tight line-clamp-2">
                  {entry.name}
                </p>
                <p className={`mt-0.5 text-[9px] font-medium uppercase tracking-wide ${entry.unlocked ? 'text-emerald-500/70' : 'text-white/30'}`}>
                  {entry.unlocked ? 'Découvert' : 'À découvrir'}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
