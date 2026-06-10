import { format } from 'date-fns'
import { AddInterventionFlow } from '@/features/interventions/add-flow'
import { FullScreenSlideModal } from '../../_components/full-screen-slide-modal'
import { InterceptedRouteDialog } from '../../_components/intercepted-route-dialog'

export default function NewInterventionModalPage() {
  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <InterceptedRouteDialog>
      <FullScreenSlideModal title="Nouveau travail">
        <AddInterventionFlow today={today} />
      </FullScreenSlideModal>
    </InterceptedRouteDialog>
  )
}
