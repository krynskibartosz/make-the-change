'use client'

import { investment } from '@make-the-change/core'
import {
  Button,
  Card,
  CardContent,
} from '@make-the-change/core/ui'
import { Elements, ExpressCheckoutElement, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { cn, formatPoints } from '@/lib/utils'
import { ProjectImpactCalculator } from '../[slug]/components/project-impact-calculator'

type FlowStep = 'impact' | 'payment' | 'success'
type LootPhase = 'tension' | 'flash' | 'euphoria' | 'resolved'
const FLOW_STEPS: FlowStep[] = ['impact', 'payment', 'success']
const QUICK_AMOUNTS = [20, 50, 100]
const REWARD_PREVIEW_IMAGE = '/images/diorama-chouette.png'
const formatAmountPlain = (value: number): string =>
  `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)} €`
const formatAmountNumber = (value: number): string =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)

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
  }
  presentation?: 'modal' | 'page'
  isAuthenticated: boolean
  source?: string
  initialAmount?: number
}

const clampAmount = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

const isValidEmail = (value: string): boolean => /.+@.+\..+/.test(value)

export function ProjectInvestOneFlow({
  project,
  presentation = 'page',
  isAuthenticated,
  initialAmount,
}: ProjectInvestOneFlowProps) {
  const t = useTranslations('projects.invest_page')
  const router = useRouter()

  const rules = investment.getInvestmentRules(project.type)

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
  const [claimEmail, setClaimEmail] = useState('')
  const [claimSaved, setClaimSaved] = useState(false)
  const [phase, setPhase] = useState<LootPhase>('tension')
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
  const protectedBees = formatPoints(Math.round((amountEur / 100) * 3800))

  useEffect(() => {
    if (step !== 'success') return

    setPhase('tension')
    const flashTimerId = window.setTimeout(() => setPhase('flash'), 1300)
    const euphoriaTimerId = window.setTimeout(() => setPhase('euphoria'), 1500)
    const resolvedTimerId = window.setTimeout(() => setPhase('resolved'), 2100)

    return () => {
      window.clearTimeout(flashTimerId)
      window.clearTimeout(euphoriaTimerId)
      window.clearTimeout(resolvedTimerId)
    }
  }, [step])

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
    setStep('success')
  }

  const submitClaim = () => {
    if (!isValidEmail(claimEmail)) {
      return
    }
    setClaimSaved(true)
  }

  const quickAmounts = QUICK_AMOUNTS

  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-col overflow-x-hidden bg-transparent',
        presentation === 'page'
          ? 'mx-auto w-full max-w-3xl px-4 pb-10 pt-6 md:px-6 md:pt-10'
          : 'h-full w-full',
      )}
    >
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
                <ProjectImpactCalculator baseAmount={100} amount={amountEur} mode="checkout" />
              </div>
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
                  Votre don pour la nature
                </p>
                <div className="mb-8 flex items-baseline justify-center gap-1.5">
                  <span className="text-7xl font-black text-white tracking-tighter tabular-nums">
                    {formatAmountNumber(amountEur)}
                  </span>
                  <span className="text-4xl font-semibold text-white/50">€</span>
                </div>

                <div className="mx-auto w-full max-w-xl rounded-xl border border-white/10 bg-white/5 p-3 text-left">
                  <div className="text-sm">
                    <span className="mr-1 text-white/40">📍 Projet :</span>
                    <span className="font-medium text-white truncate">{project.name}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="mr-1 text-white/40">🎁 Inclus :</span>
                    <span className="font-bold text-white">
                      {`${formatPoints(points.total_points)} Points d'Impact + L'Abeille Noire`}
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="mr-1 text-white/40">🔒 Sécurité :</span>
                    <span className="text-white/70">Connexion cryptée par Stripe</span>
                  </div>
                </div>
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
              'min-h-0 w-full shrink-0 overflow-y-auto pb-[calc(220px+env(safe-area-inset-bottom))]',
              presentation === 'page' ? 'pt-2' : '',
            )}
          >
            <div className="relative flex flex-col items-center px-4 pt-16 pb-6 [@media(max-height:800px)]:pt-10 [@media(max-height:800px)]:pb-4">
              <div className="pointer-events-none absolute -top-8 right-0 h-56 w-56 rounded-full bg-lime-400/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 left-0 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

              <motion.h1
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="mt-6 text-center text-4xl font-black tracking-tight text-white [@media(max-height:800px)]:mt-2 [@media(max-height:800px)]:text-3xl"
              >
                Impact Validé !
              </motion.h1>
              <p className="mt-3 mb-10 max-w-xs mx-auto text-balance text-center text-lg text-white/60 [@media(max-height:800px)]:mb-6 [@media(max-height:800px)]:text-base">
                Vos <span className="font-bold text-white tabular-nums">{formattedAmount} €</span> viennent de protéger{' '}
                <span className="font-bold text-white tabular-nums">{protectedBees}</span> abeilles.
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
                      'absolute top-1/2 left-1/2 w-56 h-56 rounded-full bg-lime-500/30 blur-[60px] transition-all duration-1000 ease-out z-0 -translate-x-1/2 -translate-y-1/2',
                      phase === 'euphoria' || phase === 'resolved' ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
                    )}
                  />
                  <div
                    className={cn(
                      'absolute inset-[-50%] bg-white rounded-full blur-2xl z-20 transition-all duration-200',
                      phase === 'flash' ? 'opacity-100 scale-110' : 'opacity-0 scale-50',
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
                  <h2 className="text-3xl font-black tracking-tight text-white [@media(max-height:800px)]:text-2xl">La Chouette Effraie</h2>
                  <p className="mt-2 text-2xl font-black tabular-nums text-lime-400 drop-shadow-[0_0_10px_rgba(132,204,22,0.4)] [@media(max-height:800px)]:text-xl">
                    {`+ ${formatPoints(points.total_points)} Points d'Impact ✨`}
                  </p>
                  <p className="mt-1 text-[10px] text-white/50 uppercase tracking-widest">
                    À dépenser dans le Marché
                  </p>
                </div>
              </motion.div>

              {!isAuthenticated && !claimSaved ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.35 }}
                  className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="mb-2 font-bold text-white">Ne perdez pas votre Abeille Noire !</h3>
                  <p className="mb-4 text-sm text-white/60">
                    Créez votre profil en 1 clic pour la sauvegarder dans votre BioDex.
                  </p>
                  <div className="grid gap-2">
                    <input
                      type="email"
                      value={claimEmail}
                      onChange={(event) => setClaimEmail(event.target.value)}
                      placeholder="Email"
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-base text-white outline-none placeholder:text-white/35 focus:border-lime-400/50 focus:ring-0"
                    />
                    <Button
                      type="button"
                      onClick={submitClaim}
                      className="h-11 rounded-xl bg-lime-400 font-bold text-black hover:bg-lime-300"
                      disabled={!isValidEmail(claimEmail)}
                    >
                      Créer mon compte
                    </Button>
                  </div>
                </motion.div>
              ) : null}

              {claimSaved && !isAuthenticated ? (
                <p className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-lime-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Profil prêt. Votre récompense sera sauvegardée dans le BioDex.
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      {step === 'impact' ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-none border-t border-white/10 bg-background/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
            <p className="mb-3 text-center text-sm font-medium text-lime-400">
              Vous allez recevoir <span className="font-black">+{formatPoints(points.total_points)} Points d&apos;Impact</span> ✨
            </p>
            <Button
              type="button"
              onClick={goToPayment}
              className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform"
            >
              Valider mon impact
            </Button>
        </div>
      ) : null}

      {step === 'payment' ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-none border-t border-white/10 bg-background/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
          <Button
            type="button"
            onClick={goToSuccess}
            className="w-full h-14 flex items-center justify-center gap-2 bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform"
          >
            <Lock className="h-5 w-5" />
            {`Payer ${formatAmountNumber(amountEur)} €`}
          </Button>
        </div>
      ) : null}

      {step === 'success' && (isAuthenticated || claimSaved) ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-full rounded-none border-t border-white/10 bg-background/95 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
          <Link href="/aventure/biodex" className="block w-full">
            <Button className="w-full h-14 flex items-center justify-center bg-lime-400 text-black font-black text-lg rounded-2xl active:scale-95 transition-transform">
              Admirer dans mon BioDex
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              router.push('/marche')
            }}
            className="mt-2 w-full py-4 text-sm font-bold text-white/60 hover:text-white transition-colors"
          >
            Visiter le Marché
          </Button>
        </div>
      ) : null}
    </div>
  )
}
