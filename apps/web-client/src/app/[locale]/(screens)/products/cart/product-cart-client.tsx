'use client'

import {
  Check,
  ChevronDown,
  CreditCard,
  Loader2,
  MapPin,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import {
  clearCartAction,
  completeMockCheckoutAction,
  updateCartLineAction,
} from '@/app/[locale]/(screens)/products/_features/mock-commerce-actions'
import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import {
  calculateCartSummary,
  getSellerShippingProfile,
  type MockCart,
} from '@/lib/mock/mock-commerce'

type Stage = 'cart' | 'checkout' | 'success'

type Props = {
  initialCart: MockCart
  unlockedAdvantageIds: string[]
  isConnected: boolean
  locale: string
}

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(value)

export function ProductCartClient({
  initialCart,
  unlockedAdvantageIds,
  isConnected,
  locale,
}: Props) {
  const [cart, setCart] = useState(initialCart)
  const [stage, setStage] = useState<Stage>('cart')
  const [conditionsOpen, setConditionsOpen] = useState(false)
  const [customer, setCustomer] = useState({
    email: '',
    name: '',
    street: '',
    postalCode: '',
    city: '',
  })
  const [orderId, setOrderId] = useState('')
  const [orderTotal, setOrderTotal] = useState(0)
  const [isPending, startTransition] = useTransition()
  const lines = cart.lines.flatMap((line) => {
    const product = getMockProductById(line.productId)
    return product ? [{ ...line, product }] : []
  })
  const summary = useMemo(
    () => calculateCartSummary(cart, { unlockedAdvantageIds }),
    [cart, unlockedAdvantageIds],
  )
  const shipping = getSellerShippingProfile(cart.sellerId)
  const sellerName = lines[0]?.product.producer.name_default ?? ''
  const canCompleteCheckout =
    customer.email.includes('@') &&
    customer.name.trim().length > 1 &&
    customer.street.trim().length > 3 &&
    customer.postalCode.trim().length >= 4 &&
    customer.city.trim().length > 1

  function updateQuantity(productId: string, quantity: number) {
    startTransition(async () => setCart(await updateCartLineAction(productId, quantity)))
  }

  function emptyCart() {
    startTransition(async () => setCart(await clearCartAction()))
  }

  function completeOrder() {
    if (!canCompleteCheckout) return
    startTransition(async () => {
      const result = await completeMockCheckoutAction(customer)
      if (!result.ok) return
      setOrderId(result.orderId)
      setOrderTotal(result.totalEur)
      setStage('success')
    })
  }

  if (stage === 'success') {
    return (
      <div className="flex min-h-[calc(100dvh-80px)] flex-col items-center px-5 pb-8 pt-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-300">
          <Check className="h-10 w-10 text-[#0B0F15]" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-white">Commande prototype validée</h1>
        <p className="mt-3 text-sm font-medium leading-relaxed text-white/55">
          Commande n° <span className="font-mono text-white/80">{orderId}</span>
          <br />
          Aucun paiement réel n’a été débité.
        </p>
        <div className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-[11px] font-bold uppercase text-white/45">Achat partenaire</p>
          <p className="mt-2 text-3xl font-black text-white">{formatEuro(orderTotal)}</p>
          <p className="mt-2 text-sm font-medium text-white/50">
            Cet achat ne génère pas de Crédits Impact.
          </p>
        </div>
        <div className="mt-auto flex w-full flex-col gap-3">
          {!isConnected && (
            <>
              <p className="text-sm font-medium leading-relaxed text-white/55">
                Crée ou connecte un espace MTC pour suivre cette commande.
              </p>
              <Link
                href={`/${locale}/register?returnTo=${encodeURIComponent('/profile/contributions')}`}
                className="rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15]"
              >
                Créer mon espace
              </Link>
              <Link
                href={`/${locale}/login?returnTo=${encodeURIComponent('/profile/contributions')}`}
                className="rounded-2xl border border-white/10 py-4 text-sm font-bold text-white/70"
              >
                J’ai déjà un espace
              </Link>
            </>
          )}
          <Link
            href={`/${locale}/products`}
            className="rounded-2xl border border-white/10 py-4 text-sm font-bold text-white/70"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    )
  }

  if (cart.lines.length === 0) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-7 text-center">
        <ShoppingBag className="h-12 w-12 text-white/20" aria-hidden="true" />
        <h1 className="mt-5 text-xl font-black text-white">Ton panier est vide</h1>
        <p className="mt-2 text-sm text-white/50">
          Découvre les coffrets et produits de nos partenaires.
        </p>
        <Link
          href={`/${locale}/products`}
          className="mt-7 rounded-2xl bg-lime-300 px-8 py-4 text-sm font-black text-[#0B0F15]"
        >
          Explorer la boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 pb-28 pt-5">
      {stage === 'cart' ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-white">Panier</h1>
            <button
              type="button"
              onClick={emptyCart}
              className="flex items-center gap-1 text-xs font-bold text-white/45"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Vider
            </button>
          </div>
          <p className="mt-2 text-sm font-medium text-white/50">
            Vendu et expédié par {sellerName}
          </p>
          <div className="mt-6 space-y-3">
            {lines.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3"
              >
                <img src={product.image_url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-bold text-white">
                    {product.name_default}
                  </p>
                  <p className="mt-1 text-sm font-black text-white">
                    {formatEuro(product.price_eur_equivalent)}
                  </p>
                </div>
                <div className="flex h-9 items-center rounded-lg border border-white/10">
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="h-9 w-8 text-white/70"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="h-9 w-8 text-white/70"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-black text-white">Livraison et paiement</h1>
          <p className="mt-2 text-sm font-medium text-white/50">
            {isConnected
              ? 'Commande liée à ton espace MTC · Belgique uniquement pour cette version'
              : 'Achat invité · Belgique uniquement pour cette version'}
          </p>
          <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-[11px] font-bold uppercase text-white/45">Articles</p>
            <div className="mt-3 space-y-3">
              {lines.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-start justify-between gap-3 text-sm">
                  <p className="min-w-0 font-semibold text-white/75">
                    {quantity} x {product.name_default}
                  </p>
                  <p className="shrink-0 font-black text-white">
                    {formatEuro(product.price_eur_equivalent * quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <input
              required
              value={customer.email}
              onChange={(event) =>
                setCustomer((value) => ({ ...value, email: event.target.value }))
              }
              placeholder="E-mail"
              type="email"
              className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35"
            />
            <input
              required
              value={customer.name}
              onChange={(event) => setCustomer((value) => ({ ...value, name: event.target.value }))}
              placeholder="Nom complet"
              className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35"
            />
            <input
              required
              value={customer.street}
              onChange={(event) =>
                setCustomer((value) => ({ ...value, street: event.target.value }))
              }
              placeholder="Rue et numéro"
              className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35"
            />
            <div className="flex gap-3">
              <input
                required
                value={customer.postalCode}
                onChange={(event) =>
                  setCustomer((value) => ({ ...value, postalCode: event.target.value }))
                }
                placeholder="Code postal"
                className="h-13 w-[38%] rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35"
              />
              <input
                required
                value={customer.city}
                onChange={(event) =>
                  setCustomer((value) => ({ ...value, city: event.target.value }))
                }
                placeholder="Ville"
                className="h-13 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/35"
              />
            </div>
            <div className="flex h-13 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/70">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Belgique
            </div>
          </div>
        </>
      )}

      <div className="mt-7 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <div className="flex justify-between text-sm text-white/60">
          <span>Sous-total</span>
          <span>{formatEuro(summary.subtotalEur)}</span>
        </div>
        {summary.discountEur > 0 && (
          <div className="mt-3 flex justify-between text-sm font-bold text-lime-300">
            <span>Avantage Ilanga · -10 %</span>
            <span>-{formatEuro(summary.discountEur)}</span>
          </div>
        )}
        <div className="mt-3 flex justify-between text-sm text-white/60">
          <span>Livraison {shipping?.carrierLabel}</span>
          <span>{summary.shippingEur === 0 ? 'Offerte' : formatEuro(summary.shippingEur)}</span>
        </div>
        {shipping && summary.amountUntilFreeShippingEur > 0 && (
          <p className="mt-3 text-[12px] font-medium text-white/45">
            Encore {formatEuro(summary.amountUntilFreeShippingEur)} pour la livraison offerte.
          </p>
        )}
        <div className="my-4 h-px bg-white/10" />
        <div className="flex justify-between text-lg font-black text-white">
          <span>Total TTC</span>
          <span>{formatEuro(summary.totalEur)}</span>
        </div>
      </div>

      {shipping && (
        <div className="mt-4 rounded-xl border border-white/8 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Truck className="h-4 w-4 text-lime-300" aria-hidden="true" />
            Livraison estimée : {shipping.deliveryLabel}
          </div>
          {shipping.feeStatus === 'prototype_estimate' && (
            <p className="mt-2 text-[12px] font-medium text-amber-200/75">
              Frais estimés pour le prototype, à confirmer par Ilanga.
            </p>
          )}
        </div>
      )}

      {stage === 'checkout' && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/8">
          <p className="px-4 pt-4 text-sm font-bold text-white">
            Vendeur et expéditeur : {sellerName}
          </p>
          <button
            type="button"
            onClick={() => setConditionsOpen((open) => !open)}
            className="mt-2 flex w-full items-center justify-between px-4 py-4 text-left text-sm font-bold text-white/75"
          >
            Conditions, retours et SAV
            <ChevronDown
              className={`h-4 w-4 ${conditionsOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          {conditionsOpen && (
            <p className="border-t border-white/8 px-4 py-4 text-[12px] font-medium leading-relaxed text-white/55">
              Le partenaire vendeur assure livraison, retours et SAV. Le droit de rétractation
              s’applique selon la réglementation, avec exceptions possibles pour certains biens.
            </p>
          )}
          <p className="border-t border-white/8 px-4 py-4 text-[12px] font-bold text-amber-200/80">
            Cet achat ne génère pas de Crédits Impact.
          </p>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 border-t border-white/5 bg-[#0B0F15]/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        {stage === 'cart' ? (
          <button
            type="button"
            onClick={() => setStage('checkout')}
            className="w-full rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15]"
          >
            Continuer vers le paiement
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending || !canCompleteCheckout}
            onClick={completeOrder}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-[15px] font-black text-[#0B0F15] disabled:opacity-70"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <CreditCard className="h-4 w-4" aria-hidden="true" />
            )}
            {isPending ? 'Validation en cours...' : 'Simuler le paiement'}
          </button>
        )}
      </div>
    </div>
  )
}
