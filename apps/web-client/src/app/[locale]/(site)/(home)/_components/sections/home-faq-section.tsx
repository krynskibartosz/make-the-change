'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@make-the-change/core/ui'
import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

type HomeFaqSectionProps = {
  variant?: 'default' | 'muted'
}

export function HomeFaqSection({ variant = 'default' }: HomeFaqSectionProps) {
  const t = useTranslations('home_v2')

  const faqItems = [
    {
      id: 'money_path',
      question: t('faq.items.money_path.question'),
      answer: t('faq.items.money_path.answer'),
    },
    {
      id: 'don_vs_soutien',
      question: t('faq.items.don_vs_soutien.question'),
      answer: t('faq.items.don_vs_soutien.answer'),
    },
    {
      id: 'progression',
      question: t('faq.items.progression.question'),
      answer: t('faq.items.progression.answer'),
    },
    {
      id: 'credits',
      question: t('faq.items.credits.question'),
      answer: t('faq.items.credits.answer'),
    },
    {
      id: 'impact',
      question: t('faq.items.impact.question'),
      answer: t('faq.items.impact.answer'),
    },
    {
      id: 'products',
      question: t('faq.items.products.question'),
      answer: t('faq.items.products.answer'),
    },
  ] as const

  return (
    <section aria-labelledby="faq-title" className={variant === 'muted' ? 'bg-muted/30 py-16 md:py-20' : 'bg-background py-16 md:py-20'}>
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
        <h2 id="faq-title" className="text-left text-2xl font-bold text-foreground sm:text-3xl">{t('faq.title')}</h2>
        <p className="mt-3 max-w-2xl text-left text-sm text-muted-foreground sm:text-base">
          {t('faq.subtitle')}
        </p>

        <Accordion type="single" collapsible defaultValue="money_path" className="mt-7 space-y-3">
          {faqItems.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="overflow-hidden rounded-2xl border bg-card shadow-sm backdrop-blur-sm transition-all duration-500 hover:bg-muted/50 dark:shadow-none data-[open]:border-lime-300 data-[open]:shadow-[0_4px_32px_rgba(132,204,22,0.08)] dark:data-[open]:border-lime-500/30 border-border"
            >
              <AccordionTrigger className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left outline-none hover:no-underline [&>svg]:hidden">
                <span className="text-base font-bold text-foreground sm:text-lg">{item.question}</span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition-all duration-300 group-hover:border-lime-200 group-hover:bg-lime-50 group-hover:text-lime-600 dark:border-white/10 dark:bg-white/5 dark:text-white dark:group-hover:border-lime-500/30 dark:group-hover:bg-lime-500/20 dark:group-hover:text-lime-400 group-data-[panel-open]:border-lime-200 group-data-[panel-open]:bg-lime-50 group-data-[panel-open]:text-lime-600 dark:group-data-[panel-open]:border-lime-500/30 dark:group-data-[panel-open]:bg-lime-500/20 dark:group-data-[panel-open]:text-lime-400">
                  <Plus className="h-5 w-5 group-data-[panel-open]:hidden" aria-hidden="true" />
                  <Minus className="hidden h-5 w-5 group-data-[panel-open]:block" aria-hidden="true" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-6 pr-16 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
