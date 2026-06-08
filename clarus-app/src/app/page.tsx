export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background px-5 py-6 text-foreground">
      <section className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col justify-between rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-[var(--shadow-elevated)]">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clarus V0</p>
              <h1 className="mt-1 text-3xl font-semibold leading-tight">Sparrenlaan</h1>
            </div>
            <div className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
              Mock-first
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-border bg-surface-elevated p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Socle Next standalone pret pour les tabs Aujourd'hui, Journal, Chantier et Couts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-[var(--radius-card)] border border-border p-3">
            <p className="text-muted-foreground">Theme</p>
            <p className="mt-1 font-semibold">Dark terrain</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-border p-3">
            <p className="text-muted-foreground">Accent</p>
            <p className="mt-1 font-semibold text-primary">#B6F255</p>
          </div>
        </div>
      </section>
    </main>
  )
}
