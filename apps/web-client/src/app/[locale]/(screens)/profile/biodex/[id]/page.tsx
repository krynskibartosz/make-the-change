import { BookOpen } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getSpeciesContext } from '@/lib/api/species-context.service'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { EvolutionTimeline } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/evolution-timeline'
import { BentoGrid } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/bento-grid'
import { SizeWeightWidget } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/bento-size-weight'
import { OriginWidget } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/bento-origin'
import { DietWidget } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/bento-diet'
import { IUCNWidget } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/bento-iucn'
import { HabitatCarousel } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/habitat-carousel'
import { ThreatTags } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/threat-tags'
import { EvolutionCard } from '@/app/[locale]/(screens)/profile/biodex/[id]/_components/evolution-card'

const REQUIRED_SEEDS = 500

export default async function SpeciesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const species = await getSpeciesContext(id)
  const currentSeeds = species?.user_status?.progressionLevel ?? 1

  if (!species) {
    return (
      <FullScreenSlideModal fallbackHref='/profile/biodex' headerMode='back'>
        <div className='flex h-full items-center justify-center'>
          <p className='text-white/50'>Espèce non trouvée</p>
        </div>
      </FullScreenSlideModal>
    )
  }

  return (
    <FullScreenSlideModal
      title={species.name_default}
      fallbackHref='/profile/biodex'
      headerMode='dynamic'
      contentClassName='overflow-y-auto'
    >
      <main className='mx-auto w-full max-w-2xl pb-12'>

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
                href={`/profile/biodex/${id}/story`}
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
    </FullScreenSlideModal>
  )
}
