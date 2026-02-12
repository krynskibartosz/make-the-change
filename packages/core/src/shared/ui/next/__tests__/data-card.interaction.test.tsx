import { fireEvent, render, screen } from '@testing-library/react'
import { routerPushMock } from '../../../../../test/mocks/next'
import { DataCard } from '../data-card'

describe('DataCard interactions', () => {
  it('navigates when clicking the card surface', () => {
    render(
      <DataCard href="/products/abc">
        <span>Card body</span>
      </DataCard>,
    )

    fireEvent.click(screen.getByRole('button'))
    expect(routerPushMock).toHaveBeenCalledWith('/products/abc')
  })

  it('does not navigate when clicking internal card actions', () => {
    render(
      <DataCard href="/products/abc">
        <span>Card body</span>
        <button type="button" data-card-action>
          Action
        </button>
      </DataCard>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Action' }))
    expect(routerPushMock).not.toHaveBeenCalled()
  })

  it('navigates on Enter key from card container and ignores Enter on actions', () => {
    render(
      <DataCard href="/products/abc">
        <span>Card body</span>
        <button type="button" data-card-action>
          Action
        </button>
      </DataCard>,
    )

    const [card] = screen.getAllByRole('button')
    const action = screen.getByRole('button', { name: 'Action' })

    fireEvent.keyDown(action, { key: 'Enter' })
    expect(routerPushMock).not.toHaveBeenCalled()

    fireEvent.keyDown(card, { key: 'Enter' })
    expect(routerPushMock).toHaveBeenCalledWith('/products/abc')
  })
})
