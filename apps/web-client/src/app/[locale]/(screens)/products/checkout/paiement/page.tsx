import { ArrowLeft } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { calculateCartSummary } from '@/lib/mock/mock-commerce'
import { getCurrentMockCart, getCurrentUnlockedAdvantageIds } from '@/lib/mock/mock-commerce-server'
import { getCurrentCheckoutSession } from '@/lib/mock/mock-checkout-session-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { PaiementClient } from './paiement-client'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CheckoutPaiementPage({ params }: Props) {
  const { locale } = await params
  const viewerSession = await getMockViewerSession()
  const [cart, checkoutSession, unlockedAdvantageIds] = await Promise.all([
    getCurrentMockCart(),
    getCurrentCheckoutSession(),
    getCurrentUnlockedAdvantageIds(viewerSession?.viewerId ?? null),
  ])

  if (cart.lines.length === 0) {
    redirect(`/${locale}/products/cart`)
  }
  if (!checkoutSession.customer.email) {
    redirect(`/${locale}/products/checkout/infos`)
  }

  const summary = calculateCartSummary(cart, { unlockedAdvantageIds })

  return (
    <Screen
      header={
        <div className="flex w-full items-center gap-3">
          <Link
            href="/products/checkout/infos"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            aria-label="Retour aux informations"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase text-white/35">Checkout</p>
            <p className="text-sm font-black text-white">Paiement</p>
          </div>
        </div>
      }
      className="bg-[#0B0F15]"
      headerClassName="bg-[#0B0F15]/90"
    >
      <PaiementClient
        cart={cart}
        summary={summary}
        customer={checkoutSession.customer}
        isConnected={Boolean(viewerSession)}
        locale={locale}
      />
    </Screen>
  )
}
