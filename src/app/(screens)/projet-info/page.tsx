'use client'

import { Building2, Calendar, ChevronLeft, FileText, Mail, MapPin, Phone, User } from 'lucide-react'
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
    loadData()
  }, [])

  const loadData = async () => {
    const p = await mockClarusRepository.getProject()
    const k = await mockClarusRepository.getDashboardKPIs()
    let c: Client | null = null
    if (p.clientId) {
      c = await mockClarusRepository.getClient(p.clientId)
    }
    setProject(p)
    setKpis(k)
    setClient(c)
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>
  if (!project) return null

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
            <h1 className="text-xl font-bold leading-tight">Fiche Chantier</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {project.status === 'active' ? 'En cours' : project.status}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-5 flex flex-col gap-6">
        {/* En-tête Projet */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary rotate-3">
            <Building2 className="size-10" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <p className="text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
              <MapPin className="size-4" />
              {project.address}
            </p>
          </div>
        </div>

        {/* Détails Techniques */}
        <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
            Détails Techniques
          </h3>

          <div className="flex gap-3">
            <div className="size-10 rounded-full bg-surface-elevated flex items-center justify-center flex-none">
              <FileText className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Description</span>
              <span className="text-muted-foreground text-sm leading-relaxed">
                {project.description}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="size-10 rounded-full bg-surface-elevated flex items-center justify-center flex-none">
              <Calendar className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Dates clés</span>
              <span className="text-muted-foreground text-sm">Début: 01/05/2026</span>
              <span className="text-muted-foreground text-sm">Livraison estimée: 15/09/2026</span>
            </div>
          </div>
        </div>

        {/* Client Associé */}
        {client && (
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Client Associé
              </h3>
              <Link
                href={`/client/${client.id}`}
                className="text-xs text-primary font-semibold bg-primary/10 px-2 py-1 rounded-md"
              >
                Voir profil complet
              </Link>
            </div>

            <div className="flex gap-3 items-center">
              <div className="size-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-none">
                <User className="size-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base">{client.name}</span>
                <span className="text-muted-foreground text-sm">
                  {client.company || 'Particulier'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <a
                href={`tel:${client.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-surface-elevated hover:bg-border/50 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Phone className="size-4" /> Appeler
              </a>
              <a
                href={`mailto:${client.email}`}
                className="flex-1 flex items-center justify-center gap-2 bg-surface-elevated hover:bg-border/50 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Mail className="size-4" /> Email
              </a>
            </div>
          </div>
        )}

        {/* Budget Macro (Admin/Chef) */}
        {kpis && (
          <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              Budget & Temps
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">
                  {Math.round((kpis.totalHours / kpis.budgetHours) * 100)}%
                </span>
                <span className="text-xs text-muted-foreground">Budget heures consommé</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold">
                  {Math.round((kpis.totalCost / kpis.budgetCost) * 100)}%
                </span>
                <span className="text-xs text-muted-foreground">Budget financier consommé</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
