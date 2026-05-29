// apps/web-client/src/app/[locale]/(screens)/products/checkout/infos/page.tsx
import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { getCurrentMockCart } from '@/lib/mock/mock-commerce-server'
import { getCurrentCheckoutSession } from '@/lib/mock/mock-checkout-session-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import {
  getCurrentMockAddresses,
} from '@/lib/mock/mock-addresses-server'
import { getUserAddresses, getDefaultAddress } from '@/lib/mock/mock-addresses'
import { InfosClient } from './infos-client'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CheckoutInfosPage({ params }: Props) {
  const { locale } = await params
  const [cart, session, viewerSession, allAddresses] = await Promise.all([
    getCurrentMockCart(),
    getCurrentCheckoutSession(),
    getMockViewerSession(),
    getCurrentMockAddresses(),
  ])

  if (cart.lines.length === 0) {
    redirect(`/${locale}/products/cart`)
  }

  const userId = viewerSession?.viewerId ?? null
  const savedAddresses = userId ? getUserAddresses(allAddresses, userId) : []
  const defaultAddress = userId ? getDefaultAddress(allAddresses, userId) : undefined

  // Pre-fill checkout customer from default address if the session customer is empty
  const customer = session.customer
  const hasFilledCustomer = Boolean(customer.street)
  const initialCustomer =
    !hasFilledCustomer && defaultAddress
      ? {
          ...customer,
          street: defaultAddress.street,
          postalCode: defaultAddress.postalCode,
          city: defaultAddress.city,
          country: defaultAddress.country,
        }
      : customer

  return (
    <Screen
      header={
        <div className="flex w-full items-center gap-3">
          <Link
            href="/products/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            aria-label="Retour au panier"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase text-white/35">Checkout</p>
            <p className="text-sm font-black text-white">Informations</p>
          </div>
        </div>
      }
      className="bg-[#0B0F15]"
      headerClassName="bg-[#0B0F15]/90"
    >
      <InfosClient
        initialCustomer={initialCustomer}
        isConnected={Boolean(viewerSession)}
        savedAddresses={savedAddresses}
        locale={locale}
      />
    </Screen>
  )
}
