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

const EMPTY_FORM: AddressForm = { street: '', postalCode: '', city: '', country: 'BE' }

const INPUT_BASE =
  'h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/25'
const INPUT_CLASS = `${INPUT_BASE} w-full`

function AddressForm({
  form,
  onChange,
  onSelect,
  isLoading,
  error,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  form: AddressForm
  onChange: (f: AddressForm) => void
  onSelect: (f: AddressForm) => void
  isLoading: boolean
  error: string | null
  onCancel: () => void
  onSubmit: () => void
  submitLabel: string
}) {
  const canSubmit = !isLoading && form.street.length > 0 && form.postalCode.length > 0 && form.city.length > 0

  return (
    <div className="space-y-3">
      {/* Pays */}
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

      {/* Rue avec autocomplete */}
      <AddressAutocompleteInput
        id={`address-street-${form.country}`}
        value={form.street}
        country={form.country}
        placeholder="Rue et numéro"
        className={INPUT_CLASS}
        onChange={(street) => onChange({ ...form, street })}
        onSelect={({ street, postalCode, city }) => onSelect({ ...form, street, postalCode, city })}
      />

      {/* CP + Ville */}
      <div className="flex gap-2">
        <input
          value={form.postalCode}
          onChange={(e) => onChange({ ...form, postalCode: e.target.value })}
          placeholder="Code postal"
          className={`${INPUT_BASE} w-[38%]`}
        />
        <input
          value={form.city}
          onChange={(e) => onChange({ ...form, city: e.target.value })}
          placeholder="Ville"
          className={`${INPUT_BASE} flex-1`}
        />
      </div>

      {error && <p className="text-xs text-red-400/80">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/60 active:bg-white/5"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 rounded-xl bg-lime-300 py-3 text-sm font-black text-[#0B0F15] disabled:opacity-50"
        >
          {isLoading ? 'Sauvegarde…' : submitLabel}
        </button>
      </div>
    </div>
  )
}

export function AddressesClient({ addresses }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<AddressForm>(EMPTY_FORM)
  const [savingEditId, setSavingEditId] = useState<string | null>(null)
  const [editError, setEditError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState<AddressForm>(EMPTY_FORM)
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

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

  function startEdit(address: MockUserAddress) {
    setEditingId(address.id)
    setEditForm({
      street: address.street,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    })
    setEditError(null)
  }

  function handleEdit() {
    if (!editingId) return
    const currentEditingId = editingId
    setSavingEditId(currentEditingId)
    setEditError(null)
    startTransition(async () => {
      try {
        const result = await updateAddressAction(currentEditingId, editForm)
        if (!result.ok) {
          setEditError("L'adresse n'a pas pu être modifiée. Reconnecte-toi et réessaie.")
          return
        }
        setEditingId(null)
      } catch {
        setEditError('Une erreur est survenue. Vérifie ta connexion et réessaie.')
      } finally {
        setSavingEditId(null)
      }
    })
  }

  function handleAdd() {
    setIsAdding(true)
    setAddError(null)
    startTransition(async () => {
      try {
        const result = await addAddressAction(addForm)
        if (!result.ok) {
          setAddError("L'adresse n'a pas pu être sauvegardée. Reconnecte-toi et réessaie.")
          setIsAdding(false)
          return
        }
        setAddForm(EMPTY_FORM)
        setShowAddForm(false)
      } catch {
        setAddError('Une erreur est survenue. Vérifie ta connexion et réessaie.')
      } finally {
        setIsAdding(false)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex h-[100dvh] w-full flex-col overflow-y-auto overscroll-y-contain bg-[#0B0F15] pb-10 text-white">
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
        <div className="relative flex h-12 items-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold text-white">
            Mes adresses
          </span>
        </div>
      </header>

      <main className="mt-[calc(env(safe-area-inset-top)+4rem)] flex-1 px-4">
        {actionError && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-xs font-medium text-red-400">
            {actionError}
          </p>
        )}

        {addresses.length === 0 && !showAddForm && (
          <p className="mt-8 text-center text-sm text-white/40">Aucune adresse sauvegardée.</p>
        )}

        <ul className="mt-4 space-y-3">
          {addresses.map((address) => {
            const rowPending = pendingId === address.id
            const isEditingThis = editingId === address.id
            const isConfirmingDelete = confirmDeleteId === address.id

            return (
              <li key={address.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                {isEditingThis ? (
                  <>
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
                      Modifier l'adresse
                    </p>
                    <AddressForm
                      form={editForm}
                      onChange={setEditForm}
                      onSelect={setEditForm}
                      isLoading={savingEditId === address.id}
                      error={editError}
                      onCancel={() => setEditingId(null)}
                      onSubmit={handleEdit}
                      submitLabel="Enregistrer"
                    />
                  </>
                ) : (
                  <>
                    <AddressLine address={address} showIcon />

                    <div className="mt-3 flex items-center gap-3">
                      {/* Définir par défaut */}
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address.id)}
                          disabled={rowPending}
                          className="text-xs font-semibold text-white/50 underline-offset-2 hover:text-white/80 disabled:opacity-40"
                        >
                          Définir par défaut
                        </button>
                      )}

                      <div className="ml-auto flex items-center gap-2">
                        {/* Modifier */}
                        <button
                          type="button"
                          onClick={() => { setConfirmDeleteId(null); startEdit(address) }}
                          disabled={rowPending}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors active:bg-white/10 disabled:opacity-40"
                          aria-label="Modifier"
                        >
                          <Pencil className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
                        </button>

                        {/* Supprimer */}
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
                              className="rounded-lg bg-red-500/15 border border-red-500/30 px-3 py-1.5 text-xs font-bold text-red-400 active:bg-red-500/25 disabled:opacity-40"
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
                  </>
                )}
              </li>
            )
          })}
        </ul>

        {showAddForm ? (
          <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
              Nouvelle adresse
            </p>
            <AddressForm
              form={addForm}
              onChange={setAddForm}
              onSelect={setAddForm}
              isLoading={isAdding}
              error={addError}
              onCancel={() => { setShowAddForm(false); setAddError(null) }}
              onSubmit={handleAdd}
              submitLabel="Sauvegarder"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setEditingId(null); setShowAddForm(true) }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-4 text-sm font-semibold text-white/50 transition-colors active:bg-white/5"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ajouter une adresse
          </button>
        )}
      </main>
    </div>
  )
}
