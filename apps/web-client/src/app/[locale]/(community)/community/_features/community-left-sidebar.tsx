'use client'

import { Avatar, AvatarFallback, AvatarImage, Button } from '@make-the-change/core/ui'
import {
  Bookmark,
  Clapperboard,
  Feather,
  Flame,
  Heart,
  Home,
  LogIn,
  MoreHorizontal,
  Search,
  ShoppingBag,
  Users,
  Rss,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/logo'
import { Link } from '@/i18n/navigation'

type SidebarUser = {
  id: string
  email: string
  avatarUrl: string | null
  displayName: string
} | null

interface CommunityLeftSidebarProps {
  user: SidebarUser
}

export function CommunityLeftSidebar({ user }: CommunityLeftSidebarProps) {
  const t = useTranslations('navigation')
  const tCommunity = useTranslations('community')

  const navItems = [
    { icon: Home, label: t('home'), href: '/' as const },
    { icon: Search, label: t('invest'), href: '/projects' as const },
    { icon: ShoppingBag, label: t('shop'), href: '/products' as const },
  ]

  const initial = user ? (user.displayName || user.email || '?').charAt(0).toUpperCase() : '?'

  return (
    <div className="flex h-full flex-col bg-background pt-4 pb-2 sm:px-3 lg:px-4">
      {/* Logo */}
      <Link
        href="/"
        className="mb-2 flex w-fit items-center gap-3 rounded-full p-3 transition-colors hover:bg-muted sm:px-4 sm:py-3"
      >
        <Logo variant="icon" height={32} width={32} className="h-8 w-8" />
        <span className="hidden text-lg font-bold sm:inline lg:text-xl">Make the Change</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-1 sm:items-start">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className="group flex w-fit items-center gap-5 rounded-full p-3 transition-colors hover:bg-muted sm:w-full sm:px-4 sm:py-3"
            >
              <Icon className="w-7 h-7 stroke-[1.5px]" />
              <span className="hidden text-lg sm:inline">{item.label}</span>
            </Link>
          )
        })}
        <Link
          href="/community"
          title={tCommunity('sidebar.feed')}
          aria-label={tCommunity('sidebar.feed')}
          className="group flex w-fit items-center gap-5 rounded-full p-3 transition-colors hover:bg-muted sm:w-full sm:px-4 sm:py-3"
        >
          <Rss className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden text-lg sm:inline">{tCommunity('sidebar.feed')}</span>
        </Link>
        <Link
          href="/community?sort=best"
          title={tCommunity('sidebar.trending')}
          aria-label={tCommunity('sidebar.trending')}
          className="group flex w-fit items-center gap-5 rounded-full p-3 transition-colors hover:bg-muted sm:w-full sm:px-4 sm:py-3"
        >
          <Flame className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden text-lg sm:inline">{tCommunity('sidebar.trending')}</span>
        </Link>
        <Link
          href="/community/reels"
          className="group flex w-fit items-center gap-5 rounded-full p-3 transition-colors hover:bg-muted sm:w-full sm:px-4 sm:py-3"
        >
          <Clapperboard className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden text-lg sm:inline">{tCommunity('sidebar.reels')}</span>
        </Link>
        <Link
          href="/community/guilds"
          className="group flex w-fit items-center gap-5 rounded-full p-3 transition-colors hover:bg-muted sm:w-full sm:px-4 sm:py-3"
        >
          <Users className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden text-lg sm:inline">{tCommunity('sidebar.guilds')}</span>
        </Link>
        <Link
          href="/community/likes"
          className="group flex w-fit items-center gap-5 rounded-full p-3 transition-colors hover:bg-muted sm:w-full sm:px-4 sm:py-3"
        >
          <Heart className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden text-lg sm:inline">{tCommunity('sidebar.likes')}</span>
        </Link>
        <Link
          href="/community/bookmarks"
          className="group flex w-fit items-center gap-5 rounded-full p-3 transition-colors hover:bg-muted sm:w-full sm:px-4 sm:py-3"
        >
          <Bookmark className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden text-lg sm:inline">{tCommunity('sidebar.bookmarks')}</span>
        </Link>
      </nav>

      {/* CTA Button */}
      <div className="mt-6 flex w-full justify-center sm:block">
        <Button
          asChild
          size="lg"
          className="h-[52px] w-[52px] rounded-full p-0 text-[17px] font-bold shadow-md sm:h-[52px] sm:w-full sm:px-6 lg:px-8"
        >
          <Link href="/community/posts/new">
            <span className="hidden sm:inline">{tCommunity('sidebar.update_post')}</span>
            <Feather className="h-6 w-6 sm:hidden" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="mt-2 hidden w-full sm:inline-flex">
          <Link href="/community/reels/new">{tCommunity('sidebar.post_reel')}</Link>
        </Button>
      </div>

      {/* Profile / Login at bottom */}
      <div className="mt-auto flex w-full justify-center pt-4 sm:block">
        {user ? (
          <Link
            href="/dashboard"
            className="mt-2 flex w-fit items-center justify-between gap-3 rounded-full p-3 transition-colors hover:bg-muted sm:w-full"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 text-xs font-bold text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start overflow-hidden sm:flex">
                <span className="font-bold text-[15px] leading-tight truncate">
                  {user.displayName}
                </span>
                <span className="text-muted-foreground text-[13px] leading-tight truncate">
                  {t('dashboard')}
                </span>
              </div>
            </div>
            <MoreHorizontal className="hidden h-5 w-5 text-muted-foreground sm:block" />
          </Link>
        ) : (
          <Link
            href="/login"
            className="mt-2 flex w-fit items-center gap-3 rounded-full p-3 transition-colors hover:bg-muted sm:w-full"
          >
            <LogIn className="h-7 w-7 stroke-[1.5px]" />
            <span className="hidden text-lg font-semibold sm:inline">{t('login')}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
