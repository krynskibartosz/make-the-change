'use client'

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Euro,
  FileText,
  Mail,
  Phone,
  User,
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
    const c = await mockClarusRepository.getClient(id)
    // In a real app we'd fetch projects by clientId. For the mock we just grab the only one if it matches.
    const p = await mockClarusRepository.getProject()
    const clientProjects = p.clientId === id ? [p] : []

    setClient(c)
    setProjects(clientProjects)
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>
  if (!client)
    return <div className="p-8 text-center text-muted-foreground">Client non trouvé.</div>

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 flex flex-col gap-4 p-5 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full hover:bg-surface-elevated transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-tight">Profil Client</h1>
            <p className="text-xs text-muted-foreground">CRM Central</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-5 flex flex-col gap-6">
        {/* En-tête Client */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="size-24 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
            <User className="size-12" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold">{client.name}</h2>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              {client.company || 'Client Particulier'}
            </p>
          </div>

          <div className="flex gap-2 mt-4 w-full">
            <a
              href={`tel:${client.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
              <Phone className="size-4" /> Appeler
            </a>
            <a
              href={`mailto:${client.email}`}
              className="flex-1 flex items-center justify-center gap-2 bg-surface border border-border hover:bg-surface-elevated py-3 rounded-xl text-sm font-bold transition-colors"
            >
              <Mail className="size-4" /> Email
            </a>
          </div>
        </div>

        {/* Chantiers associés */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground ml-1">
            Chantiers ({projects.length})
          </h3>
          {projects.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-6 text-center text-sm text-muted-foreground">
              Aucun chantier actif.
            </div>
          ) : (
            projects.map((project) => (
              <Link
                key={project.id}
                href={`/projet-info`}
                className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-primary/10 rounded-xl text-primary flex items-center justify-center">
                    <Building2 className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-base leading-tight">{project.name}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{project.address}</span>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </Link>
            ))
          )}
        </div>

        {/* Historique Financier (Mock) */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground ml-1">
            Finances
          </h3>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-surface-elevated/30">
              <span className="text-sm font-semibold">Chiffre d'Affaires</span>
              <span className="font-bold text-base">45 200 €</span>
            </div>
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-surface-elevated/30">
              <span className="text-sm font-semibold text-blue-500 flex items-center gap-1.5">
                <Euro className="size-4" /> À facturer
              </span>
              <span className="font-bold text-base text-blue-500">1 420 €</span>
            </div>
            <Link
              href="/facturation"
              className="p-3 flex justify-center items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors bg-background/50"
            >
              Voir les factures <FileText className="size-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
