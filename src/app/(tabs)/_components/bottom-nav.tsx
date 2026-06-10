'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils/cn'
import { useScrollHeader } from '@/lib/hooks/use-scroll-header'

import { clarusTabs } from './tabs'

export function BottomNav() {
  const pathname = usePathname()
  const { isVisible } = useScrollHeader()

  return (
    <nav
      aria-label="Navigation principale"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/80 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 backdrop-blur-md transition-all duration-300 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
      )}
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {clarusTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
          const Icon = tab.icon

          return (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex min-h-[var(--size-bottom-nav-item)] flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] px-2 text-xs font-semibold transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
              href={tab.href}
              key={tab.href}
            >
              {/* Pill + glow on active icon — style porté depuis web-client/mobile-bottom-nav */}
              <span
                className={cn(
                  'flex h-8 w-12 items-center justify-center rounded-xl transition-all duration-200',
                  isActive
                    ? 'scale-105 bg-primary/15 ring-1 ring-primary/30'
                    : 'bg-transparent',
                )}
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn(
                    'size-5 transition-all',
                    isActive && 'drop-shadow-[0_0_4px_hsl(var(--primary)/0.4)]',
                  )}
                />
              </span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
