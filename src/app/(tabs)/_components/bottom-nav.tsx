'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils/cn'

import { clarusTabs } from './tabs'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/94 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 shadow-[var(--shadow-elevated)] backdrop-blur"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {clarusTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
          const Icon = tab.icon

          return (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex min-h-[var(--size-bottom-nav-item)] flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] px-2 text-xs font-semibold text-muted-foreground transition-colors',
                isActive && 'bg-surface-elevated text-foreground',
              )}
              href={tab.href}
              key={tab.href}
            >
              <Icon aria-hidden="true" className={cn('size-5', isActive && 'text-primary')} />
              <span>{tab.label}</span>
              {isActive ? (
                <span className="absolute top-2 h-1 w-6 rounded-full bg-primary" />
              ) : null}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
