import type { SpeciesContext } from '@/types/context'

interface SpeciesStoryContentProps {
  species: SpeciesContext
}

export function SpeciesStoryContent({ species }: SpeciesStoryContentProps) {
  return (
    <div className="px-5 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center text-3xl font-black text-white">{species.name_default}</h1>
        <p className="mt-2 text-center text-sm italic text-white/50">{species.scientific_name}</p>
        
        {species.description_scientific && (
          <div className="mt-8 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-bold text-white">Description scientifique</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">
                {species.description_scientific}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
