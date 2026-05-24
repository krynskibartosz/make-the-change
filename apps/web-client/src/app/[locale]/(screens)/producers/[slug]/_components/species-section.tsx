'use client'

import { Leaf } from 'lucide-react'
import type { ProducerSpecies } from '../producer-detail-data'
import { producerTypography as typo } from './producer-typography'

const SPECIES_THUMBNAILS: Record<string, string> = {
  'species-abeille-noire': '/images/species-thumbnails/abeille-noire.png',
  'species-indri': '/images/species-thumbnails/indri.png',
  'species-sifaka-diademe': '/images/species-thumbnails/sifaka-diademe.png',
  'species-vari-noir-blanc': '/images/species-thumbnails/vari-noir-blanc.png',
  'species-cameleon-parson': '/images/species-thumbnails/cameleon-parson.png',
  'species-cameleon-panthere': '/images/species-thumbnails/cameleon-panthere.png',
  'species-charancon-girafe': '/images/species-thumbnails/charancon-girafe.png',
  'species-grenouille-tomate': '/images/species-thumbnails/grenouille-tomate.png',
  'species-martin-chasseur-pygme': '/images/species-thumbnails/martin-chasseur-pygmee.png',
  'species-coua-bleu': '/images/species-thumbnails/coua-bleu.png',
  'species-gecko-diurne': '/images/species-thumbnails/gecko-diurne.png',
  'species-chouette-cheveche': '/images/species-thumbnails/chouette-cheveche.png',
  'species-liotrigona-bitika': '/images/species-thumbnails/liotrigona-bitika.png',
  'species-coccinelle-7-points': '/images/species-thumbnails/coccinelle-a-7-points.png',
  'species-olivier': '/images/species-thumbnails/olivier.png',
  'species-bourdon-terrestre': '/images/species-thumbnails/bourdon-terrestre.png',
  'species-osmie-rousse': '/images/species-thumbnails/osmie-rousse.png',
  'species-megachile': '/images/species-thumbnails/megachile.png',
  'species-syrphe-ceinture': '/images/species-thumbnails/syrphe-ceinture.png',
  'species-papillon-citron': '/images/species-thumbnails/papillon-citron.png',
  'species-paon-du-jour': '/images/species-thumbnails/paon-du-jour.png',
  'species-herisson-europeen': '/images/species-thumbnails/herisson-europeen.png',
  'species-huppe-fascie': '/images/species-thumbnails/huppe-fasciee.png',
  'species-apis-ligustica': '/images/species-thumbnails/abeille-mellifere-italienne.png',
  'species-acropora-corail-cerf': '/images/species-thumbnails/acropora-corail-cerf.png',
  'species-poisson-clown': '/images/species-thumbnails/poisson-clown.png',
  'species-demoiselle-bleue': '/images/species-thumbnails/demoiselle-bleue.png',
  'species-poisson-papillon': '/images/species-thumbnails/poisson-papillon.png',
  'species-hippocampe': '/images/species-thumbnails/hippocampe.png',
  'species-tortue-verte': '/images/species-thumbnails/tortue-verte.png',
}

function getSpeciesImage(entry: ProducerSpecies): string {
  return SPECIES_THUMBNAILS[entry.id] ?? entry.image
}

function isKeySpecies(rarity: string): boolean {
  return rarity?.toUpperCase() === 'LÉGENDAIRE'
}

type SpeciesSectionProps = {
  species: ProducerSpecies[]
  title?: string
  subtitle?: string
}

export function SpeciesSection({
  species,
  title = 'Espèces liées au projet',
  subtitle,
}: SpeciesSectionProps) {
  if (species.length === 0) return null

  const sectionSubtitle =
    subtitle ??
    (species.length === 1
      ? "1 espèce pour comprendre l'écosystème du projet"
      : `${species.length} espèces pour comprendre l'écosystème du projet`)

  const keySpecies = species.find((s) => isKeySpecies(s.rarity)) ?? null
  const otherSpecies = keySpecies ? species.filter((s) => s.id !== keySpecies.id) : species

  return (
    <section>
      <div className="px-4">
        <h2 className={typo.sectionTitle}>{title}</h2>
        <p className={`mt-1 ${typo.sectionSubtitle}`}>{sectionSubtitle}</p>
      </div>

      {/* Carte espèce clé */}
      {keySpecies ? (
        <div className="mt-4 px-4">
          <div className="flex items-center gap-3 rounded-2xl border border-lime-400/20 bg-white/[0.04] p-3">
            <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-white/[0.06]">
              <img
                src={getSpeciesImage(keySpecies)}
                alt={`${keySpecies.name}, espèce clé liée au projet`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-black leading-tight text-white">{keySpecies.name}</p>
              {keySpecies.role ? (
                <p className="mt-0.5 text-[13px] text-lime-400/80">{keySpecies.role}</p>
              ) : null}
              <span className="mt-2 inline-flex rounded-full bg-lime-300/15 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-lime-300">
                ESPÈCE CLÉ
              </span>
              <div className="mt-2 flex items-center gap-1">
                <Leaf className="h-3 w-3 shrink-0 text-white/30" />
                <p className="text-[11px] text-white/35">Espèce liée au projet</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Autres espèces */}
      {otherSpecies.length > 0 ? (
        <div className="mt-4">
          {keySpecies ? (
            <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              Autres espèces associées
            </p>
          ) : null}
          <ul
            className="flex snap-x gap-3 overflow-x-auto px-4 scroll-pl-4 pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 list-none"
            aria-label="Espèces associées au partenaire"
          >
            {otherSpecies.map((entry) => (
              <li key={entry.id} className="w-[80px] shrink-0 snap-start">
                <article className="flex flex-col">
                  <div className="h-[80px] w-[80px] overflow-hidden rounded-xl bg-white/[0.04]">
                    <img
                      src={getSpeciesImage(entry)}
                      alt={`${entry.name}, espèce associée`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-center text-[11px] font-semibold leading-snug text-white/55">
                    {entry.name}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
