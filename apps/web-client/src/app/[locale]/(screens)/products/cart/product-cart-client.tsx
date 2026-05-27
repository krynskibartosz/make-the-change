'use client'

import {
  Check,
  ChevronDown,
  CreditCard,
  Loader2,
  MapPin,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import {
  addProductToCartAction,
  clearCartAction,
  completeMockCheckoutAction,
  updateCartLineAction,
} from '@/app/[locale]/(screens)/products/_features/mock-commerce-actions'
import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import {
  calculateCartSummary,
  getCartSuggestionProductIds,
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
  const [partnerOrders, setPartnerOrders] = useState<Array<{ orderId: string; sellerId: string }>>(
    [],
  )
  const [isPending, startTransition] = useTransition()
  const lines = cart.lines.flatMap((line) => {
    const product = getMockProductById(line.productId)
    return product ? [{ ...line, product }] : []
  })
  const summary = useMemo(
    () => calculateCartSummary(cart, { unlockedAdvantageIds }),
    [cart, unlockedAdvantageIds],
  )
  const sellerGroups = summary.sellerGroups.flatMap((group) => {
    const sellerLines = lines.filter((line) => line.product.producer_id === group.sellerId)
    const firstLine = sellerLines[0]
    if (!firstLine) return []
    return [
      {
        ...group,
        lines: sellerLines,
        shipping: getSellerShippingProfile(group.sellerId),
        sellerName: firstLine.product.producer.name_default,
      },
    ]
  })
  const suggestedProducts = getCartSuggestionProductIds(cart).flatMap((productId) => {
    const product = getMockProductById(productId)
    return product ? [product] : []
  })
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

  function addSuggestedProduct(productId: string) {
    startTransition(async () => {
      const result = await addProductToCartAction(productId)
      if (result.ok) setCart(result.cart)
    })
  }

  function completeOrder() {
    if (!canCompleteCheckout) return
    startTransition(async () => {
      const result = await completeMockCheckoutAction(customer)
      if (!result.ok) return
      setOrderId(result.orderId)
      setOrderTotal(result.totalEur)
      setPartnerOrders(result.partnerOrders)
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
        </div>
        <div className="mt-4 w-full text-left">
          <p className="text-[11px] font-bold uppercase text-white/45">Commandes partenaires</p>
          <p className="mt-2 text-sm font-medium text-white/55">
            {sellerGroups.length} partenaire{sellerGroups.length > 1 ? 's' : ''} ·{' '}
            {sellerGroups.length} expédition{sellerGroups.length > 1 ? 's séparées' : ''}
          </p>
          <div className="mt-3 space-y-2">
            {sellerGroups.map((group) => (
              <div
                key={group.sellerId}
                className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
              >
                <p className="text-sm font-bold text-white">{group.sellerName}</p>
                <p className="mt-1 text-[12px] font-medium text-white/50">
                  Commande{' '}
                  {partnerOrders.find((order) => order.sellerId === group.sellerId)?.orderId} ·{' '}
                  {group.shipping?.deliveryLabel}
                </p>
              </div>
            ))}
          </div>
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
            {sellerGroups.length} partenaire{sellerGroups.length > 1 ? 's' : ''}{' '}
            {sellerGroups.length > 1
              ? `· ${sellerGroups.length} expéditions séparées`
              : '· 1 expédition partenaire'}
          </p>
          <div className="mt-6 space-y-7">
            {sellerGroups.map((group) => (
              <section key={group.sellerId} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-white/40">
                      Vendu et expédié par
                    </p>
                    <p className="mt-1 text-sm font-black text-white">{group.sellerName}</p>
                  </div>
                  <p className="text-right text-[12px] font-medium text-white/45">
                    {group.shipping?.deliveryLabel}
                  </p>
                </div>
                {group.lines.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3"
                  >
                    <img
                      src={product.image_url}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover"
                    />
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
                      <span className="w-5 text-center text-sm font-bold text-white">
                        {quantity}
                      </span>
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
                <div className="flex items-start justify-between gap-3 px-1 text-[12px] font-medium text-white/45">
                  <span>Livraison {group.shipping?.carrierLabel}</span>
                  <span>{group.shippingEur === 0 ? 'Offerte' : formatEuro(group.shippingEur)}</span>
                </div>
                {group.amountUntilFreeShippingEur > 0 && (
                  <p className="px-1 text-[12px] font-medium text-white/45">
                    Encore {formatEuro(group.amountUntilFreeShippingEur)} chez {group.sellerName}{' '}
                    pour la livraison offerte.
                  </p>
                )}
              </section>
            ))}
          </div>
          {suggestedProducts.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-black text-white">Compléter votre commande</h2>
              <div className="mt-4 space-y-3">
                {suggestedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3"
                  >
                    <img
                      src={product.image_url}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase text-white/40">
                        {product.producer.name_default}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm font-bold text-white">
                        {product.name_default}
                      </p>
                      <p className="mt-1 text-sm font-black text-white">
                        {formatEuro(product.price_eur_equivalent)}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => addSuggestedProduct(product.id)}
                      aria-label={`Ajouter ${product.name_default}`}
                      className="flex shrink-0 items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white/75 disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
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
            <p className="text-[11px] font-bold uppercase text-white/45">Commandes partenaires</p>
            <div className="mt-4 space-y-5">
              {sellerGroups.map((group) => (
                <section key={group.sellerId}>
                  <p className="text-sm font-black text-white">{group.sellerName}</p>
                  <p className="mt-1 text-[12px] font-medium text-white/45">
                    Vendeur et expéditeur · Livraison {group.shipping?.deliveryLabel}
                  </p>
                  <p className="mt-3 text-[10px] font-bold uppercase text-white/40">Articles</p>
                  <div className="mt-3 space-y-2">
                    {group.lines.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <p className="min-w-0 font-semibold text-white/75">
                          {quantity} x {product.name_default}
                        </p>
                        <p className="shrink-0 font-black text-white">
                          {formatEuro(product.price_eur_equivalent * quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
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
        {sellerGroups.map((group) => (
          <div
            key={group.sellerId}
            className="mt-3 flex justify-between gap-3 text-sm text-white/60"
          >
            <span>Livraison {group.sellerName}</span>
            <span>{group.shippingEur === 0 ? 'Offerte' : formatEuro(group.shippingEur)}</span>
          </div>
        ))}
        <div className="my-4 h-px bg-white/10" />
        <div className="flex justify-between text-lg font-black text-white">
          <span>Total TTC</span>
          <span>{formatEuro(summary.totalEur)}</span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/8 p-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Truck className="h-4 w-4 text-lime-300" aria-hidden="true" />
          {sellerGroups.length > 1
            ? `${sellerGroups.length} expéditions séparées`
            : 'Expédition partenaire'}
        </div>
        <div className="mt-3 space-y-2">
          {sellerGroups.map((group) => (
            <p key={group.sellerId} className="text-[12px] font-medium text-white/55">
              {group.sellerName} · {group.shipping?.deliveryLabel}
            </p>
          ))}
        </div>
        {sellerGroups.some((group) => group.shipping?.feeStatus === 'prototype_estimate') && (
          <p className="mt-3 text-[12px] font-medium text-amber-200/75">
            Frais Ilanga estimés pour le prototype, à confirmer par le partenaire.
          </p>
        )}
      </div>

      {stage === 'checkout' && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/8">
          <div className="px-4 pt-4">
            {sellerGroups.map((group) => (
              <p key={group.sellerId} className="text-sm font-bold text-white">
                Vendeur et expéditeur : {group.sellerName}
              </p>
            ))}
          </div>
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
              Chaque partenaire vendeur assure la livraison, les retours et le SAV de ses articles.
              Le droit de rétractation s’applique selon la réglementation, avec exceptions possibles
              pour certains biens.
            </p>
          )}
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
            {isPending
              ? 'Validation en cours...'
              : `Simuler le paiement · ${formatEuro(summary.totalEur)}`}
          </button>
        )}
      </div>
    </div>
  )
}
