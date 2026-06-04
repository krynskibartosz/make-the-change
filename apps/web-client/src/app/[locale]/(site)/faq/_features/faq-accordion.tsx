'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@make-the-change/core/ui'
import { Link } from '@/i18n/navigation'
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

      <Accordion type="single" collapsible className="relative z-10 flex flex-col gap-3 px-6 mb-12">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="overflow-hidden rounded-2xl border border-white/5 bg-[#1A1F26] data-[open]:border-white/10"
          >
            <AccordionTrigger className="flex w-full items-center justify-between gap-4 p-5 text-left text-[15px] font-semibold text-white text-pretty leading-snug hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:flex-shrink-0 [&>svg]:text-gray-500 data-[panel-open]:[&>svg]:text-white/80">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="px-5 [&>div]:pt-2 [&>div]:pb-5">
              <span className="text-sm leading-relaxed text-gray-400 text-pretty">{item.a}</span>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <aside aria-labelledby="faq-footer-title" className="relative z-10 mx-6 flex flex-col items-center rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.05] to-transparent p-6 text-center">
        <h2 id="faq-footer-title" className="mb-2 text-lg font-bold text-white">{footerTitle}</h2>
        <p className="mb-6 text-sm text-gray-400 text-pretty">{footerDescription}</p>
        <Link
          href="/contact"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-lime-400 text-base font-black text-[#0B0F15] shadow-[0_0_20px_rgba(132,204,22,0.15)] transition-all active:scale-[0.98]"
        >
          {footerCta}
        </Link>
      </aside>
    </>
  )
}
