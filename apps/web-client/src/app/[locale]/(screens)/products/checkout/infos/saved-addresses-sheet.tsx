'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { AddressLine } from '@/app/[locale]/(screens)/profile/settings/addresses/address-line'

type Props = {
  addresses: MockUserAddress[]
  onSelect: (address: MockUserAddress) => void
  onClose: () => void
}

export function SavedAddressesSheet({ addresses, onSelect, onClose }: Props) {
  // Lock scroll while sheet is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Choisir une adresse"
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-white/10 bg-[#0B0F15] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-black text-white">Mes adresses</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
            aria-label="Fermer"
          >
            <X className="h-4 w-4 text-white" aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-72 overflow-y-auto space-y-2 px-4">
          {addresses.map((address) => (
            <li key={address.id}>
              <button
                type="button"
                onClick={() => { onSelect(address); onClose() }}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-colors active:bg-white/[0.08]"
              >
                <AddressLine address={address} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
