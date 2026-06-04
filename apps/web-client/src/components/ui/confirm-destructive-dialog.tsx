'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@make-the-change/core/ui'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfirmDestructiveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  isPending?: boolean
}

export function ConfirmDestructiveDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  onConfirm,
  isPending = false,
}: ConfirmDestructiveDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          // Override defaults: dark surface, z-index above FullScreenSlideModal (z-100)
          'z-[120] max-w-sm rounded-2xl border-white/10 bg-[#0B0F15] p-6 shadow-2xl',
        )}
      >
        <AlertDialogTitle className="text-lg font-bold text-white">
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription className="mt-2 text-sm text-white/70">
          {description}
        </AlertDialogDescription>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            disabled={isPending}
            className="border border-white/10 bg-transparent text-white/80 hover:bg-white/5"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault()
              void Promise.resolve(onConfirm())
            }}
            className="inline-flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {confirmLabel}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
