'use client'

import { Badge } from '@make-the-change/core/ui'
import { motion } from 'framer-motion'
import { Check, CreditCard, Search, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MarketingSection } from '../../_features/marketing-section'

type MarketingStepsSectionProps = {
  placeholderImages?: {
    projects: string[]
  }
  variant?: 'default' | 'muted'
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
} as const

const defaultProjectImages = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
]

export const MarketingStepsSection = ({
  placeholderImages,
  variant = 'default',
}: MarketingStepsSectionProps) => {
  const t = useTranslations('home')

  const projectImages =
    placeholderImages && placeholderImages.projects.length >= 3
      ? placeholderImages.projects
      : defaultProjectImages

  const investFeatures = [
    t('steps.invest.features.payment_secure'),
    t('steps.invest.features.total_transparency'),
    t('steps.invest.features.measurable_impact'),
  ]

  const enjoyMetrics = [
    {
      label: t('steps.enjoy.metrics.rewards'),
      value: t('steps.enjoy.metrics.points'),
      valueClassName: 'text-primary',
    },
    {
      label: t('steps.enjoy.metrics.impact'),
      value: t('steps.enjoy.metrics.badges'),
      valueClassName: 'text-marketing-positive-600',
    },
  ]

  return (
    <MarketingSection title="How it works" size="lg" className="relative" variant={variant}>
      <div
        className="absolute bottom-0 left-1/2 top-0 -z-10 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent lg:block"
        aria-hidden="true"
      />

      <motion.ol
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="m-0 list-none space-y-12 p-0 lg:space-y-24"
      >
        <motion.li variants={itemVariants} className="grid items-center gap-8 lg:grid-cols-2">
          <figure className="group relative m-0">
            <div
              className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl transition-colors duration-500 group-hover:bg-primary/10"
              aria-hidden="true"
            />
            <div className="relative aspect-video overflow-hidden rounded-2xl border shadow-2xl">
              <img
                src={projectImages[0]}
                alt={t('steps.choose.title')}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 left-4 rounded-xl border border-marketing-overlay-light/20 bg-marketing-overlay-light/10 p-3 backdrop-blur-md">
                <Search className="h-6 w-6 text-marketing-overlay-light" aria-hidden="true" />
              </div>
            </div>
          </figure>

          <div className="space-y-4 lg:pl-12">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                1
              </div>
              <h3 className="text-3xl font-black tracking-tight">{t('steps.choose.title')}</h3>
            </div>
            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
              {t('steps.choose.description')}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Badge variant="secondary" className="border-primary/10 bg-primary/5 text-primary">
                {t('steps.choose.badges.verified_catalog')}
              </Badge>
              <Badge
                variant="secondary"
                className="border-marketing-positive-500/10 bg-marketing-positive-500/5 text-marketing-positive-600"
              >
                {t('steps.choose.badges.advanced_filters')}
              </Badge>
            </div>
          </div>
        </motion.li>

        <motion.li variants={itemVariants} className="grid items-center gap-8 lg:grid-cols-2">
          <div className="order-2 space-y-4 lg:order-1 lg:pr-12">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                2
              </div>
              <h3 className="text-3xl font-black tracking-tight">{t('steps.invest.title')}</h3>
            </div>
            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
              {t('steps.invest.description')}
            </p>
            <ul className="m-0 list-none space-y-3 p-0 pt-2">
              {investFeatures.map((feature, index) => (
                <li
                  key={`${feature}-${index}`}
                  className="flex items-center gap-2 text-sm font-bold opacity-80"
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-marketing-positive-500/10"
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3 text-marketing-positive-600" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <figure className="group relative order-1 m-0 lg:order-2">
            <div
              className="absolute -inset-4 rounded-3xl bg-marketing-positive-500/5 blur-2xl transition-colors duration-500 group-hover:bg-marketing-positive-500/10"
              aria-hidden="true"
            />
            <div className="relative aspect-video overflow-hidden rounded-2xl border shadow-2xl">
              <img
                src={projectImages[1]}
                alt={t('steps.invest.title')}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 left-4 rounded-xl border border-marketing-overlay-light/20 bg-marketing-overlay-light/10 p-3 backdrop-blur-md">
                <CreditCard className="h-6 w-6 text-marketing-overlay-light" aria-hidden="true" />
              </div>
            </div>
          </figure>
        </motion.li>

        <motion.li variants={itemVariants} className="grid items-center gap-8 lg:grid-cols-2">
          <figure className="group relative m-0">
            <div
              className="absolute -inset-4 rounded-3xl bg-marketing-warning-500/5 blur-2xl transition-colors duration-500 group-hover:bg-marketing-warning-500/10"
              aria-hidden="true"
            />
            <div className="relative aspect-video overflow-hidden rounded-2xl border shadow-2xl">
              <img
                src={projectImages[2]}
                alt={t('steps.impact.title')}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 left-4 rounded-xl border border-marketing-overlay-light/20 bg-marketing-overlay-light/10 p-3 backdrop-blur-md">
                <TrendingUp className="h-6 w-6 text-marketing-overlay-light" aria-hidden="true" />
              </div>
            </div>
          </figure>

          <div className="space-y-4 lg:pl-12">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                3
              </div>
              <h3 className="text-3xl font-black tracking-tight">{t('steps.enjoy.title')}</h3>
            </div>
            <p className="text-lg font-medium leading-relaxed text-muted-foreground">
              {t('steps.enjoy.description')}
            </p>

            <dl className="grid grid-cols-2 gap-4 pt-2">
              {enjoyMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col-reverse gap-1 rounded-xl border bg-muted/50 p-4 text-center"
                >
                  <dt className="m-0 text-xs font-bold uppercase opacity-60">{metric.label}</dt>
                  <dd className={`m-0 text-2xl font-black ${metric.valueClassName}`}>
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.li>
      </motion.ol>
    </MarketingSection>
  )
}
