'use client'

import { X } from 'lucide-react'
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@make-the-change/core/ui'
import type { ReactNode } from 'react'

type MobileSheetProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function MobileSheet({ isOpen, onClose, title, children }: MobileSheetProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogPortal>
        <DialogBackdrop className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <DialogPopup
          className={[
            'fixed inset-x-0 bottom-0 z-[120] mx-auto max-w-xl overflow-hidden rounded-t-3xl border border-white/10',
            'bg-background/80 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] backdrop-blur-lg outline-none',
            'transition-transform duration-300 ease-out',
            'data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
          ].join(' ')}
        >
          <div className="flex items-center justify-between px-5 pb-2 pt-4">
            {title ? (
              <DialogTitle className="text-base font-black text-white">{title}</DialogTitle>
            ) : (
              <span />
            )}
            <DialogClose
              render={(props) => (
                <button
                  {...props}
                  type="button"
                  aria-label="Fermer"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-white/35 transition-colors hover:bg-white/10 hover:text-white/60"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            />
          </div>

          <div className="max-h-[78dvh] overflow-y-auto overscroll-contain px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
            {children}
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
