'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import type { AboutLetterProps } from './about.types'

export function AboutLetter({ body, signature }: AboutLetterProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <section ref={sectionRef} className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 sm:px-10 py-24 text-center">
        <p className="text-[17px] sm:text-lg text-gray-300 leading-[1.8] font-light text-pretty mb-12 drop-shadow-sm">
          Dans 3 ans, nous voulons que Make the Change soit{' '}
          <span className="text-white font-medium drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">le plus grand collectif citoyen d'Europe</span>{' '}
          pour la biodiversité. Un écosystème où chaque swipe sur un écran plante une graine, où chaque défi relevé restaure un habitat, et où l'action commune devient une seconde nature. Le collectif n'attend plus que vous.
        </p>
        <div className="flex items-center justify-center gap-4 text-gray-500 font-medium tracking-[0.2em] uppercase text-[10px] w-full">
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-gray-500"></div>
          Les fondateurs, Grégory & Bartosz
          <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-gray-500"></div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 sm:px-10 py-24 text-center">
      {/* Main paragraph with slow majestic fade-up */}
      <motion.p
        className="text-[17px] sm:text-lg text-gray-300 leading-[1.8] font-light text-pretty mb-12 drop-shadow-sm"
        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 8, filter: 'blur(4px)' }}
        transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
      >
        Dans 3 ans, nous voulons que Make the Change soit{' '}
        <span className="text-white font-medium drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">le plus grand collectif citoyen d'Europe</span>{' '}
        pour la biodiversité. Un écosystème où chaque swipe sur un écran plante une graine, où chaque défi relevé restaure un habitat, et où l'action commune devient une seconde nature. Le collectif n'attend plus que vous.
      </motion.p>

      {/* Signature with draw-out effect */}
      <motion.div
        className="flex items-center justify-center gap-4 text-gray-500 font-medium tracking-[0.2em] uppercase text-[10px] w-full"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Left line - draws from right to left */}
        <motion.div
          className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-gray-500 origin-right"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        />
        Les fondateurs, Grégory & Bartosz
        {/* Right line - draws from left to right */}
        <motion.div
          className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-gray-500 origin-left"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
        />
      </motion.div>
    </section>
  )
}
