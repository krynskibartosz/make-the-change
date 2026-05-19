import type { SpeciesContext } from '@/types/species'
import { getSpeciesEducationalSummary } from './species-helpers'

interface SpeciesWhyItMattersProps {
  species: SpeciesContext
}

export function SpeciesWhyItMatters({ species }: SpeciesWhyItMattersProps) {
  const summary = getSpeciesEducationalSummary(species)

  return (
    <section className='mx-5'>
      <p className='mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
        Pourquoi elle compte
      </p>
      <div className='rounded-2xl border border-white/8 bg-white/[0.045] px-4 py-4'>
        <p className='text-sm leading-relaxed text-white/70'>{summary}</p>
      </div>
    </section>
  )
}
