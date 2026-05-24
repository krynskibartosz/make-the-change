'use client'

import {
  Button,
  Card,
  CardContent,
} from '@make-the-change/core/ui'
import { ArrowLeft, Camera, CheckCircle2, ChevronRight, Leaf, Loader2, Lock, Mail } from 'lucide-react'
import { formatAmountPlain, formatAmountNumber } from '@/lib/formatters'
import { motion } from 'framer-motion'
import { MobileSheet } from '../../_components/shared/mobile-sheet'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useHaptic } from '@/hooks/use-haptic'
import { cn } from '@/lib/utils'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import { ProjectImpactCalculator } from '@/app/[locale]/(screens)/projects/[slug]/_components/shared/impact-calculator'
import { getProjectImpactMetrics } from '@/app/[locale]/(screens)/projects/[slug]/_utils/project-impact-metrics'
import { getMockSpeciesContextClient } from '@/lib/mock/mock-biodex'
import type { DonationOption, ProjectImpact } from '@/app/[locale]/(screens)/projects/_types/project'
import { makeProjectGlowRgba } from '@/app/[locale]/(screens)/projects/[slug]/_utils/project-glow'
import { PaymentBreakdown } from '@/app/[locale]/(screens)/projects/[slug]/_components/shared/payment-breakdown'
import { claimGuestSupport } from '@/app/[locale]/(screens)/projects/_actions/claim'

type FlowStep = 'impact' | 'payment' | 'success'
type LootPhase = 'tension' | 'flash' | 'euphoria' | 'resolved'
type SheetKind = 'tracking' | null

const FLOW_STEPS: FlowStep[] = ['impact', 'payment', 'success']
const QUICK_AMOUNTS = [20, 50, 100]
const REWARD_PREVIEW_IMAGE = '/images/dioramas/transparent/abeille-noire.png'
const MIN_DONATION_EUR = 1
const MAX_DONATION_EUR = 10_000

type ProjectContributeOneFlowProps = {
  project: {
    id: string
    slug: string
    name: string
    type: string
    coverImage?: string | null
    currentFunding?: number | null
    targetBudget?: number | null
    donationOptions: DonationOption[]
    expectedImpact?: ProjectImpact | null
  }
  presentation?: 'modal' | 'page'
  isAuthenticated: boolean
  discoveredSpeciesId?: string | null
  initialOptionId?: string | null
}

// --- Sub-components ---

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

function AfterContributeBlock({
  onOpenTracking,
}: {
  onOpenTracking: () => void
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        Après votre contribution
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]">
        <button
          type="button"
          onClick={onOpenTracking}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-white/[0.03]"
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
      </div>
    </div>
  )
}

function IncludedContributeSummary({
  onOpenTracking,
}: {
  onOpenTracking: () => void
}) {
  return (
    <div>
      <p className="mb-3.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
        Après votre contribution
      </p>
      <div className="space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.055] text-lime-300">
            <Camera className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-black text-white">Suivi du projet inclus</p>
            <p className="text-[11px] leading-snug text-white/40">Photos, étapes et évolution du terrain.</p>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenTracking}
        className="mt-4 flex items-center gap-1 text-[12px] font-black text-white/35 active:text-white/55"
      >
        Comprendre ce qui est inclus
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function BioDexSheet({
  isOpen,
  onClose,
  amount,
  hasSpecies,
}: {
  isOpen: boolean
  onClose: () => void
  amount: number
  hasSpecies: boolean
}) {
  return (
    <MobileSheet isOpen={isOpen} onClose={onClose} title="Trace BioDex">
      <p className="mt-1 text-sm leading-relaxed text-white/50">
        Votre contribution de {amount}&nbsp;€ reste rattachée à ce projet. Le BioDex sert à garder une trace claire de votre contribution et des espèces liées.
      </p>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">Trace de contribution</p>
        <div className="mt-2 flex items-center gap-2.5">
          <Leaf className="h-5 w-5 text-emerald-300" />
          <p className="text-[15px] font-black text-white">Trace enregistrée</p>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-white/50">
          Votre contribution est documentée et conservée dans votre profil avec le projet, le montant et la date.
        </p>
      </div>

      {hasSpecies ? (
        <div className="mt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">BioDex lié</p>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            Une espèce liée à ce projet sera débloquable dans votre BioDex après votre contribution.
          </p>
        </div>
      ) : null}

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">À ne pas confondre</p>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Ce n&apos;est pas un cashback, pas un rendement financier, pas une part du projet et pas un achat produit automatique.
        </p>
      </div>

      <p className="mt-5 pb-2 text-xs leading-relaxed text-white/30">
        Pas de rendement financier. Ce reçu de contribution n&apos;est pas un reçu fiscal déductible.
      </p>
    </MobileSheet>
  )
}

function TrackingSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const steps = [
    {
      title: 'Votre contribution est enregistrée',
      body: 'Elle est rattachée au projet, au montant choisi et au partenaire.',
    },
    {
      title: 'Le partenaire agit sur le terrain',
      body: 'La contribution contribue à la restauration, au suivi ou à la valorisation du projet.',
    },
    {
      title: "Vous suivez l'évolution",
      body: 'Photos, mises à jour ou données peuvent enrichir votre trace dans le temps.',
    },
  ]

  return (
    <MobileSheet isOpen={isOpen} onClose={onClose} title="Suivi de la contribution">
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
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">Niveau de preuve</p>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Le suivi documente la relation avec le terrain — photos, nouvelles partenaires, étapes. Il ne constitue pas une preuve d&apos;impact mesuré. Les données vérifiées sont affichées avec leur source et niveau de confiance.
        </p>
      </div>

      <p className="mt-5 pb-2 text-xs leading-relaxed text-white/30">
        Pas de rendement financier. Ce reçu de contribution n&apos;est pas un reçu fiscal déductible.
      </p>
    </MobileSheet>
  )
}

