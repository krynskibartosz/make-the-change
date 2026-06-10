import { TabScreen } from '../_components/tab-screen'

export default function JournalPage() {
  return (
    <TabScreen title="Journal">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Shell pret pour la liste chronologique des interventions.
        </p>
      </section>
    </TabScreen>
  )
}
