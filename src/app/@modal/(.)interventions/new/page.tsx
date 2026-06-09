import { AddInterventionFlow } from '@/features/interventions/add-flow'

import { FullScreenSlideModal } from '../../_components/full-screen-slide-modal'
import { InterceptedRouteDialog } from '../../_components/intercepted-route-dialog'

export default function NewInterventionModalPage() {
  return (
    <InterceptedRouteDialog>
      <FullScreenSlideModal title="Ajouter intervention">
        <AddInterventionFlow today={new Date().toISOString().slice(0, 10)} />
      </FullScreenSlideModal>
    </InterceptedRouteDialog>
  )
}
