'use client'

import { Loader2, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { saveCheckoutCustomerAction, saveAddressAction } from '@/app/[locale]/(screens)/products/checkout/_features/checkout-actions'
import type { MockCheckoutCustomer } from '@/lib/mock/mock-checkout-session'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { CHECKOUT_COUNTRIES } from '@/lib/checkout-countries'
import { AddressAutocompleteInput } from './address-autocomplete-input'
import { SavedAddressesSheet } from './saved-addresses-sheet'
import { CheckoutSteps } from '../_components/checkout-steps'

type Props = {
  initialCustomer: MockCheckoutCustomer
  isConnected: boolean
  savedAddresses: MockUserAddress[]
  locale: string
}

function isValidEmail(email: string): boolean {
  const parts = email.split('@')
  return parts.length === 2 && (parts[1]?.includes('.') ?? false)
}

const INPUT_BASE =
  'h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25'
const INPUT_CLASS = `${INPUT_BASE} w-full`

export function InfosClient({ initialCustomer, isConnected, savedAddresses, locale }: Props) {
  const router = useRouter()
  const [customer, setCustomer] = useState<MockCheckoutCustomer>(initialCustomer)
  const [isPending, startTransition] = useTransition()
  const [showSheet, setShowSheet] = useState(false)
  const [saveAddress, setSaveAddress] = useState(false)

  const hasSavedAddresses = savedAddresses.length > 0

  const canContinue =
    isValidEmail(customer.email) &&
    customer.name.trim().length > 1 &&
    customer.street.trim().length > 3 &&
    customer.postalCode.trim().length >= 4 &&
    customer.city.trim().length > 1

  function handleCountryChange(country: string) {
    setCustomer((v) => ({ ...v, country, street: '', postalCode: '', city: '' }))
  }

  function handleAddressSelect(address: MockUserAddress) {
    setCustomer((v) => ({
      ...v,
      street: address.street,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    }))
  }

  function handleContinue() {
    if (!canContinue) return
    startTransition(async () => {
      await saveCheckoutCustomerAction(customer)
      if (saveAddress && isConnected) {
        await saveAddressAction({
          street: customer.street,
          postalCode: customer.postalCode,
          city: customer.city,
          country: customer.country,
        })
      }
      router.push(`/${locale}/products/checkout/paiement`)
    })
  }

  return (
    <div className="px-4 pb-28 pt-5">
      <CheckoutSteps currentStep="infos" />

      <h1 className="mt-1 text-2xl font-black text-white">Informations</h1>
      <p className="mt-1 text-sm font-medium text-white/50">
        {isConnected ? 'Commande liée à ton espace MTC' : 'Achat invité'}
      </p>

      {isConnected && hasSavedAddresses && (
        <button
          type="button"
          onClick={() => setShowSheet(true)}
          className="mt-4 flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70 transition-colors active:bg-white/[0.08]"
        >
          <MapPin className="h-4 w-4 shrink-0 text-lime-300" aria-hidden="true" />
          <span className="flex-1 text-left">Changer d'adresse</span>
        </button>
      )}

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
            className={INPUT_CLASS}
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
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="checkout-country" className="block text-xs font-bold text-white/55">
            Pays
          </label>
          <select
            id="checkout-country"
            value={customer.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            autoComplete="country"
            className={`${INPUT_CLASS} appearance-none`}
          >
            {CHECKOUT_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#0B0F15] text-white">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="checkout-street" className="block text-xs font-bold text-white/55">
            Rue et numéro
          </label>
          <AddressAutocompleteInput
            id="checkout-street"
            value={customer.street}
            country={customer.country}
            placeholder="Rue de la Paix 10"
            className={INPUT_CLASS}
            onChange={(street) => setCustomer((v) => ({ ...v, street }))}
            onSelect={({ street, postalCode, city }) =>
              setCustomer((v) => ({ ...v, street, postalCode, city }))
            }
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
              className={`${INPUT_BASE} w-[38%]`}
            />
            <input
              id="checkout-city"
              required
              value={customer.city}
              onChange={(e) => setCustomer((v) => ({ ...v, city: e.target.value }))}
              placeholder="Bruxelles"
              autoComplete="address-level2"
              className={`${INPUT_BASE} flex-1`}
            />
          </div>
        </div>

        {isConnected && (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="h-4 w-4 accent-lime-300"
            />
            <span className="text-sm font-medium text-white/70">
              Sauvegarder cette adresse dans mon profil
            </span>
          </label>
        )}
      </div>

      {showSheet && (
        <SavedAddressesSheet
          addresses={savedAddresses}
          onSelect={handleAddressSelect}
          onClose={() => setShowSheet(false)}
        />
      )}

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
