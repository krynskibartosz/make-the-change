'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@make-the-change/core/ui'
import { ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { MegaMenu } from '@/components/layout/mega-menu'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Logo } from '@/components/ui/logo'
import type { MainMenuStructure } from '@/features/cms/types'
import { CartButton } from '@/features/commerce/cart/cart-button'
import { useScrollHeader } from '@/hooks/use-scroll-header'
import { Link, usePathname } from '@/i18n/navigation'
import { placeholderImages } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user?: { id: string; email: string; avatarUrl?: string | null } | null
  menuData?: MainMenuStructure | null
}

export function Header({ user, menuData }: HeaderProps) {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const { isVisible } = useScrollHeader()

  const navigation = useMemo(() => {
    const fallbackDiscoverMenu = {
      title: t('discover_menu.title'),
      sections: [
        {
          title: t('discover_menu.sections.concept'),
          items: [
            {
              title: t('discover_menu.items.mission'),
              href: '/about',
              image: placeholderImages.categories.eco,
            },
            {
              title: t('discover_menu.items.how_it_works'),
              href: '/how-it-works',
              image: placeholderImages.categories.eco,
            },
            {
              title: t('discover_menu.items.producers'),
              href: '/producers',
              image: placeholderImages.categories.eco,
            },
          ],
        },
        {
          title: t('discover_menu.sections.experience'),
          items: [
            {
              title: t('discover_menu.items.challenges'),
              href: '/challenges',
              image: placeholderImages.categories.bien_etre,
            },
            {
              title: t('discover_menu.items.leaderboard'),
              href: '/leaderboard',
              image: placeholderImages.categories.bien_etre,
            },
            {
              title: t('discover_menu.items.biodex'),
              href: '/biodex',
              image: placeholderImages.categories.bien_etre,
            },
          ],
        },
        {
          title: t('discover_menu.sections.help_resources'),
          items: [
            {
              title: t('discover_menu.items.blog'),
              href: '/blog',
              image: placeholderImages.categories.default,
            },
            {
              title: t('discover_menu.items.faq'),
              href: '/faq',
              image: placeholderImages.categories.default,
            },
            {
              title: t('discover_menu.items.contact'),
              href: '/contact',
              image: placeholderImages.categories.default,
            },
          ],
        },
      ],
    }

    const brandGuidelinesItem = {
      title: t('brand_guidelines'),
      href: '/brand-guidelines',
      image: placeholderImages.categories.default,
    }

    const baseDiscoverMenu = menuData?.discover || fallbackDiscoverMenu
    const alreadyInDiscover = baseDiscoverMenu.sections.some((section) =>
      section.items.some((item) => item.href === '/brand-guidelines'),
    )

    const discoverMenuWithBrandGuidelines = alreadyInDiscover
      ? baseDiscoverMenu
      : {
          ...baseDiscoverMenu,
          sections:
            baseDiscoverMenu.sections.length > 0
              ? baseDiscoverMenu.sections.map((section, index, sections) =>
                  index === sections.length - 1
                    ? { ...section, items: [...section.items, brandGuidelinesItem] }
                    : section,
                )
              : [
                  {
                    title: t('discover_menu.sections.help_resources'),
                    items: [brandGuidelinesItem],
                  },
                ],
        }

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
        mega: discoverMenuWithBrandGuidelines,
      },
    ]
  }, [menuData, t])

  const activeMegaMenu = useMemo(
    () => navigation.find((item) => item.id === activeMenu)?.mega,
    [activeMenu, navigation],
  )
  const closeMegaMenu = () => setActiveMenu(null)

  useEffect(() => {
    setActiveMenu(null)
  }, [])

  const avatarUrl = user?.avatarUrl ?? null
  const initial = (user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <header
      className={cn(
        'hidden md:block fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
      )}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <nav className="container relative mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Logo variant="icon" height={40} width={40} className="h-10" />
          <span className="text-xl font-bold text-foreground">Make the Change</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const label = item.label ?? t(item.name)
              if (item.mega) {
                return (
                  <NavigationMenuItem key={item.id}>
                    <button
                      type="button"
                      className={cn(
                        'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                        (isActive || activeMenu === item.id) && 'bg-accent text-accent-foreground',
                      )}
                      aria-expanded={activeMenu === item.id}
                      aria-controls={`mega-menu-${item.id}`}
                      aria-haspopup="true"
                      onMouseEnter={() => setActiveMenu(item.id)}
                      onFocus={() => setActiveMenu(item.id)}
                      onClick={() => setActiveMenu((prev) => (prev === item.id ? null : item.id))}
                    >
                      {label}
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </NavigationMenuItem>
                )
              }
              return (
                <NavigationMenuItem key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
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
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm" className="h-11 gap-2 px-2.5">
                <Link href="/dashboard" aria-label={t('dashboard')}>
                  <Avatar className="h-8 w-8 ring-1 ring-border">
                    <AvatarImage src={avatarUrl || undefined} alt="" className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 text-xs font-bold text-primary">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{t('dashboard')}</span>
                </Link>
              </Button>

              <Popover>
                <PopoverTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground hover:bg-muted">
                  <ChevronDown className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent className="w-44 p-1">
                  <Link
                    href="/dashboard/profile"
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    Profil
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    Paramètres
                  </Link>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t('login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t('register')}</Button>
              </Link>
            </div>
          )}

          <CartButton />
          <ThemeToggle />

          {/* Mobile Menu is now handled mostly by BottomNav in layouts, but kept here for fallback if needed on other pages */}
          {/* Since we hide the entire header on mobile (hidden md:block), this part won't be visible anyway */}
        </div>
        {activeMegaMenu && (
          <div id={`mega-menu-${activeMenu}`} className="absolute left-0 right-0 top-full">
            <MegaMenu content={activeMegaMenu} onClose={closeMegaMenu} />
          </div>
        )}
      </nav>

      {activeMegaMenu && (
        <div
          className="fixed inset-0 top-16 z-40 bg-background/40 backdrop-blur-sm"
          onClick={closeMegaMenu}
          onMouseEnter={closeMegaMenu}
        />
      )}
    </header>
  )
}
