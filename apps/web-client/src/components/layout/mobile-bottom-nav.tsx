'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'
import { Menu, ShoppingCart, User, Wallet, Compass } from 'lucide-react'
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
    'flex-1 h-full w-full flex flex-col justify-center items-center text-[10px] font-medium transition-colors'

  const navItems = [
    {
      href: '/products',
      icon: ShoppingCart,
      label: 'Le marche',
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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] md:hidden">
      <nav aria-label="Navigation mobile">
        <ul className="m-0 flex h-16 list-none items-stretch">
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
                      ? 'border-t-2 border-primary text-primary'
                      : 'border-t-2 border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon size={22} />
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
                  ? 'border-t-2 border-primary text-primary'
                  : 'border-t-2 border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {user ? (
                avatarUrl ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatarUrl} alt="" className="object-cover" />
                    <AvatarFallback>
                      <User size={22} />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User size={22} />
                )
              ) : (
                <Menu size={22} />
              )}
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
