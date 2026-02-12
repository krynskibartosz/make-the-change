import { render, screen } from '@testing-library/react'
import { ProjectCard } from '../project-card'

describe('ProjectCard progress', () => {
  it('renders progress, funded and goal metrics', () => {
    render(
      <ProjectCard
        context="clientCatalog"
        model={{
          id: 'project-3',
          title: 'Vineyard Regeneration',
          progressPercent: 75,
          currentFundingEuro: 750,
          targetBudgetEuro: 1000,
        }}
        labels={{
          viewLabel: 'View project',
          progressLabel: 'Progress',
          fundedLabel: 'collected',
          goalLabel: 'Goal',
        }}
      />,
    )

    expect(screen.getByText('Progress')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('€750.00 collected')).toBeInTheDocument()
    expect(screen.getByText('Goal €1000.00')).toBeInTheDocument()
  })
})
