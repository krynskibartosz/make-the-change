'use client'

import { investment } from '@make-the-change/core'
import {
  Button,
  Card,
  CardContent,
} from '@make-the-change/core/ui'
import { Elements, ExpressCheckoutElement, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowLeft, Camera, CheckCircle, CheckCircle2, ChevronRight, Leaf, Loader2, Lock, Mail, MapPin, Gift, RefreshCw, ShieldCheck } from 'lucide-react'
import { MobileSheet } from '../../_components/ui/mobile-sheet'
import { CurrencyAmount, CurrencyIcon } from '@/components/currency'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useHaptic } from '@/hooks/use-haptic'
import { cn } from '@/lib/utils'
import { ProjectImpactCalculator } from '@/app/[locale]/(screens)/projects/[slug]/_components/ui/project-impact-calculator'
import { getProjectImpactMetrics } from '@/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics'
import { getMockSpeciesContextClient } from '@/lib/mock/mock-biodex'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import { formatAmountPlain, formatAmountNumber } from '@/lib/formatters'
import type { ProjectImpact, ProjectSpecies } from '@/app/[locale]/(screens)/projects/_types/project'
import { sanitizeImageUrl } from '@/lib/image-url'

type FlowStep = 'impact' | 'payment' | 'success'
type LootPhase = 'tension' | 'flash' | 'euphoria' | 'resolved'
const FLOW_STEPS: FlowStep[] = ['impact', 'payment', 'success']
const QUICK_AMOUNTS = [20, 50, 100]
const REWARD_PREVIEW_IMAGE = '/images/dioramas/abeille-noire.png' // Image générique de fallback
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

