'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { AboutGenesisProps } from './about.types'

export function AboutGenesis({ title, paragraph1, paragraph2 }: AboutGenesisProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} className="mx-auto max-w-xl px-8 py-24 flex flex-col items-start">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          ORIGINES
        </div>
        <h2 className="mb-8 text-left text-3xl font-bold text-white tracking-tight leading-[1.1] text-balance md:text-4xl">{title}</h2>
        <div className="relative flex flex-col gap-6 pl-8">
          <div className="absolute left-0 top-1 bottom-1 h-[calc(100%-8px)] w-[2px] rounded-full bg-gradient-to-b from-emerald-500/50 via-white/10 to-transparent" />
          <p className="text-base font-light leading-[1.8] text-gray-300">{paragraph1}</p>
          <p className="text-base font-light leading-[1.8] text-gray-300">
            Après plusieurs années de recherche, de prototypes inachevés et de voyages pour comprendre les réalités du terrain (de la Belgique jusqu'à Madagascar), une évidence s'est imposée. Pour sauver la biodiversité, il fallait utiliser les codes de notre génération : le{' '}
            <span className="font-medium text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">jeu</span>, la{' '}
            <span className="font-medium text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">technologie</span> et la{' '}
            <span className="font-medium text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">transparence</span>.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="mx-auto max-w-xl px-8 py-24 flex flex-col items-start">
      {/* Micro-badge with spring-up animation */}
      <motion.div
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          initial={{ opacity: 0.3 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0.3 }}
          transition={{ duration: 0.3 }}
        />
        ORIGINES
      </motion.div>

      {/* Title with blurReveal */}
      <motion.h2
        className="mb-8 text-left text-3xl font-bold text-white tracking-tight leading-[1.1] text-balance md:text-4xl"
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {title}
      </motion.h2>

      {/* Text architecture with animated gradient line */}
      <div className="relative flex flex-col gap-6 pl-8">
        {/* Gradient line with drawing animation */}
        <motion.div
          className="absolute left-0 top-1 bottom-1 h-[calc(100%-8px)] w-[2px] rounded-full bg-gradient-to-b from-emerald-500/50 via-white/10 to-transparent origin-top"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        />

        {/* Paragraph 1 with fade-up */}
        <motion.p
          className="text-base font-light leading-[1.8] text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {paragraph1}
        </motion.p>

        {/* Paragraph 2 with sequential word glow effects */}
        <motion.p
          className="text-base font-light leading-[1.8] text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Après plusieurs années de recherche, de prototypes inachevés et de voyages pour comprendre les réalités du terrain (de la Belgique jusqu'à Madagascar), une évidence s'est imposée. Pour sauver la biodiversité, il fallait utiliser les codes de notre génération : le{' '}
          <motion.span
            className="font-medium text-gray-300"
            initial={{ color: '#9ca3af' }}
            animate={isInView ? { color: '#ffffff' } : { color: '#9ca3af' }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            jeu
          </motion.span>, la{' '}
          <motion.span
            className="font-medium text-gray-300"
            initial={{ color: '#9ca3af' }}
            animate={isInView ? { color: '#ffffff' } : { color: '#9ca3af' }}
            transition={{ duration: 0.4, delay: 0.75 }}
          >
            technologie
          </motion.span> et la{' '}
          <motion.span
            className="font-medium text-gray-300"
            initial={{ color: '#9ca3af' }}
            animate={isInView ? { color: '#ffffff' } : { color: '#9ca3af' }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            transparence
          </motion.span>.
        </motion.p>
      </div>
    </section>
  )
}
