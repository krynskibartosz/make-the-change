'use client'

import { motion } from 'framer-motion'

interface SanctuaryHeroProps {
  mascot: string
  name: string
  title: string
  accentBg: string
  factionMessage: string
}

export function SanctuaryHero({ mascot, name, title, accentBg, factionMessage }: SanctuaryHeroProps) {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-8 pb-16">
      {/* Ambient Glow Background */}
      <div className={`absolute inset-0 ${accentBg} opacity-30 blur-[120px]`} />
      
      {/* Animated Mascot */}
      <motion.div
        initial={{ y: 0, scale: 1, rotate: 0 }}
        animate={{
          y: [-8, 8, -8],
          scale: [1, 1.02, 1],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        className="relative z-10 mb-6"
      >
        <img
          src={mascot}
          alt={name}
          className="h-72 w-72 object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] will-change-transform"
          style={{ filter: 'drop-shadow(0 0 50px rgba(255,255,255,0.15))' }}
        />
      </motion.div>
      
      {/* Title - Intact and massive */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 text-5xl font-black text-white tracking-tight mb-8 text-center px-4"
      >
        {title}
      </motion.h1>
      
      {/* Message - Elegant citation in glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 max-w-2xl mx-auto px-6"
      >
        <div className="relative py-6 px-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 text-6xl font-serif">"</div>
          <p className="text-center text-lg text-white/70 italic font-light leading-relaxed">
            {factionMessage}
          </p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-white/20 text-6xl font-serif rotate-180">"</div>
        </div>
      </motion.div>
    </div>
  )
}
