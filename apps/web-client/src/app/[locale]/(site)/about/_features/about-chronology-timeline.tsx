'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { AboutTimelineProps } from './about.types'

type TimelineRowProps = {
  year: string
  title: string
  index: number
}

function TimelineRow({ year, title, index }: TimelineRowProps) {
  const ref = useRef<HTMLLIElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className="relative pl-10"
    >
      {/* Node circle */}
      <motion.span
        className="absolute left-[-5px] top-1.5 flex h-3 w-3 rounded-full border-2 border-[#0D1117] bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
        aria-hidden="true"
        initial={{ scale: 0 }}
        animate={{ scale: isInView ? 1 : 0 }}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
      />
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
        <span className="text-sm font-bold tracking-wider text-emerald-400">{year}</span>
        <h3 className="text-lg font-medium tracking-tight text-white">{title}</h3>
      </div>
    </motion.li>
  )
}

export function AboutChronologyTimeline({
  overline,
  title,
  events,
}: AboutTimelineProps) {
  const containerRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  const eventList = [
    { year: '2019', title: events.y2019 },
    { year: '2021', title: events.y2021 },
    { year: '2023', title: events.y2023 },
    { year: '2025', title: events.y2025 },
    { year: '2026', title: events.y2026 },
  ]

  return (
    <section aria-label={title} className="relative px-8 py-20 sm:py-24 mx-auto max-w-xl">
      <span aria-hidden="true" className="mb-4 block text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500">
        {overline}
      </span>
      <h2 className="mb-12 text-3xl font-bold text-white tracking-tight">{title}</h2>

      <ol ref={containerRef} className="relative space-y-12 pl-1 border-l-2 border-white/10">
        {/* Animated timeline line */}
        <motion.div
          className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-500 via-emerald-400 to-transparent origin-top"
          style={{ scaleY }}
          aria-hidden="true"
        />
        
        {eventList.map((event, index) => (
          <TimelineRow key={event.year} year={event.year} title={event.title} index={index} />
        ))}
      </ol>
    </section>
  )
}
