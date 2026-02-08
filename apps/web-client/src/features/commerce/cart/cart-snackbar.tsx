'use client'

import { Button, Card } from '@make-the-change/core/ui'
import { cn } from '@/lib/utils'
import { useCartUI } from './cart-ui-provider'

export function CartSnackbar() {
  const { snackbar, dismissSnackbar } = useCartUI()

  if (!snackbar) return null

  return (
    <div
      className={cn(
        'fixed inset-x-0 z-50 px-4',
        'bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-4',
      )}
      role="status"
      aria-live="polite"
    >
      <Card className="mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
        <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {snackbar.message}
        </p>
        <div className="flex items-center gap-2">
          {snackbar.actionLabel && snackbar.onAction ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-11"
              onClick={() => {
                snackbar.onAction?.()
                dismissSnackbar()
              }}
            >
              {snackbar.actionLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-11"
            aria-label="Fermer"
            onClick={dismissSnackbar}
          >
            OK
          </Button>
        </div>
      </Card>
    </div>
  )
}