// --- Main component ---

export function ProjectContributeOneFlow({
  project,
  presentation = 'page',
  isAuthenticated,
  discoveredSpeciesId = null,
  initialOptionId = null,
}: ProjectContributeOneFlowProps) {
  const t = useTranslations('projects.support_page')
  const router = useRouter()
  const haptic = useHaptic()

  const [discoveredSpecies, setDiscoveredSpecies] = useState<{ name_default: string; image_url?: string | null } | null>(null)

  const defaultAmount = 20

  const [amountEur, setAmountEur] = useState(() => {
    if (initialOptionId) {
      const option = project.donationOptions.find((opt) => opt.id === initialOptionId)
      return option?.price || defaultAmount
    }
    return defaultAmount
  })
  const [amountInput, setAmountInput] = useState(String(amountEur))
  const amountInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (discoveredSpeciesId) {
      getMockSpeciesContextClient(discoveredSpeciesId).then((species) => {
        if (species) {
          setDiscoveredSpecies({ name_default: species.name_default, image_url: species.image_url })
        }
      })
    }
  }, [discoveredSpeciesId])

  useEffect(() => {
    setAmountInput(String(amountEur))
  }, [amountEur])

  const [step, setStep] = useState<FlowStep>('impact')
  const [sheet, setSheet] = useState<SheetKind>(null)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestEmailError, setGuestEmailError] = useState<string | null>(null)
  const [claimSaved, setClaimSaved] = useState(false)
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false)
  const [phase, setPhase] = useState<LootPhase>('tension')
  const [isProcessing, setIsProcessing] = useState(false)

  const stepIndex = FLOW_STEPS.indexOf(step)

  const formattedAmount = formatAmountNumber(amountEur)
  const donationMetrics = getProjectImpactMetrics({
    amount: amountEur,
    projectType: project.type,
    isContributionProject: true,
    donationOptions: project.donationOptions,
    projectImpact: project.expectedImpact ?? null,
  })
  const matchedOption = project.donationOptions.find((opt) => opt.price === amountEur)
  const unitsRestored = donationMetrics.kind === 'reef'
    ? donationMetrics.corals
    : matchedOption?.impact.unitsRestored ?? Math.max(1, Math.round(amountEur / 30))
  const unitLabel = donationMetrics.kind === 'reef' ? 'coraux' : 'unités restaurées'

  const hasSpecies = false

  const glowRgba = makeProjectGlowRgba(project.type)

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

  const handleAmountInput = (value: string) => {
    const digitsOnly = value.replace(/[^\d]/g, '')
    setAmountInput(digitsOnly)
    if (digitsOnly.length === 0) return

    const parsed = Number(digitsOnly)
    if (!Number.isFinite(parsed)) return

    setAmountEur(Math.min(Math.max(Math.round(parsed), MIN_DONATION_EUR), MAX_DONATION_EUR))
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

  const submitClaim = async () => {
    if (!isValidEmail(guestEmail)) return
    setIsSendingMagicLink(true)
    try {
      const res = await claimGuestSupport(guestEmail)
      if (res.success) {
        setClaimSaved(true)
        setTimeout(() => {
          router.replace('/profile/biodex')
        }, 2000)
      } else {
        setGuestEmailError(res.error || "Erreur lors de l'enregistrement.")
      }
    } catch (e) {
      setGuestEmailError("Une erreur est survenue.")
    } finally {
      setIsSendingMagicLink(false)
    }
  }

  const showGuestClaimFooter = step === 'success' && !isAuthenticated && !claimSaved

  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-col overflow-x-hidden bg-transparent',
        presentation === 'page'
          ? 'mx-auto w-full max-w-3xl px-4 pb-10 pt-6 md:px-6 md:pt-10'
          : 'h-full w-full',
      )}
    >
      {/* Background blobs adaptés au type */}
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
            type="button"
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
          {/* Étape 1 : Choix du montant */}
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
                  <p className="text-xl font-black text-white">Choisissez votre contribution</p>
                  <p className="mt-1.5 text-sm text-white/50">
                    Votre contribution soutient directement ce projet de terrain.
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
                      aria-label="Montant"
                      className="w-auto max-w-[9ch] bg-transparent text-center text-7xl leading-none font-black tracking-tighter text-white tabular-nums caret-lime-400 outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                    <span className="mb-2 text-4xl font-semibold text-white/60">€</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {QUICK_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAmountEur(val)
                      setAmountInput(String(val))
                    }}
                    className={cn(
                      'rounded-full px-5 py-2 text-sm font-bold transition-all active:scale-95',
                      amountEur === val
                        ? 'bg-lime-400 text-black'
                        : 'bg-white/5 text-white hover:bg-white/10',
                    )}
                  >
                    {formatAmountPlain(val)}
                  </button>
                ))}
              </div>

              <p className="text-center text-[13px] text-white/45">
                Vous contribuez à{' '}
                <span className="font-black text-white/70">{project.name}</span>
              </p>

              <section className="-mx-4 border-y border-white/[0.08] px-4 py-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                      Impact estimé
                    </p>
                    <p className="mt-1 text-[11px] text-white/30">
                      Des ordres de grandeur pour comprendre ce que représente votre contribution. Ces estimations nécessitent une validation par le partenaire.
                    </p>
                  </div>
                </div>
                <div className="[&_div.tabular-nums]:transition-all [&_div.tabular-nums]:duration-300 [&_div.tabular-nums]:ease-out">
                  <ProjectImpactCalculator
                    baseAmount={defaultAmount}
                    amount={amountEur}
                    mode="checkout"
                    isContributionProject={true}
                    donationOptions={project.donationOptions}
                    projectType={project.type}
                    projectImpact={project.expectedImpact ?? null}
                    showSpeciesCard={false}
                  />
                </div>
              </section>

              <AfterContributeBlock
                onOpenTracking={() => setSheet('tracking')}
              />
            </div>
          </section>

          {/* Étape 2 : Paiement */}
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
                  Contribution au projet
                </p>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-7xl font-black tracking-tighter text-white tabular-nums">
                    {formattedAmount}
                  </span>
                  <span className="text-4xl font-semibold text-white/50">€</span>
                </div>
                <p className="mt-2 text-[13px] text-white/45">{project.name}</p>
              </div>

              {/* Ce qui est inclus — liste plate */}
              <IncludedContributeSummary onOpenTracking={() => setSheet('tracking')} />

              {/* Répartition financière transparente */}
              <PaymentBreakdown amount={amountEur} mode="donation" />

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
                  Reçu de contribution et suivi du projet. Ce reçu n&apos;est pas un reçu fiscal déductible.
                </p>
                {guestEmailError ? (
                  <p className="mt-1.5 text-xs font-semibold text-destructive">{guestEmailError}</p>
                ) : null}
              </div>

              {/* Module paiement prototype */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-5 text-center">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-white/25">
                  Paiement sécurisé par carte
                </p>
                <div className="mt-3 h-10 rounded-xl bg-white/[0.04]" />
                <div className="mt-2 h-10 rounded-xl bg-white/[0.04]" />
              </div>

              {/* Trust line */}
              <p className="text-center text-[11px] text-white/28">
                🔒 Paiement sécurisé{' '}
                <span className="mx-1 opacity-50">·</span>
                📩 Reçu de contribution envoyé
                <span className="mx-1 opacity-50">·</span>
                Pas un reçu fiscal
              </p>

            </div>
          </section>

          {/* Étape 3 : Succès */}
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
                Contribution confirmée !
              </motion.h1>
              <p className="mt-3 mb-10 max-w-xs mx-auto text-balance text-center text-lg text-white/60 [@media(max-height:800px)]:mb-6 [@media(max-height:800px)]:text-base">
                Votre contribution de <span className="font-bold text-white tabular-nums">{formattedAmount} €</span> est associée à environ{' '}
                <span className="font-bold text-white tabular-nums">{unitsRestored}</span> {unitLabel} du projet.
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
                    {hasSpecies ? (
                      <img
                        src={discoveredSpecies?.image_url ?? REWARD_PREVIEW_IMAGE}
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
                    ) : (
                      <div
                        className={cn(
                          'grid h-full w-full place-items-center rounded-full border border-lime-300/20 bg-lime-300/10 text-lime-300 transition-all duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
                          phase === 'tension' ? 'scale-90 opacity-50' : '',
                          phase === 'flash' ? 'scale-100 opacity-100 brightness-150' : '',
                          phase === 'euphoria' || phase === 'resolved' ? 'scale-105 opacity-100' : '',
                        )}
                      >
                        <CheckCircle2 className="h-24 w-24 [@media(max-height:800px)]:h-20 [@media(max-height:800px)]:w-20" />
                      </div>
                    )}
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
                    {hasSpecies ? 'Nouvelle espèce débloquée' : 'Contribution enregistrée'}
                  </span>
                  <h2 className="text-3xl font-black tracking-tight text-white [@media(max-height:800px)]:text-2xl">
                    {hasSpecies ? (discoveredSpecies?.name_default ?? 'Espèce liée au projet') : 'Suivi du projet activé'}
                  </h2>
                </div>
              </motion.div>

              {/* Suivi + BioDex — dans le bon ordre */}
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
                  {hasSpecies ? (
                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3.5 py-2.5">
                      <Leaf className="h-4 w-4 shrink-0 text-emerald-300" />
                      <p className="text-[13px] font-black text-white">
                        Trace BioDex enregistrée
                      </p>
                      <p className="ml-auto text-[10.5px] text-white/35">BioDex</p>
                    </div>
                  ) : null}
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
                    {hasSpecies ? (
                      <NextStepLine
                        icon={Leaf}
                        title="BioDex à explorer"
                        body={`${discoveredSpecies?.name_default ?? 'Votre espèce'} est maintenant dans votre trace de don.`}
                      />
                    ) : null}
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
                    {hasSpecies ? 'Sauvegarder votre BioDex' : 'Sauvegarder votre contribution'}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-white/50">
                    {hasSpecies
                      ? `Créez votre profil pour conserver ${discoveredSpecies?.name_default ?? 'votre espèce'} et suivre le projet.`
                      : 'Créez votre profil pour retrouver votre contribution et suivre le projet.'}
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
                    {hasSpecies
                      ? 'Un lien magique vous y attend pour sécuriser votre espèce.'
                      : 'Un lien magique vous y attend pour sauvegarder votre contribution.'}
                  </span>
                </motion.p>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      <TrackingSheet
        isOpen={sheet === 'tracking'}
        onClose={() => setSheet(null)}
      />

      {(step === 'impact' || step === 'payment' || (step === 'success' && (isAuthenticated || claimSaved)) || showGuestClaimFooter) ? (
        <BottomActionBar className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-none md:hidden">
          {step === 'impact' ? (
            <>
              <p className="mb-3 text-center text-[12px] font-semibold text-white/50">
                Suivi terrain
                {hasSpecies ? (
                  <>
                    <span className="mx-1.5 opacity-40">·</span>
                    <span className="font-black text-lime-300">BioDex lié</span>
                  </>
                ) : null}
              </p>
              <Button
                type="button"
                onClick={goToPayment}
                className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform"
              >
                {`Continuer avec ${formattedAmount} €`}
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
                  {`Payer ${formattedAmount} €`}
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
                  router.replace(`/projects/${project.slug}`)
                }}
                className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform"
              >
                {hasSpecies ? 'Admirer dans mon BioDex' : 'Retour au projet'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.replace(`/projects/${project.slug}`)}
                className="mt-2 w-full py-4 text-sm font-bold text-white/60 hover:text-white transition-colors"
              >
                Retour au projet
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

function isValidEmail(value: string): boolean {
  return /.+@.+\..+/.test(value)
}
