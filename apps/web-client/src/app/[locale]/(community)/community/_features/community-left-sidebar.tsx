import { Avatar, AvatarFallback, AvatarImage, Button } from '@make-the-change/core/ui'
import {
  Feather,
  Flame,
  Hash,
  Home,
  Leaf,
  LogIn,
  MessageSquare,
  MoreHorizontal,
  Search,
  ShoppingBag,
  Users,
} from 'lucide-react'
import { getTranslations } from 'next-intl/server'
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

export async function CommunityLeftSidebar({ user }: CommunityLeftSidebarProps) {
  const t = await getTranslations('navigation')
  const tCommunity = await getTranslations('community')

  const navItems = [
    { icon: Home, label: t('home'), href: '/' as const },
    { icon: Search, label: t('discover'), href: '/products' as const },
    { icon: Leaf, label: t('projects'), href: '/projects' as const },
    { icon: ShoppingBag, label: t('shop'), href: '/products' as const },
    { icon: MessageSquare, label: t('community'), href: '/community' as const },
  ]

  const initial = user ? (user.displayName || user.email || '?').charAt(0).toUpperCase() : '?'

  return (
    <div className="flex flex-col h-full bg-background pt-4 pb-2 xl:px-4">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 p-3 xl:px-4 xl:py-3 rounded-full hover:bg-muted transition-colors w-fit mb-2"
      >
        <Logo variant="icon" height={32} width={32} className="h-8 w-8" />
        <span className="hidden xl:inline text-xl font-bold">Make the Change</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 items-center xl:items-start">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="group flex items-center gap-5 p-3 xl:px-4 xl:py-3 rounded-full hover:bg-muted transition-colors w-fit"
            >
              <Icon className="w-7 h-7 stroke-[1.5px]" />
              <span className="hidden xl:inline text-xl">{item.label}</span>
            </Link>
          )
        })}
        <Link
          href="/community/trending"
          className="group flex items-center gap-5 p-3 xl:px-4 xl:py-3 rounded-full hover:bg-muted transition-colors w-fit"
        >
          <Flame className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden xl:inline text-xl">{tCommunity('sidebar.trending')}</span>
        </Link>
        <Link
          href="/community/guilds"
          className="group flex items-center gap-5 p-3 xl:px-4 xl:py-3 rounded-full hover:bg-muted transition-colors w-fit"
        >
          <Users className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden xl:inline text-xl">{tCommunity('sidebar.guilds')}</span>
        </Link>
        <Link
          href="/community/hashtags"
          className="group flex items-center gap-5 p-3 xl:px-4 xl:py-3 rounded-full hover:bg-muted transition-colors w-fit"
        >
          <Hash className="w-7 h-7 stroke-[1.5px]" />
          <span className="hidden xl:inline text-xl">{tCommunity('sidebar.hashtags')}</span>
        </Link>
      </nav>

      {/* CTA Button */}
      <div className="mt-6 w-full flex justify-center xl:block">
        <Button
          asChild
          size="lg"
          className="w-[52px] h-[52px] xl:w-full xl:h-[52px] rounded-full p-0 xl:px-8 text-[17px] font-bold shadow-md"
        >
          <Link href="/community/posts/new">
            <span className="hidden xl:inline">{tCommunity('sidebar.update_post')}</span>
            <Feather className="w-6 h-6 xl:hidden" />
          </Link>
        </Button>
      </div>

      {/* Profile / Login at bottom */}
      <div className="mt-auto pt-4 w-full flex justify-center xl:block">
        {user ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-3 mt-2 rounded-full hover:bg-muted transition-colors w-fit xl:w-full justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl || undefined} />
                <AvatarFallback className="bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 text-xs font-bold text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="hidden xl:flex flex-col items-start overflow-hidden">
                <span className="font-bold text-[15px] leading-tight truncate">
                  {user.displayName}
                </span>
                <span className="text-muted-foreground text-[13px] leading-tight truncate">
                  {t('dashboard')}
                </span>
              </div>
            </div>
            <MoreHorizontal className="hidden xl:block w-5 h-5 text-muted-foreground" />
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-3 p-3 mt-2 rounded-full hover:bg-muted transition-colors w-fit xl:w-full"
          >
            <LogIn className="w-7 h-7 stroke-[1.5px]" />
            <span className="hidden xl:inline text-xl font-semibold">{t('login')}</span>
          </Link>
        )}
      </div>
    </div>
  )
}
