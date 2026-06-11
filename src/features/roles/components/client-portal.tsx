'use client'

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  ImageIcon,
} from 'lucide-react'
import Link from 'next/link'

export function ClientPortal() {
  return (
    <div className="flex flex-col gap-6 p-5 pb-32 max-w-md mx-auto">
      {/* Header Rassurant */}
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Bonjour Martin</h1>
        <p className="text-sm text-muted-foreground">
          Votre chantier avance bien. Dernière mise à jour : aujourd'hui à 18h42
        </p>
      </section>

      {/* Avancement */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Avancement
          </h2>
        </div>
        <p className="text-sm font-medium mb-1">
          La démolition est presque terminée. L'évacuation des gravats est en cours.
        </p>
        <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>Démolition</span>
              <span className="text-primary">80%</span>
            </div>
            <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[80%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>Évacuation</span>
              <span className="text-primary">45%</span>
            </div>
            <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[45%]" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-semibold text-muted-foreground">
              <span>Structure</span>
              <span>0%</span>
            </div>
            <div className="h-2 w-full bg-surface-elevated rounded-full overflow-hidden">
              <div className="h-full bg-border rounded-full w-[0%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Action Requise (Validation) */}
      <section className="flex flex-col gap-3">
        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <AlertCircle className="size-5 text-orange-500" />
          </div>
          <div className="flex flex-col gap-1 pr-8">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              À décider
            </span>
            <h3 className="font-semibold text-foreground">Choix technique P1.7</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Avant de continuer la structure, nous devons confirmer cette option pour garantir la
              stabilité de la dalle.
            </p>
            <p className="text-sm font-semibold mt-2 text-foreground">
              Impact estimé : <span className="text-blue-500">+1 jour</span> ·{' '}
              <span className="text-red-500">+540 €</span>
            </p>
          </div>
          <Link
            href="/validations"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors w-full text-center"
          >
            Voir la demande
          </Link>
        </div>
      </section>

      {/* Résumé de la semaine (IA) */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Cette semaine
        </h2>
        <div className="rounded-2xl border border-border bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <p className="text-sm leading-relaxed">
              L'équipe a bien avancé sur la démolition extérieure de la terrasse. Une quantité de
              béton plus importante que prévu a été constatée, ce qui a nécessité l'utilisation de
              sacs de gravats supplémentaires. L'évacuation est en cours.
            </p>
          </div>

          <div className="w-full h-px bg-border/50" />

          <Link href="/photos" className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ImageIcon className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">12 Nouvelles photos</span>
                <span className="text-xs text-muted-foreground">
                  Validées par le chef de chantier
                </span>
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        </div>
      </section>

      {/* Rapports */}
      <section className="flex flex-col gap-3 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Rapports
        </h2>
        <div className="rounded-2xl border border-border bg-surface overflow-hidden flex flex-col">
          <Link
            href="/rapports/semaine-24"
            className="flex items-center justify-between p-4 bg-transparent hover:bg-surface-elevated transition-colors text-left border-b border-border/50"
          >
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium">Rapport Semaine 24</span>
            </div>
            <FileText className="size-4 text-muted-foreground" />
          </Link>
          <Link
            href="/rapports/semaine-23"
            className="flex items-center justify-between p-4 bg-transparent hover:bg-surface-elevated transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <span className="text-sm font-medium">Rapport Semaine 23</span>
            </div>
            <FileText className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </section>
    </div>
  )
}
