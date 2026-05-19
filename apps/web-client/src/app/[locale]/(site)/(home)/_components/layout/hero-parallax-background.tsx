'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function HeroParallaxBackground({
  videoUrl,
  posterUrl,
  containerRef,
  inputRange = [0, 800],
  outputRange = ['0%', '40%'],
}: {
  videoUrl: string
  posterUrl: string
  containerRef?: React.RefObject<HTMLElement | null>
  inputRange?: [number, number]
  outputRange?: [string, string]
}) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll(
    containerRef ? { container: containerRef as React.RefObject<HTMLElement> } : undefined,
  )

  const y = useTransform(scrollY, inputRange, outputRange)

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
