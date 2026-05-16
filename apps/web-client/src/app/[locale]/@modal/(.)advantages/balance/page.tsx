import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { BalanceModalContent } from '@/app/[locale]/@modal/(.)products/balance/balance-modal-content'

export default function AdvantagesBalanceModalPage() {
  return (
    <FullScreenSlideModal title="Votre Portefeuille" fallbackHref="/advantages" headerMode="back">
      <BalanceModalContent />
    </FullScreenSlideModal>
  )
}
