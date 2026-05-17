'use client'

import { motion } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { IMPACT_CONTENT } from '../_lib/antsirabe-experience-content'

const PILLAR_DELAYS = [0.35, 0.45, 0.55, 0.65]

export function FinalImpactCard({
  onFinish,
  onRestart,
}: {
  onFinish: () => void
  onRestart: () => void
}) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#05050A] pb-[max(2rem,env(safe-area-inset-bottom))]">
      {/* Header */}
      <div className="px-6 pb-6 pt-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400/60"
        >
          {IMPACT_CONTENT.label}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="text-2xl font-black text-white"
        >
          {IMPACT_CONTENT.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="mt-2 text-sm leading-relaxed text-white/50"
        >
          {IMPACT_CONTENT.subtitle}
        </motion.p>
      </div>

      {/* 4 pillars */}
      <div className="grid grid-cols-2 gap-3 px-6">
        {IMPACT_CONTENT.pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: PILLAR_DELAYS[i], duration: 0.35 }}
            className="rounded-2xl border border-white/8 bg-white/[0.04] p-4"
          >
            <span className="text-2xl leading-none">{pillar.icon}</span>
            <p className="mt-2 text-sm font-black text-white">{pillar.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-white/45">{pillar.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Closing phrase */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mx-6 mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-5 py-5"
      >
        <p className="text-lg font-black leading-snug text-white">
          {IMPACT_CONTENT.closing}
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
        className="mx-6 mt-8 space-y-3"
      >
        <button
          type="button"
          onClick={onFinish}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-base font-black text-black shadow-[0_5px_0_#065f46] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_#065f46] active:translate-y-[4px] active:shadow-[0_1px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
        >
          {IMPACT_CONTENT.cta}
          <ArrowRight className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold text-white/30 transition-colors hover:text-white/50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {IMPACT_CONTENT.restart}
        </button>
      </motion.div>
    </div>
  )
}
