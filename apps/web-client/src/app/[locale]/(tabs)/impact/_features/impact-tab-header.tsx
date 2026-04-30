'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { Clock, Gift } from 'lucide-react'
import { getCurrentSeason, getSeasonTimeRemaining } from '@/lib/mock/mock-seasons'

export function ImpactTabHeader() {
  const currentSeason = getCurrentSeason()
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(getSeasonTimeRemaining())
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeRemaining = (ms: number) => {
    const rtf = new Intl.RelativeTimeFormat('fr', {
      numeric: 'auto',
      style: 'narrow'
    })
    
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return rtf.format(days, 'day')
    }
    if (hours > 0) {
      return rtf.format(hours, 'hour')
    }
    if (minutes > 0) {
      return rtf.format(minutes, 'minute')
    }
    return rtf.format(seconds, 'second')
  }

  if (!currentSeason) return null

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-white/40" />
        <p className="text-[11px] font-medium text-white/40">
          {currentSeason.name} • {formatTimeRemaining(timeRemaining)} restantes
        </p>
      </div>
      <Link
        href="/impact/reward"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
        aria-label="Voir la récompense du mois"
      >
        <Gift className="h-5 w-5 text-lime-400" />
      </Link>
    </div>
  )
}
