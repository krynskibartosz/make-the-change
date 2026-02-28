'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'
import { Clapperboard, Plus, Rss, User, Users } from 'lucide-react'
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

  const navItems = [
    {
      href: '/community',
      icon: Rss,
      label: tCommunity('sidebar.feed'),
      isActive: pathname === '/community',
    },
    {
      href: '/community/reels',
      icon: Clapperboard,
      label: tCommunity('sidebar.reels'),
      isActive: pathname.startsWith('/community/reels'),
    },
    {
      href: '/community/reels/new',
      icon: Plus,
      label: tCommunity('sidebar.post_reel'),
      isActive: pathname.startsWith('/community/reels/new'),
      isAction: true,
    },
    {
      href: '/community/guilds',
      icon: Users,
      label: tCommunity('sidebar.guilds'),
      isActive: pathname.startsWith('/community/guilds'),
    },
  ]

  const avatarUrl = user?.avatarUrl ?? null
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/profile')

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 backdrop-blur-lg pb-safe md:hidden">
      <nav aria-label={tCommunity('mobile_nav_label')}>
        <ul className="flex h-16 items-center justify-around px-2 m-0 p-0 list-none">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors w-full',
                    item.isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
                      item.isAction
                        ? 'bg-primary text-primary-foreground'
                        : item.isActive
                          ? 'bg-primary/10'
                          : 'bg-transparent',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        !item.isAction && item.isActive && 'fill-primary/20',
                      )}
                    />
                  </div>
                  <span className={item.isActive ? 'font-semibold' : ''}>{item.label}</span>
                </Link>
              </li>
            )
          })}

          {/* Profile/Dashboard Tab */}
          <li className="flex-1">
            <Link
              href={user ? '/dashboard' : '/login'}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors w-full',
                isDashboard ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
                  isDashboard ? 'bg-primary/10' : 'bg-transparent',
                )}
              >
                {user ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={avatarUrl || undefined} alt="" className="object-cover" />
                    <AvatarFallback>
                      <User className={cn('h-4 w-4', isDashboard && 'fill-primary/20')} />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className={cn('h-5 w-5', isDashboard && 'fill-primary/20')} />
                )}
              </div>
              <span className={isDashboard ? 'font-semibold' : ''}>
                {user ? t('profile') : t('login')}
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
