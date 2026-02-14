'use client'

import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@make-the-change/core/ui'
import { Check, Search, CreditCard, TrendingUp, Crown, MousePointer2, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

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
}

export function MarketingStepsSection({ placeholderImages }: MarketingStepsSectionProps) {
  const t = useTranslations()
  
  // Utiliser des gradients colorés comme placeholders pour éviter les problèmes d'images
  const imagePlaceholders = [
    'bg-gradient-to-br from-blue-400 to-purple-600',
    'bg-gradient-to-br from-green-400 to-blue-600', 
    'bg-gradient-to-br from-orange-400 to-red-600',
  ]
  return (
    <>
      {/* How it Works Steps */}
      <div className="relative py-24">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12 lg:space-y-24"
        >
          {/* Step 1 */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
              <div className={`relative aspect-video rounded-2xl overflow-hidden border shadow-2xl ${imagePlaceholders[0]}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <Search className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:pl-12">
              <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                1
              </div>
              <h3 className="text-3xl font-black tracking-tight">Choose Your Impact</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                Browse through our verified catalog of ethical projects and find causes that resonate with your values.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">
                  Verified Catalog
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-marketing-positive-500/5 text-marketing-positive-600 border-marketing-positive-500/10"
                >
                  Advanced Filters
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 space-y-4 lg:pr-12">
              <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                2
              </div>
              <h3 className="text-3xl font-black tracking-tight">Invest with Confidence</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                Make secure investments with full transparency and track your impact in real-time.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  'Secure Payment Processing',
                  'Total Transparency',
                  'Measurable Impact',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-bold opacity-80">
                    <div className="h-5 w-5 rounded-full bg-marketing-positive-500/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-marketing-positive-600" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative group">
              <div className="absolute -inset-4 bg-marketing-positive-500/5 rounded-3xl blur-2xl group-hover:bg-marketing-positive-500/10 transition-colors duration-500" />
              <div className={`relative aspect-video rounded-2xl overflow-hidden border shadow-2xl ${imagePlaceholders[1]}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-marketing-warning-500/5 rounded-3xl blur-2xl group-hover:bg-marketing-warning-500/10 transition-colors duration-500" />
              <div className={`relative aspect-video rounded-2xl overflow-hidden border shadow-2xl ${imagePlaceholders[2]}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:pl-12">
              <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">
                3
              </div>
              <h3 className="text-3xl font-black tracking-tight">Enjoy Your Rewards</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                Earn points, collect badges, and see the positive impact you're making in the world.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-muted/50 border text-center">
                  <p className="text-2xl font-black text-primary">
                    2,500+
                  </p>
                  <p className="text-xs font-bold uppercase opacity-60">
                    Rewards Earned
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border text-center">
                  <p className="text-2xl font-black text-marketing-positive-600">
                    50+
                  </p>
                  <p className="text-xs font-bold uppercase opacity-60">
                    Impact Badges
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Membership Tiers */}
      <div className="relative overflow-hidden py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16">Choose Your Membership</h2>
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
                    <TrendingUp className="h-8 w-8 text-marketing-neutral-600" />
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">
                  Explorer
                </CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">Free</span>
                  <span className="text-muted-foreground font-bold">/month</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <p className="text-sm text-center text-muted-foreground font-medium italic">
                  Perfect for getting started and exploring ethical investment opportunities.
                </p>
                <ul className="space-y-4">
                  {[
                    'Access to all projects',
                    'Real-time impact tracking',
                    'Monthly newsletter',
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
                    Get Started
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
                    Most Popular
                  </Badge>
                </div>
                <CardHeader className="text-center pb-8 border-b border-dashed border-primary/20">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-marketing-overlay-light shadow-xl shadow-primary/20 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                    <Shield className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary">
                    Protector
                  </CardTitle>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black">€19</span>
                    <span className="text-muted-foreground font-bold">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <p className="text-sm text-center text-muted-foreground font-medium italic">
                    For committed investors who want to maximize their positive impact.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'All Explorer features',
                      '2x points bonus',
                      'Investment certificates',
                      'Priority access to new projects',
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
                      Start Protecting
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
                    Ambassador
                  </CardTitle>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black">€49</span>
                    <span className="text-muted-foreground font-bold">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <p className="text-sm text-center text-muted-foreground font-medium italic">
                    For visionaries who want to lead the change and enjoy exclusive benefits.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'All Protector features',
                      '5,000 monthly points',
                      'Exclusive events access',
                      'VIP support & concierge',
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
                      Become Ambassador
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-24 pb-48">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] bg-marketing-neutral-950 p-8 md:p-20 text-marketing-overlay-light overflow-hidden group shadow-3xl"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent -z-0 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-marketing-positive-500/10 blur-[100px] -z-0" />

          <div className="relative z-10 text-center space-y-10">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-marketing-overlay-light/5 backdrop-blur-xl border border-marketing-overlay-light/10 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <MousePointer2 className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Ready to Make{' '}
                <span className="text-primary italic">a Difference?</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg md:text-xl text-marketing-neutral-400 font-medium leading-relaxed">
                Join thousands of investors who are already creating positive change in the world through ethical investments.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 transition-transform"
                >
                  Start Investing
                  <TrendingUp className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest border-2 border-marketing-overlay-light/10 hover:bg-marketing-overlay-light/5 transition-all"
                >
                  Explore Projects
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 opacity-40">
              <div className="flex flex-col items-center">
                <p className="text-2xl font-black">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  Secure
                </p>
              </div>
              <div className="w-px h-8 bg-marketing-overlay-light/20" />
              <div className="flex flex-col items-center">
                <p className="text-2xl font-black">24/7</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  Support
                </p>
              </div>
              <div className="w-px h-8 bg-marketing-overlay-light/20" />
              <div className="flex flex-col items-center">
                <p className="text-2xl font-black">0€</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  Entry Fee
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
