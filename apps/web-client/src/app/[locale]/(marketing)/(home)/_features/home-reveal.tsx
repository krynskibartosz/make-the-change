'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

type HomeRevealProps = PropsWithChildren<{
  className?: string
  delay?: number
}>

export function HomeReveal({ children, className, delay = 0 }: HomeRevealProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -20% 0px' }}
      transition={{ duration: 0.28, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  )
}

