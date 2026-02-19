'use client'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { motion } from 'framer-motion'
import { Check, Crown, Leaf, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { PageHero } from '@/components/ui/page-hero'
import { Link } from '@/i18n/navigation'

export default function HowItWorksPage() {
  const t = useTranslations('how_it_works')

  const _containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const _itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <PageHero title={t('title')} description={t('subtitle')} size="lg" variant="gradient">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-marketing-positive-500/20 blur-[100px]" />
        </div>
      </PageHero>

      <MarketingSection
        title={t('tiers.title')}
        size="lg"
        variant="muted"
        className="relative overflow-hidden"
      >
        <div className="grid gap-8 md:grid-cols-3">
          {/* Explorer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <Card className="flex-1 border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur-xl transition-all hover:shadow-2xl hover:-translate-y-2 group">
              <CardHeader className="text-center pb-8 border-b border-dashed">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-marketing-neutral-100 dark:bg-marketing-neutral-800 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Leaf className="h-8 w-8 text-marketing-neutral-600" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">
                  {t('tiers.explorer.title')}
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">{t('tiers.explorer.price')}</span>
                  <span className="text-muted-foreground font-bold">{t('tiers.per_month')}</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <p className="text-sm text-center text-muted-foreground font-medium italic">
                  {t('tiers.explorer.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('tiers.explorer.features.access_projects'),
                    t('tiers.explorer.features.realtime_tracking'),
                    t('tiers.explorer.features.monthly_newsletter'),
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold opacity-80">
                      <Check className="h-4 w-4 text-marketing-positive-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button
                    variant="outline"
                    className="w-full py-6 font-black uppercase tracking-widest text-xs border-2 hover:bg-primary hover:text-marketing-overlay-light transition-colors"
                  >
                    {t('tiers.explorer.cta')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Protector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <Card className="flex-1 relative border-primary bg-primary/[0.02] backdrop-blur-xl shadow-2xl shadow-primary/10 transition-all hover:shadow-primary/20 hover:-translate-y-2 group ring-1 ring-primary/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-marketing-overlay-light border-none px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg">
                  {t('tiers.protector.badge')}
                </Badge>
              </div>
              <CardHeader className="text-center pb-8 border-b border-dashed border-primary/20">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-marketing-overlay-light shadow-xl shadow-primary/20 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary">
                  {t('tiers.protector.title')}
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">{t('tiers.protector.price')}</span>
                  <span className="text-muted-foreground font-bold">{t('tiers.per_month')}</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <p className="text-sm text-center text-muted-foreground font-medium italic">
                  {t('tiers.protector.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('tiers.protector.features.all_explorer'),
                    t('tiers.protector.features.points_bonus'),
                    t('tiers.protector.features.investment_certificate'),
                    t('tiers.protector.features.priority_access'),
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/projects" className="block">
                  <Button className="w-full py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                    {t('tiers.protector.cta')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ambassador */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <Card className="flex-1 border-[hsl(var(--border)/0.5)] bg-background/70 backdrop-blur-xl transition-all hover:shadow-2xl hover:-translate-y-2 group">
              <CardHeader className="text-center pb-8 border-b border-dashed">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-marketing-warning-100 dark:bg-marketing-warning-900/30 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Crown className="h-8 w-8 text-marketing-warning-600" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">
                  {t('tiers.ambassador.title')}
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">{t('tiers.ambassador.price')}</span>
                  <span className="text-muted-foreground font-bold">{t('tiers.per_month')}</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <p className="text-sm text-center text-muted-foreground font-medium italic">
                  {t('tiers.ambassador.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    t('tiers.ambassador.features.all_protector'),
                    t('tiers.ambassador.features.monthly_points'),
                    t('tiers.ambassador.features.events'),
                    t('tiers.ambassador.features.vip_support'),
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold opacity-80">
                      <Check className="h-4 w-4 text-marketing-warning-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button
                    variant="outline"
                    className="w-full py-6 font-black uppercase tracking-widest text-xs border-2 hover:bg-marketing-warning-600 hover:border-marketing-warning-600 hover:text-marketing-overlay-light transition-colors"
                  >
                    {t('tiers.ambassador.cta')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </MarketingSection>
    </>
  )
}
