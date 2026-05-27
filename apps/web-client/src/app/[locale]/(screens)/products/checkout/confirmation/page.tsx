import { redirect } from 'next/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { getCurrentCheckoutSession, clearCurrentCheckoutSession } from '@/lib/mock/mock-checkout-session-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { ConfirmationClient } from './confirmation-client'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CheckoutConfirmationPage({ params }: Props) {
  const { locale } = await params
  const [checkoutSession, viewerSession] = await Promise.all([
    getCurrentCheckoutSession(),
    getMockViewerSession(),
  ])

  if (!checkoutSession.completedOrder) {
    redirect(`/${locale}/products/cart`)
  }

  // Données extraites avant suppression — la session peut être nettoyée maintenant.
  const { completedOrder } = checkoutSession
  await clearCurrentCheckoutSession()

  return (
    <Screen className="bg-[#0B0F15]">
      <ConfirmationClient
        completedOrder={completedOrder}
        isConnected={Boolean(viewerSession)}
        locale={locale}
      />
    </Screen>
  )
}
