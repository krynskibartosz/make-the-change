'use client'
import { sanitizeImageUrl } from '@/lib/image-url'
import type { LinkedProject } from './species-linked-projects'

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
}

interface SpeciesLinkedSpeciesProps {
  linkedProjects: LinkedProject[]
  currentSpeciesId: string
}

export function SpeciesLinkedSpecies({
  linkedProjects,
  currentSpeciesId,
}: SpeciesLinkedSpeciesProps) {
  const seen = new Set<string>()
  const otherSpecies = linkedProjects
    .flatMap((p) => p.species ?? [])
    .filter((s) => {
      if (s.id === currentSpeciesId || seen.has(s.id)) return false
      seen.add(s.id)
      return true
    })

  if (otherSpecies.length === 0) return null

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Dans le même écosystème
      </p>
      <ul className='flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden m-0 list-none'>
        {otherSpecies.map((sp) => {
          const imageUrl = SPECIES_THUMBNAILS[sp.id] ?? sanitizeImageUrl(sp.icon)
          return (
            <li key={sp.id} className='w-[80px] shrink-0'>
              <div className='h-[80px] overflow-hidden rounded-xl bg-white/[0.04]'>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={sp.name}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                ) : (
                  <div className='h-full w-full' aria-hidden='true' />
                )}
              </div>
              <p className='mt-1.5 line-clamp-2 text-center text-[11px] font-semibold leading-snug text-white/55'>
                {sp.name}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
