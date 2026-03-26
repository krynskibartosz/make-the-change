'use client'

import { motion, useReducedMotion, useScroll } from 'framer-motion'
import { Check, Gift, HandCoins, Leaf } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'
import { MarketingSection } from '../../_features/marketing-section'

type MarketingStepsSectionProps = {
  variant?: 'default' | 'muted'
}

export const MarketingStepsSection = ({ variant = 'default' }: MarketingStepsSectionProps) => {
  const t = useTranslations('home_v2')
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  const steps = [
    {
      id: 'step-1',
      title: t('how_it_works.step_1.title'),
      description: t('how_it_works.step_1.description'),
      icon: Leaf,
    },
    {
      id: 'step-2',
      title: '2. Soutenez & Cumulez',
      description: t('how_it_works.step_2.description'),
      icon: HandCoins,
      checks: [t('how_it_works.step_2.check_secure'), t('how_it_works.step_2.check_verified')],
    },
    {
      id: 'step-3',
      title: t('how_it_works.step_3.title'),
      description: t('how_it_works.step_3.description'),
      icon: Gift,
    },
  ] as const

  return (
    <MarketingSection
      title={t('how_it_works.title')}
      variant={variant}
      size="lg"
      className="py-20 md:py-24 dark:!bg-black"
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative" ref={containerRef}>
          {prefersReducedMotion ? (
            <div className="absolute left-6 top-2 h-[calc(100%-0.5rem)] w-px bg-muted dark:bg-primary/20" />
          ) : (
            <>
              {/* Track fixe transparent */}
              <div
                className="absolute left-6 top-2 h-[calc(100%-0.5rem)] w-px bg-muted dark:bg-primary/20"
                aria-hidden="true"
              />
              {/* Ligne animée Framer Motion */}
              <motion.div
                aria-hidden="true"
                className="absolute left-6 top-2 h-[calc(100%-0.5rem)] w-px origin-top bg-lime-500"
                style={{ scaleY: scrollYProgress }}
              />
            </>
          )}

          <ol className="m-0 list-none space-y-7 p-0">
            {steps.map((step, index) => {
              const Icon = step.icon

              const content = (
                <div className="py-2">
                  <h3 className="mb-2 text-left text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-left text-base text-muted-foreground text-pretty">
                    {step.description}
                  </p>
                  {'checks' in step ? (
                    <ul className="m-0 mt-4 flex flex-col gap-2 list-none p-0 text-left text-sm font-medium text-muted-foreground">
                      {step.checks.map((check) => (
                        <li key={check} className="flex items-center gap-2">
                          <Check size={16} className="shrink-0 text-lime-600 dark:text-lime-500" aria-hidden="true" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )

              return (
                <li key={step.id} className="relative pl-16">
                  {/* Glassmorphism Icon Circle */}
                  <div className="absolute left-0 top-1.5 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-lime-200 bg-lime-100 text-lime-600 backdrop-blur-sm dark:border-lime-500/50 dark:bg-lime-900/30 dark:text-lime-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">{index + 1}</span>
                  </div>

                  {prefersReducedMotion ? (
                    content
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.1 }}
                    >
                      {content}
                    </motion.div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </MarketingSection>
  )
}
