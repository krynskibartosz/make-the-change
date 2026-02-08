'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Progress,
} from '@make-the-change/core/ui'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCart, useCartTotals } from '@/features/commerce/cart/use-cart'
import { Link, useRouter } from '@/i18n/navigation'
import { cn, formatPoints } from '@/lib/utils'
import { placePointsOrderAction } from './place-points-order.action'
import { placeEuroOrderAction } from './place-euro-order.action'
import { CreditCard, Wallet } from 'lucide-react'

const AddressFormSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  street: z.string().min(1, 'Adresse requise'),
  city: z.string().min(1, 'Ville requise'),
  postalCode: z.string().min(1, 'Code postal requis'),
  country: z.string().min(1, 'Pays requis'),
})

type AddressFormValues = z.infer<typeof AddressFormSchema>

type CheckoutClientProps = {
  pointsBalance: number
  defaultAddress: Partial<AddressFormValues>
}

const steps = [
  { id: 1, label: 'Panier' },
  { id: 2, label: 'Adresse' },
  { id: 3, label: 'Confirmer' },
]

type ServerErrorCode = Exclude<
  Awaited<ReturnType<typeof placePointsOrderAction>>,
  { orderId: string }
>['errorCode']

export function CheckoutClient({ pointsBalance, defaultAddress }: CheckoutClientProps) {
  const router = useRouter()
  const { items, clear } = useCart()
  const { itemsCount, totalPoints, totalEuros } = useCartTotals()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [paymentMethod, setPaymentMethod] = useState<'points' | 'euros'>('points')
  
  // Detect stale cart (items without Euro price)
  const hasStaleItems = useMemo(() => {
    return items.some(item => item.snapshot.priceEuros === undefined)
  }, [items])

  const [serverError, setServerError] = useState<string | null>(null)
  const [serverErrorCode, setServerErrorCode] = useState<ServerErrorCode | null | 'UNKNOWN'>(null)
  const [placing, setPlacing] = useState(false)

  const remainingPoints = useMemo(() => pointsBalance - totalPoints, [pointsBalance, totalPoints])
  const hasEnoughPoints = remainingPoints >= 0
  const handleTopBack = () => {
    if (step === 1) {
      router.push('/cart')
      return
    }
    setStep((prev) => Math.max(1, prev - 1) as 1 | 2 | 3)
  }

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      firstName: defaultAddress.firstName || '',
      lastName: defaultAddress.lastName || '',
      street: defaultAddress.street || '',
      city: defaultAddress.city || '',
      postalCode: defaultAddress.postalCode || '',
      country: defaultAddress.country || '',
    },
    mode: 'onBlur',
  })

  const submitAddress = form.handleSubmit(() => {
    setServerError(null)
    setServerErrorCode(null)
    setStep(3)
  })

  const confirmOrder = async () => {
    setServerError(null)
    setServerErrorCode(null)
    setPlacing(true)
    try {
      const address = form.getValues()
      
      let result
      
      if (paymentMethod === 'euros') {
        if (hasStaleItems) {
           setServerError("Veuillez vider votre panier et ajouter les articles à nouveau.")
           setPlacing(false)
           return
        }
        result = await placeEuroOrderAction({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: address,
        })
      } else {
        result = await placePointsOrderAction({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shippingAddress: address,
        })
      }

      if ('orderId' in result) {
        clear()
        router.push(`/checkout/success?orderId=${encodeURIComponent(result.orderId)}`)
        return
      }

      setServerError(result.message)
      setServerErrorCode(result.errorCode as any)
    } catch {
      setServerError('Une erreur est survenue. Réessayez.')
    } finally {
      setPlacing(false)
    }
  }

  if (itemsCount === 0) {
    return (
      <Card className="border bg-background/70 shadow-sm backdrop-blur">
        <CardContent className="space-y-4 p-6 text-center">
          <p className="text-lg font-semibold">Votre panier est vide</p>
          <p className="text-sm text-muted-foreground">
            Ajoutez des produits avant de passer commande.
          </p>
          <Button asChild>
            <Link href="/products">Explorer la boutique</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-5 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Commande</h1>
            <p className="text-sm text-muted-foreground">
              {itemsCount} article(s) • {formatPoints(totalPoints)} pts / {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalEuros || 0)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleTopBack}>
              Retour
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/cart">Modifier</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Étape {step}/3</span>
            <span>{steps[step - 1].label}</span>
          </div>
          <Progress value={step} max={3} className="h-1.5 bg-muted" />
        </div>
      </div>

      {serverError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {serverError}
        </div>
      ) : null}

      {hasStaleItems && paymentMethod === 'euros' ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-600">
          <p className="font-semibold">Mise à jour requise</p>
          <p>Certains articles dans votre panier ont des prix obsolètes. Veuillez vider votre panier et ajouter les articles à nouveau pour payer en euros.</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => {
            clear()
            router.push('/products')
          }}>
            Vider le panier et retourner à la boutique
          </Button>
        </div>
      ) : null}

      {serverErrorCode === 'INSUFFICIENT_POINTS' ? (
        <div className="rounded-2xl border bg-muted/30 px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            Votre solde a été vérifié côté serveur et il est insuffisant pour confirmer cette
            commande.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/projects">Gagner des points</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard/points">Voir mon solde</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-3 sm:p-8 sm:pt-4">
            <div className="space-y-3">
              {items.slice(0, 4).map((item) => (
                <div key={item.productId} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.snapshot.name}</p>
                    <p className="text-xs text-muted-foreground">
                      x{item.quantity} • {formatPoints(item.snapshot.pricePoints)} pts
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground tabular-nums">
                      {formatPoints(item.quantity * item.snapshot.pricePoints)} pts
                    </p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format((item.snapshot.priceEuros || 0) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
              {items.length > 4 ? (
                <p className="text-xs text-muted-foreground">
                  +{items.length - 4} autre(s) article(s)
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-foreground">
                  {formatPoints(totalPoints)} pts / {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalEuros || 0)}
                </span>
              </div>
            </div>

            <Button variant="accent" className="w-full" onClick={() => setStep(2)}>
              Continuer
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Adresse de livraison</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-3 sm:p-8 sm:pt-4">
            <form onSubmit={submitAddress} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {(() => {
                  const { ref, ...rest } = form.register('firstName')
                  return (
                    <Input
                      label="Prénom"
                      placeholder="Jean"
                      error={form.formState.errors.firstName?.message}
                      {...rest}
                      ref={ref}
                    />
                  )
                })()}
                {(() => {
                  const { ref, ...rest } = form.register('lastName')
                  return (
                    <Input
                      label="Nom"
                      placeholder="Dupont"
                      error={form.formState.errors.lastName?.message}
                      {...rest}
                      ref={ref}
                    />
                  )
                })()}
              </div>

              {(() => {
                const { ref, ...rest } = form.register('street')
                return (
                  <Input
                    label="Adresse"
                    placeholder="12 rue de l'Impact"
                    error={form.formState.errors.street?.message}
                    {...rest}
                    ref={ref}
                  />
                )
              })()}

              <div className="grid gap-4 sm:grid-cols-2">
                {(() => {
                  const { ref, ...rest } = form.register('city')
                  return (
                    <Input
                      label="Ville"
                      placeholder="Bruxelles"
                      error={form.formState.errors.city?.message}
                      {...rest}
                      ref={ref}
                    />
                  )
                })()}
                {(() => {
                  const { ref, ...rest } = form.register('postalCode')
                  return (
                    <Input
                      label="Code postal"
                      placeholder="1000"
                      error={form.formState.errors.postalCode?.message}
                      {...rest}
                      ref={ref}
                    />
                  )
                })()}
              </div>

              {(() => {
                const { ref, ...rest } = form.register('country')
                return (
                  <Input
                    label="Pays"
                    placeholder="Belgique"
                    error={form.formState.errors.country?.message}
                    {...rest}
                    ref={ref}
                  />
                )
              })()}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Retour
                </Button>
                <Button type="submit" variant="accent" className="w-full sm:w-auto">
                  Continuer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {step === 3 ? (
        <Card className="border bg-background/70 shadow-sm backdrop-blur">
          <CardHeader className="p-5 pb-4 sm:p-8 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Moyen de paiement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-5 pt-3 sm:p-8 sm:pt-4">
            {/* Payment Method Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div 
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary/50 hover:bg-muted/50",
                  paymentMethod === 'points' ? "border-primary bg-primary/5" : "border-muted bg-transparent"
                )}
                onClick={() => setPaymentMethod('points')}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    paymentMethod === 'points' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Mes Points</p>
                    <p className="text-xs text-muted-foreground">Solde: {formatPoints(pointsBalance)} pts</p>
                  </div>
                </div>
              </div>

              <div 
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 transition-all hover:border-primary/50 hover:bg-muted/50",
                  paymentMethod === 'euros' ? "border-primary bg-primary/5" : "border-muted bg-transparent"
                )}
                onClick={() => setPaymentMethod('euros')}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    paymentMethod === 'euros' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Carte Bancaire</p>
                    <p className="text-xs text-muted-foreground">Simulation (Euros)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Confirmation</h3>
              
              {paymentMethod === 'points' ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Solde actuel</p>
                    <p className="mt-2 text-lg font-semibold tabular-nums">
                      {formatPoints(pointsBalance)} pts
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Après achat
                    </p>
                    <p
                      className={cn(
                        'mt-2 text-lg font-semibold tabular-nums',
                        !hasEnoughPoints && 'text-destructive',
                      )}
                    >
                      {formatPoints(Math.max(0, remainingPoints))} pts
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total à payer</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-primary">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalEuros || 0)}
                  </p>
                </div>
              )}

              {paymentMethod === 'points' && !hasEnoughPoints ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  Points insuffisants pour confirmer cette commande.
                </div>
              ) : null}

              <div className="flex items-center justify-between rounded-2xl border bg-background/60 px-4 py-3">
                <span className="text-sm text-muted-foreground">Total commande</span>
                <span className="text-sm font-semibold text-foreground">
                  {paymentMethod === 'points' 
                    ? `${formatPoints(totalPoints)} pts`
                    : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalEuros || 0)
                  }
                </span>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={placing}>
                  Retour
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  variant="accent"
                  onClick={confirmOrder}
                  disabled={(paymentMethod === 'points' && !hasEnoughPoints) || (paymentMethod === 'euros' && hasStaleItems) || placing}
                  loading={placing}
                >
                  {paymentMethod === 'points' ? 'Confirmer (Points)' : 'Payer (Simulation)'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/90 backdrop-blur md:hidden">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="truncate text-base font-semibold text-foreground">
              {formatPoints(totalPoints)} pts / {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalEuros || 0)}
            </p>
            <p className="text-[11px] text-muted-foreground">Aucun frais caché.</p>
          </div>
          <Badge variant={hasEnoughPoints ? 'success' : 'destructive'} className="rounded-full">
            {hasEnoughPoints ? 'OK' : 'Insuffisant'}
          </Badge>
        </div>
      </div>
    </div>
  )
}
