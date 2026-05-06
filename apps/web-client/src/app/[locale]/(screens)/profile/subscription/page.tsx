import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { PaywallCard } from '@/app/[locale]/(screens)/onboarding/_features/paywall-card'

export default function ProfileSubscriptionPage() {
  return (
    <FullScreenSlideModal
      title="Le Cercle des Gardiens"
      fallbackHref="/profile"
      headerMode="dynamic"
      className="bg-[#0B0F15]"
      contentClassName="overflow-y-auto overscroll-contain"
    >
      <PaywallCard mode="dashboard" isModalContent={true} />
    </FullScreenSlideModal>
  )
}
