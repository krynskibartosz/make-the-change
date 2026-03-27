'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

type HomeFaqSectionProps = {
  variant?: 'default' | 'muted'
}

export function HomeFaqSection({ variant = 'default' }: HomeFaqSectionProps) {
  const t = useTranslations('home_v2')
  const [openItem, setOpenItem] = useState<string | null>('model')

  const faqItems = [
    {
      id: 'model',
      question: t('faq.items.model.question'),
      answer: t('faq.items.model.answer'),
    },
    {
      id: 'freedom',
      question: t('faq.items.freedom.question'),
      answer: t('faq.items.freedom.answer'),
    },
    {
      id: 'impact',
      question: t('faq.items.impact.question'),
      answer: t('faq.items.impact.answer'),
    },
  ] as const

  return (
    <section className={variant === 'muted' ? 'bg-muted/30 py-16 md:py-20' : 'bg-background py-16 md:py-20'}>
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
        <h2 className="text-left text-2xl font-bold text-foreground sm:text-3xl">{t('faq.title')}</h2>
        <p className="mt-3 max-w-2xl text-left text-sm text-muted-foreground sm:text-base">
          {t('faq.subtitle')}
        </p>

        <ul className="m-0 mt-7 list-none space-y-3 p-0">
          {faqItems.map((item) => {
            const isOpen = openItem === item.id

            return (
              <li
                key={item.id}
                className={cn(
                  'overflow-hidden rounded-2xl border bg-card shadow-sm backdrop-blur-sm transition-all duration-500 hover:bg-muted/50 dark:shadow-none',
                  isOpen
                    ? 'border-lime-300 shadow-[0_4px_32px_rgba(132,204,22,0.08)] dark:border-lime-500/30'
                    : 'border-border',
                )}
              >
                <button
                  type="button"
                  className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left outline-none"
                  onClick={() => setOpenItem((current) => (current === item.id ? null : item.id))}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-foreground sm:text-lg">{item.question}</span>
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 transition-all duration-300 group-hover:border-lime-200 group-hover:bg-lime-50 group-hover:text-lime-600 dark:border-white/10 dark:bg-white/5 dark:text-white dark:group-hover:border-lime-500/30 dark:group-hover:bg-lime-500/20 dark:group-hover:text-lime-400',
                      isOpen && 'rotate-45 border-lime-200 bg-lime-50 text-lime-600 dark:border-lime-500/30 dark:bg-lime-500/20 dark:text-lime-400',
                    )}
                  >
                    <Plus className="h-5 w-5" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-5 pb-6 pr-16">
                        <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

