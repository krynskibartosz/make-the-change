'use client'

import { investment } from '@make-the-change/core'
import {
  Button,
  Card,
  CardContent,
  Input,
  Progress,
} from '@make-the-change/core/ui'
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import { cn, formatPoints } from '@/lib/utils'
import { ProjectImpactCalculator } from '../[slug]/components/project-impact-calculator'

type FlowStep = 'impact' | 'payment' | 'success'
const FLOW_STEPS: FlowStep[] = ['impact', 'payment', 'success']
const QUICK_AMOUNTS = [50, 100, 200]
const REWARD_PREVIEW_IMAGE = '/abeille-transparente.png'
const formatAmountPlain = (value: number): string =>
  `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)} €`

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
  const defaultAmount = clampAmount(initialAmount ?? Math.max(min, 50), min, max)

  const [step, setStep] = useState<FlowStep>('impact')
  const [amountEur, setAmountEur] = useState(defaultAmount)
  const [amountInput, setAmountInput] = useState(String(defaultAmount))
  const [guestEmail, setGuestEmail] = useState('')
  const [guestEmailError, setGuestEmailError] = useState<string | null>(null)
  const [claimEmail, setClaimEmail] = useState('')
  const [claimPassword, setClaimPassword] = useState('')
  const [claimSaved, setClaimSaved] = useState(false)
  const [xpProgress, setXpProgress] = useState(0)
  const [amountFocused, setAmountFocused] = useState(false)

  const stepIndex = FLOW_STEPS.indexOf(step)
  const panelBottomPadding =
    presentation === 'modal'
      ? 'pb-[calc(1rem+env(safe-area-inset-bottom))]'
      : 'pb-[calc(7rem+env(safe-area-inset-bottom))]'

  const points = useMemo(() => {
    return investment.calculateInvestmentPoints({
      type: project.type,
      amount_eur: amountEur,
      bonus_percentage: rules.expected_bonus,
    })
  }, [amountEur, project.type, rules.expected_bonus])

  useEffect(() => {
    if (step !== 'success') {
      setXpProgress(0)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setXpProgress(100)
    }, 90)

    return () => window.clearTimeout(timeoutId)
  }, [step])

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
    if (!isValidEmail(claimEmail) || claimPassword.length < 8) {
      return
    }
    setClaimSaved(true)
  }

  const quickAmounts = useMemo(() => {
    const candidates = [min, ...QUICK_AMOUNTS, max]
    return Array.from(new Set(candidates.map((value) => clampAmount(value, min, max)))).sort(
      (a, b) => a - b,
    )
  }, [max, min])

  return (
    <div
      className={cn(
        'relative flex min-h-0 flex-col overflow-x-hidden bg-transparent',
        presentation === 'page'
          ? 'mx-auto w-full max-w-3xl px-4 pb-10 pt-6 md:px-6 md:pt-10'
          : 'h-full px-4',
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

      <div className="relative min-h-0 flex-1 overflow-x-hidden pb-24">
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
            <div className="py-4">
              <div
                className={cn(
                  'flex flex-col items-center justify-center text-center',
                  presentation === 'modal' ? 'py-6' : 'py-10',
                )}
              >
                <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
                  Choisissez votre montant
                </p>
                <div className="flex items-baseline justify-center gap-2 w-full">
                  <div
                    className={cn(
                      'border-b pb-1 transition-colors',
                      amountFocused ? 'border-lime-400/60' : 'border-white/20',
                    )}
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      size={Math.max(amountInput.length, 2)}
                      value={amountInput}
                      onChange={(event) => handleAmountInput(event.target.value)}
                      onFocus={() => setAmountFocused(true)}
                      onBlur={() => {
                        setAmountFocused(false)
                        handleAmountBlur()
                      }}
                      aria-label={t('amount_label')}
                      className="w-auto max-w-[9ch] bg-transparent text-center text-7xl leading-none font-black tracking-tighter text-white tabular-nums caret-lime-400 outline-none"
                    />
                  </div>
                  <span className="mb-1 text-5xl font-black tracking-tight text-white/90">€</span>
                </div>
                <p className="mt-2 text-xs text-white/50">
                  Touchez le montant pour le modifier
                </p>
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
              <p className="mt-10 mb-6 text-xs text-center text-white/40">
                Montant libre. Chaque euro compte.
              </p>

              <div className="[&_div.tabular-nums]:transition-all [&_div.tabular-nums]:duration-300 [&_div.tabular-nums]:ease-out">
                <ProjectImpactCalculator baseAmount={100} amount={amountEur} mode="checkout" />
              </div>
            </div>
          </section>

          <section className={cn('min-h-0 w-full shrink-0 overflow-y-auto', panelBottomPadding)}>
            <Card className="border-white/10 bg-background/60 shadow-sm backdrop-blur">
              <CardContent className="space-y-5 p-5 sm:p-6">
                <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Montant</p>
                  <p className="mt-2 text-3xl font-black tracking-tight tabular-nums text-foreground">
                    {formatAmountPlain(amountEur)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    +{formatPoints(points.total_points)} points estimés
                  </p>
                </div>

                {!isAuthenticated ? (
                  <div className="rounded-2xl border border-white/10 bg-background/50 p-4">
                    <Input
                      type="email"
                      size="lg"
                      value={guestEmail}
                      onChange={(event) => setGuestEmail(event.target.value)}
                      label="Votre email"
                      placeholder="vous@email.com"
                      className="h-12 text-base"
                      required
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Nous préparons votre reçu et votre accès de récupération.
                    </p>
                    {guestEmailError ? (
                      <p className="mt-2 text-xs font-semibold text-destructive">{guestEmailError}</p>
                    ) : null}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Paiement sécurisé Stripe</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Intégration wallet + carte à brancher à l’étape suivante.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-xl"
                    onClick={() => setStep('impact')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour
                  </Button>
                  <Button type="button" className="h-11 w-full rounded-xl font-bold" onClick={goToSuccess}>
                    Confirmer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className={cn('min-h-0 w-full shrink-0 overflow-y-auto', panelBottomPadding)}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#050b08] via-[#0a1410] to-[#08120f] p-5 shadow-2xl">
              <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-lime-400/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-lime-300">
                  <Sparkles className="h-3 w-3" />
                  Succès
                </div>

                <div>
                  <p className="text-xl font-black tracking-tight text-white">
                    Incroyable, votre impact est confirmé.
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    {formatPoints(Math.round((amountEur / 100) * 3800))} abeilles soutenues estimées.
                  </p>
                </div>

                <article className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 p-3">
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black/50">
                    <img
                      src={REWARD_PREVIEW_IMAGE}
                      alt="Aperçu espèce débloquée"
                      className="h-full w-full object-contain opacity-70"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                    <Lock className="absolute bottom-1 right-1 h-4 w-4 text-white/55" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                      Votre récompense BioDex
                    </p>
                    <p className="text-sm font-bold text-white">L&apos;Abeille Noire</p>
                    <p className="mt-0.5 text-xs text-white/70">
                      Espèce déverrouillée après confirmation du paiement.
                    </p>
                  </div>
                </article>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/70">
                    <span>+ 65 graines</span>
                    <span>{xpProgress}%</span>
                  </div>
                  <Progress
                    value={xpProgress}
                    className="h-2 bg-white/10"
                    indicatorClassName="bg-linear-to-r from-lime-400 to-emerald-400 transition-all duration-700 ease-out"
                  />
                </div>

                {isAuthenticated ? (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Link href="/dashboard/investments" className="block">
                      <Button className="h-11 w-full rounded-xl font-bold">Voir mon dashboard</Button>
                    </Link>
                    <Link href={`/projects/${project.slug}`} className="block">
                      <Button variant="outline" className="h-11 w-full rounded-xl">
                        Retour au projet
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-sm font-semibold text-white">Sauvegarder mon impact</p>
                    <p className="mt-1 text-xs text-white/70">
                      Créez votre profil pour rattacher ce don et conserver vos récompenses.
                    </p>

                    <div className="mt-3 grid gap-2">
                      <Input
                        type="email"
                        size="lg"
                        value={claimEmail}
                        onChange={(event) => setClaimEmail(event.target.value)}
                        placeholder="Email"
                        className="h-12 border-white/10 bg-black/30 text-base text-white"
                      />
                      <Input
                        type="password"
                        size="lg"
                        value={claimPassword}
                        onChange={(event) => setClaimPassword(event.target.value)}
                        placeholder="Mot de passe (8+ caractères)"
                        className="h-12 border-white/10 bg-black/30 text-base text-white"
                      />
                      <Button
                        type="button"
                        onClick={submitClaim}
                        className="h-11 rounded-xl bg-lime-400 font-bold text-black hover:bg-lime-300"
                        disabled={!isValidEmail(claimEmail) || claimPassword.length < 8}
                      >
                        Sauvegarder mon impact
                      </Button>
                      {claimSaved ? (
                        <p className="inline-flex items-center gap-1 text-xs font-semibold text-lime-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Pré-validation OK. Branchons l’action signup-and-claim ensuite.
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {step === 'impact' ? (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-background/95 backdrop-blur-xl border-t border-white/5 rounded-none p-4 pb-[max(1rem,env(safe-area-inset-bottom))] z-50 md:hidden">
            <p className="mb-3 text-center text-sm font-bold text-lime-400">
              Vous allez récolter +{formatPoints(points.total_points)} Graines 🌱
            </p>
            <Button
              type="button"
              onClick={goToPayment}
              className="w-full rounded-2xl bg-lime-400 py-4 text-lg font-black text-black transition-transform active:scale-95 hover:bg-lime-300"
            >
              Valider mon impact
            </Button>
        </div>
      ) : null}
    </div>
  )
}
