'use client'

import { Home, Menu, PiggyBank, ShoppingBag, Trophy, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface MobileBottomNavProps {
  user?: { id: string; email: string; avatarUrl?: string | null } | null
}

export function MobileBottomNav({ user }: MobileBottomNavProps) {
  const pathname = usePathname()
  const t = useTranslations('navigation')

  // Specific check for tabs
  const isHome = pathname === '/'
  const isProducts = pathname.startsWith('/products')
  const isProjects = pathname.startsWith('/projects')
  const isLeaderboard = pathname.startsWith('/leaderboard')

  // If none of the main tabs are active, we assume we are in the "Menu" context (except for specific flows like checkout maybe)
  const isMenuActive = !isHome && !isProducts && !isProjects && !isLeaderboard

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: t('home'),
      isActive: isHome,
    },
    {
      href: '/products',
      icon: ShoppingBag,
      label: t('products'),
      isActive: isProducts,
    },
    {
      href: '/projects',
      icon: PiggyBank,
      label: t('projects'),
      isActive: isProjects,
    },
    {
      href: '/leaderboard',
      icon: Trophy,
      label: t('leaderboard'),
      isActive: isLeaderboard,
    },
  ]

  const avatarUrl = user?.avatarUrl ?? null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-safe md:hidden">
      <nav className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors',
                item.isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
                  item.isActive ? 'bg-primary/10' : 'bg-transparent',
                )}
              >
                <Icon className={cn('h-5 w-5', item.isActive && 'fill-primary/20')} />
              </div>
              <span className={item.isActive ? 'font-semibold' : ''}>{item.label}</span>
            </Link>
          )
        })}

        {/* Menu Tab */}
        <Link
          href="/menu"
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors',
            isMenuActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
              isMenuActive ? 'bg-primary/10' : 'bg-transparent',
            )}
          >
            {user ? (
              avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <User className={cn('h-5 w-5', isMenuActive && 'fill-primary/20')} />
              )
            ) : (
              <Menu className={cn('h-5 w-5', isMenuActive && 'fill-primary/20')} />
            )}
          </div>
          <span className={isMenuActive ? 'font-semibold' : ''}>{t('menu')}</span>
        </Link>
      </nav>
    </div>
  )
}
