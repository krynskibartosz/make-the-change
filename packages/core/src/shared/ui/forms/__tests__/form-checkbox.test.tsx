import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { FormCheckbox } from '../form-checkbox'

type Values = {
  acceptsNewsletters: boolean
}

function FormCheckboxHarness() {
  const form = useForm<Values>({
    defaultValues: {
      acceptsNewsletters: false,
    },
  })

  return (
    <FormProvider {...form}>
      <FormCheckbox
        description="Recevoir des actualites produit"
        falseBadge="Off"
        label="Newsletter"
        name="acceptsNewsletters"
        trueBadge="On"
      />
      <output data-testid="accepts-newsletters-value">
        {String(form.watch('acceptsNewsletters'))}
      </output>
    </FormProvider>
  )
}

describe('FormCheckbox', () => {
  it('preserves boolean value mapping when toggled', async () => {
    const user = userEvent.setup()

    render(<FormCheckboxHarness />)

    const checkbox = screen.getByRole('checkbox', { name: 'Newsletter' })
    expect(checkbox).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByTestId('accepts-newsletters-value')).toHaveTextContent('false')
    expect(screen.getByText('Off')).toBeVisible()

    await user.click(checkbox)

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Newsletter' })).toHaveAttribute(
        'aria-checked',
        'true',
      )
      expect(screen.getByTestId('accepts-newsletters-value')).toHaveTextContent('true')
    })
    expect(screen.getByText('On')).toBeVisible()
  })
})
