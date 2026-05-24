'use client'

import { support } from '@make-the-change/core'
import {
  Button,
  Card,
  CardContent,
} from '@make-the-change/core/ui'
import { Elements, ExpressCheckoutElement, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Activity, ArrowLeft, Bug, Camera, CheckCircle2, ChevronRight, Cloud, Droplet, Droplets, Fish, Flower2, Grid3X3, Leaf, Loader2, Lock, Mail, TreePine, Waves } from 'lucide-react'
import { MobileSheet } from '../../_components/shared/mobile-sheet'
import { CurrencyAmount, CurrencyIcon } from '@/components/currency'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useHaptic } from '@/hooks/use-haptic'
import { cn } from '@/lib/utils'
import { ProjectImpactCalculator } from '@/app/[locale]/(screens)/projects/[slug]/_components/shared/impact-calculator'
import { getProjectImpactMetrics } from '@/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics'
import { buildProjectImpactItems } from '@/app/[locale]/(screens)/projects/[slug]/_utils/build-project-impact-items'
import type { ProjectImpactItem, ImpactIconKey } from '@/app/[locale]/(screens)/projects/[slug]/_utils/build-project-impact-items'
import { getMockSpeciesContextClient } from '@/lib/mock/mock-biodex'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import { formatAmountPlain, formatAmountNumber } from '@/lib/formatters'
import type { ProjectImpact, ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { sanitizeImageUrl } from '@/lib/image-url'

const SPECIES_THUMBNAILS: Record<string, string> = {
  'species-abeille-noire': '/images/species-thumbnails/abeille-noire.png',
  'species-indri': '/images/species-thumbnails/indri.png',
  'species-sifaka-diademe': '/images/species-thumbnails/sifaka-diademe.png',
  'species-vari-noir-blanc': '/images/species-thumbnails/vari-noir-blanc.png',
  'species-cameleon-parson': '/images/species-thumbnails/cameleon-parson.png',
  'species-cameleon-panthere': '/images/species-thumbnails/cameleon-panthere.png',
  'species-charancon-girafe': '/images/species-thumbnails/charancon-girafe.png',
  'species-grenouille-tomate': '/images/species-thumbnails/grenouille-tomate.png',
  'species-martin-chasseur-pygme': '/images/species-thumbnails/martin-chasseur-pygmee.png',
  'species-coua-bleu': '/images/species-thumbnails/coua-bleu.png',
  'species-gecko-diurne': '/images/species-thumbnails/gecko-diurne.png',
  'species-chouette-cheveche': '/images/species-thumbnails/chouette-cheveche.png',
  'species-liotrigona-bitika': '/images/species-thumbnails/liotrigona-bitika.png',
}

type FlowStep = 'impact' | 'payment' | 'success'
type LootPhase = 'tension' | 'flash' | 'euphoria' | 'resolved'
type SheetKind = 'rewards' | 'tracking' | 'impact' | null

const IMPACT_ICON_MAP: Record<ImpactIconKey, React.ComponentType<{ className?: string }>> = {
  bees:     Bug,
  honey:    Droplets,
  flowers:  Flower2,
  co2:      Cloud,
  tree:     TreePine,
  oil:      Droplet,
  coral:    Waves,
  area:     Grid3X3,
  fish:     Fish,
  survival: Activity,
}
const FLOW_STEPS: FlowStep[] = ['impact', 'payment', 'success']
const QUICK_AMOUNTS = [20, 50, 100]
const REWARD_PREVIEW_IMAGE = '/images/dioramas/transparent/abeille-noire.png' // Image générique de fallback
// Helpers moved to bottom
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

const stripeAppearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#a3e635',
    colorBackground: 'rgba(255,255,255,0.02)',
    colorText: '#ffffff',
    colorDanger: '#ef4444',
    borderRadius: '12px',
  },
  rules: {
    '.Input': {
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid rgba(163,230,53,0.6)',
      boxShadow: '0 0 0 1px rgba(163,230,53,0.3)',
    },
    '.Label': {
      color: 'rgba(255,255,255,0.65)',
      fontWeight: '600',
      letterSpacing: '0.02em',
    },
  },
} as const

type ProjectSupportOneFlowProps = {
  project: {
    id: string
    slug: string
    name: string
    type: support.SupportType
    coverImage?: string | null
    currentFunding?: number | null
    targetBudget?: number | null
    expectedImpact?: ProjectImpact | null
  }
  presentation?: 'modal' | 'page'
  isAuthenticated: boolean
  source?: string
  initialAmount?: number
  discoveredSpeciesId?: string | null
  species?: ProjectSpecies[]
}

function CreditsIcon({ className }: { className?: string }) {
  return <CurrencyIcon kind="impactCredits" className={className} />
}

function NextStepLine({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="flex items-start gap-3 border-b border-white/[0.06] py-3.5 last:border-0">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.055] text-lime-300">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-black leading-tight text-white">{title}</p>
        <p className="mt-1 text-[11.5px] leading-snug text-white/48">{body}</p>
      </div>
    </div>
  )
}


