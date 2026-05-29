'use client'

import { ChevronDown, Loader2, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { saveCheckoutCustomerAction, saveAddressAction } from '@/app/[locale]/(screens)/products/checkout/_features/checkout-actions'
import type { MockCheckoutCustomer } from '@/lib/mock/mock-checkout-session'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { CHECKOUT_COUNTRIES } from '@/lib/checkout-countries'
import { AddressAutocompleteInput } from '@/app/[locale]/(screens)/_components/address-autocomplete-input'
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

const ERROR_CLASS = 'mt-1 px-1 text-xs text-red-400/90'

export function InfosClient({ initialCustomer, isConnected, savedAddresses, locale }: Props) {
  const router = useRouter()
  const [customer, setCustomer] = useState<MockCheckoutCustomer>(initialCustomer)
  const [isPending, startTransition] = useTransition()
  const [showSheet, setShowSheet] = useState(false)
  // Pre-check for first-time connected users with no saved address yet
  const [saveAddress, setSaveAddress] = useState(isConnected && savedAddresses.length === 0)
  const [addressSaveError, setAddressSaveError] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const hasSavedAddresses = savedAddresses.length > 0

  const errors = {
    email: !isValidEmail(customer.email) ? 'Adresse e-mail invalide' : null,
    name: customer.name.trim().length < 2 ? 'Au moins 2 caractères requis' : null,
    street: customer.street.trim().length < 4 ? 'Adresse trop courte' : null,
    postalCode: customer.postalCode.trim().length < 4 ? 'Code postal invalide' : null,
    city: customer.city.trim().length < 2 ? 'Ville requise' : null,
  }

  const canContinue = Object.values(errors).every((e) => e === null)

  function touch(field: string) {
    setTouched((v) => ({ ...v, [field]: true }))
  }

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
    // Mark address fields as touched so no stale error messages show
    setTouched((v) => ({ ...v, street: false, postalCode: false, city: false }))
  }

  function handleContinue() {
    // Touch all fields to reveal any remaining errors
    setTouched({ email: true, name: true, street: true, postalCode: true, city: true })
    if (!canContinue) return
    startTransition(async () => {
      await saveCheckoutCustomerAction(customer)
      if (saveAddress && isConnected) {
        const saved = await saveAddressAction({
          street: customer.street,
          postalCode: customer.postalCode,
          city: customer.city,
          country: customer.country,
        })
        if (!saved.ok) setAddressSaveError(true)
      }
      router.push(`/${locale}/products/checkout/paiement`)
    })
  }

  return (
    <div className="px-4 pb-36 pt-5">
      <CheckoutSteps currentStep="infos" />

      <h1 className="mt-1 text-2xl font-black text-white">Informations</h1>
      <p className="mt-1 text-sm font-medium text-white/50">
        {isConnected ? 'Commande liée à ton espace MTC' : 'Achat invité'}
      </p>

      {isConnected && hasSavedAddresses && (
        <button
          type="button"
          onClick={() => setShowSheet(true)}
          className="mt-4 flex w-full items-center gap-2 rounded-xl border border-lime-300/30 bg-lime-300/5 px-4 py-3 text-sm font-medium text-lime-300 transition-colors active:bg-lime-300/10"
        >
          <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 text-left">Utiliser une adresse sauvegardée</span>
        </button>
      )}

      <div className="mt-6 space-y-4">
        {/* E-mail */}
        <div className="space-y-1">
          <label htmlFor="checkout-email" className="block text-xs font-bold text-white/55">
            E-mail
          </label>
          <input
            id="checkout-email"
            value={customer.email}
            onChange={(e) => setCustomer((v) => ({ ...v, email: e.target.value }))}
            onBlur={() => touch('email')}
            placeholder="votre@email.com"
            type="email"
            autoComplete="email"
            className={INPUT_CLASS}
          />
          {touched.email && errors.email && <p className={ERROR_CLASS}>{errors.email}</p>}
        </div>

        {/* Nom */}
        <div className="space-y-1">
          <label htmlFor="checkout-name" className="block text-xs font-bold text-white/55">
            Nom complet
          </label>
          <input
            id="checkout-name"
            value={customer.name}
            onChange={(e) => setCustomer((v) => ({ ...v, name: e.target.value }))}
            onBlur={() => touch('name')}
            placeholder="Prénom Nom"
            autoComplete="name"
            className={INPUT_CLASS}
          />
          {touched.name && errors.name && <p className={ERROR_CLASS}>{errors.name}</p>}
        </div>

        {/* Rue avec autocomplete */}
        <div className="space-y-1">
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
            onBlur={() => touch('street')}
            onSelect={({ street, postalCode, city }) => {
              setCustomer((v) => ({ ...v, street, postalCode, city }))
              setTouched((v) => ({ ...v, street: false, postalCode: false, city: false }))
            }}
          />
          {touched.street && errors.street && <p className={ERROR_CLASS}>{errors.street}</p>}
        </div>

        {/* Code postal + Ville */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-white/55">Code postal et ville</label>
          <div className="flex gap-3">
            <div className="w-[38%]">
              <input
                id="checkout-postal"
                value={customer.postalCode}
                onChange={(e) => setCustomer((v) => ({ ...v, postalCode: e.target.value }))}
                onBlur={() => touch('postalCode')}
                placeholder="1000"
                inputMode="numeric"
                autoComplete="postal-code"
                className={`${INPUT_BASE} w-full`}
              />
              {touched.postalCode && errors.postalCode && (
                <p className={ERROR_CLASS}>{errors.postalCode}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                id="checkout-city"
                value={customer.city}
                onChange={(e) => setCustomer((v) => ({ ...v, city: e.target.value }))}
                onBlur={() => touch('city')}
                placeholder="Bruxelles"
                autoComplete="address-level2"
                className={`${INPUT_BASE} w-full`}
              />
              {touched.city && errors.city && <p className={ERROR_CLASS}>{errors.city}</p>}
            </div>
          </div>
        </div>

        {/* Pays */}
        <div className="space-y-1">
          <label htmlFor="checkout-country" className="block text-xs font-bold text-white/55">
            Pays
          </label>
          <div className="relative">
            <select
              id="checkout-country"
              value={customer.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              autoComplete="country"
              className={`${INPUT_CLASS} appearance-none pr-10`}
            >
              {CHECKOUT_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0B0F15] text-white">
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Toggle sauvegarder l'adresse */}
        {isConnected && (
          <div>
            <button
              type="button"
              onClick={() => setSaveAddress((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left transition-colors active:bg-white/[0.07]"
            >
              <div>
                <p className="text-sm font-semibold text-white">Sauvegarder cette adresse</p>
                <p className="mt-0.5 text-xs text-white/40">Retrouve-la à ta prochaine commande</p>
              </div>
              {/* Toggle switch */}
              <div
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  saveAddress ? 'bg-lime-300' : 'bg-white/20'
                }`}
              >
                <div
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    saveAddress ? 'translate-x-[1.375rem]' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </button>
            {addressSaveError && (
              <p className="mt-1 px-1 text-xs text-red-400/80">
                L'adresse n'a pas pu être sauvegardée — ajoute-la depuis ton profil.
              </p>
            )}
          </div>
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
          disabled={isPending}
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