type ProjectInvestOneFlowProps = {
  project: {
    id: string
    slug: string
    name: string
    type: investment.InvestmentType
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

function SpeciesMiniStack({ species }: { species: ProjectSpecies[] }) {
  const visible = species.slice(0, 3)
  const remaining = Math.max(species.length - visible.length, 0)
  if (species.length <= 1) return null

  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map((sp) => {
          const imageUrl = sanitizeImageUrl(sp.icon)
          return (
            <div
              key={sp.id}
              className="grid h-7 w-7 place-items-center overflow-hidden rounded-full border-2 border-[#08080F] bg-white/[0.08]"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={sp.name}
                  className="h-full w-full object-cover opacity-30 blur-[0.5px]"
                />
              ) : (
                <Lock className="h-3 w-3 text-white/40" />
              )}
            </div>
          )
        })}
        {remaining > 0 ? (
          <div className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#08080F] bg-white/[0.08] text-[9px] font-black text-white/50">
            +{remaining}
          </div>
        ) : null}
      </div>
      <p className="text-[11px] text-white/40">
        {species.length} espèce{species.length > 1 ? 's' : ''} liée{species.length > 1 ? 's' : ''}
      </p>
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
  const speciesSummary =
    species.length === 0
      ? null
      : species.length === 1
        ? `BioDex : ${species[0]?.name ?? ''}`
        : `${species.length} espèces liées`

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-amber-300/16 bg-amber-300/10 text-amber-300">
          <CurrencyIcon kind="impactCredits" className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/34">
            Après votre soutien
          </p>
          <p className="mt-1 text-[15px] font-black leading-tight text-white">
            {credits} Crédits Impact{speciesSummary ? ` · ${speciesSummary}` : ''}
          </p>
          <p className="mt-1 text-[11.5px] leading-snug text-white/45">
            Une trace dans l&apos;app, des avantages partenaires et un suivi du projet.
          </p>
          {species.length > 1 ? <SpeciesMiniStack species={species} /> : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenRewards}
          className="rounded-2xl bg-black/14 px-3 py-3 text-left active:scale-[0.99]"
        >
          <span className="flex items-center justify-between gap-2 text-[12px] font-black text-white">
            Voir pourquoi
            <ChevronRight className="h-3.5 w-3.5 text-white/36" />
          </span>
          <span className="mt-0.5 block text-[10.5px] leading-snug text-white/38">
            Crédits, BioDex, limites
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenTracking}
          className="rounded-2xl bg-black/14 px-3 py-3 text-left active:scale-[0.99]"
        >
          <span className="flex items-center justify-between gap-2 text-[12px] font-black text-white">
            Voir le suivi
            <ChevronRight className="h-3.5 w-3.5 text-white/36" />
          </span>
          <span className="mt-0.5 block text-[10.5px] leading-snug text-white/38">
            Ce qui se passe après
          </span>
        </button>
      </div>
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
    <MobileSheet isOpen={isOpen} onClose={onClose} title="Pourquoi ces récompenses ?">
      <div className="mt-3 rounded-2xl border border-lime-300/16 bg-lime-300/[0.06] p-4">
        <p className="text-[14px] font-black leading-tight text-white">
          Votre soutien de {amount}&nbsp;€ reste d&apos;abord rattaché à ce projet producteur.
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-white/50">
          Les Crédits Impact et le BioDex servent à garder une trace, débloquer des avantages et prolonger la relation avec le projet.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-300/10 text-amber-300">
            <CurrencyIcon kind="impactCredits" className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[14px] font-black text-white">{credits} Crédits Impact</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-white/50">
              Utilisables ensuite dans les avantages partenaires sélectionnés.
            </p>
          </div>
        </div>

        {species.length > 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-lime-300/10 text-lime-300">
                <Leaf className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-black text-white">
                  BioDex lié : {primary?.name ?? 'Espèce principale'}
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/50">
                  L&apos;espèce principale est révélée maintenant. Les autres restent liées au
                  projet et pourront être découvertes dans votre BioDex.
                </p>
              </div>
            </div>
            {species.length > 1 ? (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {species.map((sp) => {
                  const imageUrl = sanitizeImageUrl(sp.icon)
                  const isKey = isKeyRole(sp.role)
                  return (
                    <div key={sp.id} className="min-w-[88px] rounded-xl bg-black/16 p-2.5">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/[0.06]">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={sp.name}
                            className="h-full w-full object-cover opacity-25 blur-[1px]"
                          />
                        ) : null}
                        <div className="absolute inset-0 grid place-items-center">
                          <Lock className="h-3 w-3 text-white/40" />
                        </div>
                      </div>
                      <p className="mt-1.5 line-clamp-1 text-[11px] font-black text-white">
                        {sp.name}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-[0.08em] text-white/34">
                        {isKey ? 'Révélée' : 'Liée'}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/[0.055] text-white/60">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[14px] font-black text-white">À ne pas confondre</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-white/50">
              Ce n&apos;est pas un cashback, pas un rendement, pas une part du projet et pas un
              achat produit automatique.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 pb-2 text-[11px] leading-relaxed text-white/25">
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
      <div className="mt-4 space-y-4">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1
          return (
            <div key={s.title} className="relative grid grid-cols-[40px_1fr] gap-3">
              {!isLast ? (
                <div className="absolute left-[19px] top-10 h-[calc(100%+1rem)] w-px bg-white/10" />
              ) : null}
              <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-[14px] font-black text-white">
                {i + 1}
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[14px] font-black leading-tight text-white">{s.title}</p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/54">{s.body}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-[12px] font-black text-white">À garder clair</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-white/50">
          Le suivi documente la relation avec le terrain, mais ne garantit pas un impact mesuré
          immédiatement.
        </p>
      </div>
      <p className="mt-3 pb-2 text-[11px] leading-relaxed text-white/25">
        Pas de rendement financier. Pas de reçu fiscal.
      </p>
    </MobileSheet>
  )
}

function isKeyRole(role: string | undefined | null): boolean {
  const r = role?.toLowerCase() ?? ''
  return r.includes('cle') || r.includes('clé')
}

function BiodexRail({ species }: { species: ProjectSpecies[] }) {
  if (species.length === 0) return null

  const sorted = [...species].sort(
    (a, b) => (isKeyRole(a.role) ? 0 : 1) - (isKeyRole(b.role) ? 0 : 1),
  )
  const keyCount = sorted.filter((sp) => isKeyRole(sp.role)).length
  const assocCount = sorted.length - keyCount

  const subtitle =
    keyCount === 0
      ? `${assocCount} espèce${assocCount > 1 ? 's' : ''} liée${assocCount > 1 ? 's' : ''}`
      : keyCount === 1
        ? `1 espèce clé${assocCount > 0 ? ` · ${assocCount} espèce${assocCount > 1 ? 's' : ''} associée${assocCount > 1 ? 's' : ''}` : ''}`
        : `${keyCount} espèces clés${assocCount > 0 ? ` · ${assocCount} espèce${assocCount > 1 ? 's' : ''} associée${assocCount > 1 ? 's' : ''}` : ''}`

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
          BioDex du projet
        </p>
        <p className="text-[11px] text-white/35">{subtitle}</p>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sorted.map((sp) => {
          const imageUrl = sanitizeImageUrl(sp.icon)
          const isKey = isKeyRole(sp.role)
          return (
            <button
              key={sp.id}
              type="button"
              aria-label={`Voir ${sp.name} dans le BioDex`}
              className="flex w-[88px] shrink-0 flex-col items-center gap-1.5"
            >
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl bg-white/[0.05]">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={sp.name}
                    className="h-full w-full object-cover opacity-25 blur-[1px]"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
                <div className="absolute inset-0 grid place-items-center">
                  <Lock className="h-4 w-4 text-white/40" />
                </div>
                {isKey ? (
                  <span className="absolute left-1 top-1 rounded-full bg-lime-300 px-1.5 py-0.5 text-[8px] font-black leading-none text-black">
                    Clé
                  </span>
                ) : null}
              </div>
              <p className="line-clamp-2 text-center text-[10px] font-semibold leading-tight text-white/60">
                {sp.name}
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.06em] text-white/25">
                À découvrir
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Helpers moved to bottom
export function ProjectInvestOneFlow({
  project,
  presentation = 'page',
  isAuthenticated,
  initialAmount,
  discoveredSpeciesId = null,
  species,
}: ProjectInvestOneFlowProps) {
  const t = useTranslations('projects.invest_page')
  const router = useRouter()
  const haptic = useHaptic()

  const [discoveredSpecies, setDiscoveredSpecies] = useState<{ name_default: string } | null>(null)

  const rules = investment.getInvestmentRules(project.type)

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
  const [sheet, setSheet] = useState<'rewards' | 'tracking' | null>(null)
  const amountInputRef = useRef<HTMLInputElement | null>(null)

  const stepIndex = FLOW_STEPS.indexOf(step)

  const points = useMemo(() => {
    return investment.calculateInvestmentPoints({
      type: project.type,
      amount_eur: amountEur,
      bonus_percentage: rules.expected_bonus,
    })
  }, [amountEur, project.type, rules.expected_bonus])
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
          particleCount: 100,
          spread: 72,
          origin: { y: 0.6 },
          colors: ['#a3e635', '#facc15', '#f59e0b'],
        })
        window.setTimeout(() => {
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.58 },
            colors: ['#84cc16', '#eab308', '#fbbf24'],
          })
        }, 260)
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
                <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
                  Choisissez votre montant
                </p>
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

              <div className="[&_div.tabular-nums]:transition-all [&_div.tabular-nums]:duration-300 [&_div.tabular-nums]:ease-out">
                <ProjectImpactCalculator baseAmount={100} amount={amountEur} mode="checkout" projectType={project.type} projectImpact={project.expectedImpact ?? null} />
              </div>

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
            <div className={cn('space-y-6 py-4 px-4', presentation === 'modal' ? 'pt-16' : 'pt-10')}>
              <div className="text-center">
                <p className="mb-2 text-center text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                  Votre soutien au projet
                </p>
                <div className="mb-8 flex items-baseline justify-center gap-1.5">
                  <span className="text-7xl font-black text-white tracking-tighter tabular-nums">
                    {formatAmountNumber(amountEur)}
                  </span>
                  <span className="text-4xl font-semibold text-white/50">€</span>
                </div>

                <AfterSupportBlock
                  credits={points.total_points}
                  species={species ?? []}
                  onOpenRewards={() => setSheet('rewards')}
                  onOpenTracking={() => setSheet('tracking')}
                />
              </div>

              {!isAuthenticated ? (
                <div className="w-full">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/50">
                    Email pour le reçu
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                    placeholder="vous@email.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-base text-white outline-none placeholder:text-white/35 focus:border-lime-400/50 focus:ring-0"
                    required
                  />
                  {guestEmailError ? (
                    <p className="mt-2 text-xs font-semibold text-destructive">{guestEmailError}</p>
                  ) : null}
                </div>
              ) : null}

              {stripePromise ? (
                <Elements
                  key={amountEur}
                  stripe={stripePromise}
                  options={{
                    mode: 'payment',
                    amount: Math.max(100, amountEur * 100),
                    currency: 'eur',
                    appearance: stripeAppearance,
                  }}
                >
                  <div className="mt-8 flex w-full flex-col gap-4">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                      <ExpressCheckoutElement onConfirm={() => {}} />
                    </div>

                    <div className="my-6 flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="px-4 text-[10px] text-white/30 uppercase tracking-widest">ou</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                      <PaymentElement />
                    </div>
                  </div>
                </Elements>
              ) : (
                <div className="mt-8 flex w-full flex-col gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center text-sm text-white/60">
                    Apple Pay / Google Pay indisponible (clé Stripe manquante)
                  </div>
                  <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="px-4 text-[10px] text-white/30 uppercase tracking-widest">ou</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center text-sm text-white/60">
                    Module carte bancaire Stripe
                  </div>
                </div>
              )}
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
                  <div
                    className={cn(
                      'absolute top-1/2 left-1/2 z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(132,204,22,0.35)_0%,rgba(132,204,22,0)_68%)] transition-all duration-700 ease-out',
                      phase === 'euphoria' || phase === 'resolved' ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                    )}
                  />
                  <div
                    className={cn(
                      'absolute top-1/2 left-1/2 z-20 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_65%)] transition-all duration-200',
                      phase === 'flash' ? 'opacity-100 scale-110' : 'opacity-0 scale-75',
                    )}
                  />
                  <img
                    src={REWARD_PREVIEW_IMAGE}
                    alt="Espèce débloquée"
                    className={cn(
                      'relative z-10 w-64 h-64 [@media(max-height:800px)]:w-56 [@media(max-height:800px)]:h-56 object-contain transition-all duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                      phase === 'tension' ? 'brightness-0 opacity-50 scale-90 animate-pulse' : '',
                      phase === 'flash' ? 'brightness-200 opacity-100 scale-95' : '',
                      phase === 'euphoria' || phase === 'resolved'
                        ? 'brightness-100 opacity-100 scale-110 drop-shadow-[0_20px_50px_rgba(132,204,22,0.3)]'
                        : '',
                    )}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                  <div
                    className={cn(
                      'absolute inset-0 flex items-center justify-center z-30 transition-all duration-300 ease-in',
                      phase === 'tension' ? 'opacity-100 scale-100' : 'opacity-0 scale-[3] blur-sm',
                    )}
                  >
                    <Lock className="h-12 w-12 text-white/80 [@media(max-height:800px)]:h-10 [@media(max-height:800px)]:w-10" />
                  </div>
                </div>

                <div
                  className="mt-6 text-center flex flex-col items-center gap-3"
                >
                  <span className="inline-block mx-auto px-4 py-1.5 rounded-full bg-lime-500/20 text-lime-400 text-xs font-black uppercase tracking-widest border border-lime-500/30">
                    Nouvelle espèce débloquée
                  </span>
                  <h2 className="text-3xl font-black tracking-tight text-white [@media(max-height:800px)]:text-2xl">{discoveredSpecies?.name_default || 'La Chouette Effraie'}</h2>
                  {species && species.length > 1 ? (
                    <p className="mt-1 text-[12px] font-semibold text-white/42">
                      + {species.length - 1} autre{species.length - 1 > 1 ? 's' : ''} espèce{species.length - 1 > 1 ? 's' : ''} liée{species.length - 1 > 1 ? 's' : ''} au projet
                    </p>
                  ) : null}
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-2xl font-black tabular-nums text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.28)] [@media(max-height:800px)]:text-xl">
                    <CurrencyAmount kind="impactCredits" value={points.total_points} showLabel className="text-2xl font-black [@media(max-height:800px)]:text-xl" />
                  </p>
                  <p className="mt-1 text-[10px] text-white/50 uppercase tracking-widest">
                    À utiliser dans les Avantages partenaires
                  </p>
                </div>
              </motion.div>

              {phase === 'euphoria' || phase === 'resolved' ? (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
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
                      icon={CreditsIcon}
                      title={`${points.total_points} Crédits Impact ajoutés`}
                      body="Disponibles dans votre profil et utilisables dans les avantages partenaires."
                    />
                    <NextStepLine
                      icon={Camera}
                      title="Suivi du projet"
                      body="Retrouvez les mises à jour du partenaire dans votre profil quand il publie des nouvelles du terrain."
                    />
                    <NextStepLine
                      icon={Leaf}
                      title="BioDex à sauvegarder"
                      body={
                        species && species.length > 1
                          ? `Créez votre profil pour conserver ${discoveredSpecies?.name_default || 'votre espèce'} et les ${species.length - 1} autre${species.length - 1 > 1 ? 's' : ''} espèce${species.length - 1 > 1 ? 's' : ''} liée${species.length - 1 > 1 ? 's' : ''}.`
                          : `Créez votre profil pour conserver ${discoveredSpecies?.name_default || 'votre espèce'} et la trace de ce soutien.`
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
                  className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="mb-2 font-bold text-white">Ne perdez pas votre {discoveredSpecies?.name_default || 'Chouette Effraie'} !</h3>
                  <p className="mb-4 text-sm text-white/60">
                    Créez votre profil en 1 clic pour la sauvegarder dans votre BioDex.
                  </p>
                  <div className="grid gap-2">
                    <p className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 flex items-center text-base text-white/60 truncate">
                      {guestEmail}
                    </p>
                    <Button
                      type="button"
                      onClick={submitClaim}
                      className="hidden h-11 rounded-xl bg-lime-400 font-bold text-black hover:bg-lime-300 md:inline-flex"
                      disabled={isSendingMagicLink}
                    >
                      {isSendingMagicLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Créer mon compte en 1 clic
                    </Button>
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
                Après soutien :{' '}
                <span className="font-black text-amber-300">
                  {points.total_points} Crédits Impact
                </span>
                {species && species.length > 0 ? (
                  <span className="font-black text-lime-300">
                    {' '}· {species.length} espèce{species.length > 1 ? 's' : ''} liée{species.length > 1 ? 's' : ''}
                  </span>
                ) : null}
              </p>
              <Button
                type="button"
                onClick={goToPayment}
                className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform"
              >
                Soutenir ce projet
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
