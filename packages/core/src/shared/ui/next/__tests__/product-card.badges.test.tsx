import { render, screen } from '@testing-library/react'
import { ProductCard } from '../product-card'

describe('ProductCard badges', () => {
  it('uses explicit model.badges when provided', () => {
    render(
      <ProductCard
        context="clientCatalog"
        model={{
          id: 'product-1',
          title: 'Reusable Bottle',
          badges: [{ id: 'explicit-badge', label: 'Custom badge', tone: 'warning' }],
          featured: true,
          stockQuantity: 0,
        }}
        labels={{
          pointsLabel: 'points',
          viewLabel: 'View',
          featuredLabel: 'Featured',
          lowStockLabel: 'Low stock',
          outOfStockLabel: 'Sold out',
        }}
      />,
    )

    expect(screen.getByText('Custom badge')).toBeInTheDocument()
    expect(screen.queryByText('Featured')).not.toBeInTheDocument()
    expect(screen.queryByText('Sold out')).not.toBeInTheDocument()
  })

  it('falls back to legacy featured and stock badges when model.badges is absent', () => {
    render(
      <ProductCard
        context="clientCatalog"
        model={{
          id: 'product-2',
          title: 'Local Honey',
          featured: true,
          stockQuantity: 0,
        }}
        labels={{
          pointsLabel: 'points',
          viewLabel: 'View',
          featuredLabel: 'Featured',
          lowStockLabel: 'Low stock',
          outOfStockLabel: 'Sold out',
        }}
      />,
    )

    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.getByText('Sold out')).toBeInTheDocument()
    expect(screen.queryByText('Low stock')).not.toBeInTheDocument()
  })
})
