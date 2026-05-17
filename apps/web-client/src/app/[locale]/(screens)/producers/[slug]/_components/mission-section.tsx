'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Mission - "Pourquoi ils existent"
 * 
 * Pattern: progressive disclosure
 * - Page = sommaire éditorial scannable (numéro + titre + chevron)
 * - Tap = bottom sheet d'approfondissement (description + keyPoints + whyItMatters)
 */

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import type { MissionPillar } from '@/app/[locale]/(site)/producers/_features/mock-producers'

type MissionSectionProps = {
  pillars?: MissionPillar[]
}

export function MissionSection({ pillars }: MissionSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!pillars || pillars.length === 0) return null

  const displayPillars = pillars.slice(0, 3)
  const activePillar = openIndex !== null ? displayPillars[openIndex] : null

  return (
    <>
      <section className="mt-10 px-4">
        {/* En-tête section */}
        <h2 className="text-[17px] font-bold text-white/80">
          Pourquoi ils existent
        </h2>
        <p className="mt-1 mb-5 text-[12px] leading-snug text-white/40">
          Un réseau construit autour des producteurs, du terrain et de la traçabilité.
        </p>

        {/* Liste sommaire — scannable */}
        <div className="flex flex-col">
          {displayPillars.map((pillar, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setOpenIndex(index)}
              className={`flex w-full items-center gap-3 py-3.5 text-left transition-opacity active:opacity-60 ${
                index < displayPillars.length - 1 ? 'border-b border-white/[0.05]' : ''
              }`}
            >
              {/* Numéro inline */}
              <span className="w-6 shrink-0 text-[11px] font-medium text-white/30">
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Titre */}
              <span className="min-w-0 flex-1 text-[14px] font-medium text-white/90 leading-tight">
                {pillar.title}
              </span>

              {/* Chevron affordance */}
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/25" />
            </button>
          ))}
        </div>
      </section>

      {/* Bottom sheet — approfondissement */}
      <MobileSheet
        isOpen={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        title={activePillar?.title}
      >
        {activePillar && (
          <div className="pb-2 pt-1">
            {/* Description */}
            <p className="text-[14px] leading-relaxed text-white/65">
              {activePillar.description}
            </p>

            {/* Points clés */}
            {activePillar.keyPoints && activePillar.keyPoints.length > 0 && (
              <div className="mt-5">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                  Points clés
                </p>
                <ul className="flex flex-col gap-2">
                  {activePillar.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-white/65">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-300/50" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pourquoi c'est important */}
            {activePillar.whyItMatters && (
              <div className="mt-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                  Pourquoi c'est important
                </p>
                <p className="text-[13px] leading-relaxed text-white/50">
                  {activePillar.whyItMatters}
                </p>
              </div>
            )}

            {/* Label source — garde-fou */}
            {activePillar.sourceLabel && (
              <p className="mt-6 text-[10px] text-white/25">
                {activePillar.sourceLabel}
              </p>
            )}
          </div>
        )}
      </MobileSheet>
    </>
  )
}
