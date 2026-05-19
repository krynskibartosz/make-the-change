import type { SpeciesContext } from '@/types/species'
import { getSpeciesEducationalSummary } from './species-helpers'

interface SpeciesWhyItMattersProps {
  species: SpeciesContext
}

export function SpeciesWhyItMatters({ species }: SpeciesWhyItMattersProps) {
  const summary = getSpeciesEducationalSummary(species)

  return (
    <section className='mx-5'>
      <p className='mb-3 text-sm font-black text-white/55'>Pourquoi elle compte</p>
      <div className='border-l-2 border-emerald-500/40 pl-4'>
        <p className='text-sm leading-relaxed text-white/72'>{summary}</p>
      </div>
    </section>
  )
}
