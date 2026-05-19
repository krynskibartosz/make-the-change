'use client'
import { useState } from 'react'
import { Info } from 'lucide-react'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import type { SpeciesContext } from '@/types/species'
import { getSpeciesHeroImage, getSpeciesEcologicalRole } from './species-helpers'

interface SpeciesHeroProps {
  species: SpeciesContext
}

export function SpeciesHero({ species }: SpeciesHeroProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const heroImage = getSpeciesHeroImage(species)
  const ecologicalRole = getSpeciesEcologicalRole(species)

  return (
    <>
      <div className='relative w-full overflow-hidden' style={{ minHeight: '420px' }}>
        <img
          src={heroImage}
          alt={species.name_default}
          className='absolute inset-0 h-full w-full object-cover'
        />
        {/* Dégradé sombre haut pour la nav */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent' />
        {/* Dégradé sombre bas pour le texte */}
        <div className='absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent' />

        <div className='relative flex min-h-[420px] flex-col justify-end px-6 pb-8 pt-20'>
          <h1 className='text-4xl font-black leading-none tracking-tight text-white'>
            {species.name_default}
          </h1>
          {species.scientific_name && (
            <p className='mt-2 text-sm italic text-white/45'>{species.scientific_name}</p>
          )}
          <p className='mt-3 text-base font-semibold text-emerald-300'>{ecologicalRole}</p>

          <button
            type='button'
            onClick={() => setSheetOpen(true)}
            className='mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[11px] font-semibold text-white/55 backdrop-blur-sm transition-colors active:bg-black/50'
          >
            <Info className='h-3 w-3' aria-hidden='true' />
            Représentation naturaliste
          </button>
        </div>
      </div>

      <MobileSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title='À propos de cette image'
      >
        <div className='space-y-3 pb-2 pt-1 text-sm leading-relaxed text-white/60'>
          <p>
            Cette image illustre l&apos;espèce et son milieu naturel. Elle a été créée comme
            représentation naturaliste à des fins pédagogiques.
          </p>
          <p>
            Elle ne constitue pas une photo de suivi terrain ni une preuve de présence ou de
            protection de l&apos;espèce.
          </p>
          <p className='text-xs text-white/35'>
            Make the Change distingue les illustrations pédagogiques des données terrain documentées.
          </p>
        </div>
      </MobileSheet>
    </>
  )
}
