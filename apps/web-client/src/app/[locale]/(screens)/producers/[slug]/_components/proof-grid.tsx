'use client'

import {
  Activity,
  Award,
  BadgeCheck,
  Bike,
  Building,
  Camera,
  ChevronRight,
  Droplet,
  FlaskConical,
  GraduationCap,
  Hammer,
  Hand,
  Handshake,
  Heart,
  HeartHandshake,
  Hexagon,
  Leaf,
  type LucideIcon,
  MapPin,
  Minimize2,
  Package,
  Route,
  Shield,
  Ship,
  Sprout,
  TreePine,
  Truck,
  Users,
  Waves,
} from 'lucide-react'
import { useState } from 'react'
import type { ProofCard } from '@/app/[locale]/(site)/producers/_features/mock-producers'
import { MobileSheet } from '@/components/ui/mobile-sheet'
import { producerTypography as typo } from './producer-typography'
import { primaryContext } from './proof-card-context'

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
  Camera,
  Activity,
  Waves,
  Sprout,
}

const accentStyles: Record<string, { border: string; cardBg: string; icon: string; label: string }> = {
  certification: {
    border: 'border-l-emerald-500',
    cardBg: 'bg-emerald-950/[8%]',
    icon: 'text-emerald-400',
    label: 'text-emerald-400/85',
  },
  field_operation: {
    border: 'border-l-amber-400',
    cardBg: 'bg-amber-950/[8%]',
    icon: 'text-amber-400',
    label: 'text-amber-400/85',
  },
  method: {
    border: 'border-l-sky-400',
    cardBg: 'bg-sky-950/[8%]',
    icon: 'text-sky-400',
    label: 'text-sky-400/85',
  },
  location: {
    border: 'border-l-violet-400',
    cardBg: 'bg-violet-950/[8%]',
    icon: 'text-violet-400',
    label: 'text-violet-400/85',
  },
  partner: {
    border: 'border-l-rose-400',
    cardBg: 'bg-rose-950/[8%]',
    icon: 'text-rose-400',
    label: 'text-rose-400/85',
  },
  other: {
    border: 'border-l-white/20',
    cardBg: 'bg-white/[3%]',
    icon: 'text-white/45',
    label: 'text-white/55',
  },
}

const defaultAccent: { border: string; cardBg: string; icon: string; label: string } = {
  border: 'border-l-white/20',
  cardBg: 'bg-white/[3%]',
  icon: 'text-white/45',
  label: 'text-white/55',
}

// Sélectionne 3 repères primaires: certification > field_operation > method, puis complétion
function selectPrimaryProofs(cards: ProofCard[]): ProofCard[] {
  const PRIORITY_TYPES: ProofCard['proofType'][] = ['certification', 'field_operation', 'method']
  const usedLabels = new Set<string>()
  const picks: ProofCard[] = []

  for (const type of PRIORITY_TYPES) {
    if (picks.length >= 3) break
    const found = cards.find((c) => c.proofType === type && !usedLabels.has(c.label))
    if (found) {
      picks.push(found)
      usedLabels.add(found.label)
    }
  }

  for (const card of cards) {
    if (picks.length >= 3) break
    if (!usedLabels.has(card.label)) {
      picks.push(card)
      usedLabels.add(card.label)
    }
  }

  return picks
}

function cardHasDetail(card: ProofCard): boolean {
  return Boolean(card.detail) || (card.notes?.length ?? 0) > 0 || Boolean(card.caution)
}

type ProofGridProps = {
  cards?: ProofCard[]
}

