'use client'

import { ArrowLeft } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type FullScreenSlideModalProps = PropsWithChildren<{
  title?: string
  fallbackHref?: string
  className?: string
  contentClassName?: string
}>

export function FullScreenSlideModal({
  title,
  fallbackHref = '/community',
  className,
  contentClassName,
  children,
}: FullScreenSlideModalProps) {
  const router = useRouter()

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

  const handleClose = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }

    router.push(fallbackHref)
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-background h-[100dvh] w-full flex flex-col overflow-y-auto overscroll-y-contain',
        'animate-in slide-in-from-bottom-full duration-300',
        className,
      )}
    >
      <header className="sticky top-0 z-10 flex items-center gap-2 bg-background/90 backdrop-blur-md px-2 py-1 border-b border-white/5">
        <button onClick={handleClose} className="p-4" aria-label="Retour">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        {title ? <p className="truncate text-base font-semibold text-white">{title}</p> : null}
      </header>

      <div className={cn('min-h-0 flex-1', contentClassName)}>{children}</div>
    </div>
  )
}
