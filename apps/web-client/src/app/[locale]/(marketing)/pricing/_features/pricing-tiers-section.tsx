'use client'

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import { motion } from 'framer-motion'
import { Check, Crown, Leaf, Shield } from 'lucide-react'
import { MarketingSection } from '@/app/[locale]/(marketing)/_features/marketing-section'
import { Link } from '@/i18n/navigation'
import type { PricingTiersProps } from './pricing.types'

export function PricingTiersSection({
  sectionTitle,
  explorer,
  protector,
  ambassador,
}: PricingTiersProps) {
  return (
    <MarketingSection
      title={sectionTitle}
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
                {explorer.title}
              </CardTitle>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black">{explorer.price}</span>
                <span className="text-muted-foreground font-bold">{explorer.perMonth}</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <p className="text-sm text-center text-muted-foreground font-medium italic">
                {explorer.description}
              </p>
              <ul className="space-y-4">
                {explorer.features.map((feat, i) => (
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
                  {explorer.cta}
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
                {protector.badge}
              </Badge>
            </div>
            <CardHeader className="text-center pb-8 border-b border-dashed border-primary/20">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-marketing-overlay-light shadow-xl shadow-primary/20 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary">
                {protector.title}
              </CardTitle>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black">{protector.price}</span>
                <span className="text-muted-foreground font-bold">{protector.perMonth}</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <p className="text-sm text-center text-muted-foreground font-medium italic">
                {protector.description}
              </p>
              <ul className="space-y-4">
                {protector.features.map((feat, i) => (
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
                  {protector.cta}
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
                {ambassador.title}
              </CardTitle>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black">{ambassador.price}</span>
                <span className="text-muted-foreground font-bold">{ambassador.perMonth}</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <p className="text-sm text-center text-muted-foreground font-medium italic">
                {ambassador.description}
              </p>
              <ul className="space-y-4">
                {ambassador.features.map((feat, i) => (
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
                  {ambassador.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MarketingSection>
  )
}
