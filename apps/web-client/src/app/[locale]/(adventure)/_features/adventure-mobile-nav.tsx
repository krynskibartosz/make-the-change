'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'
import { Rss, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface CommunityMobileBottomNavProps {
  user?: { id: string; email: string; avatarUrl?: string | null } | null
}

export function CommunityMobileBottomNav({ user }: CommunityMobileBottomNavProps) {
  const pathname = usePathname()
  const t = useTranslations('navigation')
  const tCommunity = useTranslations('community')
  const navLinkClass =
    'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[10px] font-medium transition-colors'

  const navItems = [
    {
      href: '/community',
      icon: Rss,
      label: tCommunity('sidebar.feed'),
      isActive: pathname === '/community',
    },
  ]

  const avatarUrl = user?.avatarUrl ?? null
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/profile')

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-safe md:hidden">
      <nav aria-label={tCommunity('mobile_nav_label')}>
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
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-xl transition-all',
                      item.isAction
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-transparent',
                    )}
                  >
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
              href={user ? '/dashboard/profile' : '/login'}
              aria-current={isDashboard ? 'page' : undefined}
              className={cn(
                navLinkClass,
                isDashboard
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center">
                {user ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatarUrl || undefined} alt="" className="object-cover" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </span>
              <span className={cn('truncate', isDashboard && 'font-semibold')}>
                {user ? t('profile') : t('login')}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
