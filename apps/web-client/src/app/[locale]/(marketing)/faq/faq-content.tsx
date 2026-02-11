'use client'

import { Button } from '@make-the-change/core/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, Plus, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const FAQ_ITEM_CONFIG = [
  { id: '01', key: 'points', icon: Zap, color: 'text-marketing-warning-500' },
  { id: '02', key: 'tracking', icon: Globe, color: 'text-marketing-info-500' },
  { id: '03', key: 'payment', icon: Sparkles, color: 'text-marketing-accent-alt-500' },
  { id: '04', key: 'profile', icon: ShieldCheck, color: 'text-marketing-positive-500' },
] as const

export function FaqContent() {
  const t = useTranslations('marketing_pages.faq')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const faqs = useMemo(
    () =>
      FAQ_ITEM_CONFIG.map((config) => ({
        id: config.id,
        category: t(`items.${config.key}.category`),
        q: t(`items.${config.key}.question`),
        a: t(`items.${config.key}.answer`),
        icon: config.icon,
        color: config.color,
      })),
    [t],
  )

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase()
    if (!normalizedQuery) {
      return faqs
    }

    return faqs.filter((item) =>
      `${item.category} ${item.q} ${item.a}`.toLowerCase().includes(normalizedQuery),
    )
  }, [faqs, search])

  useEffect(() => {
    if (activeId && !filteredFaqs.some((item) => item.id === activeId)) {
      setActiveId(null)
    }
  }, [activeId, filteredFaqs])

  return (
    <div className="min-h-screen bg-marketing-neutral-50 font-sans text-marketing-neutral-900 transition-colors duration-300 selection:bg-marketing-positive-500/30 dark:bg-marketing-surface-strong dark:text-marketing-overlay-light">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-0 top-0 h-[500px] w-full bg-gradient-to-b from-marketing-positive-500/5 to-transparent dark:from-marketing-positive-900/10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay dark:opacity-10" />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-16 lg:py-24">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-marketing-positive-200 bg-marketing-positive-100/50 px-3 py-1 dark:border-marketing-positive-500/20 dark:bg-marketing-positive-500/10">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-marketing-positive-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-marketing-positive-700 dark:text-marketing-positive-300">
              {t('badge')}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-black tracking-tight text-marketing-neutral-900 dark:text-marketing-overlay-light md:text-6xl">
            {t('title')}
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-marketing-neutral-600 dark:text-marketing-neutral-400">
            {t('description')}
          </p>

          <div className="relative w-full max-w-lg">
            <div className="relative flex items-center rounded-xl border border-marketing-neutral-200 bg-marketing-overlay-light px-4 py-3 shadow-sm transition-colors focus-within:border-marketing-positive-500 focus-within:ring-1 focus-within:ring-marketing-positive-500 dark:border-marketing-overlay-light/10 dark:bg-marketing-overlay-light/5">
              <Search className="mr-3 h-5 w-5 text-marketing-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full border-none bg-transparent text-base text-marketing-neutral-900 outline-none placeholder:text-marketing-neutral-400 dark:text-marketing-overlay-light"
              />
            </div>
          </div>
        </div>

        {filteredFaqs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredFaqs.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveId(activeId === item.id ? null : item.id)}
                className={cn(
                  'group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200',
                  activeId === item.id
                    ? 'border-marketing-positive-500/30 bg-marketing-overlay-light shadow-lg dark:bg-marketing-overlay-light/10 dark:shadow-marketing-positive-900/10'
                    : 'border-marketing-neutral-200 bg-marketing-overlay-light/50 hover:border-marketing-neutral-300 hover:bg-marketing-overlay-light dark:border-marketing-overlay-light/10 dark:bg-marketing-overlay-light/5 dark:hover:border-marketing-overlay-light/20 dark:hover:bg-marketing-overlay-light/10',
                )}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <span className="hidden h-10 w-10 items-center justify-center rounded-lg bg-marketing-neutral-100 text-sm font-bold text-marketing-neutral-500 dark:bg-marketing-overlay-light/5 dark:text-marketing-neutral-400 md:flex">
                        {item.id}
                      </span>
                      <h3
                        className={cn(
                          'text-lg font-bold transition-colors md:text-xl',
                          activeId === item.id
                            ? 'text-marketing-neutral-900 dark:text-marketing-overlay-light'
                            : 'text-marketing-neutral-700 dark:text-marketing-neutral-200',
                        )}
                      >
                        {item.q}
                      </h3>
                    </div>

                    <div
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                        activeId === item.id
                          ? 'rotate-45 border-marketing-positive-500 bg-marketing-positive-500 text-marketing-overlay-light'
                          : 'border-marketing-neutral-200 bg-transparent text-marketing-neutral-400 group-hover:border-marketing-neutral-400 dark:border-marketing-overlay-light/20',
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {activeId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="pt-6 md:pl-16">
                          <p className="text-base leading-relaxed text-marketing-neutral-600 dark:text-marketing-neutral-300 md:text-lg">
                            {item.a}
                          </p>

                          <div className="mt-6 flex items-center gap-2">
                            <Button
                              asChild
                              variant="ghost"
                              className="h-9 -ml-4 rounded-lg px-4 text-sm font-medium text-marketing-positive-600 hover:bg-marketing-positive-50 hover:text-marketing-positive-700 dark:text-marketing-positive-400 dark:hover:bg-marketing-positive-500/10"
                            >
                              <Link href="/contact">
                                {t('learn_more')} <span className="ml-1">→</span>
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-marketing-neutral-300 bg-marketing-overlay-light/70 p-10 text-center dark:border-marketing-overlay-light/20 dark:bg-marketing-overlay-light/5">
            <p className="text-lg font-bold">{t('empty_title')}</p>
            <p className="mt-2 text-sm text-marketing-neutral-600 dark:text-marketing-neutral-400">
              {t('empty_description')}
            </p>
          </div>
        )}

        <div className="mt-20 border-t border-marketing-neutral-200 pt-10 text-center dark:border-marketing-overlay-light/10">
          <p className="mb-4 text-marketing-neutral-500 dark:text-marketing-neutral-400">
            {t('footer_prompt')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center text-sm font-bold text-marketing-neutral-900 transition-colors hover:text-marketing-positive-600 dark:text-marketing-overlay-light dark:hover:text-marketing-positive-400"
          >
            {t('footer_cta')}
          </Link>
        </div>
      </div>
    </div>
  )
}
