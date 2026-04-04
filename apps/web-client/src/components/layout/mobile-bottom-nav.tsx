'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'
import { Home, Menu, ShoppingCart, User, Users, Wallet, Compass } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface MobileBottomNavProps {
  user?: { id: string; email: string; avatarUrl?: string | null } | null
}

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const pathname = usePathname()
  const t = useTranslations('navigation')

  const isHome = pathname === '/'
  const isProducts = pathname.startsWith('/products')
  const isProjects = pathname.startsWith('/projects')
  const isCommunity = pathname.startsWith('/aventure') || pathname.startsWith('/community') || pathname.startsWith('/leaderboard')
  const isDashboard = pathname.startsWith('/dashboard')
  const isMenuActive = !isHome && !isProducts && !isProjects && !isCommunity && !isDashboard
  const navLinkClass =
    'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[10px] font-medium transition-colors'

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: t('home'),
      isActive: isHome,
    },
    {
      href: '/products',
      icon: ShoppingCart,
      label: t('shop'),
      isActive: isProducts,
    },
    {
      href: '/projects',
      icon: Wallet,
      label: t('projects'),
      isActive: isProjects,
    },
    {
      href: '/aventure',
      icon: Compass,
      label: 'Aventure',
      isActive: isCommunity,
    },
  ]

  const avatarUrl = user?.avatarUrl ?? null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-safe md:hidden">
      <nav aria-label="Navigation mobile">
        <ul className="m-0 flex h-16 list-none items-stretch gap-1 px-2 py-2">
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
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )}
                >
                  <span className="flex h-6 w-6 items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={cn('truncate', item.isActive && 'font-semibold')}>
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}

          <li className="flex min-w-0 flex-1">
            <Link
              href="/menu"
              aria-current={isMenuActive ? 'page' : undefined}
              className={cn(
                navLinkClass,
                isMenuActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center">
                {user ? (
                  avatarUrl ? (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={avatarUrl} alt="" className="object-cover" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <User className="h-5 w-5" />
                  )
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </span>
              <span className={cn('truncate', isMenuActive && 'font-semibold')}>
                {t('menu')}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
