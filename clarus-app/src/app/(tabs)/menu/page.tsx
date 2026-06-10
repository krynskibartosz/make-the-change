'use client'

import { BarChart3, Image, PlusCircle, Settings } from 'lucide-react'
import Link from 'next/link'

export default function MenuPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)] text-foreground">
      <header className="flex items-center gap-4 pb-5">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight">Menu</h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4">
        <Link
          href="/couts"
          className="flex items-center gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BarChart3 className="size-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">Coûts</h2>
            <p className="text-sm text-muted-foreground">Gérer les dépenses et la facturation</p>
          </div>
        </Link>

        <Link
          href="/ajouter-materiau"
          className="flex items-center gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PlusCircle className="size-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">Ajouter un matériau</h2>
            <p className="text-sm text-muted-foreground">Enregistrer de nouveaux matériaux</p>
          </div>
        </Link>

        <Link
          href="/photos"
          className="flex items-center gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-4 transition-colors hover:bg-surface-elevated"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Image className="size-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">Photos</h2>
            <p className="text-sm text-muted-foreground">Voir et ajouter des photos du chantier</p>
          </div>
        </Link>

        <button
          type="button"
          disabled
          className="flex w-full items-center gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-4 text-left opacity-50 cursor-not-allowed"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Settings className="size-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">Paramètres</h2>
            <p className="text-sm text-muted-foreground">Configuration de l'application</p>
          </div>
        </button>
      </div>
    </main>
  )
}
