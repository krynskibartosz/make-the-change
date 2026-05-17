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
      
      <div className="flex flex-col">
        {displayPillars.map((pillar, index) => (
          <article 
            key={index}
            className={`pb-6 ${index < displayPillars.length - 1 ? 'mb-1 border-b border-white/[0.05]' : ''}`}
          >
            {/* Index éditorial — compact, proche du contenu */}
            <span className="block text-[11px] font-medium tracking-wider text-white/25 mb-1.5">
              {String(index + 1).padStart(2, '0')}
            </span>
            
            {/* Titre — medium, pas bold */}
            <h3 className="text-[15px] font-medium text-white/90 leading-tight">
              {pillar.title}
            </h3>

            {/* Micro-ligne scan — amber, ultra courte */}
            {pillar.summary && (
              <p className="mt-1 text-[12px] font-medium text-amber-300/60 leading-snug">
                {pillar.summary}
              </p>
            )}

            {/* Détail court — contextuel */}
            {(pillar.detail || pillar.shortDescription) && (
              <p className="mt-1 text-[12px] leading-snug text-white/40">
                {pillar.detail || pillar.shortDescription}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
