import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from '../field'
import { Form } from '../form'
import { Input } from '../input'
import { inputVariants } from '../input-variants'

describe('Input (new minimal API)', () => {
  it('1. variants produce expected classes', () => {
    const ghost = inputVariants({ variant: 'ghost' })
    expect(ghost).toContain('bg-white/[0.04]')
    expect(ghost).toContain('text-white')

    const def = inputVariants({ variant: 'default' })
    expect(def).toContain('text-foreground')
  })

  it('2. Field composition propagates data-attributes on blur', async () => {
    const user = userEvent.setup()

    render(
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<Input variant="ghost" />} type="email" required />
        <FieldError>Email is required</FieldError>
      </Field>,
    )

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.tab() // blur

    await waitFor(() => {
      expect(input).toHaveAttribute('data-touched')
    })
  })

  it('3. FieldLabel correctly associates with the control id', () => {
    render(
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<Input variant="ghost" />} />
      </Field>,
    )

    const input = screen.getByRole('textbox')
    const label = screen.getByText('Email')
    const inputId = input.getAttribute('id')

    expect(inputId).toBeTruthy()
    expect(label).toHaveAttribute('for', inputId!)
  })

  it('4. Form errors prop wires Field.Error message automatically', () => {
    render(
      <Form errors={{ email: 'Email already in use' }}>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <FieldControl render={<Input variant="ghost" />} />
          <FieldError />
        </Field>
      </Form>,
    )

    expect(screen.getByText('Email already in use')).toBeVisible()
  })

  it('5. validate async returns string and Field.Error displays it', async () => {
    const user = userEvent.setup()

    render(
      <Field
        name="user"
        validationMode="onBlur"
        validate={(value) => (value === 'admin' ? 'Reserved' : null)}
      >
        <FieldLabel>User</FieldLabel>
        <FieldControl render={<Input variant="ghost" />} />
        <FieldError />
      </Field>,
    )

    const input = screen.getByRole('textbox')
    await user.type(input, 'admin')
    await user.tab() // blur to trigger validate

    await waitFor(() => {
      expect(screen.getByText('Reserved')).toBeVisible()
    })
  })
})
