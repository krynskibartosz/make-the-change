import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { getCurrentProfile } from '@/lib/mock/mock-session-server'
import { getMockAdvantageById } from '../_features/mock-advantages'
import { AdvantageDetail } from './_features/advantage-detail'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const advantage = getMockAdvantageById(id)
  return {
    title: advantage ? `${advantage.title} | Make the Change` : 'Avantage | Make the Change',
  }
}

export default async function AdvantageDetailPage({ params }: Props) {
  const { id } = await params
  const advantage = getMockAdvantageById(id)

  if (!advantage) notFound()

  if (advantage.type === 'product' && advantage.productSlug) {
    redirect(`/products/${advantage.productSlug}`)
  }

  const profile = await getCurrentProfile()

  return (
    <Screen className="bg-[#0B0F15]">
      <AdvantageDetail
        advantage={advantage}
        showFloatingBack
        isConnected={Boolean(profile)}
        initialImpactCredits={profile?.impactCreditsBalance ?? 0}
      />
    </Screen>
  )
}
