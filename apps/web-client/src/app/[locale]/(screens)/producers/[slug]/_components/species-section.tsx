'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Espèces — Option A: Premium éditoriale
 * 
 * Images beaucoup plus grandes, moins de zone vide.
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
  title = "Le vivant autour de leurs projets",
  subtitle = "Pollinisateurs et espèces associées aux milieux apicoles."
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
        className="mt-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 list-none"
        aria-label="Espèces liées au partenaire"
      >
        {species.map((entry) => (
          <li
            key={entry.id}
            className="w-36 shrink-0 snap-start"
          >
            <article className="flex flex-col gap-2">
              {/* Image — aspect moins haut pour réduire le vide autour de l'illustration */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-white/5">
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="h-full w-full object-contain"
                />
                {/* Badge "Découverte" uniquement si débloquée dans le BioDex */}
                {entry.unlocked && (
                  <div className="absolute bottom-2 left-2">
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-400 backdrop-blur-sm">
                      Découverte
                    </span>
                  </div>
                )}
              </div>

              {/* Nom — élément principal */}
              <p className="text-[14px] font-bold text-white leading-tight line-clamp-2">
                {entry.name}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
