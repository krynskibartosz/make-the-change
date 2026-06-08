import { FullScreenSlideModal } from '../../../_components/full-screen-slide-modal'
import { InterceptedRouteDialog } from '../../../_components/intercepted-route-dialog'

type EditInterventionModalPageProps = Readonly<{
  params: Promise<{
    id: string
  }>
}>

export default async function EditInterventionModalPage({
  params,
}: EditInterventionModalPageProps) {
  const { id } = await params

  return (
    <InterceptedRouteDialog>
      <FullScreenSlideModal title="Modifier intervention">
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <p className="font-mono text-sm text-primary">{id}</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Route modale prete pour l'edition d'une intervention.
          </p>
        </section>
      </FullScreenSlideModal>
    </InterceptedRouteDialog>
  )
}
