'use client'

import { Compass } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { UserDrawer, type UserDrawerUser } from './user-drawer'

type TopNavigationProps = {
  user?: UserDrawerUser
}

const resolveSectionLabel = (pathname: string): string => {
  if (pathname.startsWith('/aventure')) return 'Aventure'
  if (pathname.startsWith('/projets') || pathname.startsWith('/projects')) return 'Projets'
  if (
    pathname.startsWith('/marche') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout')
  ) {
    return 'Marché'
  }
  if (
    pathname.startsWith('/collectif') ||
    pathname.startsWith('/community') ||
    pathname.startsWith('/leaderboard')
  ) {
    return 'Collectif'
  }
  return 'Aventure'
}

export function TopNavigation({ user = null }: TopNavigationProps) {
  const pathname = usePathname()
  const sectionLabel = resolveSectionLabel(pathname)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl md:hidden">
      <div className="pt-[env(safe-area-inset-top)]">
        <div className="flex h-14 items-center justify-between px-4">
          <Link
            href="/aventure"
            className="inline-flex items-center gap-2 rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-lime-500/15 text-lime-400">
              <Compass className="h-4 w-4" fill="currentColor" />
            </span>
            <div className="leading-none">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Navigation
              </p>
              <p
                className={cn(
                  'mt-1 text-sm font-semibold',
                  sectionLabel === 'Aventure' ? 'text-lime-400' : 'text-foreground',
                )}
              >
                {sectionLabel}
              </p>
            </div>
          </Link>

          <UserDrawer user={user} />
        </div>
      </div>
    </header>
  )
}
