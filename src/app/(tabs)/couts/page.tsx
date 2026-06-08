import { TabScreen } from '../_components/tab-screen'

export default function CostsPage() {
  return (
    <TabScreen title="Couts">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Shell pret pour les totaux heures, main d'oeuvre et repartitions.
        </p>
      </section>
    </TabScreen>
  )
}
