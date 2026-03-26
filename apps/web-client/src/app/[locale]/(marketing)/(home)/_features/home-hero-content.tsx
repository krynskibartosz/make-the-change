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
      className="relative z-10 mt-auto w-full max-w-xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        variants={childVariants}
        className="text-left text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance"
      >
        {title}
      </motion.h1>

      <motion.p
        variants={childVariants}
        className="mt-4 text-left text-base text-foreground/80 dark:text-muted-foreground text-pretty"
      >
        {subtitle}
      </motion.p>

      <motion.div variants={childVariants}>
        <Link
          href="/projects"
          className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-[#7ED321] font-bold text-black shadow-[0_8px_30px_rgb(132,204,22,0.25)] dark:shadow-none transition-transform hover:bg-[#68B01B] active:scale-95 select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {cta}
        </Link>
      </motion.div>
    </motion.div>
  )
}
