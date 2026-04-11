'use client'

import type { LucideIcon } from 'lucide-react'
import { Flame, Globe, ShoppingBag, User, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface MobileBottomNavProps {
  user?: { id: string; email: string; avatarUrl?: string | null; displayName?: string | null } | null
}

type BottomNavItem = {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
}

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const normalizedPath = pathname.replace(/\/+$/, '')
  const hasAuthenticatedUser = Boolean(user)
  const isInvestFlow = /\/(projects|projets)\/[^/]+\/(invest|investir)$/.test(normalizedPath)
  const isSettingsPage =
    pathname === '/dashboard/settings' || pathname.startsWith('/dashboard/settings/')

  if (isInvestFlow || isSettingsPage) {
    return null
  }

  const activeAdventureTab = searchParams.get('tab')
  const isAdventure = pathname === '/aventure' || pathname.startsWith('/aventure/')
  const isDefis =
    pathname === '/defis' ||
    pathname.startsWith('/defis/') ||
    pathname.startsWith('/challenges') ||
    (isAdventure && (activeAdventureTab === 'defis' || !activeAdventureTab))
  const isProjects = pathname.startsWith('/projets') || pathname.startsWith('/projects')
  const isCollective =
    pathname.startsWith('/collectif') ||
    pathname.startsWith('/leaderboard') ||
    pathname.startsWith('/community')
  const isMarket =
    pathname.startsWith('/marche') ||
    pathname.startsWith('/products') || pathname.startsWith('/cart') || pathname.startsWith('/checkout')
  const isProfile =
    pathname.startsWith('/dashboard/profile') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/u/')
  const navLinkClass =
    'flex h-full min-h-[48px] w-full flex-1 flex-col items-center justify-center gap-1 px-1 pt-2 text-center transition-colors'

  const navItems: BottomNavItem[] = [
    {
      href: '/defis',
      icon: Flame,
      label: 'Défis',
      isActive: isDefis,
    },
    {
      href: '/projets',
      icon: Globe,
      label: 'Projets',
      isActive: isProjects,
    },
    {
      href: '/collectif',
      icon: Users,
      label: 'Collectif',
      isActive: isCollective,
    },
    {
      href: '/marche',
      icon: ShoppingBag,
      label: 'Marché',
      isActive: isMarket,
    },
    {
      href: hasAuthenticatedUser ? '/dashboard/profile' : '/profile',
      icon: User,
      label: 'Profil',
      isActive: isProfile,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-[calc(env(safe-area-inset-bottom)+0.35rem)] md:hidden">
      <nav aria-label={hasAuthenticatedUser ? 'Navigation mobile utilisateur' : 'Navigation mobile'}>
        <ul className="m-0 flex h-[4.5rem] list-none items-stretch">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href} className="flex min-w-0 flex-1">
                <Link
                  href={item.href}
                  aria-current={item.isActive ? 'page' : undefined}
                  className={cn(
                    navLinkClass,
                    item.isActive
                      ? 'text-lime-400'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-12 items-center justify-center rounded-xl transition-all',
                      item.isActive
                        ? 'scale-105 bg-lime-400/18 ring-1 ring-lime-400/35'
                        : 'bg-transparent',
                    )}
                  >
                    <Icon
                      size={24}
                      fill="none"
                      strokeWidth={item.isActive ? 2.6 : 2.1}
                      className={cn('h-6 w-6', item.isActive && 'drop-shadow-[0_0_3px_rgba(163,230,53,0.35)]')}
                    />
                  </span>
                  <span
                    className={cn(
                      'w-full whitespace-nowrap text-center text-[10px] leading-none tracking-wide',
                      item.isActive ? 'font-bold' : 'font-medium',
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
