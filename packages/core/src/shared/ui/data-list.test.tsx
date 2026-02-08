import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DataList } from './data-list'

// Mock implementation of LucideIcon
const MockIcon = ({ className }: { className?: string }) => (
  <svg data-testid="mock-icon" className={className} />
)

describe('DataList', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ]

  const defaultProps = {
    items: mockItems,
    renderItem: (item: any) => <div data-testid="item">{item.name}</div>,
    renderSkeleton: () => <div data-testid="skeleton">Skeleton</div>,
    emptyState: {
      title: 'No items',
      description: 'There are no items to display',
      icon: MockIcon as any,
    },
    isLoading: false,
    getItemKey: (item: any) => item.id,
  }

  it('renders items in grid view by default', () => {
    render(<DataList {...defaultProps} />)
    // Both variants are rendered but one is hidden
    expect(screen.getAllByTestId('item')).toHaveLength(6)
    
    // Grid variant should be visible (not hidden)
    const gridContainer = screen.getByTestId('data-list-grid')
    expect(gridContainer).not.toHaveClass('hidden')

    // List variant should be hidden
    const listContainer = screen.getByTestId('data-list-list')
    expect(listContainer).toHaveClass('hidden')
  })

  it('renders items in list view when variant is list', () => {
    render(<DataList {...defaultProps} variant="list" />)
    
    // Grid variant should be hidden
    const gridContainer = screen.getByTestId('data-list-grid')
    expect(gridContainer).toHaveClass('hidden')
    
    // List variant should be visible
    const listContainer = screen.getByTestId('data-list-list')
    expect(listContainer).not.toHaveClass('hidden')
  })

  it('renders skeletons when loading', () => {
    render(<DataList {...defaultProps} isLoading={true} />)
    expect(screen.getAllByTestId('skeleton')).toBeDefined()
    expect(screen.queryByTestId('item')).toBeNull()
  })

  it('renders empty state when items are empty', () => {
    render(<DataList {...defaultProps} items={[]} />)
    expect(screen.getByText('No items')).toBeInTheDocument()
    expect(screen.getByText('There are no items to display')).toBeInTheDocument()
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('renders action in empty state', () => {
    render(
      <DataList
        {...defaultProps}
        items={[]}
        emptyState={{
          ...defaultProps.emptyState,
          action: <button>Create</button>,
        }}
      />
    )
    expect(screen.getByText('Create')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<DataList {...defaultProps} className="custom-class" />)
    const container = screen.getByTestId('data-list')
    expect(container).toHaveClass('custom-class')
  })

  it('renders with specific grid columns', () => {
    const { container } = render(<DataList {...defaultProps} gridCols={4} />)
    const grid = container.querySelector('.grid')
    // Check for 2xl:grid-cols-4 which corresponds to gridCols=4
    expect(grid?.className).toContain('2xl:grid-cols-4')
  })
})
