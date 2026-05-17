'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Mission - "Pourquoi ils existent"
 * 
 * Layout vertical éditorial ouvert:
 * - Pas de carousel
 * - Pas de cards fermées
 * - Manifeste condensé, lecture stable
 * - Hiérarchie narrative
 */

import type { MissionPillar } from '@/app/[locale]/(site)/producers/_features/mock-producers'

type MissionSectionProps = {
  pillars?: MissionPillar[]
}

export function MissionSection({ pillars }: MissionSectionProps) {
  if (!pillars || pillars.length === 0) return null

  // Limiter à 3 piliers maximum pour la lisibilité
  const displayPillars = pillars.slice(0, 3)

  return (
    <section className="mt-10 px-4">
      <h2 className="mb-5 text-[17px] font-bold text-white/80">
        Pourquoi ils existent
      </h2>
      
      <div className="flex flex-col gap-4">
        {displayPillars.map((pillar, index) => (
          <article 
            key={index}
            className="group flex gap-4"
          >
            {/* Index éditorial */}
            <span className="shrink-0 pt-0.5 text-[13px] font-medium text-white/30">
              {String(index + 1).padStart(2, '0')}
            </span>
            
            {/* Contenu */}
            <div className="min-w-0 flex-1 pb-4 border-b border-white/[0.06] last:border-0 last:pb-0">
              <h3 className="text-[15px] font-semibold text-white/90 leading-tight">
                {pillar.title}
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-white/55">
                {pillar.shortDescription || pillar.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
