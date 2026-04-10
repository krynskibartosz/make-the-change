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
  className?: string
  contentClassName?: string
}>

export function FullScreenSlideModal({
  title,
  fallbackHref = '/community',
  headerMode = 'back',
  className,
  contentClassName,
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

      const nextElevated = target.scrollTop > 150
      setIsHeaderElevated((previous) => (previous === nextElevated ? previous : nextElevated))
    }

    container.addEventListener('scroll', handleScroll, { passive: true, capture: true })

    return () => {
      container.removeEventListener('scroll', handleScroll, true)
    }
  }, [headerMode])

  const handleClose = () => {
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
        'fixed inset-0 z-50 bg-background h-[100dvh] w-full flex flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain',
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
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-background/80 backdrop-blur-md"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      ) : null}

      {headerMode === 'dynamic' ? (
        <header
          className={cn(
            'fixed inset-x-0 top-0 z-20 transition-all duration-300',
            isHeaderElevated
              ? 'border-b border-white/10 bg-background/90 backdrop-blur-md'
              : 'border-b border-transparent bg-transparent',
          )}
        >
          <div className="flex items-center gap-2 px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
            <button
              onClick={handleClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/45 backdrop-blur-sm"
              aria-label="Retour"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <p
              className={cn(
                'flex-1 truncate text-center text-sm font-semibold text-white transition-opacity duration-300',
                isHeaderElevated ? 'opacity-100' : 'opacity-0',
              )}
            >
              {title}
            </p>
            <span aria-hidden className="h-10 w-10 shrink-0" />
          </div>
        </header>
      ) : null}

      <div className={cn('min-h-0 flex-1', contentClassName)}>{children}</div>
    </div>
  )
}
