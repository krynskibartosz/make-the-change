'use client'

import { AlertTriangle, Briefcase, Building2, ChevronRight, Euro, Search, User } from 'lucide-react'
import Link from 'next/link'
import type { DashboardKPIs, Project } from '@/lib/domain'
import { cn } from '@/lib/utils/cn'

type PortfolioBoardProps = {
  projects: { project: Project; kpis: DashboardKPIs }[]
}

export function PortfolioBoard({ projects }: PortfolioBoardProps) {
  return (
    <div className="flex flex-col gap-6 p-5 pb-32 max-w-md mx-auto h-full w-full">
      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher un chantier..." 
            className="w-full bg-surface border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
        <button className="flex-none bg-red-500/10 border border-red-500/20 text-red-600 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
          <AlertTriangle className="size-4" />
          Blocages (1)
        </button>
        <button className="flex-none bg-blue-500/10 border border-blue-500/20 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
          <Euro className="size-4" />
          À facturer
        </button>
        <button className="flex-none bg-surface-elevated border border-border text-muted-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
          Tous les projets
        </button>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-4">
        {projects.map(({ project, kpis }) => (
          <div key={project.id} className={cn("bg-surface border border-border rounded-2xl overflow-hidden flex flex-col", kpis.blockedTasksCount > 0 && "border-red-500/30")}>
            {/* Header */}
            <div className="p-4 flex items-start justify-between border-b border-border/50 bg-surface-elevated/50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary mt-0.5">
                  <Building2 className="size-5" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-base leading-tight">{project.name}</h3>
                  <span className="text-sm text-muted-foreground">{project.address}</span>
                </div>
              </div>
              {kpis.blockedTasksCount > 0 && (
                <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-md text-xs font-bold animate-pulse">
                  <AlertTriangle className="size-3" />
                  {kpis.blockedTasksCount}
                </div>
              )}
            </div>

            {/* Quick KPIs */}
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avancement</span>
                <div className="flex items-end gap-1.5">
                  <span className="text-lg font-bold text-foreground">
                    {Math.round((kpis.totalHours / kpis.budgetHours) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-primary rounded-full w-[45%]" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">À facturer</span>
                <div className="flex items-end gap-1.5">
                  <span className={cn("text-lg font-bold", kpis.toInvoiceAmount > 0 ? "text-blue-500" : "text-muted-foreground")}>
                    {kpis.toInvoiceAmount} €
                  </span>
                </div>
                {kpis.toInvoiceAmount > 0 && (
                   <Link href="/facturation" className="text-[10px] text-blue-500 font-semibold hover:underline mt-0.5">
                     Voir les éléments
                   </Link>
                )}
              </div>
            </div>

            {/* Action footer */}
            <div className="flex bg-background/50 border-t border-border/50">
              {project.clientId && (
                <Link href={`/client/${project.clientId}`} className="flex-1 hover:bg-surface-elevated transition-colors p-3 flex justify-center items-center gap-2 text-xs font-bold text-muted-foreground border-r border-border/50">
                  <User className="size-4" />
                  Client
                </Link>
              )}
              <Link href="/projet-info" className="flex-[2] hover:bg-surface-elevated transition-colors p-3 flex justify-center items-center gap-2 text-sm font-semibold text-foreground">
                Infos Chantier
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        ))}

        {/* Mock other project */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col opacity-70">
          <div className="p-4 flex items-start justify-between border-b border-border/50 bg-surface-elevated/50">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-xl text-muted-foreground mt-0.5">
                <Briefcase className="size-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-base leading-tight">Appartement Lyon 6</h3>
                <span className="text-sm text-muted-foreground">En préparation</span>
              </div>
            </div>
            <div className="text-xs font-bold text-muted-foreground bg-surface-elevated px-2 py-0.5 rounded">
              Démarrage J-15
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
