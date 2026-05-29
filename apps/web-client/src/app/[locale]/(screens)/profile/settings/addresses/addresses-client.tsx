'use client'

import { ChevronLeft, MapPin, Plus, Star, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from '@/i18n/navigation'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { getCountryLabel } from '@/lib/checkout-countries'
import { AddressAutocompleteInput } from '@/app/[locale]/(screens)/products/checkout/infos/address-autocomplete-input'
import { CHECKOUT_COUNTRIES } from '@/lib/checkout-countries'
import {
  addAddressAction,
  removeAddressAction,
  setDefaultAddressAction,
} from './address-actions'

type Props = { addresses: MockUserAddress[] }

const INPUT_BASE =
  'h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/25'
const INPUT_CLASS = `${INPUT_BASE} w-full`

export function AddressesClient({ addresses }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState({ street: '', postalCode: '', city: '', country: 'BE' })

  function handleRemove(id: string) {
    startTransition(async () => { await removeAddressAction(id) })
  }

  function handleSetDefault(id: string) {
    startTransition(async () => { await setDefaultAddressAction(id) })
  }

  function handleAdd() {
    if (!form.street || !form.postalCode || !form.city) return
    startTransition(async () => {
      await addAddressAction(form)
      setForm({ street: '', postalCode: '', city: '', country: 'BE' })
      setShowAddForm(false)
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
        {addresses.length === 0 && !showAddForm && (
          <p className="mt-8 text-center text-sm text-white/40">
            Aucune adresse sauvegardée.
          </p>
        )}

        <ul className="mt-4 space-y-3">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-white">{address.street}</p>
                    <p className="mt-0.5 text-xs text-white/50">
                      {address.postalCode} {address.city} · {getCountryLabel(address.country)}
                    </p>
                    {address.isDefault && (
                      <span className="mt-1.5 inline-block rounded-full bg-lime-300/10 px-2 py-0.5 text-[10px] font-bold text-lime-300">
                        Par défaut
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isPending}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors active:bg-white/10"
                      aria-label="Définir par défaut"
                    >
                      <Star className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(address.id)}
                    disabled={isPending}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors active:bg-red-500/20"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-400/70" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {showAddForm && (
          <div className="mt-4 space-y-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Nouvelle adresse</p>

            <select
              value={form.country}
              onChange={(e) => setForm((v) => ({ ...v, country: e.target.value, street: '', postalCode: '', city: '' }))}
              className={`${INPUT_CLASS} appearance-none`}
            >
              {CHECKOUT_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#0B0F15]">{c.label}</option>
              ))}
            </select>

            <AddressAutocompleteInput
              id="new-address-street"
              value={form.street}
              country={form.country}
              placeholder="Rue et numéro"
              className={INPUT_CLASS}
              onChange={(street) => setForm((v) => ({ ...v, street }))}
              onSelect={({ street, postalCode, city }) =>
                setForm((v) => ({ ...v, street, postalCode, city }))
              }
            />

            <div className="flex gap-2">
              <input
                value={form.postalCode}
                onChange={(e) => setForm((v) => ({ ...v, postalCode: e.target.value }))}
                placeholder="Code postal"
                className={`${INPUT_BASE} w-[38%]`}
              />
              <input
                value={form.city}
                onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))}
                placeholder="Ville"
                className={`${INPUT_BASE} flex-1`}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-white/60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAdd}
                disabled={isPending || !form.street || !form.postalCode || !form.city}
                className="flex-1 rounded-xl bg-lime-300 py-3 text-sm font-black text-[#0B0F15] disabled:opacity-50"
              >
                {isPending ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}

        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
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
