'use client'

import { Gift } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CurrencyIcon } from '@/components/currency'
import { Link } from '@/i18n/navigation'
import { formatCompact } from '@/lib/formatters'
import { cn } from '@/lib/utils'

type AdvantagesTabHeaderProps = {
  impactCredits: number
}

export function AdvantagesTabHeader({ impactCredits }: AdvantagesTabHeaderProps) {
  const [isTitleVisible, setIsTitleVisible] = useState(false)

  useEffect(() => {
    const sentinel = document.getElementById('advantages-title-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setIsTitleVisible(!entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative z-50 flex w-full items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-lime-400/10 text-lime-300 shadow-sm">
          <Gift className="h-5 w-5" aria-hidden="true" />
        </span>
        <p
          className={cn(
            'truncate text-sm font-black text-white transition-opacity duration-300',
            isTitleVisible ? 'opacity-100' : 'opacity-0',
          )}
        >
          Avantages
        </p>
      </div>

      <Link
        href="/advantages/balance"
        prefetch={false}
        aria-label={`${impactCredits} Crédits Impact`}
        className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/5 bg-black/40 px-3 shadow-sm backdrop-blur-md transition-colors active:bg-white/10"
      >
        <CurrencyIcon kind="impactCredits" className="h-3.5 w-3.5" />
        <span className="text-[12px] font-black tabular-nums text-white">
          {formatCompact(impactCredits)}
        </span>
      </Link>
    </div>
  )
}
