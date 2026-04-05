'use client'

import { motion, type Variants } from 'framer-motion'
import { Bird, Flame, Users, ArrowRight } from 'lucide-react'
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
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
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

        <div className="grid grid-cols-2 gap-4">
          {/* Card 2: Streak */}
          <motion.article
            variants={itemVariants}
            className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                  <Flame className="h-6 w-6 animate-pulse" />
                </div>
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.8 }}
                  className="inline-flex items-center gap-1 rounded-full border border-lime-500/30 bg-lime-500/20 px-2.5 py-1 text-[11px] font-black tracking-wide text-lime-400 shadow-[0_0_12px_rgba(132,204,22,0.25)]"
                >
                  +150 Graines 🌱
                </motion.span>
              </div>
              <h3 className="text-left text-lg font-bold text-white">Série 7 jours</h3>

              <div className="relative mt-3 h-1.5 w-full">
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

            <p className="mt-auto pt-4 text-left text-xs leading-relaxed text-white/60">
              <span aria-hidden="true">🔥</span> Gardez le rythme au quotidien et gagnez des Graines bonus.
            </p>
          </motion.article>

          {/* Card 3: Tribes */}
          <motion.article
            variants={itemVariants}
            className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex -space-x-2">
                  <img
                    className="h-7 w-7 rounded-full border-2 border-[#1a1f24] object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Membre de la tribu"
                  />
                  <img
                    className="h-7 w-7 rounded-full border-2 border-[#1a1f24] object-cover"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80"
                    alt="Membre de la tribu"
                  />
                  <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1a1f24] bg-blue-500 text-[9px] font-black text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] ring-1 ring-blue-500/50">
                    +42
                  </div>
                </div>
              </div>
              <h3 className="text-left text-lg font-bold text-white">Agroforest Pioneers</h3>
            </div>

            <p className="mt-auto pt-4 text-left text-xs leading-relaxed text-white/60">
              <span aria-hidden="true">🤝</span> Atteignez des objectifs communs avec votre tribu.
            </p>
          </motion.article>
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
