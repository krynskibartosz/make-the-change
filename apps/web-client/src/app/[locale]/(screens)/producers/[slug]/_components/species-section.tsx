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
        className="mt-5 flex snap-x gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 p-0 list-none"
        aria-label="Espèces liées au partenaire"
      >
        {species.map((entry) => (
          <li
            key={entry.id}
            className="w-32 shrink-0 snap-center"
          >
            <article className="flex flex-col items-center gap-3">
              {/* Image plus grande */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/5 p-3">
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="h-full w-full object-contain"
                />
              </div>
              
              {/* Nom */}
              <div className="text-center">
                <p className="text-[14px] font-semibold text-white/90 leading-snug">
                  {entry.name}
                </p>
                <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${entry.unlocked ? 'text-emerald-500/70' : 'text-white/30'}`}>
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
