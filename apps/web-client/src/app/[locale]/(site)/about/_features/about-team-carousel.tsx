'use client'

import { Linkedin } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { AboutTeamProps } from './about.types'

function TeamMemberCard({ member, isGregory }: { member: AboutTeamProps['members'][number]; isGregory: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, amount: 0.3 })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <article ref={cardRef} className="relative flex flex-col">
        <div className="relative z-10 mb-6 flex flex-row items-center gap-5">
          <img
            src={member.photoSrc}
            alt={member.name}
            className={`h-20 w-20 rounded-full border border-white/10 object-cover ${isGregory ? 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'}`}
          />
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-white tracking-tight leading-none">{member.name}</h3>
            <p className={`mt-2 text-[10px] font-bold uppercase tracking-[0.25em] ${isGregory ? 'text-amber-500' : 'text-emerald-500'}`}>
              {member.role}
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -top-8 -left-3 select-none font-serif text-[100px] leading-none text-white/[0.03] pointer-events-none z-0">
            "
          </div>
          <blockquote className={`relative z-10 border-l-2 pl-4 ${isGregory ? 'border-amber-500/20' : 'border-emerald-500/20'}`}>
            <p className="relative z-10 text-[15px] italic leading-[1.85] font-light text-gray-300 text-pretty drop-shadow-sm sm:text-base">{member.quote}</p>
          </blockquote>
        </div>
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={member.linkedinLabel}
          className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.05] text-white transition-colors hover:bg-white/10"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </article>
    )
  }

  return (
    <article ref={cardRef} className="relative flex flex-col">
      {/* Header: Avatar + Identity */}
      <div className="relative z-10 mb-6 flex flex-row items-center gap-5">
        {/* Avatar with zoom-out reveal */}
        <motion.img
          src={member.photoSrc}
          alt={member.name}
          className={`h-20 w-20 rounded-full border border-white/10 object-cover will-change-transform ${isGregory ? 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'shadow-[0_0_30px_rgba(16,185,129,0.15)]'}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Identity with slide-in */}
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h3 className="text-2xl font-bold text-white tracking-tight leading-none">{member.name}</h3>
          <p className={`mt-2 text-[10px] font-bold uppercase tracking-[0.25em] ${isGregory ? 'text-amber-500' : 'text-emerald-500'}`}>
            {member.role}
          </p>
        </motion.div>
      </div>

      {/* Body: Quote with watermark */}
      <div className="relative">
        {/* Watermark quote mark with slide-in */}
        <motion.div
          className="absolute -top-8 -left-3 select-none font-serif text-[100px] leading-none text-white/[0.03] pointer-events-none z-0 will-change-transform"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          "
        </motion.div>

        {/* Quote with fade-up */}
        <motion.blockquote
          className={`relative z-10 border-l-2 pl-4 ${isGregory ? 'border-amber-500/20' : 'border-emerald-500/20'}`}
          initial={{ opacity: 0, y: 4 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="relative z-10 text-[15px] italic leading-[1.85] font-light text-gray-300 text-pretty drop-shadow-sm sm:text-base">{member.quote}</p>
        </motion.blockquote>
      </div>

      {/* LinkedIn button */}
      <motion.a
        href={member.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={member.linkedinLabel}
        className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.05] bg-white/[0.05] text-white transition-colors hover:bg-white/10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Linkedin className="h-4 w-4" />
      </motion.a>
    </article>
  )
}

export function AboutTeamCarousel({ title, subtitle, members }: AboutTeamProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} className="relative mt-20 py-20 sm:py-24">
        <div className="px-6 mb-12">
          <h2 className="mb-3 text-3xl font-bold text-white tracking-tight text-balance">{title}</h2>
          <p className="text-base font-light text-gray-400 mb-12">{subtitle}</p>
        </div>
        <div className="flex flex-col gap-20 px-6">
          {members.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} isGregory={index === 0} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative mt-20 py-20 sm:py-24">
      <div className="px-6 mb-12">
        <motion.h2
          className="mb-3 text-3xl font-bold text-white tracking-tight text-balance"
          initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 4, filter: 'blur(4px)' }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-base font-light text-gray-400 mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="flex flex-col gap-20 px-6">
        {members.map((member, index) => (
          <TeamMemberCard key={member.name} member={member} isGregory={index === 0} />
        ))}
      </div>
    </section>
  )
}
