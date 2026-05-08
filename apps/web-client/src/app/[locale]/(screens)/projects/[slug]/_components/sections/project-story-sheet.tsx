'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { MobileSheet } from '../ui/mobile-sheet'

type ProjectStorySheetProps = {
  description: string
  title: string
}

export function ProjectStorySheet({ description, title }: ProjectStorySheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!description) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-white/50 transition-colors hover:text-white/80"
      >
        Lire l&apos;histoire du projet
        <ChevronRight className="h-3.5 w-3.5" />
      </button>

      <MobileSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
          {description}
        </p>
      </MobileSheet>
    </>
  )
}
