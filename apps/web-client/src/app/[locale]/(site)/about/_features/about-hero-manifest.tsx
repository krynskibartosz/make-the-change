'use client'

import { motion } from 'framer-motion'
import { HeroParallaxBackground } from '../../../(marketing)/(home)/_features/hero-parallax-background'
import type { AboutHeroProps } from './about.types'

const HERO_VIDEO_URL = '/videos/home-header.mp4'
const HERO_POSTER_URL = '/images/home-header-poster.jpeg'

export function AboutHeroManifest({ overline, title, subtitle, imageAlt }: AboutHeroProps) {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black px-6 pb-16 pt-12"
      aria-label={imageAlt}
    >
      <HeroParallaxBackground videoUrl={HERO_VIDEO_URL} posterUrl={HERO_POSTER_URL} />

      {/* Same gradient structure as home: fade to page background from bottom */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/90 via-30% to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 w-full text-center py-12 mt-20">
        <motion.span
          className="mb-4 block text-[10px] font-bold uppercase tracking-[0.25em] text-amber-500 drop-shadow-md md:text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {overline}
        </motion.span>
        <motion.h1
          className="mx-auto max-w-[14ch] text-5xl font-black leading-[1.05] tracking-tighter text-white drop-shadow-lg md:text-6xl"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-[280px] text-base font-light leading-[1.7] text-gray-200 drop-shadow-md sm:max-w-xs"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  )
}
