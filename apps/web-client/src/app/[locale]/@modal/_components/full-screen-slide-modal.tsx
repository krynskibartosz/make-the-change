'use client'

import { ArrowLeft, X } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type FullScreenSlideModalProps = PropsWithChildren<{
  title?: string
  fallbackHref?: string
  headerMode?: 'back' | 'close' | 'none' | 'dynamic'
  headerRight?: React.ReactNode
  className?: string
  contentClassName?: string
  onClose?: () => void
  refreshOnClose?: boolean
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
  children,
}: FullScreenSlideModalProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isHeaderElevated, setIsHeaderElevated] = useState(false)

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

  useEffect(() => {
    if (headerMode !== 'dynamic') {
      setIsHeaderElevated(false)
      return
    }

    const container = containerRef.current
    if (!container) return

    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      const nextElevated = target.scrollTop > 60
      setIsHeaderElevated((previous) => (previous === nextElevated ? previous : nextElevated))
    }

    container.addEventListener('scroll', handleScroll, { passive: true, capture: true })

    return () => {
      container.removeEventListener('scroll', handleScroll, true)
    }
  }, [headerMode])

  const handleClose = () => {
    if (onClose) {
      onClose()
      return
    }

    if (refreshOnClose) {
      router.refresh()
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed inset-0 z-[100] bg-background h-[100dvh] w-full flex flex-col overflow-hidden',
        'animate-in slide-in-from-bottom-full duration-300',
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
              ? 'border-b border-white/[0.06] bg-[#0B0F15]/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)]'
              : 'border-b border-transparent bg-transparent',
          )}
        >
          <div className="flex items-center gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button
              onClick={handleClose}
              className={cn(
                'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                isHeaderElevated
                  ? 'bg-white/10 backdrop-blur-md'
                  : 'bg-black/20 backdrop-blur-sm border border-white/10',
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

      <div className={cn('min-h-0 flex-1', contentClassName)}>{children}</div>
    </div>
  )
}
