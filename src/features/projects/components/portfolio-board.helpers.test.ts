import { describe, expect, it } from 'vitest'
import type { DashboardKPIs, Project } from '@/lib/domain'
import {
  addPortfolioDecisionSignals,
  filterPortfolioProjects,
  getProjectProgress,
} from './portfolio-board.helpers'

const project: Project = {
  id: 'project-1',
  clientId: 'client-1',
  name: 'Villa Sparrenlaan',
  address: 'Sparrenlaan 35, Overijse',
  description: 'Transformation',
  status: 'active',
}

const kpis: DashboardKPIs = {
  totalHours: 92,
  totalCost: 8400,
  toInvoiceAmount: 1420,
  budgetHours: 200,
  budgetCost: 15000,
  blockedTasksCount: 1,
}

describe('getProjectProgress', () => {
  it('rounds progress and keeps it between 0 and 100', () => {
    expect(getProjectProgress(kpis)).toBe(46)
    expect(getProjectProgress({ ...kpis, totalHours: 250 })).toBe(100)
    expect(getProjectProgress({ ...kpis, totalHours: -10 })).toBe(0)
  })

  it('returns zero when no hour budget is available', () => {
    expect(getProjectProgress({ ...kpis, budgetHours: 0 })).toBe(0)
  })
})

describe('filterPortfolioProjects', () => {
  const projects = [
    { project, kpis },
    {
      project: {
        ...project,
        id: 'project-2',
        name: 'Rénovation Louise',
        address: 'Avenue Louise, Bruxelles',
      },
      kpis: { ...kpis, toInvoiceAmount: 0, blockedTasksCount: 0 },
    },
  ]

  it('matches names and addresses without depending on accents or case', () => {
    expect(filterPortfolioProjects(projects, 'renovation', 'all')).toHaveLength(1)
    expect(filterPortfolioProjects(projects, 'BRUXELLES', 'all')).toHaveLength(1)
  })

  it('filters projects that are blocked or ready to invoice', () => {
    expect(
      filterPortfolioProjects(projects, '', 'blocked').map(({ project }) => project.id),
    ).toEqual(['project-1'])
    expect(
      filterPortfolioProjects(projects, '', 'to-invoice').map(({ project }) => project.id),
    ).toEqual(['project-1'])
  })
})

describe('addPortfolioDecisionSignals', () => {
  it('keeps a credible blocked decision in the mock portfolio', () => {
    expect(
      addPortfolioDecisionSignals([{ project, kpis: { ...kpis, blockedTasksCount: 0 } }]),
    ).toEqual([{ project, kpis: { ...kpis, blockedTasksCount: 1 } }])
  })
})