function AfterSupportBlock({
  credits,
  species,
  onOpenRewards,
  onOpenTracking,
}: {
  credits: number
  species: ProjectSpecies[]
  onOpenRewards: () => void
  onOpenTracking: () => void
}) {
  const keyCount = species.filter((sp) => isKeyRole(sp.role)).length
  const assocCount = species.length - keyCount
  const speciesSubtitle =
    species.length === 0
      ? null
      : keyCount === 1 && assocCount === 0
        ? '1 espèce clé'
        : keyCount === 1
          ? `1 espèce clé · ${assocCount} associée${assocCount > 1 ? 's' : ''}`
          : keyCount > 1
            ? `${keyCount} espèces clés${assocCount > 0 ? ` · ${assocCount} associée${assocCount > 1 ? 's' : ''}` : ''}`
            : `${species.length} espèce${species.length > 1 ? 's' : ''} liée${species.length > 1 ? 's' : ''}`

  const visibleSpecies = species.slice(0, 2)
  const remainingSpecies = Math.max(species.length - visibleSpecies.length, 0)

  return (
    <div>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        Après votre soutien
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]">
        <button
          type="button"
          onClick={onOpenRewards}
          className="flex w-full items-center gap-3 border-b border-white/[0.06] px-4 py-3.5 text-left active:bg-white/[0.03]"
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber-300/16 bg-amber-300/10 text-amber-300">
            <CurrencyIcon kind="impactCredits" className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-white">{credits} Crédits Impact</p>
            <p className="mt-0.5 text-[11px] leading-snug text-white/40">
              Utilisables dans les avantages partenaires.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
        </button>
        <button
          type="button"
          onClick={onOpenTracking}
          className={cn(
            'flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-white/[0.03]',
            species.length > 0 ? 'border-b border-white/[0.06]' : '',
          )}
        >
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.055] text-lime-300">
            <Camera className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-white">Suivi du projet</p>
            <p className="mt-0.5 text-[11px] leading-snug text-white/40">
              Photos, étapes et évolution du terrain dans le temps.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
        </button>
        {species.length > 0 ? (
          <button
            type="button"
            onClick={onOpenRewards}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-white/[0.03]"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.055] text-lime-300">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-black text-white">Espèces liées au projet</p>
              {speciesSubtitle ? (
                <p className="mt-0.5 text-[11px] leading-snug text-white/40">{speciesSubtitle}</p>
              ) : null}
            </div>
            <div className="mr-1 flex shrink-0 -space-x-1.5">
              {visibleSpecies.map((sp) => {
                const imageUrl = SPECIES_THUMBNAILS[sp.id] ?? sanitizeImageUrl(sp.icon)
                return (
                  <div
                    key={sp.id}
                    className="h-6 w-6 overflow-hidden rounded-lg border-2 border-[#0B0F15] bg-white/[0.06]"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={sp.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                )
              })}
              {remainingSpecies > 0 ? (
                <div className="grid h-6 w-6 place-items-center rounded-lg border border-[#08080F] bg-white/[0.06] text-[8px] font-black text-white/40">
                  +{remainingSpecies}
                </div>
              ) : null}
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-white/25" />
          </button>
        ) : null}
      </div>
    </div>
  )
}

