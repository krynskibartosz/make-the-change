'use client'

import { AlertCircle, ArrowRight, Calendar, CheckCircle2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'

export default function RapportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Dans un vrai cas, on fetcherait le rapport selon l'ID.
  const isCurrentWeek = params.id === 'semaine-24'

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between pb-4 px-5 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-surface-elevated transition-colors"
        >
          <ChevronLeft className="size-6" />
        </button>
        <h1 className="text-xl font-semibold capitalize">{params.id.replace('-', ' ')}</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 flex flex-col p-5 max-w-md mx-auto w-full gap-8 mt-2">
        {/* Intro */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Calendar className="size-5" />
            <span>Synthèse de la semaine</span>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground">
            {isCurrentWeek
              ? "Une excellente semaine sur le chantier ! L'équipe s'est concentrée sur la démolition de l'ancienne terrasse et l'évacuation des gravats. Tout s'est déroulé de manière fluide, bien que la quantité de béton à évacuer soit légèrement supérieure à nos estimations initiales."
              : "La semaine 23 a été consacrée à la préparation du chantier, la mise en sécurité de la zone et le montage de l'échafaudage. Les fondations ont été inspectées avec succès."}
          </p>
        </section>

        {/* Accomplissements */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Ce qui a été accompli</h2>

          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center font-semibold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  Démolition Terrasse
                </span>
                <span className="text-emerald-500">100%</span>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                La dalle principale a été entièrement cassée et déblayée.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center font-semibold">
                <span className="flex items-center gap-2">
                  <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin-slow" />
                  Évacuation Gravats
                </span>
                <span className="text-primary">45%</span>
              </div>
              <p className="text-sm text-muted-foreground pl-7">
                3 bennes ont déjà été remplies et évacuées vers le centre de tri.
              </p>
            </div>
          </div>
        </section>

        {/* Photos Marquantes */}
        {isCurrentWeek && (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold">Photos marquantes</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-square rounded-2xl bg-surface-elevated border border-border overflow-hidden relative group">
                {/* Fallback visuel mocké */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                  <span className="text-orange-800/40 font-bold text-lg rotate-[-15deg]">
                    Démolition
                  </span>
                </div>
              </div>
              <div className="aspect-square rounded-2xl bg-surface-elevated border border-border overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <span className="text-blue-800/40 font-bold text-lg rotate-[-15deg]">
                    Gravats
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/photos"
              className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
            >
              Voir toute la galerie <ArrowRight className="size-4" />
            </Link>
          </section>
        )}

        {/* Prochaines Etapes */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Prévu pour la suite</h2>
          <div className="rounded-2xl bg-primary/5 p-4 flex flex-col gap-3">
            <ul className="list-disc list-inside text-sm text-foreground flex flex-col gap-2">
              <li>Finalisation de l'évacuation des gravats (Lundi)</li>
              <li>Traçage au sol pour les nouvelles fondations (Mardi)</li>
              <li>Début du coffrage de la nouvelle dalle (Mercredi)</li>
            </ul>
          </div>
        </section>

        {/* Points d'attention */}
        {isCurrentWeek && (
          <section className="flex flex-col gap-4">
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-orange-600 font-bold">
                <AlertCircle className="size-5" />
                <span>Point d'attention</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Nous avons besoin de votre validation concernant le{' '}
                <strong>Choix technique P1.7</strong> avant de pouvoir couler le béton de la
                structure.
              </p>
              <Link href="/validations">
                <Button
                  size="secondary"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white border-transparent"
                >
                  Voir la demande de validation
                </Button>
              </Link>
            </div>
          </section>
        )}

        <div className="h-8" />
      </div>
    </main>
  )
}
