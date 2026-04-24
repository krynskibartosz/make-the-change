'use client'

import { motion } from 'framer-motion'

interface SanctuaryHeroProps {
  mascot: string
  name: string
  title: string
  accentBg: string
}

export function SanctuaryHero({ mascot, name, title, accentBg }: SanctuaryHeroProps) {
  return (
    <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Ambient Glow Background */}
      <div className={`absolute inset-0 ${accentBg} opacity-20 blur-3xl`} />
      
      {/* Animated Mascot */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.img
          src={mascot}
          alt={name}
          initial={{ y: 0, scale: 1, rotate: 0 }}
          animate={{
            y: [-4, 4, -4],
            scale: [1, 1.02, 1],
            rotate: [-1, 1, -1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
          className="h-64 w-64 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] will-change-transform"
          style={{ filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.1))' }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 text-4xl font-black text-white tracking-tight"
        >
          {title}
        </motion.h1>
      </div>
    </div>
  )
}
