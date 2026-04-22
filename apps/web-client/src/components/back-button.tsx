'use client'

import { ChevronLeft } from 'lucide-react'

export function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      aria-label="Retour"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white transition-colors hover:bg-white/10"
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
  )
}
