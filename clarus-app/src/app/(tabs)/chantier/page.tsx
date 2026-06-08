import { TabScreen } from '../_components/tab-screen'

export default function ProjectPage() {
  return (
    <TabScreen title="Chantier">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Shell pret pour zones, phases, personnes et blocs chantier.
        </p>
      </section>
    </TabScreen>
  )
}
