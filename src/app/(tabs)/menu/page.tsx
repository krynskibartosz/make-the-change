'use client'

import { BarChart3, ChevronRight, Image, PlusCircle, Settings, Users } from 'lucide-react'
import Link from 'next/link'

export default function MenuPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-32 pt-[max(env(safe-area-inset-top),1.25rem)] text-foreground">
      <header className="flex items-center gap-4 pb-5">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold leading-tight">Menu</h1>
        </div>
      </header>

      <div className="flex flex-col rounded-[var(--radius-card)] bg-surface shadow-sm overflow-hidden border border-border">
        <Link
          href="/couts"
          className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-elevated border-b border-border last:border-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BarChart3 className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-foreground">Coûts</h2>
            <p className="text-xs text-muted-foreground">Gérer les dépenses et la facturation</p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>

        <Link
          href="/ajouter-materiau"
          className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-elevated border-b border-border last:border-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PlusCircle className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-foreground">Ajouter un matériau</h2>
            <p className="text-xs text-muted-foreground">Enregistrer de nouveaux matériaux</p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>

        <Link
          href="/photos"
          className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-elevated border-b border-border last:border-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Image className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-foreground">Photos</h2>
            <p className="text-xs text-muted-foreground">Voir et ajouter des photos du chantier</p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>

        <Link
          href="/equipe"
          className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-elevated border-b border-border last:border-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-foreground">Équipe du chantier</h2>
            <p className="text-xs text-muted-foreground">Gérer les membres de l'équipe</p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>

        <button
          type="button"
          disabled
          className="flex w-full items-center gap-4 p-4 text-left opacity-50 cursor-not-allowed transition-colors border-b border-border last:border-0"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Settings className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-foreground">Paramètres</h2>
            <p className="text-xs text-muted-foreground">Configuration de l'application</p>
          </div>
          <ChevronRight className="size-5 text-muted-foreground" />
        </button>
      </div>
    </main>
  )
}
