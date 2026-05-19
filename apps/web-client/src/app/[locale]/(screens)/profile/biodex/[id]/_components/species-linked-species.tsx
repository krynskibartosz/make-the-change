'use client'
import { sanitizeImageUrl } from '@/lib/image-url'
import type { LinkedProject } from './species-linked-projects'

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
        Espèces du même projet
      </p>
      <div className='flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {otherSpecies.map((sp) => {
          const imageUrl = sanitizeImageUrl(sp.icon)
          return (
            <div key={sp.id} className='w-[72px] shrink-0'>
              <div className='h-[72px] overflow-hidden rounded-[20px] bg-white/[0.045] ring-1 ring-white/[0.08]'>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={sp.name}
                    className='h-full w-full object-cover'
                    loading='lazy'
                  />
                ) : (
                  <div className='h-full w-full bg-white/5' aria-hidden='true' />
                )}
              </div>
              <p className='mt-2 line-clamp-2 text-[11px] font-bold leading-tight text-white/50'>
                {sp.name}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
