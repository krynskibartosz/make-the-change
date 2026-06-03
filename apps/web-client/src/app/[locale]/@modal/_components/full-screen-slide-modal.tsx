'use client'

import { ArrowLeft, X } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal } from '@make-the-change/core/ui'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useScrollElevation } from './use-scroll-elevation'

type FullScreenSlideModalProps = PropsWithChildren<{
  title?: string
  fallbackHref?: string
  headerMode?: 'back' | 'close' | 'none' | 'dynamic'
  headerRight?: React.ReactNode
  className?: string
  contentClassName?: string
  onClose?: () => void
  refreshOnClose?: boolean
  hideElevatedHeaderBorder?: boolean
  /** Rend le modal comme une page normale (pas d'overlay fixed, pas de scroll lock, pas d'animation). */
  asPage?: boolean
}>

export function FullScreenSlideModal({
  title,
  fallbackHref = '/community',
  headerMode = 'back',
  headerRight,
  className,
  contentClassName,
  onClose,
  refreshOnClose,
  hideElevatedHeaderBorder = false,
  asPage = false,
  children,
}: FullScreenSlideModalProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(true)
  const isClosingRef = useRef(false)
  const scrollElevated = useScrollElevation(containerRef, 60)
  const isHeaderElevated = headerMode === 'dynamic' ? scrollElevated : false

  useEffect(() => {
    if (!title) return

    const previousTitle = document.title
    document.title = `${title} | Make the Change`

    return () => {
      document.title = previousTitle
    }
  }, [title])

  const handleClose = () => {
    if (isClosingRef.current) return
    isClosingRef.current = true

    // Always start visual close (independent of caller-provided onClose)
    setOpen(false)

    if (onClose) {
      onClose()
      return
    }

    if (refreshOnClose) {
      router.refresh()
    }

    setTimeout(() => {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back()
        return
      }

      router.push(fallbackHref)
    }, 200)
  }

  if (asPage) {
    return (
      <div
        ref={containerRef}
        className={cn(
          'relative h-[100dvh] w-full flex flex-col bg-background overflow-hidden',
          className,
        )}
      >
        {headerMode === 'back' ? (
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/5 bg-background/90 px-2 py-1 backdrop-blur-md">
            <button onClick={handleClose} className="p-4" aria-label="Retour">
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            {title ? <p className="truncate text-base font-semibold text-white">{title}</p> : null}
          </header>
        ) : null}

        {headerMode === 'close' ? (
          <button
            onClick={handleClose}
            aria-label="Fermer"
            className="absolute right-5 top-[max(1.5rem,calc(env(safe-area-inset-top)+0.5rem))] z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors active:bg-white/20"
          >
            <X className="h-5 w-5 text-white/90" />
          </button>
        ) : null}

        {headerMode === 'dynamic' ? (
          <header
            className={cn(
              'fixed inset-x-0 top-0 z-20 transition-all duration-500 ease-out',
              isHeaderElevated
                ? cn(
                    'bg-[#0B0F15]/55 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)]',
                    hideElevatedHeaderBorder
                      ? 'border-b border-transparent'
                      : 'border-b border-white/[0.05]',
                  )
                : 'border-b border-transparent bg-transparent',
            )}
          >
            <div className="flex items-center gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
              <button
                onClick={handleClose}
                className={cn(
                  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                  isHeaderElevated
                    ? 'border-transparent bg-transparent active:bg-white/10'
                    : 'border-white/[0.06] bg-black/10 backdrop-blur-sm active:bg-black/20',
                )}
                aria-label="Retour"
              >
                <ArrowLeft className="h-4 w-4 text-white/90" />
              </button>
              <p
                className={cn(
                  'flex-1 truncate text-center text-[13px] font-medium text-white/90 transition-all duration-300',
                  isHeaderElevated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1',
                )}
              >
                {title}
              </p>
              {headerRight ? (
                <div className="shrink-0">{headerRight}</div>
              ) : (
                <span aria-hidden className="h-9 w-9 shrink-0" />
              )}
            </div>
          </header>
        ) : null}

        <div data-modal-scroll-root className={cn('min-h-0 flex-1', contentClassName)}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && handleClose()} modal>
      <DialogPortal>
        <DialogBackdrop className="fixed inset-0 z-[99] bg-black/30 backdrop-blur-sm transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <DialogPopup
          ref={containerRef}
          className={cn(
            'fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col bg-background overflow-hidden',
            'transition-transform duration-300 ease-out',
            'data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
            className,
          )}
        >
          {headerMode === 'back' ? (
            <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/5 bg-background/90 px-2 py-1 backdrop-blur-md">
              <button onClick={handleClose} className="p-4" aria-label="Retour">
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              {title ? <p className="truncate text-base font-semibold text-white">{title}</p> : null}
            </header>
          ) : null}

          {headerMode === 'close' ? (
            <DialogClose
              render={(props) => (
                <button
                  {...props}
                  type="button"
                  aria-label="Fermer"
                  className="absolute right-5 top-[max(1.5rem,calc(env(safe-area-inset-top)+0.5rem))] z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors active:bg-white/20"
                >
                  <X className="h-5 w-5 text-white/90" />
                </button>
              )}
            />
          ) : null}

          {headerMode === 'dynamic' ? (
            <header
              className={cn(
                'fixed inset-x-0 top-0 z-20 transition-all duration-500 ease-out',
                isHeaderElevated
                  ? cn(
                      'bg-[#0B0F15]/55 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)]',
                      hideElevatedHeaderBorder
                        ? 'border-b border-transparent'
                        : 'border-b border-white/[0.05]',
                    )
                  : 'border-b border-transparent bg-transparent',
              )}
            >
              <div className="flex items-center gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
                <DialogClose
                  render={(props) => (
                    <button
                      {...props}
                      type="button"
                      className={cn(
                        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                        isHeaderElevated
                          ? 'border-transparent bg-transparent active:bg-white/10'
                          : 'border-white/[0.06] bg-black/10 backdrop-blur-sm active:bg-black/20',
                      )}
                      aria-label="Retour"
                    >
                      <ArrowLeft className="h-4 w-4 text-white/90" />
                    </button>
                  )}
                />
                <p
                  className={cn(
                    'flex-1 truncate text-center text-[13px] font-medium text-white/90 transition-all duration-300',
                    isHeaderElevated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1',
                  )}
                >
                  {title}
                </p>
                {headerRight ? (
                  <div className="shrink-0">{headerRight}</div>
                ) : (
                  <span aria-hidden className="h-9 w-9 shrink-0" />
                )}
              </div>
            </header>
          ) : null}

          <div data-modal-scroll-root className={cn('min-h-0 flex-1', contentClassName)}>
            {children}
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  )
}
