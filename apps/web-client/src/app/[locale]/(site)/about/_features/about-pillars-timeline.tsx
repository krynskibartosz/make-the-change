'use client'

import { Globe, Sprout, Users } from 'lucide-react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { AboutPillarEntry, AboutPillarsProps } from './about.types'

type PillarRowProps = {
  entry: AboutPillarEntry
  icon: React.ReactNode
  accentClassName: string
  glowClassName: string
  index: number
}

function PillarRow({ entry, icon, accentClassName, glowClassName, index }: PillarRowProps) {
  const ref = useRef<HTMLLIElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative pl-10"
    >
      <motion.span
        className={`absolute left-0 top-0.5 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#0D1117] ring-1 ring-white/5 ${accentClassName} ${isInView ? glowClassName : ''}`}
        aria-hidden="true"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: isInView ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.span>
      <h3 className="text-xl font-bold tracking-tight text-white">{entry.title}</h3>
      <p className="mt-2 text-sm font-light leading-relaxed text-gray-400">{entry.description}</p>
    </motion.li>
  )
}

export function AboutPillarsTimeline({
  overline,
  engagement,
  swarm,
  impact,
}: AboutPillarsProps) {
  const containerRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="relative px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-xl">
        <span className="mb-12 block text-[11px] font-semibold uppercase tracking-[0.4em] text-amber-400/90">
          {overline}
        </span>

        <ol ref={containerRef} className="relative space-y-10 pl-6">
          {/* Animated gradient timeline line: centered on icon */}
          <motion.div
            className="absolute left-[22px] top-2 h-full w-px bg-gradient-to-b from-emerald-400/60 via-amber-300/30 to-sky-400/40 origin-top"
            style={{ scaleY }}
            aria-hidden="true"
          />
          <PillarRow
            entry={engagement}
            icon={<Sprout className="h-4 w-4" />}
            accentClassName="text-emerald-400"
            glowClassName="shadow-[0_0_18px_rgba(52,211,153,0.45)]"
            index={0}
          />
          <PillarRow
            entry={swarm}
            icon={<Users className="h-4 w-4" />}
            accentClassName="text-amber-300"
            glowClassName="shadow-[0_0_18px_rgba(252,211,77,0.45)]"
            index={1}
          />
          <PillarRow
            entry={impact}
            icon={<Globe className="h-4 w-4" />}
            accentClassName="text-sky-400"
            glowClassName="shadow-[0_0_18px_rgba(56,189,248,0.45)]"
            index={2}
          />
        </ol>
      </div>
    </section>
  )
}
