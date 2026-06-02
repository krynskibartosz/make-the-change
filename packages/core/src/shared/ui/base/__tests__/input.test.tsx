import { render, screen } from '@testing-library/react'
import { Input } from '../input'

describe('Input', () => {
  it('renders an accessible text input for ghost variant', () => {
    render(<Input variant="ghost" placeholder="Email" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('associates label with input via htmlFor', () => {
    render(<Input id="test-email" label="Email" variant="ghost" />)
    expect(screen.getByText('Email')).toHaveAttribute('for', 'test-email')
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-email')
  })

  it('shows error text and marks input aria-invalid', () => {
    render(<Input variant="ghost" error="Champ requis" />)
    expect(screen.getByText('Champ requis')).toBeVisible()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows helpText when no error', () => {
    render(<Input variant="ghost" helpText="Format : vous@email.com" />)
    expect(screen.getByText('Format : vous@email.com')).toBeVisible()
  })

  it('shows required marker in label', () => {
    render(<Input variant="ghost" label="Email" required />)
    expect(screen.getByRole('textbox')).toHaveAttribute('required')
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('default variant still renders', () => {
    render(<Input variant="default" label="Name" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
