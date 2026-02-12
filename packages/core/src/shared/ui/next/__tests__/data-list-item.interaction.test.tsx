import { fireEvent, render, screen } from '@testing-library/react'
import { routerPushMock } from '../../../../../test/mocks/next'
import { DataListItem } from '../data-list-item'

describe('DataListItem interactions', () => {
  it('navigates when clicking the list item container', () => {
    render(
      <DataListItem href="/products/xyz">
        <span>List item body</span>
      </DataListItem>,
    )

    fireEvent.click(screen.getByRole('button'))
    expect(routerPushMock).toHaveBeenCalledWith('/products/xyz')
  })

  it('does not navigate when clicking internal actions', () => {
    render(
      <DataListItem href="/products/xyz">
        <span>List item body</span>
        <button type="button" data-card-action>
          Inline action
        </button>
      </DataListItem>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Inline action' }))
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  it('navigates on Enter from container and ignores Enter on actions', () => {
    render(
      <DataListItem href="/products/xyz">
        <span>List item body</span>
        <button type="button" data-card-action>
          Inline action
        </button>
      </DataListItem>,
    )

    const [item] = screen.getAllByRole('button')
    const action = screen.getByRole('button', { name: 'Inline action' })

    fireEvent.keyDown(action, { key: 'Enter' })
    expect(routerPushMock).not.toHaveBeenCalled()

    fireEvent.keyDown(item, { key: 'Enter' })
    expect(routerPushMock).toHaveBeenCalledWith('/products/xyz')
  })
})
