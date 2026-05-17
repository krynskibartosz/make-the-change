'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Mission - "Pourquoi ils existent"
 * 
 * Cards scannables mobile-first:
 * - Icon + titre en haut
 * - Bullets micro-lignes
 * - Pas de texte dense
 */

import { Users, Ship, Route, Check, type LucideIcon } from 'lucide-react'
import type { MissionPillar } from '@/app/[locale]/(site)/producers/_features/mock-producers'

const iconMap: Record<string, LucideIcon> = {
  Users,
  Ship,
  Route,
}

type MissionSectionProps = {
  pillars?: MissionPillar[]
}

// Transforme une description en bullets scannables
function parseBullets(description: string): string[] {
  // Split par virgule, point, ou tiret
  const cleaned = description
    .replace(/^[\s\-•]+/, '')
    .split(/[,;.]/)  
    .map(s => s.trim())
    .filter(s => s.length > 3 && s.length < 40)
    .slice(0, 4) // Max 4 bullets
  
  return cleaned.length > 0 ? cleaned : [description.slice(0, 35)]
}

export function MissionSection({ pillars }: MissionSectionProps) {
  if (!pillars || pillars.length === 0) return null

  return (
    <section className="mt-8">
      <h2 className="mb-3 px-4 text-[17px] font-bold text-white/80">
        Pourquoi ils existent
      </h2>
      
      <ul 
        className="flex snap-x gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 p-0 list-none"
        aria-label="Mission du partenaire"
      >
        {pillars.map((pillar, index) => {
          const Icon = iconMap[pillar.icon] || Users
          const bullets = parseBullets(pillar.description)
          
          return (
            <li 
              key={index}
              className="w-36 shrink-0 snap-start first:pl-0"
            >
              <article className="flex flex-col rounded-xl border border-white/5 bg-white/[0.03] p-3">
                {/* Header compact */}
                <div className="mb-2 flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
                    <Icon className="h-4 w-4 text-amber-400" />
                  </div>
                  <h3 className="text-[13px] font-bold text-white leading-tight">
                    {pillar.title}
                  </h3>
                </div>
                
                {/* Bullets scannables */}
                <ul className="flex flex-col gap-1">
                  {bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-white/30" />
                      <span className="text-[11px] leading-snug text-white/60">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
