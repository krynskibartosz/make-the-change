'use client'

import { investment } from '@make-the-change/core'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Progress,
  Slider,
  SliderThumb,
} from '@make-the-change/core/ui'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useMemo, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { cn, formatPoints } from '@/lib/utils'
import { createInvestmentAction } from './create-investment.action'

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

type InvestClientProps = {
  project: {
    id: string
    slug: string
    name: string
    type: investment.InvestmentType
    coverImage?: string | null
  }
  pointsBalance: number
}

type Step = 1 | 2 | 3

function InvestmentPaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setError(null)
    setConfirming(true)

    try {
      const pathname = window.location.pathname
      const locale = pathname.split('/')[1] || 'fr'
      const returnUrl = `${window.location.origin}/${locale}/dashboard/investments`

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: returnUrl },
        redirect: 'if_required',
      })

      if (error) {
        setError(error.message || 'Paiement refusé. Vérifiez vos informations.')
        return
      }

      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
        onSuccess()
        return
      }

      if (paymentIntent?.status === 'requires_payment_method') {
        setError('Paiement refusé. Essayez une autre méthode de paiement.')
        return
      }

      setError('Paiement non confirmé. Réessayez.')
    } catch {
      setError('Une erreur est survenue lors du paiement. Réessayez.')
    } finally {
      setConfirming(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-2xl border bg-background/60 p-4">
        <PaymentElement />
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        loading={confirming}
        disabled={!stripe || !elements || confirming}
      >
        Payer
      </Button>
    </form>
  )
}

export function InvestClient({ project, pointsBalance }: InvestClientProps) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const rules = investment.getInvestmentRules(project.type)
  const [amountEur, setAmountEur] = useState<number>(rules?.min_amount ?? 50)
  const [error, setError] = useState<string | null>(null)
  const [initializingPayment, setInitializingPayment] = useState(false)
  const [pointsEarned, setPointsEarned] = useState<number>(0)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const calc = useMemo(() => {
    const bonus = rules?.expected_bonus ?? 0
    try {
      return investment.calculateInvestmentPoints({
        type: project.type,
        amount_eur: amountEur,
        bonus_percentage: bonus,
      })
    } catch {
      return null
    }
  }, [project.type, amountEur, rules?.expected_bonus])

  const min = rules?.min_amount ?? 50
  const max = rules?.max_amount ?? 200
  const bonusPct = rules?.expected_bonus ?? 0

  const progress = Math.min(((amountEur - min) / (max - min)) * 100, 100)

  const backToSummary = () => {
    setClientSecret(null)
    setPointsEarned(0)
    setStep(2)
  }

  const initializePayment = async () => {
    setError(null)
    setInitializingPayment(true)
    try {
      const result = await createInvestmentAction({
        projectId: project.id,
        amountEur,
      })

      if ('investmentId' in result) {
        setPointsEarned(result.pointsEarned)
        setClientSecret(result.clientSecret)
        return
      }
      setError(result.message)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setInitializingPayment(false)
    }
  }

  if (!rules) {
    return (
      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardContent className="p-6 text-center text-sm text-muted-foreground">
          Ce projet ne peut pas être investi pour le moment.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Investir</p>
          <h1 className="mt-2 truncate text-2xl font-bold sm:text-3xl">{project.name}</h1>
        </div>
        <Badge variant="secondary" className="rounded-full">
          +{bonusPct}% bonus
        </Badge>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Choisir un montant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-3 sm:p-8 sm:pt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[min, Math.round((min + max) / 2), max].map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={amountEur === v ? 'default' : 'outline'}
                  onClick={() => setAmountEur(v)}
                >
                  {v}€
                </Button>
              ))}
            </div>

            <div className="rounded-2xl border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Montant</p>
                <p className="text-lg font-semibold tabular-nums">{amountEur}€</p>
              </div>
              <div className="mt-3">
                <Progress value={progress} />
              </div>
              <div className="mt-4 px-1">
                <Slider
                  max={max}
                  min={min}
                  step={1}
                  value={[amountEur]}
                  onValueChange={(values) => {
                    const nextValue = Array.isArray(values) ? values[0] : values
                    if (typeof nextValue === 'number' && Number.isFinite(nextValue)) {
                      setAmountEur(Math.max(min, Math.min(max, Math.round(nextValue))))
                    }
                  }}
                >
                  <SliderThumb />
                </Slider>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Limites: {min}€ - {max}€
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={amountEur}
                onChange={(e) => setAmountEur(Number(e.target.value || min))}
                label="Montant personnalisé"
              />
              <div className="rounded-2xl border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Points estimés
                </p>
                <p className="mt-2 text-2xl font-semibold text-primary tabular-nums">
                  {calc ? formatPoints(calc.total_points) : '—'} pts
                </p>
              </div>
            </div>

            <Button className="w-full" type="button" onClick={() => setStep(2)}>
              Continuer
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-3 sm:p-8 sm:pt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Base</p>
                <p className="mt-2 text-lg font-semibold tabular-nums">
                  {calc ? formatPoints(calc.base_points) : '—'} pts
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bonus</p>
                <p className="mt-2 text-lg font-semibold tabular-nums text-client-emerald-600 dark:text-client-emerald-400">
                  +{calc ? formatPoints(calc.bonus_points) : '—'} pts
                </p>
              </div>
              <div className="rounded-2xl border bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</p>
                <p className="mt-2 text-lg font-semibold tabular-nums text-primary">
                  {calc ? formatPoints(calc.total_points) : '—'} pts
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-background/60 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Votre solde</span>
                <span className="font-semibold tabular-nums">
                  {formatPoints(pointsBalance)} pts
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Retour
              </Button>
              <Button type="button" className="w-full sm:w-auto" onClick={() => setStep(3)}>
                Confirmer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Paiement sécurisé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-3 sm:p-8 sm:pt-4">
            <div className="rounded-2xl border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Montant</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{amountEur}€</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Vous recevrez {calc ? formatPoints(calc.total_points) : '—'} points.
              </p>
            </div>

            {clientSecret ? (
              stripePromise ? (
                <>
                  <div className="flex">
                    <Button type="button" variant="outline" onClick={backToSummary}>
                      Retour
                    </Button>
                  </div>
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: { theme: 'stripe' },
                    }}
                  >
                    <InvestmentPaymentForm
                      onSuccess={() => router.push('/dashboard/investments')}
                    />
                  </Elements>
                </>
              ) : (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Stripe n’est pas configuré (clé publique manquante).
                </div>
              )
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Votre investissement sera créé en statut{' '}
                  <span className="font-medium">pending</span>. Les points seront crédités après
                  confirmation du paiement par Stripe.
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={backToSummary}
                    disabled={initializingPayment}
                  >
                    Retour
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={initializePayment}
                    loading={initializingPayment}
                  >
                    Continuer vers le paiement
                  </Button>
                </div>
              </>
            )}

            {pointsEarned > 0 ? (
              <div className="rounded-2xl border bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Points prévus
                </p>
                <p className="mt-2 text-lg font-semibold tabular-nums text-primary">
                  +{formatPoints(pointsEarned)} pts
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur md:hidden">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Montant</p>
            <p className="truncate text-base font-semibold text-foreground tabular-nums">
              {amountEur}€
            </p>
          </div>
          <Badge variant="secondary" className={cn('rounded-full', clientSecret && 'opacity-60')}>
            {calc ? `+${formatPoints(calc.total_points)} pts` : '—'}
          </Badge>
        </div>
      </div>
    </div>
  )
}
