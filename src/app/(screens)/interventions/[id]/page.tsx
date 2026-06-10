import { Screen } from '../../_components/screen'

type InterventionDetailPageProps = Readonly<{
  params: Promise<{
    id: string
  }>
}>

export default async function InterventionDetailPage({ params }: InterventionDetailPageProps) {
  const { id } = await params

  return (
    <Screen title="Intervention">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <p className="font-mono text-sm text-primary">{id}</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Shell pret pour Apercu, Heures, Couts et Photos.
        </p>
      </section>
    </Screen>
  )
}
