import { MapPin } from 'lucide-react'
import type { MockUserAddress } from '@/lib/mock/mock-addresses'
import { getCountryLabel } from '@/lib/checkout-countries'

type Props = {
  address: Pick<MockUserAddress, 'street' | 'postalCode' | 'city' | 'country' | 'isDefault'>
  showIcon?: boolean
}

export function AddressLine({ address, showIcon = false }: Props) {
  return (
    <div className="flex items-start gap-3">
      {showIcon && <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />}
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
  )
}
