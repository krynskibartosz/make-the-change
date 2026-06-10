'use client'

import { ChevronLeft, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'

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
  title,
}: FullScreenSlideModalProps) {
  const router = useRouter()
  const isBackMode = headerMode === 'back'
  const resolvedCloseLabel = closeLabel ?? (isBackMode ? 'Retour' : 'Fermer')

  function closeModal() {
    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <div
      className={
        asPage
          ? 'min-h-dvh bg-background text-foreground'
          : 'fixed inset-0 z-50 bg-background text-foreground'
      }
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-5 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <header className="flex items-start gap-3 border-b border-border pb-4">
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
        <div className={cn('flex flex-1 flex-col gap-4 py-5', contentClassName)}>{children}</div>
      </div>
    </div>
  )
}
