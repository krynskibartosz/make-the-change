import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Screen } from '@/app/[locale]/(screens)/_components/screen'
import { getCurrentMockCommerceEvents } from '@/lib/mock/mock-commerce-server'
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

  const profile = await getCurrentProfile()
  const events = await getCurrentMockCommerceEvents()
  const profileId = profile?.id ?? null
  const initialUnlocked =
    profileId !== null &&
    events.some(
      (event) =>
        event.type === 'ci_redemption' &&
        event.userId === profileId &&
        event.advantageId === advantage.id,
    )
  const initialUsed =
    profileId !== null &&
    events.some(
      (event) =>
        event.type === 'discount_used' &&
        event.userId === profileId &&
        event.advantageId === advantage.id,
    )

  return (
    <Screen className="bg-[#0B0F15]">
      <AdvantageDetail
        advantage={advantage}
        showFloatingBack
        isConnected={Boolean(profile)}
        initialImpactCredits={profile?.impactCreditsBalance ?? 0}
        initialUnlocked={initialUnlocked}
        initialUsed={initialUsed}
      />
    </Screen>
  )
}
