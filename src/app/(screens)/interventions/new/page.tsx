import { FullScreenSlideModal } from '../../../@modal/_components/full-screen-slide-modal'

export default function NewInterventionPage() {
  return (
    <FullScreenSlideModal asPage headerMode="back" title="Ajouter intervention">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Page fallback prete pour le flow Quoi, Ou, Qui, Quand, Statut et Resume.
        </p>
      </section>
    </FullScreenSlideModal>
  )
}
