'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Infinity } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatMsCountdown, msUntilNextRegen } from '@/lib/lives'
import { cn } from '@/lib/utils'

type LivesCounterProps = {
  lives: number
  unlimited?: boolean
  updatedAt?: string
  onClick?: () => void
  className?: string
}

export function LivesCounter({
  lives,
  unlimited = false,
  updatedAt,
  onClick,
  className,
}: LivesCounterProps) {
  const [countdown, setCountdown] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (unlimited || lives >= 5 || !updatedAt) {
      setCountdown('')
      return
    }

    const livesState = { remaining: lives, updatedAt }

    const update = () => {
      const ms = msUntilNextRegen(livesState, false)
      setCountdown(ms > 0 ? formatMsCountdown(ms) : '')
    }

    update()
    intervalRef.current = setInterval(update, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [lives, unlimited, updatedAt])

  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'flex min-h-11 items-center gap-1.5 rounded-full border px-3 transition-colors duration-300',
        unlimited
          ? 'border-violet-500/30 bg-violet-500/10'
          : lives >= 3
            ? 'border-red-500/25 bg-red-500/10'
            : lives >= 1
              ? 'border-amber-500/25 bg-amber-500/10'
              : 'border-white/10 bg-white/5 opacity-60',
        onClick && 'cursor-pointer touch-manipulation hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        className,
      )}
    >
      <motion.div
        key={lives}
        animate={lives > 0 || unlimited ? { x: [0, -4, 4, -4, 4, 0] } : { scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="flex items-center gap-1.5"
      >
        {unlimited ? (
          <Infinity className="h-4 w-4 shrink-0 text-violet-300" />
        ) : (
          <Heart
            className={cn(
              'h-4 w-4 shrink-0 fill-current',
              lives >= 3 ? 'text-red-400' : lives >= 1 ? 'text-amber-400' : 'text-white/30',
            )}
          />
        )}
        {unlimited ? (
          <span className="text-sm font-black leading-none text-violet-300">∞</span>
        ) : (
          <span
            className={cn(
              'text-sm font-black leading-none tabular-nums',
              lives >= 3 ? 'text-red-400' : lives >= 1 ? 'text-amber-400' : 'text-white/30',
            )}
          >
            {lives}
          </span>
        )}
      </motion.div>
      <AnimatePresence>
        {!unlimited && lives < 5 && countdown && (
          <motion.span
            key="timer"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden text-[10px] font-bold tabular-nums text-white/40"
          >
            {countdown}
          </motion.span>
        )}
      </AnimatePresence>
    </Tag>
  )
}
