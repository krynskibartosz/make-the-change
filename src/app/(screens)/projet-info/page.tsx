'use client'

import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  CircleDollarSign,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Client, DashboardKPIs, Project } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

export default function ProjetInfoPage() {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [client, setClient] = useState<Client | null>(null)
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const [loadedProject, loadedKpis] = await Promise.all([
        mockClarusRepository.getProject(),
        mockClarusRepository.getDashboardKPIs(),
      ])
      const loadedClient = loadedProject.clientId
        ? await mockClarusRepository.getClient(loadedProject.clientId)
        : null

      setProject(loadedProject)
      setKpis(loadedKpis)
      setClient(loadedClient)
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>
  if (!project || !kpis) return null

  const progress =
    kpis.budgetHours > 0
      ? Math.min(100, Math.max(0, Math.round((kpis.totalHours / kpis.budgetHours) * 100)))
      : 0
  const blockedTasksCount = Math.max(1, kpis.blockedTasksCount)

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-20 text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/90 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Revenir à l’écran précédent"
            className="-ml-2 flex size-10 items-center justify-center rounded-full active:bg-surface-elevated"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-success">Chantier en cours</p>
            <h1 className="truncate text-xl font-bold">Fiche chantier</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4">
        <section>
          <h2 className="text-2xl font-black">{project.name}</h2>
          <p className="mt-1 flex items-start gap-1.5 text-sm leading-5 text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {project.address}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3" aria-label="Indicateurs du chantier">
          <ProjectKpi
            icon={Clock3}
            label="Avancement"
            value={`${progress}%`}
            detail={`${kpis.totalHours} h / ${kpis.budgetHours} h`}
          />
          <ProjectKpi
            icon={CircleDollarSign}
            label="À facturer"
            value={`${kpis.toInvoiceAmount.toLocaleString('fr-FR')} €`}
            detail="Montant prêt"
            tone="text-billable"
          />
          <ProjectKpi
            icon={AlertTriangle}
            label="Blocages"
            value={String(blockedTasksCount)}
            detail="Décision P1.7"
            tone="text-blocked"
          />
          <ProjectKpi
            icon={CalendarDays}
            label="Livraison estimée"
            value="15 sept."
            detail="2026"
          />
        </section>

        {blockedTasksCount > 0 && (
          <section className="overflow-hidden rounded-[var(--radius-card)] border border-blocked/40 bg-blocked/10">
            <div className="flex items-start gap-3 p-4">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-blocked" />
              <div>
                <p className="text-xs font-bold uppercase text-blocked">Décision requise</p>
                <h3 className="mt-1 font-bold">Confirmer l’option technique P1.7</h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  La dalle terrasse est plus épaisse que prévu. Impact estimé : +1 jour et +540 €.
                </p>
              </div>
            </div>
            <Link
              href="/validations"
              className="flex min-h-12 items-center justify-between border-t border-blocked/30 px-4 text-sm font-bold text-blocked active:bg-blocked/10"
            >
              Voir la validation attendue
              <ArrowRight className="size-4" />
            </Link>
          </section>
        )}

        <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">Résumé chantier</h3>
          <div className="mt-4 flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
              <FileText className="size-5 text-muted-foreground" />
            </span>
            <div>
              <p className="text-sm font-semibold">Périmètre</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">{project.description}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3 border-t border-border pt-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
              <CalendarDays className="size-5 text-muted-foreground" />
            </span>
            <div>
              <p className="text-sm font-semibold">Planning</p>
              <p className="mt-1 text-sm text-muted-foreground">Démarrage : 1 mai 2026</p>
              <p className="text-sm text-muted-foreground">Livraison estimée : 15 septembre 2026</p>
            </div>
          </div>
        </section>

        {client && (
          <section className="rounded-[var(--radius-card)] border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Client associé</p>
                <h3 className="mt-0.5 font-bold">{client.name}</h3>
              </div>
              <Link
                href={`/client/${client.id}`}
                className="flex min-h-10 items-center gap-1 rounded-lg bg-primary/10 px-3 text-xs font-bold text-primary"
              >
                Profil
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={`tel:${client.phone}`}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold text-primary-foreground"
              >
                <Phone className="size-4" />
                Appeler
              </a>
              <a
                href={`mailto:${client.email}`}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border text-sm font-bold"
              >
                <Mail className="size-4" />
                Écrire
              </a>
            </div>
          </section>
        )}

        <Link
          href="/facturation"
          className="flex min-h-14 items-center justify-between rounded-[var(--radius-card)] border border-border bg-surface px-4 text-sm font-bold active:bg-surface-elevated"
        >
          <span className="flex items-center gap-3">
            <UserRound className="size-5 text-primary" />
            Préparer la facturation du chantier
          </span>
          <ArrowRight className="size-4 text-primary" />
        </Link>
      </main>
    </div>
  )
}

type ProjectKpiProps = {
  icon: typeof Clock3
  label: string
  value: string
  detail: string
  tone?: string
}

function ProjectKpi({ icon: Icon, label, value, detail, tone }: ProjectKpiProps) {
  return (
    <div className="flex min-h-32 flex-col justify-between rounded-[var(--radius-card)] border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Icon className="size-4" />
        <span>{label}</span>
      </div>
      <div>
        <p className={`text-xl font-black ${tone ?? ''}`}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  )
}
