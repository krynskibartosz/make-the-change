import { fireEvent, render, screen } from '@testing-library/react'
import { ProductCard } from '../product-card'

describe('ProductCard media fallback', () => {
  it('shows placeholder icon when the main image fails to load', () => {
    const { container } = render(
      <ProductCard
        context="clientHome"
        model={{
          id: 'product-3',
          title: 'Olive Oil',
          image: {
            src: '/broken-image.jpg',
            alt: 'Broken image',
          },
        }}
        labels={{
          pointsLabel: 'points',
          viewLabel: '',
        }}
      />,
    )

    const image = screen.getByAltText('Broken image')
    fireEvent.error(image)

    expect(screen.queryByAltText('Broken image')).not.toBeInTheDocument()
    expect(container.querySelector('svg.lucide-package')).toBeInTheDocument()
  })
})
