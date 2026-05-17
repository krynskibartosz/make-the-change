'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { INTRO_CONTENT } from '../_lib/antsirabe-experience-content'

const BG_IMAGE = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop'

export function IntroCinematic({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-black">
      {/* Background */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10 px-6 pt-[max(1.5rem,env(safe-area-inset-top))]"
      >
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-400">
          {INTRO_CONTENT.eyebrow}
        </span>
      </motion.div>

      {/* Headline */}
      <div className="relative z-10 mt-auto px-6 pb-10">
        <div className="mb-6 space-y-1">
          {INTRO_CONTENT.lines.map((line, i) => (
            <motion.h1
              key={line}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
              className="text-5xl font-black leading-none tracking-tight text-white"
            >
              {line}
            </motion.h1>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="mb-8 max-w-sm text-base leading-relaxed text-white/65"
        >
          {INTRO_CONTENT.body}
        </motion.p>

        <motion.button
          type="button"
          onClick={onNext}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.4 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 text-base font-black text-black shadow-[0_6px_0_#065f46] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_#065f46] active:translate-y-[5px] active:shadow-[0_1px_0_#065f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
        >
          {INTRO_CONTENT.cta}
          <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  )
}
