'use client'

import { useEffect, useRef, useState } from 'react'
import { Sprout } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { formatCompact } from '@/lib/formatters'

export function SeedsFloatingBadge({ seeds }: { seeds: number }) {
  const [visible, setVisible] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Sentinel — positioned after intro. When it exits viewport, badge appears. */}
      <div ref={sentinelRef} aria-hidden="true" className="pointer-events-none h-0" />

      <Link
        href="/profile/seeds"
        prefetch={false}
        aria-label={`Solde : ${seeds} Graines`}
        className={cn(
          'fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-1/2 z-50 flex h-9 -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/5 bg-black/50 px-3 shadow-sm backdrop-blur-md transition-all duration-300 active:bg-white/10',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <Sprout className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
        <span className="text-[12px] font-black tabular-nums text-white">{formatCompact(seeds)}</span>
      </Link>
    </>
  )
}
