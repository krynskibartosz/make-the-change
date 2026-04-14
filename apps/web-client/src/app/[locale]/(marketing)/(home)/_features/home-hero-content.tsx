'use client'

import { motion, type Variants } from 'framer-motion'
import { Link } from '@/i18n/navigation'

type HomeHeroContentProps = {
  title: string
  subtitle: string
  cta: string
}

export function HomeHeroContent({ title, subtitle, cta }: HomeHeroContentProps) {
  const containerVariants: Variants = {
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <motion.div
      className="relative z-10 px-5 pb-8 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        variants={childVariants}
        className="text-[40px] leading-[1.15] font-black text-white tracking-tight mb-4"
      >
        Soutenez la biodiversité, récoltez les bénéfices.
      </motion.h1>

      <motion.p
        variants={childVariants}
        className="text-white/80 text-[16px] leading-relaxed mb-8"
      >
        Transformez votre soutien à des projets concrets en points. Utilisez-les pour obtenir des récompenses éthiques et responsables.
      </motion.p>

      <motion.div variants={childVariants}>
        <Link
          href="/projects"
          className="flex w-full items-center justify-center bg-lime-400 text-[#0B0F15] font-bold text-[17px] h-14 rounded-2xl active:scale-95 transition-transform shadow-lg"
        >
          Découvrir les projets
        </Link>
      </motion.div>
    </motion.div>
  )
}
