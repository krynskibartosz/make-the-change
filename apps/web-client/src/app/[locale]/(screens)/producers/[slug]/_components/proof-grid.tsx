'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Repères de confiance
 * 
 * Architecture:
 * - 3 repères majeurs: cards sobres, accent coloré sur icône + liseré gauche uniquement
 * - Bottom sheet par repère: contexte + nuances
 * - 7 chips secondaires max: éléments documentés lisibles
 * - Chips partenariats non vérifiés masqués
 */

import { useState } from 'react'
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
  ChevronRight,
  type LucideIcon 
} from 'lucide-react'
import { MobileSheet } from '@/components/ui/mobile-sheet'
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

// Accent coloré uniquement — fond toujours sombre
const accentStyles = {
  certification: {
    border: 'border-l-emerald-500/50',
    icon: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
    label: 'text-emerald-400/80',
  },
  field_operation: {
    border: 'border-l-amber-400/50',
    icon: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
    label: 'text-amber-400/80',
  },
  method: {
    border: 'border-l-sky-400/50',
    icon: 'text-sky-400',
    iconBg: 'bg-sky-500/15',
    label: 'text-sky-400/80',
  },
}

// Contexte bottom sheet par repère principal
const primaryContext: Record<string, { body: string; notes: string[] }> = {
  'Certification Ecocert': {
    body: "Certains miels Ilanga Nature disposent d'une certification biologique Ecocert. Cette information permet de situer le niveau de contrôle qualité associé aux produits concernés.",
    notes: [
      "Certification biologique Ecocert",
      "Contrôle humidité 16\u201318\u202f%",
      "Mielleries homologuées Ministère malgache de l'\u00c9levage",
    ]
  },
  '2 mielleries mobiles': {
    body: "Ilanga utilise 2 unités mobiles pour collecter le miel au plus près des zones de production, notamment sur le canal des Pangalanes.",
    notes: [
      "2 unités mobiles de collecte",
      "Barge motorisée sur le canal des Pangalanes",
      "3 mielleries fixes : Antananarivo, Manakara, Fort-Dauphin",
    ]
  },
  "\u00c9cole d'apiculture": {
    body: "Ilanga forme des apiculteurs locaux à Fort-Dauphin. Cette école s'inscrit dans une logique de transmission de savoir-faire, sans constituer une preuve d'impact mesuré.",
    notes: [
      "Formation terrain pratique",
      "Localisation : Fort-Dauphin",
      "Accompagnement Miarakap / IIP (programme Mitsiry)",
    ]
  },
}

type ProofGridProps = {
  cards?: ProofCard[]
}

export function ProofGrid({ cards }: ProofGridProps) {
  const [openLabel, setOpenLabel] = useState<string | null>(null)

  if (!cards || cards.length === 0) return null

  const primaryLabels = [
    'Certification Ecocert',
    '2 mielleries mobiles',
    "\u00c9cole d'apiculture",
  ]

  // Chips masquées : partenariats non vérifiés
  const hiddenChipLabels = [
    'Partenariat USAID',
    'Partenariat ADAMA',
    'Partenariat Hope Madagascar',
  ]

  const primaryProofs = primaryLabels
    .map((label) => cards.find((card) => card.label === label))
    .filter((card): card is ProofCard => Boolean(card))

  const secondaryProofs = cards
    .filter(c => !primaryProofs.some(p => p.label === c.label))
    .filter(c => !hiddenChipLabels.includes(c.label))
    .slice(0, 7)

  const activeCard = openLabel ? primaryProofs.find(c => c.label === openLabel) : null
  const activeContext = openLabel ? primaryContext[openLabel] : null

  return (
    <>
      <section className="mt-8 px-4">
        {/* En-tête */}
        {primaryProofs.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[17px] font-bold text-white/80">
              Repères de confiance
            </h2>
            <p className="mt-1 mb-4 text-[12px] leading-snug text-white/40">
              Quelques éléments documentés pour situer leur travail sur le terrain.
            </p>

            {/* Cards sobres — liseré gauche coloré, fond sombre */}
            <div className="space-y-2">
              {primaryProofs.map((card, index) => {
                const Icon = iconMap[card.icon] || BadgeCheck
                const style = accentStyles[card.proofType as keyof typeof accentStyles] || accentStyles.method

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setOpenLabel(card.label)}
                    className={`flex w-full items-center gap-3 rounded-lg border border-white/[0.07] border-l-2 ${style.border} bg-white/[0.03] px-3 py-3 text-left transition-opacity active:opacity-60`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${style.iconBg}`}>
                      <Icon className={`h-4 w-4 ${style.icon}`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium leading-tight text-white/85">
                        {card.label}
                      </p>
                      {card.value && (
                        <p className={`mt-0.5 text-[11px] leading-snug ${style.label}`}>
                          {card.value}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Chips secondaires */}
        {secondaryProofs.length > 0 && (
          <div>
            <h3 className="mb-2.5 text-[12px] font-medium text-white/40">
              Autres éléments documentés
            </h3>

            <div className="flex flex-wrap gap-2">
              {secondaryProofs.map((card, index) => {
                const Icon = iconMap[card.icon] || BadgeCheck

                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-white/60"
                  >
                    <Icon className="h-3 w-3 text-white/40" />
                    <span>{card.label}</span>
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Bottom sheet — contexte repère */}
      <MobileSheet
        isOpen={openLabel !== null}
        onClose={() => setOpenLabel(null)}
        title={activeCard?.label}
      >
        {activeCard && activeContext && (
          <div className="pb-2 pt-1">
            <p className="text-[14px] leading-relaxed text-white/65">
              {activeContext.body}
            </p>

            <div className="mt-5">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                Éléments liés
              </p>
              <ul className="flex flex-col gap-2">
                {activeContext.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-white/60">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-[10px] text-white/25">
              Information partenaire documentée
            </p>
          </div>
        )}
      </MobileSheet>
    </>
  )
}
