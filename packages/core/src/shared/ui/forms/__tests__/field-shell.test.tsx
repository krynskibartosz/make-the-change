import { render, screen } from '@testing-library/react'
import { FieldShell } from '../field-shell'

describe('FieldShell', () => {
  it('wires label, description and error to the provided field id', () => {
    render(
      <FieldShell
        description="Nous n'utiliserons jamais votre email publiquement."
        error="Email requis."
        fieldId="email-field"
        label="Email"
        required
      >
        <input id="email-field" type="email" />
      </FieldShell>,
    )

    const control = screen.getByRole('textbox')
    const label = screen.getByText('Email')

    expect(control).toHaveAttribute('id', 'email-field')
    expect(label).toHaveAttribute('for', 'email-field')
    expect(screen.getByText("Nous n'utiliserons jamais votre email publiquement.")).toBeVisible()
    expect(screen.getByText('Email requis.')).toBeVisible()
  })

  it('shows validating text when validation is running', () => {
    render(
      <FieldShell isValidating label="Nom" validatingText="Validation active...">
        <input id="name-field" type="text" />
      </FieldShell>,
    )

    expect(screen.getByText('Validation active...')).toBeVisible()
  })
})
