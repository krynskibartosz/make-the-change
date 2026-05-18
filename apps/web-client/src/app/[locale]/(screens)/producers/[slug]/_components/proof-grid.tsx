'use client'

/**
 * [ACTUEL_CODE] [SOURCE_PROTOTYPE]
 * Section Repères documentés — générique multi-partenaires.
 *
 * Architecture:
 * - 3 repères primaires: sélection dynamique (certification > field_operation > method)
 * - Bottom sheet par repère: primaryContext Ilanga ou card.detail/notes en fallback
 * - Chips secondaires: éléments restants, valeur "À confirmer" masquée
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
  Hammer,
  HeartHandshake,
  Hand,
  Bike,
  FlaskConical,
  Minimize2,
  Leaf,
  Waves,
  Sprout,
  HandHeart,
  Fish,
  Smartphone,
  Phone,
  type LucideIcon,
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
  Hammer,
  HeartHandshake,
  Hand,
  Bike,
  FlaskConical,
  Minimize: Minimize2,
  Minimize2,
  Leaf,
  Waves,
  Sprout,
  HandHeart,
  Fish,
  Smartphone,
  Phone,
}

const accentStyles = {
  certification: {
    border: 'border-l-emerald-500/40',
    cardBg: 'bg-emerald-950/20',
    icon: 'text-emerald-400/90',
    label: 'text-emerald-400/70',
  },
  field_operation: {
    border: 'border-l-amber-400/40',
    cardBg: 'bg-amber-950/20',
    icon: 'text-amber-400/90',
    label: 'text-amber-400/70',
  },
  method: {
    border: 'border-l-sky-400/40',
    cardBg: 'bg-sky-950/20',
    icon: 'text-sky-400/90',
    label: 'text-sky-400/70',
  },
}

// Contenu enrichi des bottom sheets — Ilanga uniquement (données historiques)
const primaryContext: Record<string, { body: string; notes: string[]; caution?: string }> = {
  'Certification Ecocert': {
    body: "Certains miels Ilanga Nature disposent d'une certification biologique Ecocert. Cette information permet de situer le niveau de contrôle qualité associé aux produits concernés.",
    notes: [
      "Miels biologiques certifiés Ecocert",
      "Contrôle humidité 16–18 %",
      "Mielleries homologuées Ministère malgache de l'Élevage",
    ],
    caution: "Cette certification concerne les produits documentés, pas nécessairement l'ensemble des actions terrain."
  },
  '2 mielleries mobiles': {
    body: "Ilanga utilise 2 unités mobiles pour collecter le miel au plus près des zones de production, notamment sur le canal des Pangalanes.",
    notes: [
      "2 unités mobiles de collecte",
      "Barge motorisée, canal des Pangalanes",
      "3 mielleries fixes : Antananarivo, Manakara, Fort-Dauphin",
    ],
    caution: "La proximité de collecte est une pratique opérationnelle documentée, pas une mesure d'impact environnemental."
  },
  "École d'apiculture": {
    body: "Ilanga forme des apiculteurs locaux à Fort-Dauphin dans une logique de transmission de savoir-faire et de structuration de la filière.",
    notes: [
      "Formation terrain pratique",
      "Localisation : Fort-Dauphin",
      "Accompagnement Miarakap / IIP — programme Mitsiry",
    ],
    caution: "Cette démarche de formation ne constitue pas une preuve d'impact mesuré."
  },
}

// Sélectionne 3 repères primaires: certification > field_operation > method, puis complétion
function selectPrimaryProofs(cards: ProofCard[]): ProofCard[] {
  const PRIORITY_TYPES: ProofCard['proofType'][] = ['certification', 'field_operation', 'method']
  const usedLabels = new Set<string>()
  const picks: ProofCard[] = []

  for (const type of PRIORITY_TYPES) {
    if (picks.length >= 3) break
    const found = cards.find(c => c.proofType === type && !usedLabels.has(c.label))
    if (found) {
      picks.push(found)
      usedLabels.add(found.label)
    }
  }

  // Complétion si moins de 3
  for (const card of cards) {
    if (picks.length >= 3) break
    if (!usedLabels.has(card.label)) {
      picks.push(card)
      usedLabels.add(card.label)
    }
  }

  return picks
}

type ProofGridProps = {
  cards?: ProofCard[]
}

export function ProofGrid({ cards }: ProofGridProps) {
  const [openLabel, setOpenLabel] = useState<string | null>(null)

  if (!cards || cards.length === 0) return null

  const primaryProofs = selectPrimaryProofs(cards)
  const primaryLabelSet = new Set(primaryProofs.map(c => c.label))

  const MAX_CHIPS = 5
  const allSecondary = cards
    .filter(c => !primaryLabelSet.has(c.label))
    .filter(c => c.value !== 'À confirmer')
  const secondaryProofs = allSecondary.slice(0, MAX_CHIPS)
  const hiddenCount = allSecondary.length - secondaryProofs.length

  const activeCard = openLabel ? primaryProofs.find(c => c.label === openLabel) : null
  const activeContext = openLabel ? primaryContext[openLabel] ?? null : null

  return (
    <>
      <section className="mt-8 px-4">
        {primaryProofs.length > 0 && (
          <div className="mb-4">
            <h2 className="text-[17px] font-bold text-white/80">
              Repères documentés
            </h2>
            <p className="mt-1 mb-4 text-[12px] leading-snug text-white/40">
              Quelques éléments concrets pour situer leur méthode et leur engagement.
            </p>

            <div className="space-y-2">
              {primaryProofs.map((card, index) => {
                const Icon = iconMap[card.icon] || BadgeCheck
                const style = accentStyles[card.proofType as keyof typeof accentStyles] || accentStyles.method

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setOpenLabel(card.label)}
                    className={`flex w-full items-center gap-3 rounded-xl border border-white/[0.06] border-l-[3px] ${style.border} ${style.cardBg} px-3.5 py-3.5 text-left transition-opacity active:opacity-60`}
                  >
                    <Icon className={`h-[18px] w-[18px] shrink-0 ${style.icon}`} />

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

        {secondaryProofs.length > 0 && (
          <div>
            <h3 className="mb-2.5 text-[12px] font-medium text-white/40">
              Autres éléments documentés
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {secondaryProofs.map((card, index) => {
                const Icon = iconMap[card.icon] || BadgeCheck

                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-[11px] font-medium text-white/65"
                  >
                    <Icon className="h-3 w-3 text-white/45" />
                    <span>{card.label}</span>
                  </span>
                )
              })}
              {hiddenCount > 0 && (
                <span className="inline-flex items-center rounded-full border border-white/[0.06] px-2.5 py-1 text-[11px] text-white/35">
                  +{hiddenCount} éléments
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Bottom sheet — repère détaillé */}
      <MobileSheet
        isOpen={openLabel !== null}
        onClose={() => setOpenLabel(null)}
        title={activeCard?.label}
      >
        {activeCard && (
          <div className="pb-2">
            <span className="mb-3 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-white/40">
              Information partenaire documentée
            </span>

            {activeContext ? (
              /* Contenu enrichi (Ilanga) */
              <>
                <p className="text-[13px] leading-relaxed text-white/65">
                  {activeContext.body}
                </p>

                {activeContext.notes.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                      Éléments liés
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {activeContext.notes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-white/60">
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-white/25" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeContext.caution && (
                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <p className="text-[11px] leading-snug text-white/40 italic">
                      {activeContext.caution}
                    </p>
                  </div>
                )}
              </>
            ) : (
              /* Fallback: contenu depuis card.detail / card.notes / card.value */
              <>
                {(activeCard.detail || activeCard.value) && (
                  <p className="text-[13px] leading-relaxed text-white/65">
                    {activeCard.detail || activeCard.value}
                  </p>
                )}

                {activeCard.notes && activeCard.notes.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                      Éléments liés
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {activeCard.notes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-white/60">
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-white/25" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeCard.caution && (
                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <p className="text-[11px] leading-snug text-white/40 italic">
                      {activeCard.caution}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </MobileSheet>
    </>
  )
}
