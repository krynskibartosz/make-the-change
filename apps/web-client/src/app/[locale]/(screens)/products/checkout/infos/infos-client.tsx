'use client'

import { AlertTriangle, CheckCircle, Loader2, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTriggerBare,
  SelectValue,
  Switch,
} from '@make-the-change/core/ui'
import { saveCheckoutCustomerAction, saveAddressAction } from '@/app/[locale]/(screens)/products/checkout/_features/checkout-actions'
import type { MockCheckoutCustomer } from '@/lib/mock/mock-checkout-session'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import type { AddressValidationResult, ValidationSuggestion } from '@/lib/address-validation'
import { CHECKOUT_COUNTRIES } from '@/lib/checkout-countries'
import { BottomActionBar } from '@/app/[locale]/_components/bottom-action-bar'
import { AddressAutocompleteInput } from '@/app/[locale]/(screens)/_components/address-autocomplete-input'
import { SavedAddressesSheet } from './saved-addresses-sheet'
import { CheckoutSteps } from '../_components/checkout-steps'

type Props = {
  initialCustomer: MockCheckoutCustomer
  isConnected: boolean
  savedAddresses: MockUserAddress[]
  locale: string
}

type ValidationPhase = 'idle' | 'validating' | 'confirmed' | 'suggested' | 'invalid' | 'unavailable'

function isValidEmail(email: string): boolean {
  const parts = email.split('@')
  return parts.length === 2 && (parts[1]?.includes('.') ?? false)
}


