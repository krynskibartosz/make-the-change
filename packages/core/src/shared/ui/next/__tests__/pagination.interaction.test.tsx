import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  pathnameMock,
  routerPushMock,
  searchParamsMock,
} from '../../../../../test/mocks/next'
import { Pagination } from '../pagination'

describe('Pagination interactions', () => {
  it('keeps disabled states and aria-current markers in sync with page boundaries', () => {
    const { rerender } = render(
      <Pagination
        pagination={{
          currentPage: 1,
          pageSize: 10,
          totalItems: 120,
          totalPages: 12,
        }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page')

    rerender(
      <Pagination
        pagination={{
          currentPage: 12,
          pageSize: 10,
          totalItems: 120,
          totalPages: 12,
        }}
      />,
    )

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '12' })).toHaveAttribute('aria-current', 'page')
  })

  it('supports keyboard navigation for page buttons', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <Pagination
        onPageChange={onPageChange}
        pagination={{
          currentPage: 1,
          pageSize: 10,
          totalItems: 30,
          totalPages: 3,
        }}
      />,
    )

    const targetPageButton = screen.getByRole('button', { name: '2' })
    targetPageButton.focus()
    await user.keyboard('{Enter}')

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('updates the URL query param when onPageChange is not provided', async () => {
    const user = userEvent.setup()
    pathnameMock.mockReturnValue('/products')
    searchParamsMock.mockReturnValue(new URLSearchParams('query=soil&page=1'))

    render(
      <Pagination
        pagination={{
          currentPage: 1,
          pageSize: 10,
          totalItems: 30,
          totalPages: 3,
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(routerPushMock).toHaveBeenCalledWith('/products?query=soil&page=2')
  })
})
