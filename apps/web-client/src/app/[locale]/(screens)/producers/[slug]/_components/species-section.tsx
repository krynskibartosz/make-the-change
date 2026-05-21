'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Espèces — Option A: Premium éditoriale
 *
 * Images beaucoup plus grandes, moins de zone vide.
 * Contexte éditorial: pourquoi ces espèces sont là.
 */

import { Link } from '@/i18n/navigation'
import type { ProducerSpecies } from '../producer-detail-data'
import { producerTypography as typo } from './producer-typography'

function getRarityColor(rarity: string) {
  const r = rarity?.toUpperCase()
  if (r === 'LÉGENDAIRE') return 'text-amber-400/80'
  if (r === 'RARE') return 'text-blue-400/70'
  return 'text-emerald-500/60'
}

function getRarityLabel(rarity: string) {
  const r = rarity?.toUpperCase()
  if (r === 'LÉGENDAIRE') return 'Espèce remarquable'
  if (r === 'RARE') return 'Espèce liée'
  return 'Commune'
}

type SpeciesSectionProps = {
  species: ProducerSpecies[]
  title?: string
  subtitle?: string
}

export function SpeciesSection({
  species,
  title = 'Le vivant autour de leurs projets',
  subtitle = 'Espèces et milieux associés aux projets documentés.',
}: SpeciesSectionProps) {
  if (species.length === 0) return null

  return (
    <section>
      <div className="px-4">
        <h2 className={typo.sectionTitle}>{title}</h2>
        {subtitle && <p className={`mt-1.5 ${typo.sectionSubtitle}`}>{subtitle}</p>}
      </div>

      <ul
        className="mt-4 flex snap-x gap-4 overflow-x-auto px-4 scroll-pl-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 list-none"
        aria-label="Espèces liées au partenaire"
      >
        {species.map((entry) => (
          <li key={entry.id} className="w-36 shrink-0 snap-start">
            <Link href={`/profile/biodex/${entry.id}`} className="block">
              <article className="flex flex-col gap-1.5">
                {/* Image — scale-110 pour que l'illustration occupe plus de surface */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#1A1F26]">
                  <img
                    src={entry.image}
                    alt={entry.name}
                    className="h-full w-full object-contain scale-110"
                  />
                </div>

                {/* Nom — élément principal */}
                <p className={`${typo.cardTitle} line-clamp-2`}>{entry.name}</p>

                {/* Rôle écologique — contexte éditorial */}
                {entry.role && (
                  <p className="text-[13px] font-medium leading-snug text-white/56">{entry.role}</p>
                )}

                {/* Rareté BioDex — label explicite plutôt que niveau brut */}
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.08em] ${getRarityColor(entry.rarity)}`}
                >
                  {getRarityLabel(entry.rarity)}
                </p>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
