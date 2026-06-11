import { format } from 'date-fns'
import { AddInterventionFlow } from '@/features/interventions/add-flow'
import { FullScreenSlideModal } from '../../../@modal/_components/full-screen-slide-modal'

export default function NewInterventionPage() {
  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <FullScreenSlideModal asPage headerMode="back" title="Nouveau travail">
      <AddInterventionFlow today={today} />
    </FullScreenSlideModal>
  )
}
