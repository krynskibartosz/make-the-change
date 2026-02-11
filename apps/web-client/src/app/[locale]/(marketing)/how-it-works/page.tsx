'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@make-the-change/core/ui'
import { ArrowRight, Check, CreditCard, Crown, Gift, Leaf, Search, Shield, MousePointer2, Sparkles, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PageHero } from '@/components/ui/page-hero'
import { SectionContainer } from '@/components/ui/section-container'
import { Link } from '@/i18n/navigation'
import { placeholderImages } from '@/lib/placeholder-images'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function HowItWorksPage() {
  const t = useTranslations('how_it_works')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <>
      <PageHero
        badge={
          <span className="flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            Guide Interactif
          </span>
        }
        title={t('title')}
        description={t('subtitle')}
        size="lg"
        variant="gradient"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-emerald-500/20 blur-[100px]" />
        </div>
      </PageHero>

      <SectionContainer size="lg" className="relative">
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
              <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl">
                <img src={placeholderImages.projects[0]} alt="Step 1" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <Search className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:pl-12">
              <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">1</div>
              <h3 className="text-3xl font-black tracking-tight">{t('steps.choose.title')}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {t('steps.choose.description')}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10">Catalogue vérifié</Badge>
                <Badge variant="secondary" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/10">Filtres avancés</Badge>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1 space-y-4 lg:pr-12">
              <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">2</div>
              <h3 className="text-3xl font-black tracking-tight">{t('steps.invest.title')}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {t('steps.invest.description')}
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Paiement 100% sécurisé",
                  "Transparence totale des flux",
                  "Impact mesurable dès 1€"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-bold opacity-80">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative group">
              <div className="absolute -inset-4 bg-emerald-500/5 rounded-3xl blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
              <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl">
                <img src={placeholderImages.projects[1]} alt="Step 2" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
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
              <div className="absolute -inset-4 bg-orange-500/5 rounded-3xl blur-2xl group-hover:bg-orange-500/10 transition-colors duration-500" />
              <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-2xl">
                <img src={placeholderImages.projects[2]} alt="Step 3" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-4 lg:pl-12">
              <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-lg shadow-primary/20">3</div>
              <h3 className="text-3xl font-black tracking-tight">{t('steps.enjoy.title')}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                {t('steps.enjoy.description')}
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-muted/50 border text-center">
                  <p className="text-2xl font-black text-primary">Points</p>
                  <p className="text-xs font-bold uppercase opacity-60">Récompenses</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border text-center">
                  <p className="text-2xl font-black text-emerald-600">Badges</p>
                  <p className="text-xs font-bold uppercase opacity-60">Impact</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </SectionContainer>

      <SectionContainer title={t('tiers.title')} size="lg" variant="muted" className="relative overflow-hidden">
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
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Leaf className="h-8 w-8 text-slate-600" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">{t('tiers.explorer.title')}</CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">{t('tiers.explorer.price')}</span>
                  <span className="text-muted-foreground font-bold">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <p className="text-sm text-center text-muted-foreground font-medium italic">
                  {t('tiers.explorer.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    "Accès à tous les projets",
                    "Suivi de l'impact en temps réel",
                    "Newsletter mensuelle exclusive"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold opacity-80">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full py-6 font-black uppercase tracking-widest text-xs border-2 hover:bg-primary hover:text-white transition-colors">
                    Commencer l'aventure
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
                <Badge className="bg-primary text-white border-none px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg">Le plus prisé</Badge>
              </div>
              <CardHeader className="text-center pb-8 border-b border-dashed border-primary/20">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 transition-transform group-hover:scale-110 group-hover:-rotate-3">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary">{t('tiers.protector.title')}</CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">{t('tiers.protector.price')}</span>
                  <span className="text-muted-foreground font-bold">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <p className="text-sm text-center text-muted-foreground font-medium italic">
                  {t('tiers.protector.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    "Tout Explorer inclus",
                    "Bonus de points (30-50%)",
                    "Certificat d'investissement officiel",
                    "Accès prioritaire aux projets"
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
                    Devenir Protecteur
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
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">{t('tiers.ambassador.title')}</CardTitle>
                <div className="mt-4 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">{t('tiers.ambassador.price')}</span>
                  <span className="text-muted-foreground font-bold">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <p className="text-sm text-center text-muted-foreground font-medium italic">
                  {t('tiers.ambassador.description')}
                </p>
                <ul className="space-y-4">
                  {[
                    "Tout Protecteur inclus",
                    "Points mensuels automatiques",
                    "Événements & Meetups exclusifs",
                    "Support VIP prioritaire"
                  ].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold opacity-80">
                      <Check className="h-4 w-4 text-amber-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button variant="outline" className="w-full py-6 font-black uppercase tracking-widest text-xs border-2 hover:bg-amber-600 hover:border-amber-600 hover:text-white transition-colors">
                    Rejoindre l'élite
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </SectionContainer>

      <SectionContainer size="lg" className="pb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] bg-slate-950 p-8 md:p-20 text-white overflow-hidden group shadow-3xl"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent -z-0 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] -z-0" />
          
          <div className="relative z-10 text-center space-y-10">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <MousePointer2 className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Prêt à faire <span className="text-primary italic">le changement ?</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                Rejoignez une communauté de milliers d'investisseurs qui transforment déjà leur épargne en impact concret.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
                  Créer mon compte
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest border-2 border-white/10 hover:bg-white/5 transition-all">
                  Voir les projets
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-8 opacity-40">
              <div className="flex flex-col items-center">
                <p className="text-2xl font-black">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Sécure</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex flex-col items-center">
                <p className="text-2xl font-black">24/7</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Support</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex flex-col items-center">
                <p className="text-2xl font-black">0€</p>
                <p className="text-[10px] font-bold uppercase tracking-widest">Frais d'entrée</p>
              </div>
            </div>
          </div>
        </motion.div>
      </SectionContainer>
    </>
  )
}
