'use client'

import {
  AlertTriangle,
  Building2,
  CircleDollarSign,
  HardHat,
  Search,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { DashboardKPIs, Project } from '@/lib/domain'
import { cn } from '@/lib/utils/cn'
import {
  addPortfolioDecisionSignals,
  filterPortfolioProjects,
  getProjectProgress,
  type PortfolioFilter,
} from './portfolio-board.helpers'

type PortfolioBoardProps = {
  projects: { project: Project; kpis: DashboardKPIs }[]
}

const filters: { value: PortfolioFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'blocked', label: 'Bloqués' },
  { value: 'to-invoice', label: 'À facturer' },
]

export function PortfolioBoard({ projects }: PortfolioBoardProps) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<PortfolioFilter>('all')
  const projectsWithDecisionSignals = useMemo(
    () => addPortfolioDecisionSignals(projects),
    [projects],
  )
  const visibleProjects = useMemo(
    () => filterPortfolioProjects(projectsWithDecisionSignals, query, filter),
    [filter, projectsWithDecisionSignals, query],
  )

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col gap-5 p-5 pb-32">
      <div className="flex flex-col gap-3">
        <label className="relative block">
          <span className="sr-only">Rechercher un chantier</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom ou adresse du chantier"
            className="h-12 w-full rounded-[var(--radius-control)] border border-border bg-surface pl-10 pr-4 text-base outline-none transition-colors focus:border-primary"
          />
        </label>

        <fieldset className="grid grid-cols-3 gap-1 rounded-[var(--radius-control)] border border-border bg-surface p-1">
          <legend className="sr-only">Filtrer les chantiers</legend>
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={cn(
                'min-h-10 rounded-lg px-2 text-sm font-semibold transition-colors',
                filter === item.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground active:bg-surface-elevated',
              )}
            >
              {item.label}
            </button>
          ))}
        </fieldset>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">
          {visibleProjects.length} chantier{visibleProjects.length > 1 ? 's' : ''}
        </p>
        <p className="text-xs text-muted-foreground">Décisions et suivi financier</p>
      </div>

      <div className="flex flex-col gap-4">
        {visibleProjects.map(({ project, kpis }) => {
          const progress = getProjectProgress(kpis)
          const hasBlockage = kpis.blockedTasksCount > 0

          return (
            <article
              key={project.id}
              className={cn(
                'overflow-hidden rounded-[var(--radius-card)] border bg-surface',
                hasBlockage ? 'border-blocked/50' : 'border-border',
              )}
            >
              <div className="flex items-start gap-3 border-b border-border p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-bold">{project.name}</h3>
                  <p className="mt-0.5 text-sm leading-5 text-muted-foreground">
                    {project.address}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-success/10 px-2 py-1 text-xs font-bold text-success">
                  En cours
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-4">
                <div className="col-span-2">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">Avancement</span>
                    <span className="text-sm font-black">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {kpis.totalHours} h réalisées sur {kpis.budgetHours} h prévues
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Montant à facturer</p>
                  <p className="mt-1 text-xl font-black text-billable">
                    {kpis.toInvoiceAmount.toLocaleString('fr-FR')} €
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Blocage actif</p>
                  <p
                    className={cn(
                      'mt-1 flex items-center gap-1.5 text-sm font-bold',
                      hasBlockage ? 'text-blocked' : 'text-success',
                    )}
                  >
                    {hasBlockage ? (
                      <>
                        <AlertTriangle className="size-4 shrink-0" />
                        Choix P1.7
                      </>
                    ) : (
                      'Aucun'
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-border bg-background/40">
                <ActionLink href="/projet-info" icon={HardHat} label="Chantier" />
                <ActionLink
                  href={project.clientId ? `/client/${project.clientId}` : '#'}
                  icon={UserRound}
                  label="Client"
                />
                <ActionLink href="/facturation" icon={CircleDollarSign} label="Facturation" />
              </div>
            </article>
          )
        })}

        {visibleProjects.length === 0 && (
          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface p-8 text-center">
            <Search className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 font-semibold">Aucun chantier trouvé</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Modifiez la recherche ou le filtre.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

type ActionLinkProps = {
  href: string
  icon: typeof HardHat
  label: string
}

function ActionLink({ href, icon: Icon, label }: ActionLinkProps) {
  return (
    <Link
      href={href}
      className="flex min-h-16 flex-col items-center justify-center gap-1 border-r border-border px-1 text-[11px] font-bold last:border-r-0 active:bg-surface-elevated"
    >
      <Icon className="size-4 text-primary" />
      <span>{label}</span>
    </Link>
  )
}
