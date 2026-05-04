'use client'
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SpeciesContext } from '@/types/species'
import { ImpactCard } from './impact-card'
import { StickyEvolutionBar } from './sticky-evolution-bar'
import { BentoGrid } from './bento-grid'
import { SizeWeightWidget } from './bento-size-weight'
import { OriginWidget } from './bento-origin'
import { DietWidget } from './bento-diet'
import { IUCNWidget } from './bento-iucn'
import { HabitatCarousel } from './habitat-carousel'

const REQUIRED_SEEDS = 500

interface SpeciesDetailClientProps {
  species: SpeciesContext
  userSeedsBalance: number
}

export function SpeciesDetailClient({ species, userSeedsBalance }: SpeciesDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'discovery' | 'scientific'>('discovery')
  const [showAllThreats, setShowAllThreats] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const canEvolve = userSeedsBalance >= REQUIRED_SEEDS
  const progressionLevel = species.user_status?.progressionLevel ?? 1
  const isLevel2Unlocked = progressionLevel >= 2

  const allThreats = species.threats ?? []
  const mainThreat = allThreats[0]
  const extraThreatsCount = allThreats.length - 1

  const hasSizeOrWeight = !!(species.size || species.weight)
  const hasOrigin = !!species.origin_country
  const hasDiet = !!species.diet
  const hasIUCN = !!species.conservation_status
  const hasBentoContent = hasSizeOrWeight || hasOrigin || hasDiet || hasIUCN

  const handleDisabledClick = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  return (
    <>
      <div className='pb-28'>
        {/* Hero image */}
        <section className='mt-4'>
          <div className='relative flex aspect-square w-full items-center justify-center'>
            <div className='absolute inset-0 mx-auto h-3/4 w-3/4 rounded-full bg-emerald-500/10 blur-[100px]' />
            <img
              src={species.image_url || '/images/diaromas/abeille noire.png'}
              alt={species.name_default}
              className='z-10 h-64 w-64 object-contain drop-shadow-2xl'
            />
          </div>
        </section>

        {/* Title + scientific name */}
        <section className='mt-2 px-6 text-center'>
          <h1 className='text-3xl font-black text-white'>{species.name_default}</h1>
          {species.scientific_name && (
            <p className='mt-1 text-sm italic text-white/40'>{species.scientific_name}</p>
          )}
        </section>

        {/* Impact Card */}
        <ImpactCard projects={species.associated_projects} />

        {/* Segmented Control */}
        <div className='mx-5 mt-6'>
          <div className='flex gap-1 rounded-2xl bg-white/5 p-1'>
            <button
              type='button'
              onClick={() => setActiveTab('discovery')}
              className={cn(
                'flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-200',
                activeTab === 'discovery'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/50 hover:text-white/80',
              )}
            >
              Découverte
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('scientific')}
              className={cn(
                'flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-200',
                activeTab === 'scientific'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/50 hover:text-white/80',
              )}
            >
              Scientifique
            </button>
          </div>
        </div>

        {/* ── TAB: Découverte ── */}
        {activeTab === 'discovery' && (
          <div className='mt-6 space-y-6'>
            {/* Intro */}
            {species.description_default && (
              <div className='px-5'>
                <p className='text-sm leading-relaxed text-white/70'>
                  {species.description_default}
                </p>
              </div>
            )}

            {/* Menace principale */}
            {mainThreat && (
              <div className='px-5'>
                <h3 className='mb-3 text-xs font-bold uppercase tracking-wider text-white/40'>
                  Défi principal
                </h3>
                <div className='rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <AlertTriangle className='h-5 w-5 shrink-0 text-orange-400' />
                    <p className='text-sm font-semibold text-white/90'>{mainThreat}</p>
                  </div>
                </div>
                {extraThreatsCount > 0 && !showAllThreats && (
                  <button
                    type='button'
                    onClick={() => setShowAllThreats(true)}
                    className='mt-3 text-xs font-bold text-white/40 transition-colors hover:text-white/60'
                  >
                    Voir {extraThreatsCount} autre{extraThreatsCount > 1 ? 's' : ''} menace
                    {extraThreatsCount > 1 ? 's' : ''} →
                  </button>
                )}
                {showAllThreats && (
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {allThreats.slice(1).map((threat, i) => (
                      <div
                        key={i}
                        className='rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70'
                      >
                        {threat}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Niveau 2 — contenu grisé / débloqué */}
            <div className='px-5'>
              <div
                className={cn(
                  'rounded-3xl border p-5 transition-all',
                  isLevel2Unlocked ? 'border-white/5 bg-white/5' : 'border-white/5 bg-white/[0.02]',
                )}
              >
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-sm font-bold text-white/80'>Anecdote</h3>
                  {!isLevel2Unlocked && (
                    <span className='rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/30'>
                      Niveau 2
                    </span>
                  )}
                </div>
                {isLevel2Unlocked && species.description_scientific ? (
                  <p className='text-sm leading-relaxed text-white/60'>
                    {species.description_scientific}
                  </p>
                ) : (
                  <div className='space-y-2'>
                    <div className='h-2.5 w-full rounded-full bg-white/5' />
                    <div className='h-2.5 w-4/5 rounded-full bg-white/5' />
                    <div className='h-2.5 w-3/5 rounded-full bg-white/5' />
                    <p className='mt-3 text-xs text-white/30'>
                      Améliorez la fiche pour découvrir l&apos;histoire de cette espèce.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Scientifique ── */}
        {activeTab === 'scientific' && (
          <div className='mt-6 space-y-6'>
            {hasBentoContent && (
              <BentoGrid>
                {hasSizeOrWeight && (
                  <SizeWeightWidget size={species.size} weight={species.weight} />
                )}
                {hasOrigin && <OriginWidget originCountry={species.origin_country} />}
                {hasDiet && <DietWidget diet={species.diet} />}
                {hasIUCN && <IUCNWidget conservationStatus={species.conservation_status} />}
              </BentoGrid>
            )}

            {species.habitat && species.habitat.length > 0 && (
              <HabitatCarousel habitats={species.habitat} />
            )}

            {allThreats.length > 0 && (
              <div className='px-5'>
                <h3 className='mb-3 font-bold text-white'>Les Défis de son Monde</h3>
                <div className='flex flex-wrap gap-2'>
                  {allThreats.map((threat, i) => (
                    <div
                      key={i}
                      className='rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80'
                    >
                      {threat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {species.description_scientific && (
              <div className='px-5'>
                <h3 className='mb-3 font-bold text-white'>Description scientifique</h3>
                <div
                  className={cn(
                    'text-sm leading-relaxed transition-all',
                    isLevel2Unlocked
                      ? 'text-white/70'
                      : 'select-none text-white/30 blur-[3px]',
                  )}
                >
                  <p>{species.description_scientific}</p>
                </div>
                {!isLevel2Unlocked && (
                  <p className='mt-2 text-xs text-white/30'>
                    Améliorez la fiche (Niveau 2) pour lire la description complète.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <StickyEvolutionBar
        currentSeeds={userSeedsBalance}
        requiredSeeds={REQUIRED_SEEDS}
        canEvolve={canEvolve}
        onDisabledClick={handleDisabledClick}
      />

      {/* Toast */}
      {showToast && (
        <div className='pointer-events-none fixed inset-x-4 bottom-28 z-[60] flex items-center justify-center'>
          <div className='animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-medium text-white/90 shadow-xl backdrop-blur-md duration-300'>
            Continuez l&apos;Aventure ou l&apos;Academy pour gagner des Graines !
          </div>
        </div>
      )}
    </>
  )
}
