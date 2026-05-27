'use client'

import { Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import {
  addProductToCartAction,
  clearCartAction,
  updateCartLineAction,
} from '@/app/[locale]/(screens)/products/_features/mock-commerce-actions'
import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import {
  calculateCartSummary,
  getCartSuggestionProductIds,
  getSellerShippingProfile,
  type MockCart,
} from '@/lib/mock/mock-commerce'

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
  isConnected: _isConnected,
  locale,
}: Props) {
  const router = useRouter()
  const [cart, setCart] = useState(initialCart)
  const [confirmClear, setConfirmClear] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [cartStatus, setCartStatus] = useState('')

  const lines = cart.lines.flatMap((line) => {
    const product = getMockProductById(line.productId)
    return product ? [{ ...line, product }] : []
  })
  const summary = useMemo(
    () => calculateCartSummary(cart, { unlockedAdvantageIds }),
    [cart, unlockedAdvantageIds],
  )
  const prevTotalRef = useRef(summary.totalEur)

  useEffect(() => {
    if (prevTotalRef.current !== summary.totalEur) {
      prevTotalRef.current = summary.totalEur
      setCartStatus(
        cart.lines.length === 0
          ? 'Panier vidé'
          : `Panier mis à jour · ${formatEuro(summary.totalEur)} au total`,
      )
    }
  }, [summary.totalEur, cart.lines.length])

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

  function updateQuantity(productId: string, quantity: number) {
    startTransition(async () => setCart(await updateCartLineAction(productId, quantity)))
  }

  function emptyCart() {
    startTransition(async () => {
      setConfirmClear(false)
      setCart(await clearCartAction())
    })
  }

  function addSuggestedProduct(productId: string) {
    startTransition(async () => {
      const result = await addProductToCartAction(productId)
      if (result.ok) setCart(result.cart)
    })
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
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {cartStatus}
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Panier</h1>
        {confirmClear ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/45">Vider le panier ?</span>
            <button type="button" onClick={emptyCart} className="text-xs font-bold text-red-400">
              Oui
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="text-xs font-bold text-white/45"
            >
              Non
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-1 text-xs font-bold text-white/45"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Vider
          </button>
        )}
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
                <p className="text-[10px] font-bold uppercase text-white/40">Vendu et expédié par</p>
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
                <Link
                  href={`/${locale}/products/${product.slug}`}
                  className="shrink-0"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={product.image_url}
                    alt=""
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${locale}/products/${product.slug}`}
                    className="line-clamp-2 text-sm font-bold text-white hover:underline"
                  >
                    {product.name_default}
                  </Link>
                  <p className="mt-1 text-sm font-black text-white">
                    {formatEuro(product.price_eur_equivalent)}
                  </p>
                </div>
                <div className="flex h-9 items-center rounded-lg border border-white/10">
                  {quantity === 1 ? (
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, 0)}
                      aria-label={`Supprimer ${product.name_default}`}
                      className="flex h-9 w-8 items-center justify-center text-white/50 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label="Diminuer la quantité"
                      className="h-9 w-8 text-white/70"
                    >
                      -
                    </button>
                  )}
                  <span className="w-5 text-center text-sm font-bold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label="Augmenter la quantité"
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
                Encore {formatEuro(group.amountUntilFreeShippingEur)} chez {group.sellerName} pour
                la livraison offerte.
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

      {/* Récap total */}
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

      <div className="fixed inset-x-0 bottom-0 border-t border-white/5 bg-[#0B0F15]/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-[11px] font-medium text-white/45">Total TTC</p>
            <p className="text-base font-black text-white">{formatEuro(summary.totalEur)}</p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/products/checkout/infos`)}
            className="flex-1 rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15]"
          >
            Continuer vers le paiement
          </button>
        </div>
      </div>
    </div>
  )
}
