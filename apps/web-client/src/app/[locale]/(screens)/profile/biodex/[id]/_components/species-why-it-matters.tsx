import type { SpeciesContext } from '@/types/species'
import { getSpeciesEducationalSummary } from './species-helpers'

interface SpeciesWhyItMattersProps {
  species: SpeciesContext
}

export function SpeciesWhyItMatters({ species }: SpeciesWhyItMattersProps) {
  const summary = getSpeciesEducationalSummary(species)

  return (
    <section className='mx-5'>
      <p className='mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>Rôle dans le vivant</p>
      <div className='border-l-2 border-emerald-500/40 pl-4'>
        <p className='text-sm leading-relaxed text-white/72'>{summary}</p>
      </div>
    </section>
  )
}
