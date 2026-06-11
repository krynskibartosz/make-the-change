'use client'

import { AlertCircle, CheckCircle2, ChevronLeft, Clock, Euro, ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { useRole } from '@/lib/role-context'

export default function ValidationsPage() {
  const { role, isReady } = useRole()

  if (!isReady) return null

  return (
    <div className="flex flex-col min-h-dvh pb-32 text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col gap-4 pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center gap-3">
          {/* Back button optionnel si on vient d'ailleurs, mais ici c'est un tab, donc on met juste le titre */}
          <h1 className="text-2xl font-semibold leading-tight">À Valider</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-5 max-w-md mx-auto w-full">
        {/* Item à valider */}
        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            {/* Header de la carte */}
            <div className="bg-orange-500/10 p-4 border-b border-orange-500/20 flex items-start gap-3">
              <AlertCircle className="size-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">En attente de votre accord</span>
                <h2 className="font-semibold text-lg">Choix technique P1.7</h2>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Situation</h3>
                  <p className="text-sm leading-relaxed text-foreground">
                    Lors de la démolition de la terrasse extérieure, nous avons constaté que la dalle de béton existante était plus épaisse que prévu.
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pourquoi votre accord est nécessaire</h3>
                  <p className="text-sm leading-relaxed text-foreground">
                    Avant de continuer la structure, nous devons confirmer cette option technique pour garantir la stabilité de la nouvelle dalle.
                  </p>
                </div>
              </div>

              {/* Preuves / Photos */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preuves du terrain</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                  <div className="h-24 w-32 shrink-0 bg-surface-elevated rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 snap-center">
                    <ImageIcon className="size-6 text-muted-foreground/50" />
                    <span className="text-[10px] text-muted-foreground font-medium text-center px-1">Épaisseur de la dalle</span>
                  </div>
                  <div className="h-24 w-32 shrink-0 bg-surface-elevated rounded-xl border border-border/50 flex flex-col items-center justify-center gap-2 snap-center">
                    <ImageIcon className="size-6 text-muted-foreground/50" />
                    <span className="text-[10px] text-muted-foreground font-medium text-center px-1">Option technique P1.7</span>
                  </div>
                </div>
              </div>

              {/* Impacts */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Impact estimé</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border/50">
                    <Clock className="size-5 text-blue-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Délai</span>
                      <span className="text-sm font-semibold">+ 1 jour</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border/50">
                    <Euro className="size-5 text-red-500" />
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Coût</span>
                      <span className="text-sm font-semibold">+ 540 €</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-2">
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="size-5" />
                  Accepter l'option et le supplément
                </button>
                <button className="w-full bg-surface hover:bg-surface-elevated border border-border text-foreground font-medium py-3 px-4 rounded-xl transition-colors">
                  Demander une précision
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Historique des validations (Mock) */}
        <section className="flex flex-col gap-3 mt-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">
            Déjà validé
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface opacity-75">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-500" />
                <span className="text-sm font-medium">Protection de l'escalier</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">Validé le 8 juin</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface opacity-75">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-500" />
                <span className="text-sm font-medium">Enlèvement conteneur</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">Validé le 9 juin</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