export function InfosClient({ initialCustomer, isConnected, savedAddresses, locale }: Props) {
  const router = useRouter()
  const [customer, setCustomer] = useState<MockCheckoutCustomer>(initialCustomer)
  const [isPending, startTransition] = useTransition()
  const isProcessingRef = useRef(false)
  const [showSheet, setShowSheet] = useState(false)
  const [saveAddress, setSaveAddress] = useState(isConnected && savedAddresses.length === 0)
  const [addressSaveError, setAddressSaveError] = useState(false)
  // Address validation state machine (kept — async API validation)
  const [validationPhase, setValidationPhase] = useState<ValidationPhase>('idle')
  const [validationSuggestion, setValidationSuggestion] = useState<ValidationSuggestion | null>(null)

  const hasSavedAddresses = savedAddresses.length > 0

  const canContinue =
    isValidEmail(customer.email) &&
    customer.name.trim().length >= 2 &&
    customer.street.trim().length >= 4 &&
    customer.postalCode.trim().length >= 4 &&
    customer.city.trim().length >= 2

  function resetValidation() {
    if (validationPhase !== 'idle') setValidationPhase('idle')
    setValidationSuggestion(null)
  }

  function handleCountryChange(country: string) {
    setCustomer((v) => ({ ...v, country, street: '', postalCode: '', city: '' }))
    resetValidation()
  }

  function handleAddressSelect(address: MockUserAddress) {
    setCustomer((v) => ({
      ...v,
      street: address.street,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    }))
    resetValidation()
  }

  async function validateAddress(): Promise<ValidationPhase> {
    setValidationPhase('validating')
    try {
      const res = await fetch('/api/address-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          street: customer.street,
          postalCode: customer.postalCode,
          city: customer.city,
          country: customer.country,
        }),
      })
      const result = (await res.json()) as AddressValidationResult
      if (result.status === 'suggested') {
        setValidationSuggestion(result.suggestion)
      }
      setValidationPhase(result.status)
      return result.status
    } catch {
      setValidationPhase('unavailable')
      return 'unavailable'
    }
  }

  async function proceedToPayment(withCustomer = customer) {
    startTransition(async () => {
      await saveCheckoutCustomerAction(withCustomer)
      if (saveAddress && isConnected) {
        const saved = await saveAddressAction({
          street: withCustomer.street,
          postalCode: withCustomer.postalCode,
          city: withCustomer.city,
          country: withCustomer.country,
        })
        if (!saved.ok) setAddressSaveError(true)
      }
      router.push(`/${locale}/products/checkout/paiement`)
    })
  }

  async function handleContinue() {
    if (isProcessingRef.current) return
    if (!canContinue) return

    isProcessingRef.current = true
    try {
      // Already validated — proceed
      if (validationPhase === 'invalid' || validationPhase === 'unavailable') {
        await proceedToPayment()
        return
      }

      // Validate address first
      const result = await validateAddress()
      if (result === 'confirmed' || result === 'unavailable') {
        await proceedToPayment()
      }
      // 'suggested' or 'invalid' → show UI, wait for user action
    } finally {
      isProcessingRef.current = false
    }
  }

  async function handleUseSuggestion() {
    if (!validationSuggestion) return
    const updated: MockCheckoutCustomer = {
      ...customer,
      street: validationSuggestion.street,
      postalCode: validationSuggestion.postalCode,
      city: validationSuggestion.city,
    }
    setCustomer(updated)
    setValidationPhase('confirmed')
    await proceedToPayment(updated)
  }

  const isValidating = validationPhase === 'validating'
  const showSuggestion = validationPhase === 'suggested' && validationSuggestion !== null
  const showInvalidWarning = validationPhase === 'invalid'

  return (
    <div className="px-4 pb-40 pt-5">
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
        <Field name="email">
          <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">E-mail</FieldLabel>
          <FieldControl
            render={<Input variant="ghost" size="lg" />}
            type="email"
            required
            value={customer.email}
            onChange={(e) => setCustomer((v) => ({ ...v, email: (e.target as HTMLInputElement).value }))}
            placeholder="votre@email.com"
            autoComplete="email"
          />
          <FieldError className="mt-1 text-xs text-red-400" match="valueMissing">
            E-mail requis
          </FieldError>
          <FieldError className="mt-1 text-xs text-red-400" match="typeMismatch">
            Format e-mail invalide
          </FieldError>
        </Field>

        {/* Nom */}
        <Field name="name">
          <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">Nom complet</FieldLabel>
          <FieldControl
            render={<Input variant="ghost" size="lg" />}
            required
            minLength={2}
            value={customer.name}
            onChange={(e) => setCustomer((v) => ({ ...v, name: (e.target as HTMLInputElement).value }))}
            placeholder="Prénom Nom"
            autoComplete="name"
          />
          <FieldError className="mt-1 text-xs text-red-400" match="valueMissing">
            Nom requis
          </FieldError>
          <FieldError className="mt-1 text-xs text-red-400" match="tooShort">
            Au moins 2 caractères requis
          </FieldError>
        </Field>

        {/* Rue */}
        <Field name="street">
          <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">
            Rue et numéro
          </FieldLabel>
          <AddressAutocompleteInput
            id="checkout-street"
            value={customer.street}
            country={customer.country}
            placeholder="Rue de la Paix 10"
            className="h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25 w-full"
            onChange={(street) => { setCustomer((v) => ({ ...v, street })); resetValidation() }}
            onSelect={({ street, postalCode, city }) => {
              setCustomer((v) => ({ ...v, street, postalCode, city }))
              resetValidation()
            }}
          />
        </Field>

        {/* Code postal + Ville */}
        <div className="flex gap-3">
          <Field name="postalCode" className="w-[38%]">
            <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">
              Code postal
            </FieldLabel>
            <FieldControl
              render={<Input variant="ghost" size="lg" />}
              required
              minLength={4}
              value={customer.postalCode}
              onChange={(e) => {
                setCustomer((v) => ({ ...v, postalCode: (e.target as HTMLInputElement).value }))
                resetValidation()
              }}
              placeholder="1000"
              inputMode="numeric"
              autoComplete="postal-code"
            />
            <FieldError className="mt-1 text-xs text-red-400" match="valueMissing">
              Requis
            </FieldError>
            <FieldError className="mt-1 text-xs text-red-400" match="tooShort">
              Code postal invalide
            </FieldError>
          </Field>
          <Field name="city" className="flex-1">
            <FieldLabel className="block text-xs font-bold text-white/55 mb-1.5">
              Ville
            </FieldLabel>
            <FieldControl
              render={<Input variant="ghost" size="lg" />}
              required
              minLength={2}
              value={customer.city}
              onChange={(e) => {
                setCustomer((v) => ({ ...v, city: (e.target as HTMLInputElement).value }))
                resetValidation()
              }}
              placeholder="Bruxelles"
              autoComplete="address-level2"
            />
            <FieldError className="mt-1 text-xs text-red-400" match="valueMissing">
              Ville requise
            </FieldError>
          </Field>
        </div>

        {/* Pays */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-white/55">Pays</label>
          <Select
            value={customer.country}
            onValueChange={(value) => {
              const next = typeof value === 'string' ? value : String(value)
              handleCountryChange(next)
            }}
          >
            <SelectTriggerBare
              id="checkout-country"
              className="h-13 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white w-full"
            >
              <SelectValue placeholder="Pays" />
            </SelectTriggerBare>
            <SelectContent>
              {CHECKOUT_COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Toggle sauvegarder */}
        {isConnected && (
          <div>
            <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Sauvegarder cette adresse</p>
                <p className="mt-0.5 text-xs text-white/40">Retrouve-la à ta prochaine commande</p>
              </div>
              <Switch
                checked={saveAddress}
                onCheckedChange={setSaveAddress}
                className="h-6 w-11 shrink-0 rounded-full border-0 transition-colors data-[checked]:bg-lime-300 data-[unchecked]:bg-white/20"
              />
            </div>
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

      {/* Fixed bottom bar */}
      <BottomActionBar className="fixed inset-x-0 bottom-0 z-40">

        {/* Suggestion card */}
        {showSuggestion && validationSuggestion && (
          <div className="mb-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-400">Vouliez-vous dire ?</p>
                <p className="mt-1 text-sm font-medium text-white">{validationSuggestion.label}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleUseSuggestion}
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-lime-300 py-3 text-sm font-black text-[#0B0F15] disabled:opacity-60"
              >
                <CheckCircle className="h-4 w-4" aria-hidden="true" />
                Utiliser cette adresse
              </button>
              <button
                type="button"
                onClick={() => proceedToPayment()}
                disabled={isPending}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/60 disabled:opacity-60"
              >
                Garder la mienne
              </button>
            </div>
          </div>
        )}

        {/* Invalid warning */}
        {showInvalidWarning && (
          <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-red-400">Adresse non reconnue</p>
                <p className="mt-0.5 text-xs text-white/55">
                  On n'a pas pu vérifier cette adresse. Vérifie qu'elle est correcte, ou continue quand même.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main CTA — hidden when suggestion is shown (user must choose) */}
        {!showSuggestion && (
          <button
            type="button"
            disabled={isPending || isValidating || !canContinue}
            onClick={handleContinue}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 py-4 text-[15px] font-black text-[#0B0F15] disabled:opacity-60"
          >
            {(isPending || isValidating) && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isValidating
              ? "Vérification de l'adresse…"
              : isPending
                ? 'Enregistrement…'
                : showInvalidWarning
                  ? 'Continuer quand même'
                  : 'Continuer vers le paiement'}
          </button>
        )}
      </BottomActionBar>
    </div>
  )
}
