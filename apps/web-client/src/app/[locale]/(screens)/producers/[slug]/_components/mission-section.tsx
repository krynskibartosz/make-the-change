'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Mission - "Pourquoi ils existent"
 * 
 * 3 blocs horizontaux scrollables:
 * - Soutien aux apiculteurs
 * - Mielleries mobiles  
 * - Traçabilité réelle
 * 
 * Transforme la fiche en mission narrative.
 */

import { Users, Ship, Route, type LucideIcon } from 'lucide-react'
import type { MissionPillar } from '@/app/[locale]/(site)/producers/_features/mock-producers'

const iconMap: Record<string, LucideIcon> = {
  Users,
  Ship,
  Route,
}

type MissionSectionProps = {
  pillars?: MissionPillar[]
}

export function MissionSection({ pillars }: MissionSectionProps) {
  if (!pillars || pillars.length === 0) return null

  return (
    <section className="mt-10">
      <h2 className="mb-4 px-5 text-lg font-bold text-white/90">
        Pourquoi ils existent
      </h2>
      
      <ul 
        className="flex snap-x gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden m-0 p-0 list-none"
        aria-label="Mission du partenaire"
      >
        {pillars.map((pillar, index) => {
          const Icon = iconMap[pillar.icon] || Users
          
          return (
            <li 
              key={index}
              className="w-40 shrink-0 snap-start"
            >
              <article className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
                
                <h3 className="text-[15px] font-bold text-white leading-tight">
                  {pillar.title}
                </h3>
                
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">
                  {pillar.description}
                </p>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
