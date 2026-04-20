'use client'

import { ChevronLeft } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useRouter } from '@/i18n/navigation'

type BlogShellProps = PropsWithChildren<{
  title?: string
}>

export function BlogShell({ title = 'Blog', children }: BlogShellProps) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }
    router.push('/')
  }

  return (
    <div className="fixed inset-0 z-40 flex h-[100dvh] w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#0B0F15] pb-12 text-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0F15]/80 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-xl">
        <div className="relative flex h-12 items-center">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 truncate max-w-[60%] text-sm font-medium text-white/80">
            {title}
          </span>
        </div>
      </header>

      {children}
    </div>
  )
}
