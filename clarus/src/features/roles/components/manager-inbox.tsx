'use client'

import { AlertTriangle, ArrowRight, CheckCircle2, Clock, MapPin, Mic } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui'

export function ManagerInbox() {
  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">À vérifier aujourd'hui</h2>
          <p className="text-sm text-muted-foreground">3 éléments en attente</p>
        </div>
      </div>

      {/* Notes IA à valider */}
      <section>
        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          <Mic className="size-4" /> Notes Terrain IA
        </h3>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
              Confiance 82%
            </div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-foreground font-bold shadow-sm">
                  H
                </div>
                <div>
                  <p className="text-sm font-semibold">Note de Hubert</p>
                  <p className="text-xs text-muted-foreground">Il y a 10 min</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg p-3 text-sm mb-4 border border-border/50">
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-muted-foreground text-xs">Travail</div>
                <div className="font-medium text-right">Démolition</div>

                <div className="text-muted-foreground text-xs">Zone</div>
                <div className="font-medium text-right flex items-center justify-end gap-1">
                  <MapPin className="size-3" /> Extérieur
                </div>

                <div className="text-muted-foreground text-xs">Équipe</div>
                <div className="font-medium text-right">Hubert, Chris</div>

                <div className="text-muted-foreground text-xs">Durée estimée</div>
                <div className="font-medium text-right flex items-center justify-end gap-1">
                  <Clock className="size-3 text-orange-500" />{' '}
                  <span className="text-orange-500">10h (à confirmer)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="secondary"
                className="flex-1"
                variant="primary"
                leftIcon={<CheckCircle2 className="size-4" />}
              >
                Valider tout
              </Button>
              <Link href="/interventions/new" className="flex-1">
                <Button size="secondary" variant="secondary" fullWidth>
                  Corriger
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Heures & Blocages */}
      <section className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            <AlertTriangle className="size-4" /> Points bloquants
          </h3>
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-foreground">Conteneur presque plein</p>
              <span className="bg-orange-500/20 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Urgent
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Signalé par Chris — Zone Extérieur</p>
            <Button variant="secondary" size="compact" className="w-full mt-1">
              Transformer en tâche
            </Button>
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            <Clock className="size-4" /> Heures à valider
          </h3>
          <div className="rounded-xl border border-border bg-surface p-0 flex flex-col divide-y divide-border">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm font-medium">Hubert</p>
                  <p className="text-xs text-muted-foreground">08:00 → 16:30</p>
                </div>
              </div>
              <Button variant="ghost" size="compact" className="text-primary hover:bg-primary/10">
                Valider
              </Button>
            </div>
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm font-medium">Chris</p>
                  <p className="text-xs text-muted-foreground">08:00 → 16:30</p>
                </div>
              </div>
              <Button variant="ghost" size="compact" className="text-primary hover:bg-primary/10">
                Valider
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Raccourcis classiques */}
      <section className="mt-4 pt-4 border-t border-border/50">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Actions classiques
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/interventions/new"
            className="flex items-center justify-between bg-surface border border-border p-3 rounded-xl"
          >
            <span className="text-sm font-medium">Créer Travail</span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>
          <Link
            href="/ajouter-depense"
            className="flex items-center justify-between bg-surface border border-border p-3 rounded-xl"
          >
            <span className="text-sm font-medium">Créer Dépense</span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </section>
    </div>
  )
}
