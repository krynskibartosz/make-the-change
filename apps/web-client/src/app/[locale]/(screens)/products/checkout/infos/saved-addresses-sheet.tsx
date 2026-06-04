'use client'

import { MobileSheet } from '@/app/[locale]/(screens)/projects/[slug]/_components/shared/mobile-sheet'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { AddressLine } from '@/app/[locale]/(screens)/profile/settings/addresses/address-line'

type Props = {
  addresses: MockUserAddress[]
  onSelect: (address: MockUserAddress) => void
  onClose: () => void
}

export function SavedAddressesSheet({ addresses, onSelect, onClose }: Props) {
  return (
    <MobileSheet isOpen={true} onClose={onClose} title="Mes adresses">
      <ul className="space-y-2 pb-6">
        {addresses.map((address) => (
          <li key={address.id}>
            <button
              type="button"
              onClick={() => {
                onSelect(address)
                onClose()
              }}
              className="flex w-full items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-left active:bg-white/[0.05]"
            >
              <AddressLine address={address} />
            </button>
          </li>
        ))}
        {addresses.length === 0 && (
          <p className="px-4 text-center text-sm text-white/40">Aucune adresse sauvegardée.</p>
        )}
      </ul>
    </MobileSheet>
  )
}
