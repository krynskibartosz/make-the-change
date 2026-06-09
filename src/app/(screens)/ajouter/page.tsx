import { AddInterventionFlow } from '@/features/interventions/add-flow'

import { FullScreenSlideModal } from '../../@modal/_components/full-screen-slide-modal'

export default function AddPage() {
  return (
    <FullScreenSlideModal asPage headerMode="back" title="Ajouter intervention">
      <AddInterventionFlow today={new Date().toISOString().slice(0, 10)} />
    </FullScreenSlideModal>
  )
}
