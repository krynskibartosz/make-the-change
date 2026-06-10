'use client'

import { ChevronLeft, X } from 'lucide-react'
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
  title: string
}>

export function FullScreenSlideModal({
  action,
  asPage = false,
  children,
  closeLabel,
  contentClassName = '',
  eyebrow = 'Sparrenlaan',
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
        asPage ? 'relative' : 'fixed inset-0 z-50',
        'h-[100dvh] w-full flex flex-col bg-background text-foreground overflow-y-auto overflow-x-hidden overscroll-y-contain'
      )}
    >
      <div className="mx-auto flex flex-1 w-full max-w-md flex-col">
        <header className="sticky top-0 z-40 flex items-start gap-3 border-b border-white/5 bg-background/90 backdrop-blur-md px-5 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)]">
          {headerMode !== 'none' ? (
            <button
              aria-label={resolvedCloseLabel}
              className="inline-flex size-[var(--size-icon-button)] shrink-0 items-center justify-center rounded-[var(--radius-control)] border border-border bg-surface-elevated text-foreground"
              onClick={closeModal}
              type="button"
            >
              {isBackMode ? (
                <ChevronLeft aria-hidden="true" className="size-5" />
              ) : (
                <X aria-hidden="true" className="size-5" />
              )}
            </button>
          ) : null}
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight">{title}</h1>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
        <div className={cn('flex flex-1 flex-col gap-4 px-5 pb-5 py-5', contentClassName)}>{children}</div>
      </div>
    </div>
  )
}
