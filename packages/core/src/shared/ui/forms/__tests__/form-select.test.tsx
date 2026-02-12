import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { FormSelect } from '../form-select'

type Values = {
  country: string
}

const OPTIONS = [
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Allemagne' },
  { value: 'be', label: 'Belgique' },
]

function FormSelectHarness({
  defaultValue,
  useExplicitControl,
}: {
  defaultValue: string
  useExplicitControl?: boolean
}) {
  const form = useForm<Values>({
    defaultValues: {
      country: defaultValue,
    },
  })

  return (
    <FormProvider {...form}>
      <FormSelect
        control={useExplicitControl ? form.control : undefined}
        label="Pays"
        name="country"
        options={OPTIONS}
      />
      <output data-testid="country-value">{form.watch('country')}</output>
    </FormProvider>
  )
}

describe('FormSelect', () => {
  it('supports uncontrolled usage through FormProvider context', async () => {
    const user = userEvent.setup()

    render(<FormSelectHarness defaultValue="fr" />)

    expect(screen.getByTestId('country-value')).toHaveTextContent('fr')
    expect(screen.getByRole('combobox', { name: 'Pays' })).toHaveTextContent('fr')

    await user.click(screen.getByRole('combobox', { name: 'Pays' }))
    await user.click(await screen.findByText('Allemagne'))

    await waitFor(() => {
      expect(screen.getByTestId('country-value')).toHaveTextContent('de')
    })
  })

  it('supports explicit controlled usage with control prop', async () => {
    const user = userEvent.setup()

    render(<FormSelectHarness defaultValue="de" useExplicitControl />)

    expect(screen.getByTestId('country-value')).toHaveTextContent('de')
    expect(screen.getByRole('combobox', { name: 'Pays' })).toHaveTextContent('de')

    await user.click(screen.getByRole('combobox', { name: 'Pays' }))
    await user.click(await screen.findByText('France'))

    await waitFor(() => {
      expect(screen.getByTestId('country-value')).toHaveTextContent('fr')
    })
  })
})
