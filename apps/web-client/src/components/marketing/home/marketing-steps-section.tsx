'use client'

import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@make-the-change/core/ui'
import { Check, Search, CreditCard, TrendingUp, Crown, MousePointer2, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { MarketingSection } from '../marketing-section'

// Animation variants for motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
} as const

interface MarketingStepsSectionProps {
  placeholderImages: {
    projects: string[]
  }
  variant?: 'default' | 'muted'
}

const placeholderImages = {
  projects: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
  ],
  products: [
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=900&q=80',
  ],
  categories: {
    default:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    bien_etre:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    maison:
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80',
    alimentation:
      'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=900&q=80',
    eco: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
  },
  profileCovers: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=80',
  ],
}

export function MarketingStepsSection({ variant = 'default' }: MarketingStepsSectionProps) {
  const t = useTranslations('home')

  // Utiliser des gradients colorés comme placeholders pour éviter les problèmes d'images
  const imagePlaceholders = [
    'bg-gradient-to-br from-blue-400 to-purple-600',
    'bg-gradient-to-br from-green-400 to-blue-600',
    'bg-gradient-to-br from-orange-400 to-red-600',
  ]
  return (
    <>
      <MarketingSection title={"How it works"} size="lg" className="relative" variant={variant}>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block -z-10" aria-hidden="true" />

        <motion.ol
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12 lg:space-y-24 list-none m-0 p-0"
        >
          {/* Step 1 */}
          <motion.li variants={itemVariants} className="grid lg:grid-cols-2 gap-8 items-center">
            <figure className="relative group m-0">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl group-hover:bg-primary/10 transition-colors duration-500" aria-hidden="true" />
              <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl">
                <img
                  src={placeholderImages.projects[0]}
                  alt={t('steps.choose.title')}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-4 left-4 p-3 bg-marketing-overlay-light/10 backdrop-blur-md rounded-xl border border-marketing-overlay-light/20">
                  <Search className="h-6 w-6 text-marketing-overlay-light" aria-hidden="true" />
                </div>
              </div>
            </figure>
            <div className="space-y-4 lg:pl-12">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                  1
                </div>
                <h3 className="text-3xl font-black tracking-tight">{t('steps.choose.title')}</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {t('steps.choose.description')}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                  {t('steps.choose.badges.verified_catalog')}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-marketing-positive-500/5 text-marketing-positive-600 border-marketing-positive-500/10"
                >
                  {t('steps.choose.badges.advanced_filters')}
                </Badge>
              </div>
            </div>
          </motion.li>

          {/* Step 2 */}
          <motion.li variants={itemVariants} className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 space-y-4 lg:pr-12">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                  2
                </div>
                <h3 className="text-3xl font-black tracking-tight">{t('steps.invest.title')}</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {t('steps.invest.description')}
              </p>
              <ul className="space-y-3 pt-2 list-none m-0 p-0">
                {[
                  t('steps.invest.features.payment_secure'),
                  t('steps.invest.features.total_transparency'),
                  t('steps.invest.features.measurable_impact'),
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold opacity-80">
                    <span className="h-5 w-5 rounded-full bg-marketing-positive-500/10 flex items-center justify-center" aria-hidden="true">
                      <Check className="h-3 w-3 text-marketing-positive-600" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="order-1 lg:order-2 relative group m-0">
              <div className="absolute -inset-4 bg-marketing-positive-500/5 rounded-3xl blur-2xl group-hover:bg-marketing-positive-500/10 transition-colors duration-500" aria-hidden="true" />
              <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl">
                <img
                  src={placeholderImages.projects[1]}
                  alt={t('steps.invest.title')}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-4 left-4 p-3 bg-marketing-overlay-light/10 backdrop-blur-md rounded-xl border border-marketing-overlay-light/20">
                  <CreditCard className="h-6 w-6 text-marketing-overlay-light" aria-hidden="true" />
                </div>
              </div>
            </figure>
          </motion.li>

          {/* Step 3 */}
          <motion.li variants={itemVariants} className="grid lg:grid-cols-2 gap-8 items-center">
            <figure className="relative group m-0">
              <div className="absolute -inset-4 bg-marketing-warning-500/5 rounded-3xl blur-2xl group-hover:bg-marketing-warning-500/10 transition-colors duration-500" aria-hidden="true" />
              <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl">
                <img
                  src={placeholderImages.projects[2]}
                  alt={t('steps.impact.title')}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-marketing-overlay-dark/60 via-transparent to-transparent" aria-hidden="true" />
                <div className="absolute bottom-4 left-4 p-3 bg-marketing-overlay-light/10 backdrop-blur-md rounded-xl border border-marketing-overlay-light/20">
                  <TrendingUp className="h-6 w-6 text-marketing-overlay-light" aria-hidden="true" />
                </div>
              </div>
            </figure>
            <div className="space-y-4 lg:pl-12">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                  3
                </div>
                <h3 className="text-3xl font-black tracking-tight">{t('steps.enjoy.title')}</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {t('steps.enjoy.description')}
              </p>
              <dl className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-muted/50 border text-center flex flex-col-reverse gap-1">
                  <dt className="text-xs font-bold uppercase opacity-60 m-0">
                    {t('steps.enjoy.metrics.rewards')}
                  </dt>
                  <dd className="text-2xl font-black text-primary m-0">
                    {t('steps.enjoy.metrics.points')}
                  </dd>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border text-center flex flex-col-reverse gap-1">
                  <dt className="text-xs font-bold uppercase opacity-60 m-0">
                    {t('steps.enjoy.metrics.impact')}
                  </dt>
                  <dd className="text-2xl font-black text-marketing-positive-600 m-0">
                    {t('steps.enjoy.metrics.badges')}
                  </dd>
                </div>
              </dl>
            </div>
          </motion.li>
        </motion.ol>
      </MarketingSection>


    </>
  )
}
