import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { getCurrentMockCart, getCurrentUnlockedAdvantageIds } from '@/lib/mock/mock-commerce-server'
import { getMockViewerSession } from '@/lib/mock/mock-session-server'
import { ProductCartClient } from './product-cart-client'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function ProductCartPage({ params }: Props) {
  const { locale } = await params
  const session = await getMockViewerSession()
  const [cart, unlockedAdvantageIds] = await Promise.all([
    getCurrentMockCart(),
    getCurrentUnlockedAdvantageIds(session?.viewerId ?? null),
  ])

  return (
    <Screen
      header={
        <div className="flex w-full items-center gap-3">
          <Link
            href="/products"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white"
            aria-label="Retour à la boutique"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase text-white/35">Boutique partenaire</p>
            <p className="text-sm font-black text-white">Panier et paiement</p>
          </div>
        </div>
      }
      className="bg-[#0B0F15]"
      headerClassName="bg-[#0B0F15]/90"
    >
      <ProductCartClient
        initialCart={cart}
        unlockedAdvantageIds={unlockedAdvantageIds}
        isConnected={Boolean(session)}
        locale={locale}
      />
    </Screen>
  )
}
