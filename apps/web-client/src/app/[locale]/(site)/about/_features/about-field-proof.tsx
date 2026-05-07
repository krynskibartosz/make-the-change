'use client'

import { MapPin, Flower2, Fish, Users } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { AboutFieldProofProps } from './about.types'

type IconComponent = typeof Flower2

const icons: Array<{ icon: IconComponent; color: string; bg: string }> = [
  { icon: Flower2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Fish, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
]

export function AboutFieldProof({ title, description, projects }: AboutFieldProofProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const prefersReducedMotion = useReducedMotion()

  const projectList = [
    { label: projects.apiculture, ...icons[0] },
    { label: projects.corals, ...icons[1] },
    { label: projects.olives, ...icons[2] },
    { label: projects.partners, ...icons[3] },
  ]

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} aria-labelledby="field-proof-title" className="mx-auto max-w-xl px-8 py-20 flex flex-col items-start relative overflow-hidden">
        <h2 id="field-proof-title" className="mb-6 text-3xl font-bold text-white tracking-tight leading-tight">{title}</h2>
        <p className="mb-12 text-base font-light leading-[1.8] text-gray-300">{description}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {projectList.map((item, index) => {
            const Icon = item.icon as IconComponent
            return (
              <div key={index} className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.bg}`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="mx-auto max-w-xl px-8 py-20 flex flex-col items-start relative overflow-hidden">
      <motion.h2
        className="mb-6 text-3xl font-bold text-white tracking-tight leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="mb-12 text-base font-light leading-[1.8] text-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {description}
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {projectList.map((item, index) => {
          const Icon = item.icon as IconComponent
          return (
            <motion.div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.bg}`}>
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <span className="text-sm font-medium text-white">{item.label}</span>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