function IncludedSummary({
  credits,
  species,
  onOpen,
}: {
  credits: number
  species: ProjectSpecies[]
  onOpen: () => void
}) {
  return (
    <div>
      <p className="mb-3.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        Après votre soutien
      </p>
      <div className="space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-amber-300/16 bg-amber-300/10 text-amber-300">
            <CurrencyIcon kind="impactCredits" className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-white">{credits} Crédits Impact</p>
            <p className="text-[11px] leading-snug text-white/40">Utilisables dans les avantages partenaires.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.055] text-lime-300">
            <Camera className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-white">Suivi du projet inclus</p>
            <p className="text-[11px] leading-snug text-white/40">Photos, étapes et évolution du terrain.</p>
          </div>
        </div>
        {species.length > 0 ? (
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.055] text-lime-300">
              <Leaf className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-black text-white">
                {species.length === 1
                  ? (species[0]?.name ?? 'Espèce liée')
                  : `${species.length} espèces liées au projet`}
              </p>
              <p className="text-[11px] leading-snug text-white/40">BioDex débloquable après votre soutien.</p>
            </div>
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="mt-4 flex items-center gap-1 text-[12px] font-black text-white/35 active:text-white/55"
      >
        Comprendre ce qui est inclus
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function RewardsSheet({
  isOpen,
  onClose,
  credits,
  species,
  amount,
}: {
  isOpen: boolean
  onClose: () => void
  credits: number
  species: ProjectSpecies[]
  amount: number
}) {
  const primary = species.find((sp) => isKeyRole(sp.role)) ?? species[0]

  return (
    <MobileSheet isOpen={isOpen} onClose={onClose} title="Crédits Impact & BioDex">
      <p className="mt-1 text-sm leading-relaxed text-white/50">
        Votre soutien de {amount}&nbsp;€ reste rattaché à ce projet. Les Crédits Impact et le BioDex servent à garder une trace, débloquer des avantages et prolonger la relation avec le terrain.
      </p>

      {/* Crédits Impact */}
      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
          Crédits Impact
        </p>
        <div className="mt-2 flex items-center gap-2.5">
          <CurrencyIcon kind="impactCredits" className="h-5 w-5 text-amber-300" />
          <p className="text-[15px] font-black text-white">{credits} Crédits</p>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-white/50">
          Utilisables dans les avantages partenaires sélectionnés.
        </p>
      </div>

      {/* BioDex */}
      {species.length > 0 ? (
        <div className="mt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
            BioDex lié
          </p>
          <div>
            {species.map((sp) => {
              const imageUrl = SPECIES_THUMBNAILS[sp.id] ?? sanitizeImageUrl(sp.icon)
              const isKey = isKeyRole(sp.role)
              return (
                <div
                  key={sp.id}
                  className="flex items-center gap-3 border-b border-white/[0.06] py-3 last:border-0"
                >
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={sp.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white">{sp.name}</p>
                    {sp.scientificName ? (
                      <p className="mt-0.5 text-[11px] italic text-white/30">{sp.scientificName}</p>
                    ) : null}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${
                      isKey
                        ? 'bg-lime-300/15 text-lime-300/80'
                        : 'bg-white/[0.06] text-white/35'
                    }`}
                  >
                    {isKey ? 'Révélée' : 'Liée'}
                  </span>
                </div>
              )
            })}
          </div>
          {species.length > 1 && primary ? (
            <p className="mt-2 text-xs leading-relaxed text-white/35">
              {primary.name} est révélée maintenant. Les autres restent liées au projet.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* À ne pas confondre */}
      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
          À ne pas confondre
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Ce n&apos;est pas un cashback, pas un rendement financier, pas une part du projet et pas un achat produit automatique.
        </p>
      </div>

      <p className="mt-5 pb-2 text-xs leading-relaxed text-white/30">
        Pas de rendement financier. Pas de reçu fiscal.
      </p>
    </MobileSheet>
  )
}

function TrackingSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const steps = [
    {
      title: 'Votre soutien est enregistré',
      body: 'Il est rattaché au projet, au montant choisi et au producteur.',
    },
    {
      title: 'Le partenaire agit sur le terrain',
      body: "Le soutien contribue à l'équipement, au suivi ou à la valorisation de la filière.",
    },
    {
      title: "Vous suivez l'évolution",
      body: 'Photos, mises à jour ou données peuvent enrichir votre trace dans le temps.',
    },
  ]

  return (
    <MobileSheet isOpen={isOpen} onClose={onClose} title="Suivi du soutien">
      <p className="mt-1 text-sm text-white/50">Ce qui se passe après votre paiement.</p>

      <div className="mt-4">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1
          return (
            <div key={s.title} className="relative grid grid-cols-[32px_1fr] gap-3 py-4">
              {!isLast ? (
                <div className="absolute left-[15px] top-[52px] h-[calc(100%-20px)] w-px bg-white/[0.08]" />
              ) : null}
              <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-black text-white/50">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-black text-white">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/50">{s.body}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">
          À garder clair
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Le suivi documente la relation avec le terrain, mais ne garantit pas un impact mesuré immédiatement.
        </p>
      </div>

      <p className="mt-5 pb-2 text-xs leading-relaxed text-white/30">
        Pas de rendement financier. Pas de reçu fiscal.
      </p>
    </MobileSheet>
  )
}

function ImpactSheet({
  isOpen,
  onClose,
  items,
}: {
  isOpen: boolean
  onClose: () => void
  items: ProjectImpactItem[]
}) {
  return (
    <MobileSheet isOpen={isOpen} onClose={onClose} title="Données d'impact">
      <p className="mt-1 text-sm text-white/50">
        Des ordres de grandeur pour comprendre ce que représente le soutien.
      </p>

      <div className="mt-4">
        {items.map((item) => {
          const Icon = IMPACT_ICON_MAP[item.iconKey]
          return (
            <div key={item.id} className="border-b border-white/[0.06] py-4 last:border-0">
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                    item.main
                      ? 'bg-amber-300/10 text-amber-300'
                      : 'bg-white/[0.05] text-white/40'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-white">{item.label}</p>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-white/45">{item.meaning}</p>
                  {item.estimate ? (
                    <p className="mt-1 text-[10.5px] text-white/28">{item.estimate}</p>
                  ) : null}
                </div>
                <div className="ml-2 shrink-0 text-right">
                  {item.prefix ? (
                    <p className="text-[8px] font-black uppercase tracking-[0.08em] text-white/28">
                      {item.prefix}
                    </p>
                  ) : null}
                  <p className="text-xl font-black tracking-tight text-white tabular-nums">
                    {item.value}
                    {item.unit ? (
                      <span className="ml-0.5 text-[11px] text-white/42">{item.unit}</span>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 pb-2 text-xs leading-relaxed text-white/25">
        Ces chiffres sont des estimations pédagogiques. Ils ne signifient pas que chaque abeille, fleur ou kg de miel est suivi individuellement.
      </p>
    </MobileSheet>
  )
}

function isKeyRole(role: string | undefined | null): boolean {
  const r = role?.toLowerCase() ?? ''
  return r.includes('cle') || r.includes('clé')
}

// Helpers moved to bottom
export function ProjectSupportOneFlow({
  project,
  presentation = 'page',
  isAuthenticated,
  initialAmount,
  discoveredSpeciesId = null,
  species,
}: ProjectSupportOneFlowProps) {
  const t = useTranslations('projects.support_page')
  const router = useRouter()
  const haptic = useHaptic()

  const [discoveredSpecies, setDiscoveredSpecies] = useState<{ name_default: string } | null>(null)

  const rules = support.getSupportRules(project.type)

  useEffect(() => {
    if (discoveredSpeciesId) {
      getMockSpeciesContextClient(discoveredSpeciesId).then((species) => {
        if (species) {
          setDiscoveredSpecies({ name_default: species.name_default })
        }
      })
    }
  }, [discoveredSpeciesId])

  if (!rules) {
    return (
      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Ce projet ne peut pas être soutenu pour le moment.
        </CardContent>
      </Card>
    )
  }

  const min = rules.min_amount
  const max = rules.max_amount
  const defaultAmount = clampAmount(initialAmount ?? 50, min, max)

  const [step, setStep] = useState<FlowStep>('impact')
  const [amountEur, setAmountEur] = useState(defaultAmount)
  const [amountInput, setAmountInput] = useState(String(defaultAmount))
  const [guestEmail, setGuestEmail] = useState('')
  const [guestEmailError, setGuestEmailError] = useState<string | null>(null)
  const [claimSaved, setClaimSaved] = useState(false)
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)
  const [phase, setPhase] = useState<LootPhase>('tension')
  const [isProcessing, setIsProcessing] = useState(false)
  const [sheet, setSheet] = useState<SheetKind>(null)
  const amountInputRef = useRef<HTMLInputElement | null>(null)

  const stepIndex = FLOW_STEPS.indexOf(step)

  const points = useMemo(() => {
    return support.calculateSupportPoints({
      type: project.type,
      amount_eur: amountEur,
      bonus_percentage: rules.expected_bonus,
    })
  }, [amountEur, project.type, rules.expected_bonus])

  const impactItems = useMemo(() => buildProjectImpactItems({
    amount: amountEur,
    projectType: project.type,
    isDonationProject: false,
    donationOptions: null,
    projectImpact: project.expectedImpact ?? null,
  }), [amountEur, project.type, project.expectedImpact])
  const formattedAmount = formatAmountNumber(amountEur)
  const supportMetrics = getProjectImpactMetrics({
    amount: amountEur,
    projectType: project.type,
    projectImpact: project.expectedImpact ?? null,
  })
  const protectedBees = supportMetrics.kind === 'bees' ? formatAmountNumber(supportMetrics.bees) : formatAmountNumber(0)
  const supportImpactLabel =
    supportMetrics.kind === 'bees'
      ? `${protectedBees} abeilles`
      : supportMetrics.kind === 'orchard'
        ? `${formatAmountNumber(supportMetrics.olivesSupported)} oliviers`
        : 'ce projet'

  useEffect(() => {
    if (step !== 'success') return

    setPhase('tension')
    haptic.mediumTap()

    const flashTimerId = window.setTimeout(() => {
      setPhase('flash')
      haptic.trigger([30, 200, 30])
    }, 1300)
    const euphoriaTimerId = window.setTimeout(() => {
      setPhase('euphoria')
      haptic.trigger([60, 50, 80])
    }, 1500)
    const resolvedTimerId = window.setTimeout(() => setPhase('resolved'), 2100)
    const boomTimerId = window.setTimeout(() => {
      haptic.trigger([250])
    }, 1720)

    return () => {
      window.clearTimeout(flashTimerId)
      window.clearTimeout(euphoriaTimerId)
      window.clearTimeout(resolvedTimerId)
      window.clearTimeout(boomTimerId)
    }
  }, [haptic, step])

  useEffect(() => {
    if (step !== 'success' || phase !== 'euphoria') return

    void import('canvas-confetti')
      .then(({ default: confetti }) => {
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.62 },
          colors: ['#4ade80', '#86efac', '#a3e635', '#d9f99d', '#bbf7d0'],
          scalar: 0.85,
          gravity: 0.7,
          drift: 0.4,
        })
        window.setTimeout(() => {
          confetti({
            particleCount: 28,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#84cc16', '#16a34a', '#15803d', '#d1fae5', '#6ee7b7'],
            scalar: 0.75,
            gravity: 0.6,
            drift: -0.3,
          })
        }, 340)
      })
      .catch(() => {})
  }, [step, phase])

  useEffect(() => {
    if (presentation !== 'modal') return

    const closeButton = document.querySelector('button[aria-label="Fermer"]') as HTMLButtonElement | null
    if (!closeButton) return

    const shouldShowCloseButton = !(step === 'success' && phase !== 'resolved')
    closeButton.style.opacity = shouldShowCloseButton ? '1' : '0'
    closeButton.style.pointerEvents = shouldShowCloseButton ? 'auto' : 'none'

    return () => {
      closeButton.style.opacity = '1'
      closeButton.style.pointerEvents = 'auto'
    }
  }, [presentation, step, phase])

  useEffect(() => {
    setAmountInput(String(amountEur))
  }, [amountEur])

  const handleAmountInput = (value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, '')
    setAmountInput(digitsOnly)
    if (digitsOnly.length === 0) {
      return
    }

    const parsed = Number(digitsOnly)
    if (!Number.isFinite(parsed)) {
      return
    }

    setAmountEur(clampAmount(Math.round(parsed), min, max))
  }

  const handleAmountBlur = () => {
    if (amountInput.trim().length === 0) {
      setAmountEur(defaultAmount)
      setAmountInput(String(defaultAmount))
      return
    }

    setAmountInput(String(amountEur))
  }

  const goToPayment = () => {
    haptic.heartbeat()
    setGuestEmailError(null)
    setStep('payment')
  }

  const goToSuccess = () => {
    if (!isAuthenticated) {
      if (!isValidEmail(guestEmail)) {
        setGuestEmailError('Ajoutez un email valide pour continuer.')
        return
      }
    }

    setGuestEmailError(null)
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setStep('success')
    }, 1500)
  }

  const submitClaim = () => {
    if (!isValidEmail(guestEmail)) {
      return
    }
    setIsSendingMagicLink(true)
    setTimeout(() => {
      setIsSendingMagicLink(false)
      setClaimSaved(true)
      setTimeout(() => {
        router.replace('/profile/biodex')
      }, 2000)
    }, 1200)
  }

  const showGuestClaimFooter = step === 'success' && !isAuthenticated && !claimSaved

  const quickAmounts = QUICK_AMOUNTS

  const glowColor = (() => {
    const t = project.type?.toLowerCase() ?? ''
    if (t.includes('coral') || t.includes('reef') || t.includes('ocean')) return { r: 14, g: 165, b: 233 }
    if (t.includes('orchard') || t.includes('olive') || t.includes('forest') || t.includes('tree')) return { r: 16, g: 185, b: 129 }
    return { r: 245, g: 158, b: 11 }
  })()
  const glowRgba = (alpha: number) => `rgba(${glowColor.r}, ${glowColor.g}, ${glowColor.b}, ${alpha})`

  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-col overflow-x-hidden bg-transparent',
        presentation === 'page'
          ? 'mx-auto w-full max-w-3xl px-4 pb-10 pt-6 md:px-6 md:pt-10'
          : 'h-full w-full',
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: glowRgba(0.10) }}
        />
        <div
          className="absolute -bottom-20 -left-24 h-64 w-64 rounded-full blur-3xl"
          style={{ backgroundColor: glowRgba(0.12) }}
        />
      </div>
      {presentation === 'page' ? (
        <header className="mb-4 px-1">
          <Button
            variant="ghost"
            onClick={() => router.push(`/projects/${project.slug}`)}
            className="mb-3 h-auto justify-start px-0 py-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back_to_project')}
          </Button>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {project.name}
          </h1>
        </header>
      ) : null}

      <div
        className={cn(
          'relative min-h-0 flex-1 overflow-x-hidden',
          'pb-24',
        )}
      >
        {presentation === 'modal' && step === 'payment' ? (
          <button
            onClick={() => setStep('impact')}
            className="absolute top-4 left-4 z-30 p-2"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>
        ) : null}

        <div
          className="flex h-full min-h-0 transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${stepIndex * 100}%)` }}
        >
          <section
            className={cn(
              'min-h-0 w-full shrink-0 overflow-y-auto',
              'pb-[calc(200px+env(safe-area-inset-bottom))]',
              presentation === 'page' ? 'pt-2' : '',
            )}
          >
            <div className={cn('flex flex-col gap-8 py-4 px-4', presentation === 'modal' ? 'pt-16' : 'pt-10')}>
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-5 text-center">
                  <p className="text-xl font-black text-white">Choisissez votre soutien</p>
                  <p className="mt-1.5 text-sm text-white/50">
                    Votre contribution aide ce producteur à faire avancer son projet.
                  </p>
                </div>
                <div className="flex w-full items-baseline justify-center">
                  <div
                    className="flex cursor-text items-baseline justify-center gap-2 rounded-3xl bg-white/5 px-8 py-4 transition-colors hover:bg-white/10"
                    onClick={() => amountInputRef.current?.focus()}
                  >
                    <input
                      ref={amountInputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      size={Math.max(amountInput.length, 2)}
                      value={amountInput}
                      onChange={(event) => handleAmountInput(event.target.value)}
                      onBlur={handleAmountBlur}
                      aria-label={t('amount_label')}
                      className="w-auto max-w-[9ch] bg-transparent text-center text-7xl leading-none font-black tracking-tighter text-white tabular-nums caret-lime-400 outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                    <span className="mb-2 text-4xl font-semibold text-white/60">€</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {quickAmounts.map((boundedValue) => (
                  <button
                    key={boundedValue}
                    type="button"
                    onClick={() => {
                      setAmountEur(boundedValue)
                      setAmountInput(String(boundedValue))
                    }}
                    className={cn(
                      'rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-95',
                      amountEur === boundedValue
                        ? 'bg-lime-400 text-black'
                        : 'bg-white/5 text-white hover:bg-white/10',
                    )}
                  >
                    {formatAmountPlain(boundedValue)}
                  </button>
                ))}
              </div>

              <p className="text-center text-[13px] text-white/45">
                Vous soutenez{' '}
                <span className="font-black text-white/70">{project.name}</span>
              </p>

              <section className="-mx-4 border-y border-white/[0.08] px-4 py-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                      Impact estimé
                    </p>
                    <p className="mt-1 text-[11px] text-white/30">
                      Des ordres de grandeur pour comprendre ce que représente votre soutien.
                    </p>
                  </div>
                  {impactItems.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setSheet('impact')}
                      className="text-[11px] font-black text-lime-300/80 active:scale-95"
                    >
                      Détails
                    </button>
                  ) : null}
                </div>
                <div className="[&_div.tabular-nums]:transition-all [&_div.tabular-nums]:duration-300 [&_div.tabular-nums]:ease-out">
                  <ProjectImpactCalculator baseAmount={100} amount={amountEur} mode="checkout" projectType={project.type} projectImpact={project.expectedImpact ?? null} />
                </div>
              </section>

              <AfterSupportBlock
                credits={points.total_points}
                species={species ?? []}
                onOpenRewards={() => setSheet('rewards')}
                onOpenTracking={() => setSheet('tracking')}
              />
            </div>
          </section>

          <section
            className={cn(
              'min-h-0 w-full shrink-0 overflow-y-auto pb-[calc(200px+env(safe-area-inset-bottom))]',
              presentation === 'page' ? 'pt-2' : '',
            )}
          >
            <div className={cn('flex flex-col gap-6 py-4 px-4', presentation === 'modal' ? 'pt-16' : 'pt-10')}>

              {/* Montant + contexte projet */}
              <div className="text-center">
                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                  Soutien producteur
                </p>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-7xl font-black tracking-tighter text-white tabular-nums">
                    {formatAmountNumber(amountEur)}
                  </span>
                  <span className="text-4xl font-semibold text-white/50">€</span>
                </div>
                <p className="mt-2 text-[13px] text-white/45">{project.name}</p>
              </div>

              {/* Ce qui est inclus — liste plate */}
              <IncludedSummary
                credits={points.total_points}
                species={species ?? []}
                onOpen={() => setSheet('rewards')}
              />

              {/* Email de confirmation */}
              <div className="w-full">
                <label className="mb-1.5 block text-xs font-bold text-white/60">
                  Email de confirmation
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(event) => setGuestEmail(event.target.value)}
                  placeholder="vous@email.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none placeholder:text-white/35 focus:border-lime-400/50 focus:ring-0"
                  required
                />
                <p className="mt-1.5 text-[11px] text-white/35">
                  Reçu de contribution et suivi du projet.
                </p>
                {guestEmailError ? (
                  <p className="mt-1.5 text-xs font-semibold text-destructive">{guestEmailError}</p>
                ) : null}
              </div>

              {/* Module paiement */}
              <div className="flex flex-col gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-5 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-white/25">
                    Paiement sécurisé par carte
                  </p>
                  <div className="mt-3 h-10 rounded-xl bg-white/[0.04]" />
                  <div className="mt-2 h-10 rounded-xl bg-white/[0.04]" />
                </div>
              </div>

              {/* Trust line */}
              <p className="text-center text-[11px] text-white/28">
                🔒 Paiement sécurisé{' '}
                <span className="mx-1 opacity-50">·</span>
                📩 Reçu envoyé par email
              </p>

            </div>
          </section>

          <section
            className={cn(
              'min-h-0 w-full shrink-0 overflow-y-auto overflow-x-hidden pb-[calc(220px+env(safe-area-inset-bottom))]',
              presentation === 'page' ? 'pt-2' : '',
            )}
          >
            <div className="relative flex flex-col items-center overflow-x-hidden px-4 pt-16 pb-6 [@media(max-height:800px)]:pt-10 [@media(max-height:800px)]:pb-4">

              <motion.h1
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="mt-6 text-center text-4xl font-black tracking-tight text-white [@media(max-height:800px)]:mt-2 [@media(max-height:800px)]:text-3xl"
              >
                Projet soutenu !
              </motion.h1>
              <p className="mt-3 mb-10 max-w-xs mx-auto text-balance text-center text-lg text-white/60 [@media(max-height:800px)]:mb-6 [@media(max-height:800px)]:text-base">
                Votre soutien de <span className="font-bold text-white tabular-nums">{formattedAmount} €</span> est associé à environ{' '}
                <span className="font-bold text-white tabular-nums">{supportImpactLabel}</span>.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="flex-1 flex flex-col items-center justify-center gap-4 my-4 w-full"
              >
                <div className="relative mx-auto w-64 h-64 flex items-center justify-center [@media(max-height:800px)]:w-56 [@media(max-height:800px)]:h-56">
                  {/* Glow dynamique selon le type de projet */}
                  <div
                    className={cn(
                      'absolute top-1/2 left-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ease-out',
                      phase === 'euphoria' || phase === 'resolved' ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                    )}
                    style={{ background: `radial-gradient(circle, ${glowRgba(0.35)} 0%, ${glowRgba(0)} 68%)` }}
                  />
                  <div
                    className={cn(
                      'absolute top-1/2 left-1/2 z-20 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_65%)] transition-all duration-200',
                      phase === 'flash' ? 'opacity-100 scale-110' : 'opacity-0 scale-75',
                    )}
                  />
                  {/* Wrapper : scale + drop-shadow dynamique (séparé de brightness sur l'img) */}
                  <div
                    className={cn(
                      'relative z-10 w-64 h-64 [@media(max-height:800px)]:w-56 [@media(max-height:800px)]:h-56 transition-all duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                      phase === 'tension' ? 'scale-90' : '',
                      phase === 'flash' ? 'scale-95' : '',
                      phase === 'euphoria' || phase === 'resolved' ? 'scale-110' : '',
                    )}
                    style={
                      phase === 'euphoria' || phase === 'resolved'
                        ? { filter: `drop-shadow(0 20px 50px ${glowRgba(0.3)})` }
                        : undefined
                    }
                  >
                    <img
                      src={REWARD_PREVIEW_IMAGE}
                      alt="Espèce débloquée"
                      className={cn(
                        'w-full h-full object-contain transition-all duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                        phase === 'tension' ? 'brightness-0 opacity-50 animate-pulse' : '',
                        phase === 'flash' ? 'brightness-200 opacity-100' : '',
                        phase === 'euphoria' || phase === 'resolved' ? 'brightness-100 opacity-100' : '',
                      )}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                  <div
                    className={cn(
                      'absolute inset-0 flex items-center justify-center z-30 transition-all duration-300 ease-in',
                      phase === 'tension' ? 'opacity-100 scale-100' : 'opacity-0 scale-[3] blur-sm',
                    )}
                  >
                    <Lock className="h-12 w-12 text-white/80 [@media(max-height:800px)]:h-10 [@media(max-height:800px)]:w-10" />
                  </div>
                </div>

                <div className="mt-5 text-center flex flex-col items-center gap-2">
                  <span className="inline-block mx-auto px-4 py-1.5 rounded-full bg-lime-500/20 text-lime-400 text-xs font-black uppercase tracking-widest border border-lime-500/30">
                    Nouvelle espèce débloquée
                  </span>
                  <h2 className="text-3xl font-black tracking-tight text-white [@media(max-height:800px)]:text-2xl">
                    {discoveredSpecies?.name_default || 'La Chouette Effraie'}
                  </h2>
                  {species && species.length > 1 ? (
                    <p className="text-[12px] text-white/40">
                      + {species.length - 1} autre{species.length - 1 > 1 ? 's' : ''} espèce{species.length - 1 > 1 ? 's' : ''} liée{species.length - 1 > 1 ? 's' : ''} au projet
                    </p>
                  ) : null}
                </div>
              </motion.div>

              {/* Suivi + crédits — apparaissent après la révélation, dans le bon ordre */}
              {phase === 'euphoria' || phase === 'resolved' ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="mt-3 w-full space-y-2"
                >
                  <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3.5 py-2.5">
                    <Camera className="h-4 w-4 shrink-0 text-lime-300" />
                    <p className="text-[13px] font-black text-white">Suivi du projet activé</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3.5 py-2.5">
                    <CurrencyIcon kind="impactCredits" className="h-4 w-4 shrink-0 text-amber-300" />
                    <p className="text-[13px] font-black text-white">
                      {points.total_points} Crédits Impact ajoutés
                    </p>
                    <p className="ml-auto text-[10.5px] text-white/35">Avantages partenaires</p>
                  </div>
                </motion.div>
              ) : null}

              {phase === 'euphoria' || phase === 'resolved' ? (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="mt-8 w-full border-t border-white/10 pt-5"
                >
                  <h3 className="text-[18px] font-black tracking-tight text-white">
                    Et maintenant ?
                  </h3>
                  <div className="mt-3">
                    <NextStepLine
                      icon={Mail}
                      title="Reçu envoyé"
                      body={guestEmail ? `Envoyé à ${guestEmail}.` : 'Disponible dans votre profil.'}
                    />
                    <NextStepLine
                      icon={Camera}
                      title="Suivi du projet"
                      body="Les prochaines nouvelles du terrain apparaîtront sur la page du projet dès que le partenaire les publiera."
                    />
                    <NextStepLine
                      icon={Leaf}
                      title="BioDex à explorer"
                      body={
                        species && species.length > 1
                          ? `${discoveredSpecies?.name_default || 'Votre espèce'} et ${species.length - 1} autre${species.length - 1 > 1 ? 's' : ''} espèce${species.length - 1 > 1 ? 's' : ''} liée${species.length - 1 > 1 ? 's' : ''} vous attendent.`
                          : `${discoveredSpecies?.name_default || 'Votre espèce'} est maintenant dans votre trace de soutien.`
                      }
                    />
                  </div>
                </motion.section>
              ) : null}

              {!isAuthenticated && !claimSaved ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.35 }}
                  className="mt-6 w-full border-t border-white/[0.08] pt-5"
                >
                  <p className="text-sm font-black text-white">
                    Sauvegarder votre BioDex
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-white/50">
                    Créez votre profil pour conserver{' '}
                    {discoveredSpecies?.name_default || 'votre espèce'} et suivre le projet.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[13px] text-white/38">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{guestEmail}</span>
                  </div>
                </motion.div>
              ) : null}

              {claimSaved && !isAuthenticated ? (
                <motion.p 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 inline-flex w-full items-center gap-3 rounded-xl border border-lime-400/30 bg-lime-400/10 p-4 text-left text-sm font-semibold text-lime-300 shadow-sm"
                >
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <span>
                    <span className="block font-black text-lime-400 mb-0.5">Vérifiez votre boîte mail !</span>
                    Un lien magique vous y attend pour sécuriser votre espèce.
                  </span>
                </motion.p>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      <ImpactSheet
        isOpen={sheet === 'impact'}
        onClose={() => setSheet(null)}
        items={impactItems}
      />
      <RewardsSheet
        isOpen={sheet === 'rewards'}
        onClose={() => setSheet(null)}
        credits={points.total_points}
        species={species ?? []}
        amount={amountEur}
      />
      <TrackingSheet
        isOpen={sheet === 'tracking'}
        onClose={() => setSheet(null)}
      />

      {(step === 'impact' || step === 'payment' || (step === 'success' && (isAuthenticated || claimSaved)) || showGuestClaimFooter) ? (
        <BottomActionBar className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-none md:hidden">
          {step === 'impact' ? (
            <>
              <p className="mb-3 text-center text-[12px] font-semibold text-white/50">
                Suivi inclus
                {species && species.length > 0 ? (
                  <>
                    <span className="mx-1.5 opacity-40">·</span>
                    <span className="font-black text-lime-300">BioDex lié</span>
                  </>
                ) : null}
                <span className="mx-1.5 opacity-40">·</span>
                <span className="font-black text-amber-300">{points.total_points} Crédits Impact</span>
              </p>
              <Button
                type="button"
                onClick={goToPayment}
                className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform"
              >
                {`Continuer avec ${formatAmountNumber(amountEur)} €`}
              </Button>
            </>
          ) : null}

          {step === 'payment' ? (
            <Button
              type="button"
              disabled={isProcessing}
              onClick={goToSuccess}
              className="w-full h-14 flex items-center justify-center gap-2 bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform disabled:opacity-75 disabled:active:scale-100"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  {`Payer ${formatAmountNumber(amountEur)} €`}
                </>
              )}
            </Button>
          ) : null}

          {step === 'success' && (isAuthenticated || claimSaved) ? (
            <>
              <Button
                type="button"
                onClick={() => {
                  if (discoveredSpeciesId) {
                    router.replace(`/profile/biodex/${discoveredSpeciesId}`)
                    return
                  }
                  router.replace('/profile/biodex')
                }}
                className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform"
              >
                Admirer dans mon BioDex
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  router.replace('/products')
                }}
                className="mt-2 w-full py-4 text-sm font-bold text-white/60 hover:text-white transition-colors"
              >
                Visiter les Avantages partenaires
              </Button>
            </>
          ) : null}

          {showGuestClaimFooter ? (
            <Button
              type="button"
              disabled={isSendingMagicLink}
              onClick={submitClaim}
              className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform disabled:opacity-75 disabled:active:scale-100"
            >
              {isSendingMagicLink ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Créer mon compte en 1 clic
            </Button>
          ) : null}
        </BottomActionBar>
      ) : null}
    </div>
  )
}
function clampAmount(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function isValidEmail(value: string): boolean {
  return /.+@.+\..+/.test(value)
}
