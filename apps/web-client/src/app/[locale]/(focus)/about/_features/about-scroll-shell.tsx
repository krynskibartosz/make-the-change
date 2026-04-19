'use client'

import { ChevronLeft } from 'lucide-react'
import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type AboutScrollShellProps = PropsWithChildren<{
  title?: string
}>

export function AboutScrollShell({ title = 'À propos', children }: AboutScrollShellProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isElevated, setIsElevated] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const next = container.scrollTop > 150
      setIsElevated((prev) => (prev === next ? prev : next))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }
    router.push('/')
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex h-[100dvh] w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#0D1117] text-white"
    >
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isElevated
            ? 'border-b border-white/5 bg-[#0D1117]/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="flex items-center gap-2 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/45 backdrop-blur-sm transition hover:bg-black/60 active:scale-95"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <p
            className={cn(
              'flex-1 truncate text-center text-sm font-semibold text-white transition-opacity duration-300',
              isElevated ? 'opacity-100' : 'opacity-0',
            )}
          >
            {title}
          </p>
          <span aria-hidden className="h-10 w-10 shrink-0" />
        </div>
      </header>

      {children}
    </div>
  )
}
