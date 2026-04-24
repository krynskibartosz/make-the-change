import { Leaf, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { getSpeciesContext } from '@/lib/api/species-context.service'
import { BackButton } from '@/components/back-button'
import { EvolutionTimeline } from '@/components/biodex/evolution-timeline'
import { BentoGrid } from '@/components/biodex/bento-grid'
import { SizeWeightWidget } from '@/components/biodex/bento-size-weight'
import { OriginWidget } from '@/components/biodex/bento-origin'
import { DietWidget } from '@/components/biodex/bento-diet'
import { IUCNWidget } from '@/components/biodex/bento-iucn'
import { HabitatCarousel } from '@/components/biodex/habitat-carousel'
import { ThreatTags } from '@/components/biodex/threat-tags'
import { EvolutionCard } from '@/components/biodex/evolution-card'

const REQUIRED_SEEDS = 500

export default async function SpeciesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const species = await getSpeciesContext(id)
  const currentSeeds = species?.user_status?.progressionLevel ?? 1

  if (!species) {
    return (
      <div className="min-h-screen bg-[#0B0F15] text-white">
        <main className="mx-auto w-full max-w-2xl pb-12">
          <div className="flex items-center justify-center px-5 pt-12">
            <div className="text-white/50">Espèce non trouvée</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F15] text-white">
      <main className="mx-auto w-full max-w-2xl pb-12">
        <header className="flex items-center justify-between px-5 pb-4 pt-12">
          <BackButton />

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
            <Leaf className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400 tabular-nums">{currentSeeds}</span>
          </div>
        </header>

        <section className="mt-4">
          <div className="relative flex aspect-square w-full items-center justify-center">
            <div className="absolute inset-0 mx-auto h-3/4 w-3/4 rounded-full bg-emerald-500/10 blur-[100px]" />
            <img
              src={species.image_url || '/images/diaromas/abeille noire.png'}
              alt={species.name_default}
              className="z-10 h-64 w-64 object-cover drop-shadow-2xl"
            />
          </div>
        </section>

        <section className="mt-2 text-center">
          <EvolutionTimeline currentLevel={species.user_status?.progressionLevel ?? 1} />
          <h1 className="text-center text-3xl font-black text-white">{species.name_default}</h1>
          <p className="mt-2 px-8 text-center text-sm text-white/50">
            {species.description_default}
          </p>
        </section>

        {/* Bento Grid Data Widgets */}
        <BentoGrid>
          <SizeWeightWidget size={species.size} weight={species.weight} />
          <OriginWidget originCountry={species.origin_country} />
          <DietWidget diet={species.diet} />
          {species.conservation_status && (
            <IUCNWidget conservationStatus={species.conservation_status} />
          )}
        </BentoGrid>

        {/* Le Saviez-vous ? Hook + Modal Link */}
        {species.description_default && (
          <div className="mx-5 mt-6">
            <h3 className="mb-2 text-lg font-bold text-white">Le Saviez-vous ?</h3>
            <p className="mb-3 text-sm text-white/70 line-clamp-3">
              {species.description_default}
            </p>
            {species.description_scientific && (
              <Link
                href={`/biodex/${id}/story`}
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
              >
                <BookOpen className="h-4 w-4" />
                Lire son histoire...
              </Link>
            )}
          </div>
        )}

        {/* Habitats Carousel */}
        {species.habitat && species.habitat.length > 0 && (
          <div className="mt-6">
            <HabitatCarousel habitats={species.habitat} />
          </div>
        )}

        {/* Threats Tags */}
        {species.threats && species.threats.length > 0 && (
          <div className="mt-6">
            <ThreatTags threats={species.threats} />
          </div>
        )}

        {/* Evolution Card */}
        <EvolutionCard
          currentSeeds={currentSeeds}
          requiredSeeds={REQUIRED_SEEDS}
          canEvolve={currentSeeds >= REQUIRED_SEEDS}
        />
      </main>
    </div>
  )
}
