'use client'

import { ChevronDown, ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from '@/i18n/navigation'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { AddressAutocompleteInput } from '@/app/[locale]/(screens)/_components/address-autocomplete-input'
import { CHECKOUT_COUNTRIES } from '@/lib/checkout-countries'
import {
  addAddressAction,
  removeAddressAction,
  setDefaultAddressAction,
  updateAddressAction,
} from './address-actions'
import { AddressLine } from './address-line'

type Props = { addresses: MockUserAddress[] }

type AddressForm = { street: string; postalCode: string; city: string; country: string }
type Mode =
  | { type: 'list' }
  | { type: 'add' }
  | { type: 'edit'; address: MockUserAddress }

const EMPTY_FORM: AddressForm = { street: '', postalCode: '', city: '', country: 'BE' }

const INPUT_BASE =
  'h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25'
const INPUT_CLASS = `${INPUT_BASE} w-full`

function AddressFields({
  form,
  onChange,
  onSelect,
}: {
  form: AddressForm
  onChange: (f: AddressForm) => void
  onSelect: (f: AddressForm) => void
}) {
  return (
    <div className="space-y-4">
      {/* Pays */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-white/55">Pays</label>
        <div className="relative">
          <select
            value={form.country}
            onChange={(e) => onChange({ ...form, country: e.target.value, street: '', postalCode: '', city: '' })}
            className={`${INPUT_CLASS} appearance-none pr-10`}
          >
            {CHECKOUT_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#0B0F15]">{c.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden="true" />
        </div>
      </div>

      {/* Rue avec autocomplete */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-white/55">Rue et numéro</label>
        <AddressAutocompleteInput
          id={`address-street-${form.country}`}
          value={form.street}
          country={form.country}
          placeholder="Rue de la Paix 10"
          className={INPUT_CLASS}
          onChange={(street) => onChange({ ...form, street })}
          onSelect={({ street, postalCode, city }) => onSelect({ ...form, street, postalCode, city })}
        />
      </div>

      {/* CP + Ville */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-white/55">Code postal et ville</label>
        <div className="flex gap-3">
          <input
            value={form.postalCode}
            onChange={(e) => onChange({ ...form, postalCode: e.target.value })}
            placeholder="1000"
            inputMode="numeric"
            className={`${INPUT_BASE} w-[38%]`}
          />
          <input
            value={form.city}
            onChange={(e) => onChange({ ...form, city: e.target.value })}
            placeholder="Bruxelles"
            className={`${INPUT_BASE} flex-1`}
          />
        </div>
      </div>
    </div>
  )
}

export function AddressesClient({ addresses }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [mode, setMode] = useState<Mode>({ type: 'list' })
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const canSave = form.street.length > 0 && form.postalCode.length > 0 && form.city.length > 0

  function openAdd() {
    setForm(EMPTY_FORM)
    setFormError(null)
    setMode({ type: 'add' })
  }

  function openEdit(address: MockUserAddress) {
    setForm({
      street: address.street,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    })
    setFormError(null)
    setConfirmDeleteId(null)
    setMode({ type: 'edit', address })
  }

  function closeForm() {
    setMode({ type: 'list' })
    setFormError(null)
  }

  function handleSave() {
    if (!canSave || isSaving) return
    setIsSaving(true)
    setFormError(null)

    startTransition(async () => {
      try {
        if (mode.type === 'add') {
          const result = await addAddressAction(form)
          if (!result.ok) {
            setFormError("L'adresse n'a pas pu être sauvegardée. Reconnecte-toi et réessaie.")
            setIsSaving(false)
            return
          }
        } else if (mode.type === 'edit') {
          const result = await updateAddressAction(mode.address.id, form)
          if (!result.ok) {
            setFormError("L'adresse n'a pas pu être modifiée. Reconnecte-toi et réessaie.")
            setIsSaving(false)
            return
          }
        }
        setMode({ type: 'list' })
      } catch {
        setFormError('Une erreur est survenue. Vérifie ta connexion et réessaie.')
      } finally {
        setIsSaving(false)
      }
    })
  }

  function handleRemove(id: string) {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    setConfirmDeleteId(null)
    setPendingId(id)
    setActionError(null)
    startTransition(async () => {
      const result = await removeAddressAction(id)
      if (!result.ok) setActionError('La suppression a échoué. Reconnecte-toi et réessaie.')
      setPendingId(null)
    })
  }

  function handleSetDefault(id: string) {
    setPendingId(id)
    setActionError(null)
    startTransition(async () => {
      const result = await setDefaultAddressAction(id)
      if (!result.ok) setActionError('La modification a échoué. Reconnecte-toi et réessaie.')
      setPendingId(null)
    })
  }

  const isFormMode = mode.type === 'add' || mode.type === 'edit'
  const headerTitle = mode.type === 'edit' ? "Modifier l'adresse" : mode.type === 'add' ? 'Nouvelle adresse' : 'Mes adresses'

  return (
    <div className="fixed inset-0 z-40 flex h-[100dvh] w-full flex-col overflow-y-auto overscroll-y-contain bg-[#0B0F15] text-white" style={{ paddingBottom: isFormMode ? '9rem' : '2rem' }}>
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
        <div className="relative flex h-12 items-center">
          <button
            type="button"
            onClick={isFormMode ? closeForm : () => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white">
            {headerTitle}
          </span>
        </div>
      </header>

      <main className="mt-[calc(env(safe-area-inset-top)+4rem)] flex-1 px-4">

        {/* Mode liste */}
        {mode.type === 'list' && (
          <>
            {actionError && (
              <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-xs font-medium text-red-400">
                {actionError}
              </p>
            )}

            {addresses.length === 0 && (
              <p className="mt-8 text-center text-sm text-white/40">Aucune adresse sauvegardée.</p>
            )}

            <ul className="mt-4 space-y-3">
              {addresses.map((address) => {
                const rowPending = pendingId === address.id
                const isConfirmingDelete = confirmDeleteId === address.id

                return (
                  <li key={address.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <AddressLine address={address} showIcon />

                    <div className="mt-3 flex items-center gap-3">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          disabled={rowPending}
                          className="text-xs font-semibold text-white/50 hover:text-white/80 disabled:opacity-40"
                        >
                          Définir par défaut
                        </button>
                      )}

                      <div className="ml-auto flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(address)}
                          disabled={rowPending}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors active:bg-white/10 disabled:opacity-40"
                          aria-label="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
                        </button>

                        {isConfirmingDelete ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/60 active:bg-white/5"
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(address.id)}
                              disabled={rowPending}
                              className="rounded-lg border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-xs font-bold text-red-400 active:bg-red-500/25 disabled:opacity-40"
                            >
                              Confirmer
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRemove(address.id)}
                            disabled={rowPending}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors active:bg-red-500/20 disabled:opacity-40"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-400/70" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={openAdd}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-4 text-sm font-semibold text-white/50 transition-colors active:bg-white/5"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter une adresse
            </button>
          </>
        )}

        {/* Mode formulaire (add ou edit) */}
        {isFormMode && (
          <>
            <div className="mt-2">
              <AddressFields
                form={form}
                onChange={setForm}
                onSelect={setForm}
              />
              {formError && (
                <p className="mt-3 text-xs text-red-400/80">{formError}</p>
              )}
            </div>
          </>
        )}
      </main>

      {/* Barre fixe en bas — uniquement en mode formulaire */}
      {isFormMode && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col">
          <div className="h-8 w-full bg-gradient-to-t from-[#0B0F15] to-transparent pointer-events-none" />
          <div className="border-t border-white/5 bg-[#0B0F15] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave || isSaving}
              className={`flex h-14 w-full items-center justify-center rounded-2xl text-[15px] font-black transition-all active:scale-[0.98] disabled:cursor-not-allowed ${
                canSave && !isSaving
                  ? 'bg-lime-300 text-[#0B0F15] shadow-[0_0_20px_rgba(163,230,53,0.15)]'
                  : 'bg-white/5 text-white/30'
              }`}
            >
              {isSaving ? 'Sauvegarde…' : mode.type === 'edit' ? 'Enregistrer' : 'Sauvegarder'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="mt-2 h-11 w-full text-sm font-semibold text-white/40 active:text-white/60"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
