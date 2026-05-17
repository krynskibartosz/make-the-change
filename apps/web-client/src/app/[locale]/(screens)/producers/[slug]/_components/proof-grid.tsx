'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Preuves & Crédibilité - Hiérarchisée mobile-first
 * 
 * Architecture:
 * - 3 preuves majeures en cartes éditoriales
 * - Preuves secondaires en pills compactes
 * - Palette réduite: vert (confiance), or (terrain), bleu (structure)
 */

import { 
  Ship, 
  BadgeCheck, 
  Users, 
  MapPin, 
  Route, 
  Hexagon,
  Award,
  Building,
  GraduationCap,
  Droplet,
  Truck,
  Handshake,
  Shield,
  Package,
  TreePine,
  Heart,
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
  Award,
  Building,
  GraduationCap,
  Droplet,
  Truck,
  Handshake,
  Shield,
  Package,
  TreePine,
  Heart,
}

// Palette réduite: vert (certif/confiance), or (terrain/ops), bleu (structure)
const primaryStyles = {
  certification: { 
    bg: 'bg-emerald-500/20', 
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    iconBg: 'bg-emerald-500/30'
  },
  field_operation: { 
    bg: 'bg-amber-500/20', 
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/30'
  },
  method: { 
    bg: 'bg-sky-500/20', 
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    iconBg: 'bg-sky-500/30'
  },
}

const secondaryStyles = {
  partner: 'bg-white/5 text-white/50',
  location: 'bg-white/5 text-white/50',
  other: 'bg-white/5 text-white/50',
}

type ProofGridProps = {
  cards?: ProofCard[]
}

export function ProofGrid({ cards }: ProofGridProps) {
  if (!cards || cards.length === 0) return null

  const primaryLabels = [
    'Certification Ecocert',
    '2 mielleries mobiles',
    "École d'apiculture",
  ]
  const primaryProofs = primaryLabels
    .map((label) => cards.find((card) => card.label === label))
    .filter((card): card is ProofCard => Boolean(card))
  
  const secondaryProofs = cards.filter(c => 
    !primaryProofs.some((primary) => primary.label === c.label)
  )

  return (
    <section className="mt-8 px-4">
      {/* ── Preuves majeures ── */}
      {primaryProofs.length > 0 && (
        <div className="mb-4">
          <h2 className="mb-3 text-[15px] font-bold text-white/80">
            Points forts
          </h2>
          
          <div className="space-y-2">
            {primaryProofs.map((card, index) => {
              const Icon = iconMap[card.icon] || BadgeCheck
              const style = primaryStyles[card.proofType as keyof typeof primaryStyles] || primaryStyles.method
              
              return (
                <article 
                  key={index}
                  className={`flex items-center gap-3 rounded-lg border ${style.border} ${style.bg} p-3`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}>
                    <Icon className={`h-5 w-5 ${style.text}`} />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    {card.value && (
                      <p className={`text-[15px] font-bold ${style.text} leading-tight`}>
                        {card.value}
                      </p>
                    )}
                    <p className="text-[13px] font-medium leading-snug text-white/70">
                      {card.label}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
      
      {/* ── Preuves secondaires (pills) ── */}
      {secondaryProofs.length > 0 && (
        <div>
          <h3 className="mb-2 text-[13px] font-medium text-white/50">
            Autres éléments documentés
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {secondaryProofs.map((card, index) => {
              const Icon = iconMap[card.icon] || BadgeCheck
              const styleClass = secondaryStyles[card.proofType as keyof typeof secondaryStyles] || secondaryStyles.other
              
              return (
                <span 
                  key={index}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${styleClass}`}
                >
                  <Icon className="h-3 w-3 opacity-70" />
                  <span>{card.label}</span>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
