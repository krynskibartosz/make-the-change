'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Mission - "Pourquoi ils existent"
 *
 * Pattern: progressive disclosure
 * - Page = sommaire éditorial scannable (numéro + titre + chevron)
 * - Tap = bottom sheet d'approfondissement (description + keyPoints + whyItMatters)
 */

import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { MissionPillar } from '@/app/[locale]/(site)/producers/_features/mock-producers'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import { producerTypography as typo } from './producer-typography'

type MissionSectionProps = {
  pillars?: MissionPillar[]
  subtitle?: string
}

export function MissionSection({ pillars, subtitle }: MissionSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!pillars || pillars.length === 0) return null

  const MAX_MISSION_PILLARS = 3
  const displayPillars = pillars.slice(0, MAX_MISSION_PILLARS)
  const activePillar = openIndex !== null ? displayPillars[openIndex] : null

  return (
    <>
      <section className="mt-10 px-4">
        {/* En-tête section */}
        <h2 className={typo.sectionTitle}>Pourquoi ils existent</h2>
        {subtitle && <p className={`mt-1.5 mb-3 ${typo.sectionSubtitle}`}>{subtitle}</p>}

        {/* Liste sommaire — scannable */}
        <div className="flex flex-col">
          {displayPillars.map((pillar, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setOpenIndex(index)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-3.5 -mx-2 text-left transition-all active:bg-white/[0.04] active:opacity-70 ${
                index < displayPillars.length - 1 ? 'border-b border-white/[0.05]' : ''
              }`}
            >
              {/* Numéro inline */}
              <span className={`w-6 shrink-0 ${typo.listNumber}`}>
                {String(index + 1).padStart(2, '0')}
              </span>

              {/* Titre */}
              <span className={`min-w-0 flex-1 ${typo.listTitle}`}>{pillar.title}</span>

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
            <p className={typo.modalBody}>{activePillar.description}</p>

            {/* Points clés */}
            {activePillar.keyPoints && activePillar.keyPoints.length > 0 && (
              <div className="mt-5">
                <p className={`mb-3 ${typo.modalLabel}`}>Points clés</p>
                <ul className="flex flex-col gap-2">
                  {activePillar.keyPoints.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[14px] leading-relaxed text-white/66"
                    >
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
                <p className={`mb-2.5 ${typo.modalLabel}`}>Pourquoi c'est important</p>
                <p className={typo.modalBodyMuted}>{activePillar.whyItMatters}</p>
              </div>
            )}

            {/* Label source — garde-fou */}
            {activePillar.sourceLabel && (
              <p className="mt-6 text-[12px] leading-snug text-white/38">
                {activePillar.sourceLabel}
              </p>
            )}
          </div>
        )}
      </MobileSheet>
    </>
  )
}
