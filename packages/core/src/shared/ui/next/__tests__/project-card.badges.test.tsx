import { render, screen } from '@testing-library/react'
import { ProjectCard } from '../project-card'

describe('ProjectCard badges', () => {
  it('uses explicit model.badges when provided', () => {
    render(
      <ProjectCard
        context="clientCatalog"
        model={{
          id: 'project-1',
          title: 'Olive Grove Expansion',
          badges: [{ id: 'explicit-badge', label: 'Custom badge', tone: 'warning' }],
          featured: true,
          status: 'active',
        }}
        labels={{
          viewLabel: 'View project',
          featuredLabel: 'Featured',
          activeLabel: 'Active',
          fundedLabel: 'Funded',
        }}
      />,
    )

    expect(screen.getByText('Custom badge')).toBeInTheDocument()
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
    expect(screen.queryByText('Active')).not.toBeInTheDocument()
  })

  it('falls back to legacy featured + status badges when model.badges is absent', () => {
    render(
      <ProjectCard
        context="clientCatalog"
        model={{
          id: 'project-2',
          title: 'Beehive Restoration',
          featured: true,
          status: 'active',
        }}
        labels={{
          viewLabel: 'View project',
          featuredLabel: 'Featured',
          activeLabel: 'Active',
          fundedLabel: 'Funded',
        }}
      />,
    )

    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})
