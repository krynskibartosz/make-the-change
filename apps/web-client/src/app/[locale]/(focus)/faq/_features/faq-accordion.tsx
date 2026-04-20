'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { FaqViewModel } from './faq.types'

type FaqAccordionProps = Pick<
  FaqViewModel,
  'items' | 'footerTitle' | 'footerDescription' | 'footerCta'
>

export function FaqAccordion({
  items,
  footerTitle,
  footerDescription,
  footerCta,
}: FaqAccordionProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        })}
      </script>

      <div className="relative z-10 flex flex-col gap-3 px-6 mb-12">
        {items.map((item) => {
          const isOpen = activeId === item.id
          return (
            <div
              key={item.id}
              className={cn(
                'overflow-hidden rounded-2xl border bg-[#1A1F26] transition-all duration-300',
                isOpen ? 'border-white/10' : 'border-white/5',
              )}
            >
              <button
                type="button"
                onClick={() => setActiveId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-[15px] font-semibold text-white text-pretty leading-snug">
                  {item.q}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-300',
                    isOpen && 'rotate-180 text-white/80',
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${item.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pt-2 pb-5 text-sm leading-relaxed text-gray-400 text-pretty">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="relative z-10 mx-6 flex flex-col items-center rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.05] to-transparent p-6 text-center">
        <p className="mb-2 text-lg font-bold text-white">{footerTitle}</p>
        <p className="mb-6 text-sm text-gray-400 text-pretty">{footerDescription}</p>
        <Link
          href="/contact"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-lime-400 text-base font-black text-[#0B0F15] shadow-[0_0_20px_rgba(132,204,22,0.15)] transition-all active:scale-[0.98]"
        >
          {footerCta}
        </Link>
      </div>
    </>
  )
}
