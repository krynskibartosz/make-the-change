import { notFound } from 'next/navigation'
import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { getMockAdvantageById } from '@/app/[locale]/(screens)/advantages/_features/mock-advantages'
import { AdvantageDetail } from '@/app/[locale]/(screens)/advantages/[id]/_features/advantage-detail'
import { getCurrentMockCommerceEvents } from '@/lib/mock/mock-commerce-server'
import { getCurrentProfile } from '@/lib/mock/mock-session-server'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdvantageDetailModalPage({ params }: Props) {
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
    <FullScreenSlideModal fallbackHref="/advantages" headerMode="dynamic" title={advantage.title}>
      <AdvantageDetail
        advantage={advantage}
        isConnected={Boolean(profile)}
        initialImpactCredits={profile?.impactCreditsBalance ?? 0}
        initialUnlocked={initialUnlocked}
        initialUsed={initialUsed}
      />
    </FullScreenSlideModal>
  )
}
