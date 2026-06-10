'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconButton } from '@/components/ui/button'

export default function CostsPage() {
  const router = useRouter()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)] text-foreground">
      <header className="flex items-center gap-4 pb-5">
        <IconButton aria-label="Retour" variant="ghost" onClick={() => router.back()}>
          <ChevronLeft />
        </IconButton>
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight">Couts</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4">
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Shell pret pour les totaux heures, main d'oeuvre et repartitions.
          </p>
        </section>

        <section className="mt-6 flex flex-col gap-4">
          <Link
            href="/ajouter-depense"
            className="inline-flex min-h-[var(--size-primary-button)] items-center justify-center rounded-[var(--radius-control)] bg-primary px-5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-colors"
          >
            Ajouter une dépense
          </Link>

          <Link
            href="/facturation"
            className="inline-flex min-h-[var(--size-primary-button)] items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface-elevated px-5 text-base font-semibold text-foreground transition-colors"
          >
            Gérer la facturation
          </Link>
        </section>
      </div>
    </main>
  )
}
