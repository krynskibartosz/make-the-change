'use client'

import { motion, type Variants } from 'framer-motion'
import {  Bird, Flame, ArrowRight , Sprout } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { MarketingSection } from '../../_features/marketing-section'

type HomeGamificationSectionProps = {
  variant?: 'default' | 'muted'
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function HomeGamificationSection({ variant = 'default' }: HomeGamificationSectionProps) {
  const t = useTranslations('home_v2')

  return (
    <MarketingSection
      title={t('gamification.title')}
      description={t('gamification.description')}
      variant={variant}
      size="lg"
      className="overflow-hidden bg-[#121619] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(126,211,33,0.12),transparent_60%)]"
        aria-hidden="true"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="grid gap-4"
      >
        {/* Card 1: BioDex */}
        <motion.article
          variants={itemVariants}
          className="group relative mb-4 flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
        >
          {/* Image layer */}
          <div className="absolute inset-0 z-0">
            {/* Dark gradient overlay — cross-platform safe (no WebKit `to-transparent` bug) */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
            <img
              src="/images/chouette-effrai.png"
              alt="Chouette Effraie"
              className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
            />
          </div>

          {/* Text content — z-20 to stay above gradient */}
          <div className="relative z-20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-500/20 px-3 py-1.5 backdrop-blur-md">
              <Bird className="h-4 w-4 text-lime-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-lime-400">
                BioDex
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              Chouette Effraie
            </h3>
            <p className="mt-2 max-w-[200px] text-sm font-bold text-lime-400">
              Espèce découverte !
            </p>
          </div>
        </motion.article>

        <div className="grid grid-cols-2 gap-3">
          {/* Card 2: Streak */}
          <motion.article
            variants={itemVariants}
            className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md"
          >
            <div className="flex justify-between items-start w-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                <Flame className="h-5 w-5 shrink-0 animate-pulse" />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.8 }}
                className="px-1.5 py-0.5 rounded-full bg-lime-500/10 text-lime-400 text-[10px] font-bold tabular-nums whitespace-nowrap shrink-0"
              >
                +150 <Sprout className="inline h-[1.2em] w-[1.2em] align-text-bottom text-lime-400" />
              </motion.div>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <h3 className="min-w-0 break-words text-left text-sm font-bold leading-tight text-white">Série 7 jours</h3>

              <div className="relative h-1.5 w-full">
                {/* Track (empty) */}
                <div className="absolute inset-0 flex gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-1.5 flex-1 rounded-full bg-white/10" />
                  ))}
                </div>

                {/* Animated filled segments */}
                <motion.div
                  initial={{ width: '0%' }}
                  whileInView={{ width: '71.4%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                  className="absolute left-0 top-0 flex h-1.5 w-full gap-1 overflow-hidden"
                >
                  <div className="flex w-full min-w-full gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < 5 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="min-w-0">
              <p className="mt-1 min-w-0 text-[11px] leading-tight text-muted-foreground line-clamp-3 overflow-hidden text-ellipsis">
                Gardez le rythme au quotidien et gagnez des Graines bonus.
              </p>
            </div>
          </motion.article>

          {/* Card 3: Faction (Teasing — Sans Faction) */}
          <motion.div variants={itemVariants} className="h-full">
            <Link
              href="/onboarding"
              className="relative col-span-1 flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-[#1A1F26] to-[#0B0F15] p-5 group active:scale-[0.98] transition-transform"
            >
              {/* Glow subtil */}
              <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-2xl transition-colors duration-500 group-hover:bg-white/10" />

              {/* Avatar Stack — 3 mascottes superposées (Premium) */}
              <div className="relative z-10 mb-3 mt-1 flex items-center pl-1">
                <div className="relative z-30 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#0B0F15] shadow-lg ring-2 ring-[#1A1F26] transition-transform duration-300 group-hover:-translate-y-1">
                  <img src="/sylva.png" alt="Terres et Forêts" className="mt-1 h-[120%] w-[120%] object-contain" />
                </div>
                <div className="relative z-20 -ml-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#0B0F15] shadow-lg ring-2 ring-[#1A1F26] transition-transform delay-75 duration-300 group-hover:-translate-y-1">
                  <img src="/abeille-transparente.png" alt="Vie Sauvage" className="mt-1 h-[120%] w-[120%] object-contain" />
                </div>
                <div className="relative z-10 -ml-4 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#0B0F15] shadow-lg ring-2 ring-[#1A1F26] transition-transform delay-150 duration-300 group-hover:-translate-y-1">
                  <img src="/aura.png" alt="Artisans Locaux" className="mt-1 h-[120%] w-[120%] object-contain" />
                </div>
                <div className="relative z-40 -ml-3 flex h-7 w-7 items-center justify-center rounded-full border border-lime-400/20 bg-lime-400/10 shadow-sm backdrop-blur-md transition-all group-hover:scale-110 group-hover:bg-lime-400/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="3">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </div>

              {/* CTA */}
              <div className="relative z-10 mt-auto min-w-0">
                <span className="mb-1 block text-[9px] font-black uppercase tracking-widest text-gray-500">Votre aventure</span>
                <h3 className="mb-1.5 text-sm font-bold leading-tight text-white transition-colors group-hover:text-lime-400">
                  Choisissez un camp
                </h3>
                <p className="line-clamp-2 text-[10px] leading-relaxed text-gray-400">
                  Sélectionnez votre compagnon et rejoignez l&apos;effort collectif.
                </p>
              </div>
            </Link>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-4">
          <Link
            href="/community"
            className="group flex w-full items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-5 font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
          >
            Découvrir l'aventure
            <ArrowRight className="h-5 w-5 text-lime-400 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </MarketingSection>
  )
}
