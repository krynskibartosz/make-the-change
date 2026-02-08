import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  AdminFilterButton,
  AdminFilterSheet,
} from '@/app/[locale]/admin/(dashboard)/components/ui/admin-filter-sheet'

vi.mock('@make-the-change/core/ui', async (importOriginal) => {
  const mod = (await importOriginal()) as Record<string, unknown>
  let onOpenChangeRef: ((open: boolean) => void) | undefined

  return {
    ...mod,
    BottomSheet: ({
      open,
      onOpenChange,
      children,
    }: {
      open: boolean
      onOpenChange: (open: boolean) => void
      children: React.ReactNode
    }) => {
      onOpenChangeRef = onOpenChange
      return open ? <div data-testid="mock-bottom-sheet">{children}</div> : null
    },
    BottomSheetContent: ({ children }: { children: React.ReactNode }) => (
      <div role="dialog">{children}</div>
    ),
    BottomSheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BottomSheetBody: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BottomSheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    BottomSheetClose: ({
      render,
    }: {
      render: (props: { onClick: () => void }) => React.ReactNode
    }) => render({ onClick: () => onOpenChangeRef?.(false) }),
  }
})

describe('AdminFilterSheet', () => {
  it('opens and closes via the trigger and close button', async () => {
    const user = userEvent.setup()

    const Test = () => {
      const [open, setOpen] = useState(false)
      return (
        <div>
          <AdminFilterButton isActive={false} onClick={() => setOpen(true)} />
          <AdminFilterSheet open={open} onOpenChange={setOpen} title="Filtres">
            <div>Contenu filtres</div>
          </AdminFilterSheet>
        </div>
      )
    }

    render(<Test />)

    await user.click(screen.getByRole('button', { name: /ouvrir les filtres/i }))
    expect(await screen.findByText('Contenu filtres')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /fermer/i }))
    await waitFor(() => {
      expect(screen.queryByText('Contenu filtres')).not.toBeInTheDocument()
    })
  })
})
