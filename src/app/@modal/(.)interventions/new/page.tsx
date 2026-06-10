import { FullScreenSlideModal } from '../../_components/full-screen-slide-modal'
import { InterceptedRouteDialog } from '../../_components/intercepted-route-dialog'

export default function NewInterventionModalPage() {
  return (
    <InterceptedRouteDialog>
      <FullScreenSlideModal title="Ajouter intervention">
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Route modale prete pour le flow Quoi, Ou, Qui, Quand, Statut et Resume.
          </p>
        </section>
      </FullScreenSlideModal>
    </InterceptedRouteDialog>
  )
}
