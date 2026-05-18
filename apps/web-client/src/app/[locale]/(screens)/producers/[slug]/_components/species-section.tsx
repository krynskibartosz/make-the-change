'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Espèces — Option A: Premium éditoriale
 * 
 * Images beaucoup plus grandes, moins de zone vide.
 * Contexte éditorial: pourquoi ces espèces sont là.
 */

import type { ProducerSpecies } from '../producer-detail-data'

function getRarityColor(rarity: string) {
  const r = rarity?.toUpperCase()
  if (r === 'LÉGENDAIRE') return 'text-amber-400/80'
  if (r === 'RARE') return 'text-blue-400/70'
  return 'text-emerald-500/60'
}

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
        className="mt-4 flex snap-x gap-4 overflow-x-auto px-4 scroll-pl-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 list-none"
        aria-label="Espèces liées au partenaire"
      >
        {species.map((entry) => (
          <li
            key={entry.id}
            className="w-36 shrink-0 snap-start"
          >
            <article className="flex flex-col gap-2">
              {/* Image — scale-110 pour que l'illustration occupe plus de surface */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#1A1F26]">
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="h-full w-full object-contain scale-110"
                />
              </div>

              {/* Nom — élément principal */}
              <p className="text-[14px] font-bold text-white leading-tight line-clamp-2">
                {entry.name}
              </p>

              {/* Rareté — même logique de couleur que BioDexCard */}
              <p className={`text-[10px] font-bold uppercase tracking-widest ${getRarityColor(entry.rarity)}`}>
                {entry.rarity}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
