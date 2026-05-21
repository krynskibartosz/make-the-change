'use client'
import { useRef } from 'react'
import { useHeroParallax } from '@/hooks/use-hero-parallax'
import type { SpeciesContext } from '@/types/species'
import { getSpeciesHeroImage, getSpeciesEcologicalRole } from './species-helpers'

interface SpeciesHeroProps {
  species: SpeciesContext
}

export function SpeciesHero({ species }: SpeciesHeroProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const heroImage = getSpeciesHeroImage(species)
  const ecologicalRole = getSpeciesEcologicalRole(species)

  useHeroParallax(imageRef)

  return (
    <div className='relative w-full overflow-hidden' style={{ minHeight: '420px' }}>
      <img
        ref={imageRef}
        src={heroImage}
        alt={species.name_default}
        className='absolute inset-x-0 -top-6 h-[calc(100%+48px)] w-full object-cover'
      />
      <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent' />
      <div className='absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent' />

      <div className='relative flex min-h-[420px] flex-col justify-end px-6 pb-8 pt-20'>
        <h1 className='text-4xl font-black leading-none tracking-tight text-white'>
          {species.name_default}
        </h1>
        {species.scientific_name && (
          <p className='mt-2 text-sm italic text-white/45'>{species.scientific_name}</p>
        )}
        <p className='mt-3 text-base font-semibold text-emerald-300'>{ecologicalRole}</p>
      </div>
    </div>
  )
}
