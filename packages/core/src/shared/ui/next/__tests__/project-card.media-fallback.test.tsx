import { fireEvent, render, screen } from '@testing-library/react'
import { ProjectCard } from '../project-card'

describe('ProjectCard media fallback', () => {
  it('shows placeholder icon when the project image fails to load', () => {
    const { container } = render(
      <ProjectCard
        context="clientHome"
        model={{
          id: 'project-4',
          title: 'Local biodiversity sanctuary',
          image: {
            src: '/broken-project-image.jpg',
            alt: 'Broken project image',
          },
        }}
        labels={{
          viewLabel: '',
        }}
      />,
    )

    const image = screen.getByAltText('Broken project image')
    fireEvent.error(image)

    expect(screen.queryByAltText('Broken project image')).not.toBeInTheDocument()
    expect(container.querySelector('svg.lucide-target')).toBeInTheDocument()
  })
})
