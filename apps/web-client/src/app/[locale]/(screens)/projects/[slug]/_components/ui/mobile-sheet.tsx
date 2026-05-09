'use client'

import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

type MobileSheetProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function MobileSheet({ isOpen, onClose, title, children }: MobileSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          <motion.aside
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-xl overflow-hidden rounded-t-3xl border border-white/10 bg-background/80 shadow-[0_-20px_80px_rgba(0,0,0,0.6)] backdrop-blur-lg"
          >
            {/* Drag handle */}
            <div className="flex justify-center pb-1 pt-3">
              <div className="h-[3px] w-9 rounded-full bg-white/25" />
            </div>

            <div className="flex items-center justify-between px-5 pb-2 pt-2">
              {title ? (
                <h2 className="text-base font-black text-white">{title}</h2>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-white/35 transition-colors hover:bg-white/10 hover:text-white/60"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-h-[78dvh] overflow-y-auto overscroll-contain px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
