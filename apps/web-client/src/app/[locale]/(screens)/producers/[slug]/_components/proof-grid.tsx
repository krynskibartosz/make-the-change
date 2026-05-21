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

const cardStyle = {
  border: 'border-l-white/15',
  cardBg: 'bg-white/[3%]',
  icon: 'text-teal-400/60',
  label: 'text-white/50',
}

const GROUP_LABELS: Record<string, string> = {
  certification: 'Certifications & qualité',
  field_operation: 'Terrain & infrastructures',
  method: 'Formation & méthodes',
  partner: 'Partenariats',
  location: 'Localisation',
  other: 'Autres repères',
}

const GROUP_ORDER = ['certification', 'field_operation', 'method', 'partner', 'location', 'other']

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

function groupAllProofs(
  cards: ProofCard[],
): Array<{ type: string; label: string; items: ProofCard[] }> {
  const map = new Map<string, ProofCard[]>()
  for (const card of cards) {
    const t = card.proofType ?? 'other'
    if (!map.has(t)) map.set(t, [])
    map.get(t)!.push(card)
  }
  return GROUP_ORDER.filter((t) => map.has(t)).map((t) => ({
    type: t,
    label: GROUP_LABELS[t] ?? 'Autres repères',
    items: map.get(t)!,
  }))
}

type ProofGridProps = {
  cards?: ProofCard[]
}

export function ProofGrid({ cards }: ProofGridProps) {
  const [openLabel, setOpenLabel] = useState<string | null>(null)
  const [allProofsOpen, setAllProofsOpen] = useState(false)

  if (!cards || cards.length === 0) return null

  const primaryProofs = selectPrimaryProofs(cards)
  const primaryLabelSet = new Set(primaryProofs.map((c) => c.label))

  const allSecondary = cards
    .filter((c) => !primaryLabelSet.has(c.label))
    .filter((c) => c.value !== 'À confirmer')

  const PREVIEW_COUNT = 4
  const previewLabels = allSecondary.slice(0, PREVIEW_COUNT).map((c) => c.label)
  const remainingCount = allSecondary.length - PREVIEW_COUNT

  const groupedSecondary = groupAllProofs(allSecondary)

  const activeCard = openLabel ? primaryProofs.find((c) => c.label === openLabel) : null
  const activeContext = openLabel ? (primaryContext[openLabel] ?? null) : null

  return (
    <>
      <section className="px-4">
        {primaryProofs.length > 0 && (
          <div className={allSecondary.length > 0 ? 'mb-5' : ''}>
            <h2 className={typo.sectionTitle}>Ce qui est documenté</h2>
            <p className={`mt-1.5 mb-4 ${typo.sectionSubtitle}`}>
              Des repères concrets pour comprendre ce qui est suivi ou documenté.
            </p>

            <div className="space-y-2">
              {primaryProofs.map((card, index) => {
                const Icon = iconMap[card.icon] || BadgeCheck

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setOpenLabel(card.label)}
                    className={`flex w-full items-center gap-3 rounded-xl border border-white/[0.06] border-l-[3px] ${cardStyle.border} ${cardStyle.cardBg} px-3.5 py-3.5 text-left transition-opacity active:opacity-60`}
                  >
                    <Icon className={`h-[18px] w-[18px] shrink-0 ${cardStyle.icon}`} />

                    <div className="min-w-0 flex-1">
                      <p className={typo.cardTitle}>{card.label}</p>
                      {card.value && (
                        <p className={`mt-1 text-[13px] font-semibold leading-snug ${cardStyle.label}`}>
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

        {allSecondary.length > 0 && (
          <div>
            <h3 className="mb-2 text-[13px] font-semibold text-white/50">
              Autres repères documentés
            </h3>
            {previewLabels.length > 0 && (
              <p className="mb-3 text-[12px] leading-relaxed text-white/38">
                {previewLabels.join(' · ')}
                {remainingCount > 0 && ` · +${remainingCount} autres`}
              </p>
            )}
            <button
              type="button"
              onClick={() => setAllProofsOpen(true)}
              className="flex items-center gap-1 text-[13px] font-semibold text-white/55 transition-opacity active:opacity-60"
            >
              Voir tous les repères
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
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

      {/* Bottom sheet — repères complémentaires groupés par catégorie */}
      <MobileSheet
        isOpen={allProofsOpen}
        onClose={() => setAllProofsOpen(false)}
        title="Repères complémentaires"
      >
        <div className="pb-2">
          <div className="space-y-6">
            {groupedSecondary.map((group) => (
              <div key={group.type}>
                <p className="mb-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-white/35">
                  {group.label}
                </p>
                <ul className="space-y-3">
                  {group.items.map((card, i) => {
                    const Icon = iconMap[card.icon] || BadgeCheck
                    return (
                      <li key={i} className="flex items-start gap-2.5">
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30" />
                        <div>
                          <p className="text-[13px] text-white/72">{card.label}</p>
                          {card.value && card.value !== 'À confirmer' && (
                            <p className="mt-0.5 text-[12px] text-white/40">{card.value}</p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
            <p className={typo.modalNote}>
              Ces repères aident à comprendre le partenaire et ses méthodes. Ils ne constituent pas
              à eux seuls une preuve d&apos;impact mesuré.
            </p>
          </div>
        </div>
      </MobileSheet>
    </>
  )
}
