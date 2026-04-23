import { FullScreenSlideModal } from '@/app/[locale]/@modal/_components/full-screen-slide-modal'
import { BalanceModalContent } from './balance-modal-content'

export default function BalanceModalPage() {
  return (
    <FullScreenSlideModal
      title="Votre Portefeuille"
      fallbackHref="/products"
      headerMode="back"
    >
      <BalanceModalContent />
    </FullScreenSlideModal>
  )
}
