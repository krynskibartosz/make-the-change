'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface AccordionSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function AccordionSection({ title, children, defaultOpen = false }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mx-5 rounded-3xl border border-white/5 bg-[#1C1C22]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="font-bold text-white">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-white/50 transition-transform" />
        ) : (
          <ChevronDown className="h-5 w-5 text-white/50 transition-transform" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 transition-all duration-300 ease-in-out">
          <div className="text-sm text-white/70">{children}</div>
        </div>
      )}
    </div>
  )
}
