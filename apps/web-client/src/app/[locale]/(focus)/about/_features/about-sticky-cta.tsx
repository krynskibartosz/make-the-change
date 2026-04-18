'use client'

import { ArrowRight } from 'lucide-react'
import { useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import type { AboutCtaProps } from './about.types'

export function AboutStickyCta({ label }: AboutCtaProps) {
  const router = useRouter()

  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return
    }
    router.push('/')
  }, [router])

  return (
    <>
      {/* Spacer so content is never hidden behind the fixed bar */}
      <div aria-hidden="true" className="h-28" />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-6">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/70 to-transparent" />

        <div className="pointer-events-auto relative mx-auto max-w-md rounded-full bg-black/40 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={handleClick}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-4 text-base font-bold text-white shadow-[0_0_32px_-4px_rgba(16,185,129,0.6)] transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]"
          >
            <span>{label}</span>
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </>
  )
}
