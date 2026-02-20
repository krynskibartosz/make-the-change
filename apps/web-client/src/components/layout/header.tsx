'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  NavigationMenu,
  NavigationMenuBackdrop,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@make-the-change/core/ui'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CartButton } from '@/app/[locale]/(marketing-no-footer)/cart/_features/cart-button'
import type { MainMenuStructure } from '@/app/[locale]/admin/cms/_features/types'
import { MegaMenu } from '@/components/layout/mega-menu'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useDiscoverMenu } from '@/components/layout/use-discover-menu'
import { useScrollHeader } from '@/components/layout/use-scroll-header'
import { Logo } from '@/components/ui/logo'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type HeaderElementProps = Omit<ComponentPropsWithoutRef<'header'>, 'children'>
type AppLinkProps = ComponentProps<typeof Link>
type HeaderNavigationItem = {
  id: 'home' | 'projects' | 'products' | 'discover'
  name: 'home' | 'projects' | 'products' | 'discover'
  href: AppLinkProps['href'] | '#'
  label?: string
  mega?: MainMenuStructure[keyof MainMenuStructure]
}

type HeaderProps = HeaderElementProps & {
  user?: { id: string; email: string; avatarUrl?: string | null } | null
  menuData?: MainMenuStructure | null
}

export const Header = ({ user, menuData, className, ...rest }: HeaderProps) => {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const navigationMenuRef = useRef<HTMLElement | null>(null)
  const { isVisible } = useScrollHeader()

  const discoverMenu = useDiscoverMenu()

  const navigation = useMemo(() => {
    return [
      { id: 'home', name: 'home', href: '/' },
      {
        id: 'projects',
        name: 'projects',
        href: '/projects',
        mega: menuData?.projects,
      },
      {
        id: 'products',
        name: 'products',
        href: '/products',
        mega: menuData?.products,
      },
      {
        id: 'discover',
        name: 'discover',
        href: '#',
        label: t('discover'),
        mega: discoverMenu,
      },
    ] satisfies HeaderNavigationItem[]
  }, [menuData, t, discoverMenu])

  const closeMegaMenu = useCallback(() => setActiveMenu(null), [])

  useEffect(() => {
    if (!pathname) return
    setActiveMenu(null)
  }, [pathname])

  useEffect(() => {
    if (!isVisible) {
      closeMegaMenu()
    }
  }, [isVisible, closeMegaMenu])

  useEffect(() => {
    if (!activeMenu) return

    const onDocumentPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (target.closest('[data-mega-menu-surface="true"]')) return
      if (navigationMenuRef.current?.contains(target)) return
      setActiveMenu(null)
    }

    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    return () => document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  }, [activeMenu])

  const avatarUrl = user?.avatarUrl ?? null
  const initial = (user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <header
      {...rest}
      className={cn(
        'hidden md:block fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
        className,
      )}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="container relative mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex cursor-pointer items-center gap-3">
          <Logo variant="icon" height={40} width={40} className="h-10" />
          <span className="text-xl font-bold text-foreground">Make the Change</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu
          ref={navigationMenuRef}
          aria-label="Navigation principale"
          className="relative hidden md:flex"
          value={activeMenu}
          delay={0}
          closeDelay={0}
          onValueChange={(value, eventDetails) => {
            if (eventDetails.reason === 'trigger-hover') return
            const nextValue = typeof value === 'string' ? value : null
            if (eventDetails.reason === 'trigger-press' && nextValue === activeMenu) {
              setActiveMenu(null)
              return
            }
            setActiveMenu(nextValue)
          }}
        >
          <NavigationMenuList className="items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const label = item.label ?? t(item.name)
              if (item.mega) {
                const isMegaOpen = activeMenu === item.id
                return (
                  <NavigationMenuItem key={item.id} value={item.id}>
                    <NavigationMenuTrigger
                      className={cn(
                        'flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                        (isActive || isMegaOpen) && 'bg-accent text-accent-foreground',
                      )}
                      onClick={(event) => {
                        if (!isMegaOpen) return
                        event.preventDefault()
                        closeMegaMenu()
                      }}
                      onKeyDown={(event) => {
                        if (!isMegaOpen) return
                        if (event.key !== 'Enter' && event.key !== ' ') return
                        event.preventDefault()
                        closeMegaMenu()
                      }}
                    >
                      {label}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="pointer-events-none w-full border-0 bg-transparent p-0 shadow-none">
                      <MegaMenu content={item.mega} onClose={closeMegaMenu} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )
              }
              return (
                <NavigationMenuItem key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      'cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      isActive && 'bg-accent text-accent-foreground',
                    )}
                    onMouseEnter={closeMegaMenu}
                    onFocus={closeMegaMenu}
                  >
                    {label}
                  </Link>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
          <NavigationMenuViewport className="fixed inset-x-0 top-[4.5rem] z-50 px-4" />
          <NavigationMenuBackdrop
            className="fixed inset-0 top-16 z-40 bg-gradient-to-b from-black/5 to-black/15 backdrop-blur-[3px] transition-opacity duration-200 data-closed:opacity-0 data-open:opacity-100 dark:from-black/35 dark:to-black/65"
            onPointerDown={closeMegaMenu}
            onClick={closeMegaMenu}
          />
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm" className="h-11 cursor-pointer gap-2 px-2.5">
                <Link href="/dashboard" className="cursor-pointer">
                  <Avatar className="h-8 w-8 ring-1 ring-border">
                    <AvatarImage src={avatarUrl || undefined} alt="" className="object-cover" />
                    <AvatarFallback className="bg-linear-to-br from-primary/10 via-secondary/10 to-accent/10 text-xs font-bold text-primary">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{t('dashboard')}</span>
                </Link>
              </Button>

              <Popover>
                <PopoverTrigger
                  aria-label="Menu utilisateur"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                >
                  <ChevronDown className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent className="w-44 p-1">
                  <Link
                    href="/dashboard/profile"
                    className="block cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block cursor-pointer rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    Paramètres
                  </Link>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" aria-label={t('login')}>
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  {t('login')}
                </Button>
              </Link>
            </div>
          )}

          <CartButton />
          <ThemeToggle />

          {/* Mobile Menu is now handled mostly by BottomNav in layouts, but kept here for fallback if needed on other pages */}
          {/* Since we hide the entire header on mobile (hidden md:block), this part won't be visible anyway */}
        </div>
      </div>
    </header>
  )
};
