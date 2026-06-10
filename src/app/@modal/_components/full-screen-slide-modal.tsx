'use client'

import { ArrowLeft, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils/cn'

type FullScreenSlideModalProps = Readonly<{
  action?: ReactNode
  asPage?: boolean
  children: ReactNode
  closeLabel?: string
  contentClassName?: string
  eyebrow?: string
  fallbackHref?: string
  headerMode?: 'back' | 'close' | 'none'
  onClose?: () => void
  title?: string
}>

export function FullScreenSlideModal({
  action,
  asPage = false,
  children,
  closeLabel,
  contentClassName = '',
  eyebrow,
  fallbackHref = '/aujourd-hui',
  headerMode = 'close',
  onClose,
  title,
}: FullScreenSlideModalProps) {
  const router = useRouter()
  const isBackMode = headerMode === 'back'
  const resolvedCloseLabel = closeLabel ?? (isBackMode ? 'Retour' : 'Fermer')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    html.classList.add('overflow-hidden')
    body.classList.add('overflow-hidden')

    return () => {
      html.classList.remove('overflow-hidden')
      body.classList.remove('overflow-hidden')
    }
  }, [])

  function closeModal() {
    if (onClose) {
      onClose()
      return
    }

    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        asPage ? 'relative' : 'fixed inset-0 z-50 animate-in slide-in-from-bottom-full duration-300',
        'h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-y-auto overflow-x-hidden overscroll-y-contain'
      )}
    >
      <div className="mx-auto flex flex-1 w-full max-w-md flex-col">
        {headerMode === 'back' ? (
          <header className="sticky top-0 z-40 flex items-center gap-2 border-b border-white/5 bg-background/90 px-2 py-1 backdrop-blur-md pt-[max(env(safe-area-inset-top),0.25rem)]">
            <button onClick={closeModal} className="p-4" aria-label={resolvedCloseLabel}>
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </button>
            <div className="flex-1 min-w-0">
              {title ? <p className="truncate text-base font-semibold text-foreground">{title}</p> : null}
            </div>
            {action ? <div className="shrink-0 pr-2">{action}</div> : null}
          </header>
        ) : null}

        {headerMode === 'close' ? (
          <>
            <button
              onClick={closeModal}
              aria-label={resolvedCloseLabel}
              className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-background/80 backdrop-blur-md text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            {title && (
              <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-white/5 bg-background/90 px-4 py-4 backdrop-blur-md pt-[max(env(safe-area-inset-top),1rem)]">
                <div className="flex-1 min-w-0 pr-12">
                  <p className="truncate text-lg font-semibold text-foreground">{title}</p>
                </div>
                {action ? <div className="shrink-0 pr-2">{action}</div> : null}
              </header>
            )}
          </>
        ) : null}

        <div className={cn('flex flex-1 flex-col min-h-0', contentClassName)}>{children}</div>
      </div>
    </div>
  )
}
