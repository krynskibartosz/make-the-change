'use client'

import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { AboutModelBlock, AboutModelProps } from './about.types'

function GamificationCard({ title, description }: AboutModelBlock) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 200], [0, -15], { clamp: true })

  return (
    <motion.article
      ref={cardRef}
      className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent p-8 transition-transform duration-300 ease-out active:scale-[0.98]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-8 h-56 w-56 rounded-full bg-emerald-500/20 blur-[50px] z-0" />
      {/* Watermark with parallax */}
      <motion.div
        className="absolute -bottom-6 -right-2 text-[120px] leading-none font-black italic text-white/[0.02] pointer-events-none z-0 select-none will-change-transform"
        style={{ y }}
      >
        01
      </motion.div>
      {/* Content */}
      <h3 className="relative z-10 mb-4 text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-[1.8] text-gray-300 drop-shadow-md">{description}</p>
    </motion.article>
  )
}

function CircularCard({ title, description }: AboutModelBlock) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 200], [0, -15], { clamp: true })

  return (
    <motion.article
      ref={cardRef}
      className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent p-8 transition-transform duration-300 ease-out active:scale-[0.98]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-8 h-56 w-56 rounded-full bg-amber-500/20 blur-[50px] z-0" />
      {/* Watermark with parallax */}
      <motion.div
        className="absolute -bottom-6 -right-2 text-[120px] leading-none font-black italic text-white/[0.02] pointer-events-none z-0 select-none will-change-transform"
        style={{ y }}
      >
        02
      </motion.div>
      {/* Content */}
      <h3 className="relative z-10 mb-4 text-xl font-bold text-white tracking-tight leading-tight">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-[1.8] text-gray-300 drop-shadow-md">{description}</p>
    </motion.article>
  )
}

function TransparencyCard({ title, description }: AboutModelBlock) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 200], [0, -15], { clamp: true })

  return (
    <motion.article
      ref={cardRef}
      className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-transparent p-8 transition-transform duration-300 ease-out active:scale-[0.98]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 -right-8 h-56 w-56 rounded-full bg-blue-500/20 blur-[50px] z-0" />
      {/* Watermark with parallax */}
      <motion.div
        className="absolute -bottom-6 -right-2 text-[120px] leading-none font-black italic text-white/[0.02] pointer-events-none z-0 select-none will-change-transform"
        style={{ y }}
      >
        03
      </motion.div>
      {/* Content */}
      <h3 className="relative z-10 mb-4 text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="relative z-10 text-sm font-light leading-[1.8] text-gray-300 drop-shadow-md">{description}</p>
    </motion.article>
  )
}

export function AboutModelBento({ overline, gamification, circular, transparency }: AboutModelProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} className="mt-12 py-16 sm:py-20">
        <div className="mb-12 flex flex-col items-start px-8">
          <span className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500">
            Notre Modèle
          </span>
          <h2 className="mb-8 text-3xl font-bold text-white tracking-tight">Un cercle vertueux.</h2>
        </div>
        <div className="flex flex-col gap-6 px-6">
          <GamificationCard {...gamification} />
          <CircularCard {...circular} />
          <TransparencyCard {...transparency} />
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="mt-12 py-16 sm:py-20">
      <div className="mb-12 flex flex-col items-start px-8">
        <motion.span
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Notre Modèle
        </motion.span>
        <motion.h2
          className="mb-8 text-3xl font-bold text-white tracking-tight"
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          Un cercle vertueux.
        </motion.h2>
      </div>
      <div className="flex flex-col gap-6 px-6">
        <GamificationCard {...gamification} />
        <CircularCard {...circular} />
        <TransparencyCard {...transparency} />
      </div>
    </section>
  )
}