export function ProofGrid({ cards }: ProofGridProps) {
  const [openLabel, setOpenLabel] = useState<string | null>(null)
  const [openSecondaryLabel, setOpenSecondaryLabel] = useState<string | null>(null)
  const [showAllSecondary, setShowAllSecondary] = useState(false)

  if (!cards || cards.length === 0) return null

  const primaryProofs = selectPrimaryProofs(cards)
  const primaryLabelSet = new Set(primaryProofs.map((c) => c.label))

  const MAX_CHIPS = 4
  const allSecondary = cards
    .filter((c) => !primaryLabelSet.has(c.label))
    .filter((c) => c.value !== 'À confirmer')
  const secondaryProofs = showAllSecondary ? allSecondary : allSecondary.slice(0, MAX_CHIPS)
  const hiddenCount = allSecondary.length - MAX_CHIPS

  const activeCard = openLabel ? primaryProofs.find((c) => c.label === openLabel) : null
  const activeContext = openLabel ? (primaryContext[openLabel] ?? null) : null
  const activeSecondaryCard = openSecondaryLabel
    ? allSecondary.find((c) => c.label === openSecondaryLabel)
    : null

  return (
    <>
      <section className="px-4">
        {primaryProofs.length > 0 && (
          <div className="mb-4">
            <h2 className={typo.sectionTitle}>Ce qui est documenté</h2>
            <p className={`mt-1.5 mb-4 ${typo.sectionSubtitle}`}>
              Des repères concrets pour comprendre ce qui est suivi ou documenté.
            </p>

            <div className="space-y-2">
              {primaryProofs.map((card, index) => {
                const Icon = iconMap[card.icon] || BadgeCheck
                const style = accentStyles[card.proofType] ?? defaultAccent

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setOpenLabel(card.label)}
                    className={`flex w-full items-center gap-3 rounded-xl border border-white/[0.06] border-l-[3px] ${style.border} ${style.cardBg} px-3.5 py-3.5 text-left transition-opacity active:opacity-60`}
                  >
                    <Icon className={`h-[18px] w-[18px] shrink-0 ${style.icon}`} />

                    <div className="min-w-0 flex-1">
                      <p className={typo.cardTitle}>{card.label}</p>
                      {card.value && (
                        <p className={`mt-1 text-[13px] font-semibold leading-snug ${style.label}`}>
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
            <h3 className="mb-3 text-[13px] font-semibold text-white/50">
              Repères complémentaires
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {secondaryProofs.map((card, index) => {
                const Icon = iconMap[card.icon] || BadgeCheck
                const hasDetail = cardHasDetail(card)

                if (hasDetail) {
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setOpenSecondaryLabel(card.label)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-[12px] font-semibold leading-tight text-white/72 transition-opacity active:opacity-60"
                    >
                      <Icon className="h-3 w-3 text-white/45" />
                      <span>{card.label}</span>
                      <ChevronRight className="h-2.5 w-2.5 text-white/30" />
                    </button>
                  )
                }

                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-[12px] font-semibold leading-tight text-white/72"
                  >
                    <Icon className="h-3 w-3 text-white/45" />
                    <span>{card.label}</span>
                  </span>
                )
              })}
              {!showAllSecondary && hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAllSecondary(true)}
                  className="inline-flex items-center rounded-full border border-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-white/45 transition-opacity active:opacity-60"
                >
                  +{hiddenCount} autres
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Bottom sheet — repère primaire détaillé */}
      <MobileSheet
        isOpen={openLabel !== null}
        onClose={() => setOpenLabel(null)}
        title={activeCard?.label}
      >
        {activeCard && (
          <div className="pb-2">
            <span className="mb-4 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white/48">
              Information partenaire documentée
            </span>

            {activeContext ? (
              <>
                <p className={typo.modalBody}>{activeContext.body}</p>

                {activeContext.notes.length > 0 && (
                  <div className="mt-4">
                    <p className={`mb-3 ${typo.modalLabel}`}>Éléments liés</p>
                    <ul className="flex flex-col gap-1.5">
                      {activeContext.notes.map((note, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[14px] leading-relaxed text-white/64"
                        >
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-white/25" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeContext.caution && (
                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <p className={typo.modalNote}>{activeContext.caution}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {(activeCard.detail || activeCard.value) && (
                  <p className={typo.modalBody}>{activeCard.detail || activeCard.value}</p>
                )}

                {activeCard.notes && activeCard.notes.length > 0 && (
                  <div className="mt-4">
                    <p className={`mb-3 ${typo.modalLabel}`}>Éléments liés</p>
                    <ul className="flex flex-col gap-1.5">
                      {activeCard.notes.map((note, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[14px] leading-relaxed text-white/64"
                        >
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-white/25" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeCard.caution && (
                  <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                    <p className={typo.modalNote}>{activeCard.caution}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </MobileSheet>

      {/* Bottom sheet — repère complémentaire détaillé */}
      <MobileSheet
        isOpen={openSecondaryLabel !== null}
        onClose={() => setOpenSecondaryLabel(null)}
        title={activeSecondaryCard?.label}
      >
        {activeSecondaryCard && (
          <div className="pb-2">
            <span className="mb-4 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white/48">
              Information partenaire documentée
            </span>

            {(activeSecondaryCard.detail || activeSecondaryCard.value) && (
              <p className={typo.modalBody}>
                {activeSecondaryCard.detail || activeSecondaryCard.value}
              </p>
            )}

            {activeSecondaryCard.notes && activeSecondaryCard.notes.length > 0 && (
              <div className="mt-4">
                <p className={`mb-3 ${typo.modalLabel}`}>Éléments liés</p>
                <ul className="flex flex-col gap-1.5">
                  {activeSecondaryCard.notes.map((note, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-[14px] leading-relaxed text-white/64"
                    >
                      <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-white/25" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeSecondaryCard.caution && (
              <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                <p className={typo.modalNote}>{activeSecondaryCard.caution}</p>
              </div>
            )}
          </div>
        )}
      </MobileSheet>
    </>
  )
}
