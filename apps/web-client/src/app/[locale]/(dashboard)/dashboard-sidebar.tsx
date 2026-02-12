'use client'

import type { Messages } from '@make-the-change/core/i18n'
import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card, CardContent, CardHeader } from '@make-the-change/core/ui'
import {
  ArrowUpRight,
  Bell,
  Coins,
  CreditCard,
  Home,
  LayoutDashboard,
  Leaf,
  LogOut,
  type LucideIcon,
  PiggyBank,
  Settings,
  ShoppingBag,
  Trophy,
  User,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useDashboardSidebar } from '@/components/layout/dashboard-sidebar-context'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { logout } from '../(auth)/actions'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url?: string | null
  metadata?: Record<string, unknown> | null
  user_level: string | null
}

interface DashboardSidebarProps {
  user: { id: string; email: string | undefined }
  profile: Profile | null
}

type NavigationKey = keyof Messages['navigation']

type AccountNavItem =
  | { href: string; icon: LucideIcon; labelKey: NavigationKey }
  | { href: string; icon: LucideIcon; labelText: string }

const accountNavPrimaryItems: AccountNavItem[] = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/dashboard/profile', labelKey: 'profile', icon: User },
  { href: '/dashboard/investments', labelKey: 'my_investments', icon: PiggyBank },
  { href: '/dashboard/orders', labelKey: 'my_orders', icon: ShoppingBag },
  { href: '/dashboard/points', labelKey: 'my_points', icon: Coins },
]

const accountNavSecondaryItems: AccountNavItem[] = [
  { href: '/dashboard/subscription', labelKey: 'subscriptions', icon: CreditCard },
  { href: '/dashboard/settings', labelKey: 'settings', icon: Settings },
]

const sidebarItemClass =
  'group relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background'

type SidebarNavLinkProps = {
  href: string
  icon: LucideIcon
  label: string
  active: boolean
  endIcon?: LucideIcon
  tone?: 'default' | 'danger'
  onClick?: () => void
}

const SidebarNavLink: FC<SidebarNavLinkProps> = ({
  href,
  icon: Icon,
  label,
  active,
  endIcon: EndIcon,
  tone = 'default',
  onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    aria-current={active ? 'page' : undefined}
    className={cn(
      sidebarItemClass,
      active
        ? "bg-primary/10 text-foreground shadow-sm shadow-primary/10 before:absolute before:left-1 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-full before:bg-primary before:content-['']"
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
      tone === 'danger' && !active && 'hover:bg-destructive/10 hover:text-destructive',
    )}
  >
    <span
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground transition-colors',
        active ? 'bg-primary/10 text-primary' : 'group-hover:bg-muted/50 group-hover:text-foreground',
        tone === 'danger' && !active && 'group-hover:bg-destructive/15 group-hover:text-destructive',
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
    <span className="truncate">{label}</span>
    {EndIcon ? (
      <EndIcon
        className={cn(
          'ml-auto h-4 w-4 text-muted-foreground/70 transition-colors',
          active ? 'text-primary' : 'group-hover:text-foreground',
        )}
      />
    ) : null}
  </Link>
)

type SidebarActionButtonProps = {
  icon: LucideIcon
  label: string
  type?: 'button' | 'submit'
  onClick?: () => void
  tone?: 'default' | 'danger'
}

const SidebarActionButton: FC<SidebarActionButtonProps> = ({
  icon: Icon,
  label,
  type = 'button',
  onClick,
  tone = 'default',
}) => (
  <button
    type={type}
    onClick={onClick}
    className={cn(
      sidebarItemClass,
      'w-full text-left',
      tone === 'danger'
        ? 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
    )}
  >
    <span
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground transition-colors',
        tone === 'danger'
          ? 'group-hover:bg-destructive/15 group-hover:text-destructive'
          : 'group-hover:bg-muted/50 group-hover:text-foreground',
      )}
    >
      <Icon className="h-4 w-4" />
    </span>
    <span className="truncate">{label}</span>
  </button>
)

export function DashboardSidebar({ user, profile }: DashboardSidebarProps) {
  const t = useTranslations('navigation')
  const tDashboard = useTranslations('dashboard')
  const pathname = usePathname()
  const { isMobileOpen, setIsMobileOpen } = useDashboardSidebar()

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`
    : user.email

  const userLevel = profile?.user_level || 'explorateur'
  const secondaryLine = profile?.first_name ? user.email : null
  const initial = (displayName || '?').trim().charAt(0).toUpperCase()
  const avatarUrl =
    (profile?.metadata?.avatar_url as string | undefined) || profile?.avatar_url || null
  const levelColors: Record<string, string> = {
    explorateur: 'bg-muted text-muted-foreground',
    protecteur: 'bg-success/15 text-success',
    ambassadeur: 'bg-warning/15 text-warning',
  }

  const handleNavClick = () => {
    setIsMobileOpen(false)
  }

  const exploreNavItems: Array<{ href: string; icon: LucideIcon; label: string }> = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/projects', icon: Leaf, label: t('projects') },
    { href: '/products', icon: ShoppingBag, label: t('products') },
    { href: '/leaderboard', icon: Trophy, label: t('leaderboard') },
  ]

  const isActiveAccountRoute = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  const sidebarContent = (
    <div className="flex flex-col h-full min-h-0 text-foreground bg-background/95 backdrop-blur-xl border-r">
      <div className="p-4 pb-4 border-b">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 ring-1 ring-border">
              <Avatar className="h-12 w-12">
                <AvatarImage src={avatarUrl || undefined} alt="" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/10 text-sm font-bold text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-none text-foreground">
                {displayName}
              </p>
              {secondaryLine ? (
                <p className="mt-1 truncate text-xs text-muted-foreground">{secondaryLine}</p>
              ) : null}
              <Badge
                className={cn(
                  'mt-2 rounded-full px-2.5 py-0.5 text-[11px]',
                  levelColors[userLevel],
                )}
              >
                {tDashboard(`overview.levels.${userLevel}`)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-label={t('close_menu')}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          <div>
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('account_section')}
            </p>
            <nav className="space-y-1">
              {accountNavPrimaryItems.map((item) => (
                <SidebarNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={'labelKey' in item ? t(item.labelKey) : item.labelText}
                  active={isActiveAccountRoute(item.href)}
                  onClick={handleNavClick}
                />
              ))}
            </nav>

            <div className="my-3 h-px bg-border/60" />

            <nav className="space-y-1">
              {accountNavSecondaryItems.map((item) => (
                <SidebarNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={'labelKey' in item ? t(item.labelKey) : item.labelText}
                  active={isActiveAccountRoute(item.href)}
                  onClick={handleNavClick}
                />
              ))}
            </nav>
          </div>

          <div>
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('explore_section')}
            </p>
            <nav className="space-y-1">
              {exploreNavItems.map((item) => (
                <SidebarNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  onClick={handleNavClick}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-1 bg-muted/5">
        <SidebarNavLink
          href={`/profile/${user.id}`}
          icon={User}
          label={t('public_profile')}
          active={false}
          endIcon={ArrowUpRight}
          onClick={handleNavClick}
        />
        <form action={logout}>
          <SidebarActionButton icon={LogOut} label={t('logout')} type="submit" tone="danger" />
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-full w-80 overflow-y-auto bg-background shadow-2xl animate-in slide-in-from-left">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
