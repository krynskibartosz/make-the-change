'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { IconButton } from '@/components/ui/button'

export default function CostsPage() {
  const router = useRouter()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col pb-32 text-foreground">
      <header className="sticky top-0 z-30 flex items-center gap-4 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/70 mb-5">
        <IconButton aria-label="Retour" variant="ghost" onClick={() => router.back()}>
          <ChevronLeft />
        </IconButton>
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight">Couts</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-5">
        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Shell pret pour les totaux heures, main d'oeuvre et repartitions.
          </p>
        </section>

        <section className="mt-6 flex flex-col gap-4">
          <Link
            href="/facturation"
            className="inline-flex min-h-[var(--size-primary-button)] items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface-elevated px-5 text-base font-semibold text-foreground transition-colors"
          >
            Gérer la facturation
          </Link>
        </section>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[max(env(safe-area-inset-bottom),1rem)] bg-background/90 backdrop-blur-md border-t border-border/50 z-40">
        <div className="max-w-md mx-auto">
          <Link
            href="/ajouter-depense"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-3.5 font-semibold active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Ajouter une dépense
          </Link>
        </div>
      </div>
    </main>
  )
}
