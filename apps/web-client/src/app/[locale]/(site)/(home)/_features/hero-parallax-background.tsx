'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function HeroParallaxBackground({
  videoUrl,
  posterUrl,
}: {
  videoUrl: string
  posterUrl: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Utilisation directe du scroll global (plus robuste si le ref absolute pose souci)
  const { scrollY } = useScroll()

  // On amplifie grandement l'effet : quand on scrolle 800px vers le bas, la vidéo descend de 40%
  const y = useTransform(scrollY, [0, 800], ['0%', '40%'])

  return (
    <div ref={ref} className="absolute inset-0 h-full w-full overflow-hidden">
      <motion.video
        style={{ y }}
        className="absolute -top-[20%] h-[140%] w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={posterUrl}
      >
        <source src={videoUrl} type="video/mp4" />
      </motion.video>
    </div>
  )
}
