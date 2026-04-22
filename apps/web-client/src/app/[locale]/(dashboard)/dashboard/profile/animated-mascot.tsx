'use client'

import { motion } from 'framer-motion'

interface AnimatedMascotProps {
  themeKey: string
  label: string
}

export function AnimatedMascot({ themeKey, label }: AnimatedMascotProps) {
  const src =
    themeKey === 'pollinisateurs'
      ? '/images/logo-icon-bee.png'
      : themeKey === 'forets'
        ? '/sylva.png'
        : '/ondine.png'

  return (
    <motion.img
      src={src}
      alt={label}
      initial={{ y: 0 }}
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      className="h-full w-full origin-bottom scale-[1.1] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
    />
  )
}
