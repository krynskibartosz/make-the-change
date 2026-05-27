'use client'

import { Loader2, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { saveCheckoutCustomerAction } from '@/app/[locale]/(screens)/products/checkout/_features/checkout-actions'
import type { MockCheckoutCustomer } from '@/lib/mock/mock-checkout-session'
import { CheckoutSteps } from '../_components/checkout-steps'

type Props = {
  initialCustomer: MockCheckoutCustomer
  isConnected: boolean
  locale: string
}

function isValidEmail(email: string): boolean {
  const parts = email.split('@')
  return parts.length === 2 && (parts[1]?.includes('.') ?? false)
}

export function InfosClient({ initialCustomer, isConnected, locale }: Props) {
  const router = useRouter()
  const [customer, setCustomer] = useState<MockCheckoutCustomer>(initialCustomer)
  const [isPending, startTransition] = useTransition()

  const canContinue =
    isValidEmail(customer.email) &&
    customer.name.trim().length > 1 &&
    customer.street.trim().length > 3 &&
    customer.postalCode.trim().length >= 4 &&
    customer.city.trim().length > 1

  function handleContinue() {
    if (!canContinue) return
    startTransition(async () => {
      await saveCheckoutCustomerAction(customer)
      router.push(`/${locale}/products/checkout/paiement`)
    })
  }

  return (
    <div className="px-4 pb-28 pt-5">
      <CheckoutSteps currentStep="infos" />

      <h1 className="mt-1 text-2xl font-black text-white">Informations</h1>
      <p className="mt-1 text-sm font-medium text-white/50">
        {isConnected
          ? 'Commande liée à ton espace MTC · Belgique uniquement'
          : 'Achat invité · Belgique uniquement'}
      </p>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="checkout-email" className="block text-xs font-bold text-white/55">
            E-mail
          </label>
          <input
            id="checkout-email"
            required
            value={customer.email}
            onChange={(e) => setCustomer((v) => ({ ...v, email: e.target.value }))}
            placeholder="votre@email.com"
            type="email"
            autoComplete="email"
            className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="checkout-name" className="block text-xs font-bold text-white/55">
            Nom complet
          </label>
          <input
            id="checkout-name"
            required
            value={customer.name}
            onChange={(e) => setCustomer((v) => ({ ...v, name: e.target.value }))}
            placeholder="Prénom Nom"
            autoComplete="name"
            className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="checkout-street" className="block text-xs font-bold text-white/55">
            Rue et numéro
          </label>
          <input
            id="checkout-street"
            required
            value={customer.street}
            onChange={(e) => setCustomer((v) => ({ ...v, street: e.target.value }))}
            placeholder="Rue de la Paix 10"
            autoComplete="street-address"
            className="h-13 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-white/55">Code postal et ville</label>
          <div className="flex gap-3">
            <input
              id="checkout-postal"
              required
              value={customer.postalCode}
              onChange={(e) => setCustomer((v) => ({ ...v, postalCode: e.target.value }))}
              placeholder="1000"
              inputMode="numeric"
              autoComplete="postal-code"
              className="h-13 w-[38%] rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25"
            />
            <input
              id="checkout-city"
              required
              value={customer.city}
              onChange={(e) => setCustomer((v) => ({ ...v, city: e.target.value }))}
              placeholder="Bruxelles"
              autoComplete="address-level2"
              className="h-13 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25"
            />
          </div>
        </div>

        <div className="flex h-13 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/70">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Belgique
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-white/5 bg-[#0B0F15]/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-lg">
        <button
          type="button"
          disabled={isPending || !canContinue}
          onClick={handleContinue}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15] disabled:opacity-60"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isPending ? 'Enregistrement...' : 'Continuer vers le paiement'}
        </button>
      </div>
    </div>
  )
}
