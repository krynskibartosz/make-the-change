'use client'

import {
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarCheck2,
  ChevronLeft,
  CircleDollarSign,
  Clock3,
  FileText,
  Mail,
  Phone,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { Client, Project } from '@/lib/domain'
import { mockClarusRepository } from '@/lib/repositories'

export default function ClientProfilePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const [loadedClient, project] = await Promise.all([
      mockClarusRepository.getClient(id),
      mockClarusRepository.getProject(),
    ])

    setClient(loadedClient)
    setProjects(project.clientId === id ? [project] : [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>
  if (!client)
    return <div className="p-8 text-center text-muted-foreground">Client non trouvé.</div>

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
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">Relation client</p>
            <h1 className="text-xl font-bold">Profil client</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-4">
        <section className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-info/10 text-info">
            <UserRound className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-black">{client.name}</h2>
            <p className="text-sm text-muted-foreground">
              {client.company || 'Client particulier'}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${client.phone}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-primary text-sm font-bold text-primary-foreground"
          >
            <Phone className="size-4" />
            Appeler
          </a>
          <a
            href={`mailto:${client.email}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-border bg-surface text-sm font-bold"
          >
            <Mail className="size-4" />
            Écrire
          </a>
        </div>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">Suivi client</h3>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            <ClientFollowUpRow
              icon={Clock3}
              label="Dernier contact"
              value="Appel du 10 juin"
              detail="Compte-rendu envoyé au client"
            />
            <ClientFollowUpRow
              icon={CalendarCheck2}
              label="Prochaine action"
              value="Relancer le 12 juin avant 16 h"
              detail="Obtenir une réponse sur l’option terrasse"
              tone="text-info"
            />
            <Link
              href="/validations"
              className="flex min-h-24 items-start gap-3 border-t border-border p-4 active:bg-surface-elevated"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <AlertCircle className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-muted-foreground">
                  Validation en attente
                </span>
                <span className="mt-0.5 block font-bold">Option technique terrasse</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  Accord client demandé pour +540 € et +1 jour
                </span>
              </span>
              <ArrowRight className="mt-2 size-4 shrink-0 text-warning" />
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">
            Chantiers ({projects.length})
          </h3>
          {projects.length === 0 ? (
            <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6 text-center text-sm text-muted-foreground">
              Aucun chantier actif.
            </div>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                href="/projet-info"
                className="flex min-h-20 items-center gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4 active:bg-surface-elevated"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{project.name}</span>
                  <span className="mt-0.5 block text-xs leading-4 text-muted-foreground">
                    {project.address}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-primary" />
              </Link>
            ))
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase text-muted-foreground">
            Situation financière
          </h3>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-surface">
            <div className="flex items-center justify-between gap-4 p-4">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <CircleDollarSign className="size-4 text-muted-foreground" />
                Chiffre d’affaires
              </span>
              <span className="font-black">45 200 €</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border p-4">
              <span className="flex items-center gap-2 text-sm font-semibold text-billable">
                <FileText className="size-4" />À facturer
              </span>
              <span className="font-black text-billable">1 420 €</span>
            </div>
            <Link
              href="/facturation"
              className="flex min-h-12 items-center justify-between border-t border-border px-4 text-sm font-bold active:bg-surface-elevated"
            >
              Préparer la facture
              <ArrowRight className="size-4 text-primary" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

type ClientFollowUpRowProps = {
  icon: typeof Clock3
  label: string
  value: string
  detail: string
  tone?: string
}

function ClientFollowUpRow({ icon: Icon, label, value, detail, tone }: ClientFollowUpRowProps) {
  return (
    <div className="flex min-h-24 items-start gap-3 border-t border-border p-4 first:border-t-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className={`mt-0.5 font-bold ${tone ?? ''}`}>{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  )
}
