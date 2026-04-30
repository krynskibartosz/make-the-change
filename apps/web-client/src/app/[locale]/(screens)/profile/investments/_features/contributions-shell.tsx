'use client'

import { ChevronLeft } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'

type ContributionsShellProps = PropsWithChildren<{
  title?: string
}>

export function ContributionsShell({ title = 'Historique', children }: ContributionsShellProps) {
  const router = useRouter()

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }
    router.push('/dashboard')
  }

  useEffect(() => {
    // Hide mobile bottom nav when shell is active
    const bottomNav = document.getElementById('mobile-bottom-nav')
    if (bottomNav) {
      bottomNav.style.display = 'none'
    }

    return () => {
      // Restore mobile bottom nav when shell is unmounted
      if (bottomNav) {
        bottomNav.style.display = ''
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex h-[100dvh] w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#0B0F15] pb-12 text-white scrollbar-gutter-stable">
      {/* Halo lumineux */}
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-64 w-full -translate-x-1/2 bg-lime-500/5 blur-[100px]" />

      {/* Header fixed glass */}
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
          <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-white/80">
            {title}
          </span>
        </div>
      </header>

      {children}
    </div>
  )
}
