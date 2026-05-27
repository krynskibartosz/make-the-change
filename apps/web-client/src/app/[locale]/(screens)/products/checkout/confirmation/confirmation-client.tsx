'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import type { MockCheckoutCompletedOrder } from '@/lib/mock/mock-checkout-session'

type Props = {
  completedOrder: MockCheckoutCompletedOrder
  isConnected: boolean
  locale: string
}

const formatEuro = (value: number) =>
  new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(value)

export function ConfirmationClient({ completedOrder, isConnected, locale }: Props) {
  const { orderId, totalEur, partnerOrders } = completedOrder

  return (
    <div className="flex min-h-[100dvh] flex-col items-center px-5 pb-8 pt-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-300">
        <Check className="h-10 w-10 text-[#0B0F15]" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-3xl font-black text-white">Commande confirmée</h1>
      <p className="mt-3 text-sm font-medium leading-relaxed text-white/55">
        Commande n° <span className="font-mono text-white/80">{orderId}</span>
      </p>

      <div className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-[11px] font-bold uppercase text-white/45">Total achat partenaire</p>
        <p className="mt-2 text-3xl font-black text-white">{formatEuro(totalEur)}</p>
      </div>

      <div className="mt-4 w-full text-left">
        <p className="text-[11px] font-bold uppercase text-white/45">Commandes partenaires</p>
        <p className="mt-2 text-sm font-medium text-white/55">
          {partnerOrders.length} partenaire{partnerOrders.length > 1 ? 's' : ''} ·{' '}
          {partnerOrders.length} expédition{partnerOrders.length > 1 ? 's séparées' : ''}
        </p>
        <div className="mt-3 space-y-2">
          {partnerOrders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-sm font-bold text-white">{order.sellerName}</p>
              <p className="mt-1 text-[12px] font-medium text-white/50">
                Commande {order.orderId}
                {order.deliveryLabel ? ` · ${order.deliveryLabel}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex w-full flex-col gap-3 pt-8">
        {!isConnected && (
          <>
            <p className="text-sm font-medium leading-relaxed text-white/55">
              Crée ou connecte un espace MTC pour suivre cette commande.
            </p>
            <Link
              href={`/${locale}/register?returnTo=${encodeURIComponent('/profile/contributions')}`}
              className="block rounded-2xl bg-lime-300 py-4 text-center text-[15px] font-black text-[#0B0F15]"
            >
              Créer mon espace
            </Link>
            <Link
              href={`/${locale}/login?returnTo=${encodeURIComponent('/profile/contributions')}`}
              className="block rounded-2xl border border-white/10 py-4 text-center text-sm font-bold text-white/70"
            >
              J'ai déjà un espace
            </Link>
          </>
        )}
        <Link
          href={`/${locale}/products`}
          className="block rounded-2xl border border-white/10 py-4 text-center text-sm font-bold text-white/70"
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  )
}
