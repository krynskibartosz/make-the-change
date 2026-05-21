'use client'
import { useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import type { SpeciesContext } from '@/types/species'

function isSimpleHabitat(habitat: string): boolean {
  return !habitat.includes('(Z')
}

function simplifyThreat(threat: string): string {
  const idx = threat.indexOf(' (')
  return idx > 0 ? threat.slice(0, idx) : threat
}

interface SpeciesKnowledgeSectionProps {
  species: SpeciesContext
}

export function SpeciesKnowledgeSection({ species }: SpeciesKnowledgeSectionProps) {
  const [habitatSheetOpen, setHabitatSheetOpen] = useState(false)
  const [threatsSheetOpen, setThreatsSheetOpen] = useState(false)

  const allHabitats = species.habitat ?? []
  const simpleHabitats = allHabitats.filter(isSimpleHabitat)
  const technicalHabitats = allHabitats.filter((h) => !isSimpleHabitat(h))
  const mainHabitat = simpleHabitats[0] ?? allHabitats[0] ?? null
  const secondaryHabitats = simpleHabitats.slice(1)

  const allThreats = species.threats ?? []
  const visibleThreats = allThreats.slice(0, 3).map(simplifyThreat)
  const hasMoreThreats = allThreats.length > 3

  return (
    <>
      <section className='mx-5 space-y-8'>
        <p className='text-[11px] font-black uppercase tracking-[0.16em] text-white/35'>
          Explorer son rôle
        </p>

        {/* Où elle vit */}
        <div className='space-y-3'>
          <p className='text-sm font-bold text-white/80'>Où elle vit</p>
          {mainHabitat ? (
            <>
              <p className='text-sm leading-relaxed text-white/60'>{mainHabitat}</p>
              {secondaryHabitats.length > 0 && (
                <p className='text-xs text-white/30'>{secondaryHabitats.join(' · ')}</p>
              )}
              {technicalHabitats.length > 0 && (
                <button
                  type='button'
                  onClick={() => setHabitatSheetOpen(true)}
                  className='flex items-center gap-1 text-xs font-semibold text-white/40 transition-colors active:text-white/60'
                >
                  Zones documentées
                  <ChevronUp className='h-3 w-3' aria-hidden='true' />
                </button>
              )}
            </>
          ) : (
            <p className='text-xs text-white/35'>Habitat à documenter avec le partenaire.</p>
          )}
        </div>

        <div className='h-px bg-white/[0.06]' />

        {/* Avec qui elle interagit */}
        <div className='space-y-3'>
          <p className='text-sm font-bold text-white/80'>Avec qui elle interagit</p>
          <p className='text-sm leading-relaxed text-white/60'>
            Elle visite des plantes à fleurs pour le nectar et le pollen. Ses liens avec d&apos;autres
            pollinisateurs, cultures locales et prédateurs restent à documenter.
          </p>
        </div>

        <div className='h-px bg-white/[0.06]' />

        {/* Ce qui la fragilise */}
        <div className='space-y-3'>
          <p className='text-sm font-bold text-white/80'>Ce qui la fragilise</p>
          {allThreats.length > 0 ? (
            <>
              <p className='text-sm leading-relaxed text-white/60'>
                Son équilibre dépend de la qualité de son habitat et des ressources disponibles dans
                son milieu.
              </p>
              <p className='text-xs text-white/35'>
                {visibleThreats.join(' · ')}
                {hasMoreThreats && '…'}
              </p>
              <button
                type='button'
                onClick={() => setThreatsSheetOpen(true)}
                className='flex items-center gap-1 text-xs font-semibold text-white/40 transition-colors active:text-white/60'
              >
                Voir les fragilités
                <ChevronUp className='h-3 w-3' aria-hidden='true' />
              </button>
            </>
          ) : (
            <p className='text-xs text-white/35'>
              Fragilités à documenter avec le partenaire et les données terrain.
            </p>
          )}
        </div>
      </section>

      {/* MobileSheet — Zones documentées */}
      <MobileSheet
        isOpen={habitatSheetOpen}
        onClose={() => setHabitatSheetOpen(false)}
        title='Zones documentées'
      >
        <div className='space-y-4 pb-2 pt-1'>
          <div className='space-y-2'>
            {technicalHabitats.map((h, i) => (
              <div
                key={i}
                className='rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5 text-sm text-white/65'
              >
                {h}
              </div>
            ))}
          </div>
          <p className='text-xs leading-relaxed text-white/30'>
            Ces zones décrivent des contextes écologiques possibles. Les données locales du projet
            restent à documenter avec le partenaire.
          </p>
        </div>
      </MobileSheet>

      {/* MobileSheet — Fragilités */}
      <MobileSheet
        isOpen={threatsSheetOpen}
        onClose={() => setThreatsSheetOpen(false)}
        title='Ce qui la fragilise'
      >
        <div className='space-y-4 pb-2 pt-1'>
          <div className='space-y-2'>
            {allThreats.map((t, i) => (
              <div
                key={i}
                className='rounded-xl border border-orange-500/15 bg-orange-500/5 px-3 py-2.5 text-sm text-white/65'
              >
                {t}
              </div>
            ))}
          </div>
          <p className='text-xs leading-relaxed text-white/30'>
            Les niveaux de pression locaux doivent être confirmés avec le partenaire ou une source
            scientifique identifiable. Ces données sont indicatives.
          </p>
        </div>
      </MobileSheet>
    </>
  )
}
