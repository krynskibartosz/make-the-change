import Link from 'next/link'

import { TabScreen } from '../_components/tab-screen'

export default function TodayPage() {
  return (
    <TabScreen
      action={
        <Link
          className="inline-flex min-h-12 items-center rounded-[var(--radius-control)] bg-primary px-4 text-sm font-semibold text-primary-foreground"
          href="/interventions/new"
        >
          Ajouter
        </Link>
      }
      title="Aujourd'hui"
    >
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Shell pret pour le resume du jour, les alertes a verifier et la derniere activite.
        </p>
      </section>
    </TabScreen>
  )
}
