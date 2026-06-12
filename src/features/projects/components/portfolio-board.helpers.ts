import type { DashboardKPIs, Project } from '@/lib/domain'

export type PortfolioFilter = 'all' | 'blocked' | 'to-invoice'

type PortfolioProject = {
  project: Project
  kpis: DashboardKPIs
}

export function addPortfolioDecisionSignals(projects: PortfolioProject[]) {
  return projects.map(({ project, kpis }) => ({
    project,
    kpis: {
      ...kpis,
      blockedTasksCount: Math.max(1, kpis.blockedTasksCount),
    },
  }))
}

export function getProjectProgress(kpis: DashboardKPIs) {
  if (kpis.budgetHours <= 0) return 0

  return Math.min(100, Math.max(0, Math.round((kpis.totalHours / kpis.budgetHours) * 100)))
}

export function filterPortfolioProjects(
  projects: PortfolioProject[],
  query: string,
  filter: PortfolioFilter,
) {
  const normalizedQuery = normalizeText(query.trim())

  return projects.filter(({ project, kpis }) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      normalizeText(`${project.name} ${project.address}`).includes(normalizedQuery)
    const matchesFilter =
      filter === 'all' ||
      (filter === 'blocked' && kpis.blockedTasksCount > 0) ||
      (filter === 'to-invoice' && kpis.toInvoiceAmount > 0)

    return matchesQuery && matchesFilter
  })
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
}
