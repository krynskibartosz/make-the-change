'use client'

import { CreditCard, Loader2, Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import { completeCheckoutAction } from '@/app/[locale]/(screens)/products/checkout/_features/checkout-actions'
import { getMockProductById } from '@/app/[locale]/(screens)/products/_features/mock-products'
import { getSellerShippingProfile, type CartSummary, type MockCart } from '@/lib/mock/mock-commerce'
import type { MockCheckoutCustomer } from '@/lib/mock/mock-checkout-session'
import { CheckoutSteps } from '../_components/checkout-steps'

type Props = {
  cart: MockCart
  summary: CartSummary
  customer: MockCheckoutCustomer
  isConnected: boolean
  locale: string
}

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(value)

export function PaiementClient({ cart, summary, customer, isConnected, locale }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const lines = useMemo(
    () =>
      cart.lines.flatMap((line) => {
        const product = getMockProductById(line.productId)
        return product ? [{ ...line, product }] : []
      }),
    [cart.lines],
  )

  const sellerGroups = useMemo(
    () =>
      summary.sellerGroups.flatMap((group) => {
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
      }),
    [summary.sellerGroups, lines],
  )

  function handlePay() {
    setError(null)
    startTransition(async () => {
      const result = await completeCheckoutAction()
      if (!result.ok) {
        setError('Une erreur est survenue. Veuillez réessayer.')
        return
      }
      router.push(`/${locale}/products/checkout/confirmation`)
    })
  }

  return (
    <div className="px-4 pb-28 pt-5">
      <CheckoutSteps currentStep="paiement" />

      <h1 className="mt-1 text-2xl font-black text-white">Paiement</h1>
      <p className="mt-1 text-sm font-medium text-white/50">
        {isConnected ? 'Commande liée à ton espace MTC' : 'Achat invité'} · Belgique uniquement
      </p>

      {/* Récapitulatif commandes */}
      <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.03] p-4">
        <p className="text-[11px] font-bold uppercase text-white/45">Articles</p>
        <div className="mt-4 space-y-5">
          {sellerGroups.map((group) => (
            <section key={group.sellerId}>
              <p className="text-sm font-black text-white">{group.sellerName}</p>
              <p className="mt-1 text-[12px] font-medium text-white/45">
                Livraison {group.shipping?.deliveryLabel}
              </p>
              <div className="mt-3 space-y-2">
                {group.lines.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <p className="min-w-0 font-semibold text-white/75">
                      {quantity} × {product.name_default}
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

      {/* Adresse de livraison */}
      <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-4">
        <p className="text-[11px] font-bold uppercase text-white/45">Livraison à</p>
        <p className="mt-2 text-sm font-bold text-white">{customer.name}</p>
        <p className="mt-1 text-[12px] font-medium text-white/55">
          {customer.street}, {customer.postalCode} {customer.city}, Belgique
        </p>
        <p className="mt-1 text-[12px] font-medium text-white/40">{customer.email}</p>
      </div>

      {/* Récap livraison */}
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
        {sellerGroups.some((g) => g.shipping?.feeStatus === 'prototype_estimate') && (
          <p className="mt-3 text-[12px] font-medium text-amber-200/75">
            Frais estimés pour le prototype, à confirmer par le partenaire.
          </p>
        )}
      </div>

      {/* Total */}
      <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
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
          <div key={group.sellerId} className="mt-3 flex justify-between gap-3 text-sm text-white/60">
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

      {/* CGV et rétractation */}
      <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.03] p-4">
        <p className="text-[12px] font-medium leading-relaxed text-white/55">
          Chaque partenaire vendeur assure la livraison, les retours et le SAV.
        </p>
        <p className="mt-2 text-[12px] font-bold text-white/50">
          Droit de rétractation : 14 jours à compter de la réception.
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-white/5 bg-[#0B0F15]/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        {error && (
          <p role="alert" aria-live="polite" className="mb-3 text-center text-sm font-medium text-red-400">
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={isPending}
          onClick={handlePay}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-[15px] font-black text-[#0B0F15] disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <CreditCard className="h-4 w-4" aria-hidden="true" />
          )}
          {isPending ? 'Validation en cours...' : `Simuler le paiement · ${formatEuro(summary.totalEur)}`}
        </button>
      </div>
    </div>
  )
}
