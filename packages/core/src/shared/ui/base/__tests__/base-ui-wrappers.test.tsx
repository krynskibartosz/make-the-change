import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../dialog'
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../field'
import { Form } from '../form'
import { Menu, MenuContent, MenuItem, MenuTrigger } from '../menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../navigation-menu'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '../number-field'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import { Radio, RadioGroup } from '../radio'
import { Slider, SliderThumb } from '../slider'

describe('Base UI wrappers', () => {
  it('handles dialog keyboard focus and escape close', async () => {
    const user = userEvent.setup()

    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Delete resource</DialogTitle>
          <button type="button">Confirm</button>
        </DialogContent>
      </Dialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Open dialog' }))

    const dialog = await screen.findByRole('dialog', { name: 'Delete resource' })
    await waitFor(() => {
      expect(dialog).toContainElement(document.activeElement)
    })

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Delete resource' })).not.toBeInTheDocument()
    })
  })

  it('opens popover and closes with escape', async () => {
    const user = userEvent.setup()

    render(
      <Popover>
        <PopoverTrigger>Open popover</PopoverTrigger>
        <PopoverContent>Quick profile actions</PopoverContent>
      </Popover>,
    )

    await user.click(screen.getByRole('button', { name: 'Open popover' }))
    expect(await screen.findByText('Quick profile actions')).toBeVisible()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByText('Quick profile actions')).not.toBeInTheDocument()
    })
  })

  it('supports menu keyboard activation', async () => {
    const user = userEvent.setup()
    const onRename = vi.fn()

    render(
      <Menu>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem onClick={onRename}>Rename</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuContent>
      </Menu>,
    )

    const trigger = screen.getByRole('button', { name: 'Actions' })
    trigger.focus()
    await user.keyboard('{Enter}')

    const firstItem = await screen.findByRole('menuitem', { name: 'Rename' })
    firstItem.focus()
    await user.keyboard('{Enter}')

    expect(onRename).toHaveBeenCalledTimes(1)
  })

  it('sets navigation menu trigger aria-expanded from keyboard', async () => {
    const user = userEvent.setup()

    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Discover</NavigationMenuTrigger>
            <NavigationMenuContent>Navigation panel</NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )

    const trigger = screen.getByRole('button', { name: 'Discover' })
    trigger.focus()
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })
  })

  it('updates radio selection with keyboard arrows', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <RadioGroup aria-label="Payment method" defaultValue="card" onValueChange={onValueChange}>
        <label>
          <Radio value="card" />
          Card
        </label>
        <label>
          <Radio value="bank" />
          Bank transfer
        </label>
      </RadioGroup>,
    )

    const [cardRadio, bankRadio] = screen.getAllByRole('radio')
    expect(cardRadio).toHaveAttribute('aria-checked', 'true')

    cardRadio.focus()
    await user.keyboard('{ArrowRight}')

    expect(bankRadio).toHaveAttribute('aria-checked', 'true')
    expect(onValueChange).toHaveBeenCalled()
  })

  it('increments and decrements number field values', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <NumberField defaultValue={2} min={1} max={5} onValueChange={onValueChange}>
        <NumberFieldGroup>
          <NumberFieldDecrement aria-label="Decrease quantity">-</NumberFieldDecrement>
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement aria-label="Increase quantity">+</NumberFieldIncrement>
        </NumberFieldGroup>
      </NumberField>,
    )

    const input = screen.getByLabelText('Quantity') as HTMLInputElement
    expect(input.value).toBe('2')

    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    expect(input.value).toBe('3')

    await user.click(screen.getByRole('button', { name: 'Decrease quantity' }))
    expect(input.value).toBe('2')
    expect(onValueChange).toHaveBeenCalled()
  })

  it('updates slider aria state on keyboard input', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <Slider defaultValue={25} min={0} max={100} onValueChange={onValueChange}>
        <SliderThumb aria-label="Investment amount" />
      </Slider>,
    )

    const thumb = screen.getByRole('slider', { name: 'Investment amount' })
    const before = Number(thumb.getAttribute('aria-valuenow'))

    thumb.focus()
    await act(async () => {
      await user.keyboard('{ArrowRight}')
    })

    const after = Number(thumb.getAttribute('aria-valuenow'))
    expect(after).toBeGreaterThan(before)
    expect(onValueChange).toHaveBeenCalled()
  })

  it('wires field labels and descriptions inside form', async () => {
    const user = userEvent.setup()
    const onFormSubmit = vi.fn()

    render(
      <Form onFormSubmit={onFormSubmit}>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <FieldDescription>Primary email used for account access.</FieldDescription>
          <FieldControl required />
          <FieldError match={true}>Email is required.</FieldError>
        </Field>
        <button type="submit">Submit</button>
      </Form>,
    )

    const control = screen.getByLabelText('Email')
    expect(control).toBeInTheDocument()
    expect(screen.getByText('Primary email used for account access.')).toBeVisible()
    expect(screen.getByText('Email is required.')).toBeVisible()

    await user.type(control, 'demo@make-the-change.com')
    const form = screen.getByRole('button', { name: 'Submit' }).closest('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form as HTMLFormElement)
    expect(onFormSubmit).toHaveBeenCalledTimes(1)
  })
})
