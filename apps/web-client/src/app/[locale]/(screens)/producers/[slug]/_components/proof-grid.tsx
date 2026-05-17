'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Preuves & Crédibilité
 * 
 * Grid de 4-6 mini preuves compactes:
 * - Mielleries mobiles
 * - Certifié UE
 * - Coopérative
 * - Présence terrain
 * 
 * Style sobre, pas de métriques énormes.
 * Différenciation visuelle par type de preuve.
 */

import { 
  Ship, 
  BadgeCheck, 
  Users, 
  MapPin, 
  Route, 
  Hexagon,
  type LucideIcon 
} from 'lucide-react'
import type { ProofCard } from '@/app/[locale]/(site)/producers/_features/mock-producers'

const iconMap: Record<string, LucideIcon> = {
  Ship,
  BadgeCheck,
  Users,
  MapPin,
  Route,
  Hexagon,
}

const proofTypeStyles: Record<string, { bg: string; text: string }> = {
  certification: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  location: { bg: 'bg-sky-500/15', text: 'text-sky-400' },
  field_operation: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  partner: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  method: { bg: 'bg-rose-500/15', text: 'text-rose-400' },
  other: { bg: 'bg-white/10', text: 'text-white/60' },
}

const defaultStyles = { bg: 'bg-white/10', text: 'text-white/60' }

type ProofGridProps = {
  cards?: ProofCard[]
}

export function ProofGrid({ cards }: ProofGridProps) {
  if (!cards || cards.length === 0) return null

  return (
    <section className="mt-10 px-5">
      <h2 className="mb-4 text-lg font-bold text-white/90">
        Preuves & crédibilité
      </h2>
      
      <ul 
        className="grid grid-cols-2 gap-3 m-0 p-0 list-none"
        aria-label="Preuves de crédibilité du partenaire"
      >
        {cards.map((card, index) => {
          const Icon = iconMap[card.icon] || BadgeCheck
          const styles = proofTypeStyles[card.proofType] || defaultStyles
          
          return (
            <li key={index}>
              <article className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.bg}`}>
                  <Icon className={`h-4 w-4 ${styles.text}`} />
                </div>
                
                <div className="min-w-0">
                  {card.value && (
                    <p className={`text-sm font-black ${styles.text}`}>
                      {card.value}
                    </p>
                  )}
                  <p className="text-[12px] font-medium leading-tight text-white/70">
                    {card.label}
                  </p>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
