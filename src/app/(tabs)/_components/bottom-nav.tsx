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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/85 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 backdrop-blur-xl"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1 h-[4.5rem]">
        {clarusTabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`)
          const Icon = tab.icon

          return (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1.5 rounded-[var(--radius-control)] px-2 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
              href={tab.href}
              key={tab.href}
            >
              <span
                className={cn(
                  'flex h-8 w-12 items-center justify-center rounded-xl transition-all duration-200',
                  isActive ? 'scale-105 bg-primary/18 ring-1 ring-primary/35' : 'bg-transparent',
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
              <span
                className={cn(
                  'w-full whitespace-nowrap text-center text-[10px] leading-none tracking-wide',
                  isActive ? 'font-bold' : 'font-medium',
                )}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
