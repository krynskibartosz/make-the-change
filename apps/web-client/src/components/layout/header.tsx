'use client'

import type { Locale } from '@make-the-change/core/i18n'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@make-the-change/core/ui'
import { ChevronDown } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  id: 'projects' | 'products' | 'discover'
  href: AppLinkProps['href'] | '#'
  label: string
  mega?: MainMenuStructure[keyof MainMenuStructure]
}

type HeaderProps = HeaderElementProps & {
  user?: { id: string; email: string; avatarUrl?: string | null } | null
  menuData?: MainMenuStructure | null
}

const toCategoryQueryToken = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

type CmsTextTranslations = {
  fr: string
  en: string
  nl: string
  aliases: string[]
}

const CMS_MENU_TEXT_TRANSLATIONS: CmsTextTranslations[] = [
  {
    fr: 'Investir',
    en: 'Invest',
    nl: 'Investeren',
    aliases: ['investir', 'invest', 'investeren'],
  },
  {
    fr: 'Biodiversité',
    en: 'Biodiversity',
    nl: 'Biodiversiteit',
    aliases: ['biodiversite', 'biodiversity', 'biodiversiteit'],
  },
  {
    fr: 'Agriculture durable',
    en: 'Sustainable farming',
    nl: 'Duurzame landbouw',
    aliases: ['agriculture durable', 'sustainable farming', 'duurzame landbouw'],
  },
  {
    fr: 'Investir dans la biodiversité',
    en: 'Invest in biodiversity',
    nl: 'Investeer in biodiversiteit',
    aliases: [
      'investir dans la biodiversite',
      'invest in biodiversity',
      'investeer in biodiversiteit',
    ],
  },
  {
    fr: 'Voir tous les projets',
    en: 'View all projects',
    nl: 'Bekijk alle projecten',
    aliases: ['voir tous les projets', 'view all projects', 'bekijk alle projecten'],
  },
  {
    fr: 'Boutique',
    en: 'Shop',
    nl: 'Winkel',
    aliases: ['boutique', 'shop', 'winkel'],
  },
  {
    fr: 'Alimentation',
    en: 'Food',
    nl: 'Voeding',
    aliases: ['alimentation', 'food', 'voeding'],
  },
  {
    fr: 'Maison',
    en: 'Home',
    nl: 'Huis',
    aliases: ['maison', 'home', 'huis'],
  },
  {
    fr: 'Découvrez la boutique',
    en: 'Discover the shop',
    nl: 'Ontdek de winkel',
    aliases: [
      'decouvrez la boutique',
      'découvrez la boutique',
      'discover the shop',
      'ontdek de winkel',
    ],
  },
  {
    fr: 'Voir la boutique',
    en: 'View shop',
    nl: 'Bekijk de winkel',
    aliases: ['voir la boutique', 'view shop', 'bekijk de winkel'],
  },
]

const normalizeCmsLabel = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')

const localizeCmsLabel = (value: string, locale: Locale): string => {
  const normalizedValue = normalizeCmsLabel(value)
  const matchingEntry = CMS_MENU_TEXT_TRANSLATIONS.find((entry) =>
    entry.aliases.some((alias) => normalizeCmsLabel(alias) === normalizedValue),
  )

  if (!matchingEntry) return value
  return matchingEntry[locale]
}

export const Header = ({ user, menuData, className, ...rest }: HeaderProps) => {
  const t = useTranslations('navigation')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const navigationMenuRef = useRef<HTMLElement | null>(null)
  const { isVisible } = useScrollHeader()

  const discoverMenu = useDiscoverMenu()
  const investMenu = useMemo(() => {
    const projectsMenu = menuData?.projects
    if (!projectsMenu) return undefined

    const categoryItems =
      projectsMenu.sections.find((section) => section.items.length > 0)?.items ??
      projectsMenu.sections.flatMap((section) => section.items)

    const normalizedItems = categoryItems.map((item) => ({
      ...item,
      title: localizeCmsLabel(item.title, locale),
      href: '/projects',
    }))

    return {
      ...projectsMenu,
      ...(projectsMenu.eyebrow !== undefined
        ? { eyebrow: localizeCmsLabel(projectsMenu.eyebrow, locale) }
        : {}),
      title: '',
      sections: [
        {
          title: '',
          items: normalizedItems,
        },
      ],
      ...(projectsMenu.featured !== undefined
        ? {
            featured: {
              ...projectsMenu.featured,
              title: localizeCmsLabel(projectsMenu.featured.title, locale),
              ctaLabel: localizeCmsLabel(projectsMenu.featured.ctaLabel, locale),
            },
          }
        : {}),
    } satisfies MainMenuStructure['projects']
  }, [locale, menuData?.projects])
  const shopMenu = useMemo(() => {
    const productsMenu = menuData?.products
    if (!productsMenu) return undefined

    const categoryItems =
      productsMenu.sections.find((section) => section.items.length > 0)?.items ??
      productsMenu.sections.flatMap((section) => section.items)

    const normalizedItems = categoryItems.map((item) => ({
      ...item,
      title: localizeCmsLabel(item.title, locale),
      href: item.href.includes('category=')
        ? item.href
        : (() => {
            const categoryToken = toCategoryQueryToken(item.title)
            if (!categoryToken) return '/products'
            return `/products?category=${encodeURIComponent(categoryToken)}`
          })(),
    }))

    return {
      ...productsMenu,
      ...(productsMenu.eyebrow !== undefined
        ? { eyebrow: localizeCmsLabel(productsMenu.eyebrow, locale) }
        : {}),
      title: '',
      sections: [
        {
          title: '',
          items: normalizedItems,
        },
      ],
      ...(productsMenu.featured !== undefined
        ? {
            featured: {
              ...productsMenu.featured,
              title: localizeCmsLabel(productsMenu.featured.title, locale),
              ctaLabel: localizeCmsLabel(productsMenu.featured.ctaLabel, locale),
            },
          }
        : {}),
    } satisfies MainMenuStructure['products']
  }, [locale, menuData?.products])

  const navigation = useMemo(() => {
    const projectsNavigationItem: HeaderNavigationItem = {
      id: 'projects',
      href: '/projects',
      label: t('invest'),
      ...(investMenu !== undefined ? { mega: investMenu } : {}),
    }

    const productsNavigationItem: HeaderNavigationItem = {
      id: 'products',
      href: '/products',
      label: t('shop'),
      ...(shopMenu !== undefined ? { mega: shopMenu } : {}),
    }

    const discoverNavigationItem: HeaderNavigationItem = {
      id: 'discover',
      href: '#',
      label: t('discover'),
      ...(discoverMenu !== undefined ? { mega: discoverMenu } : {}),
    }

    return [
      projectsNavigationItem,
      productsNavigationItem,
      discoverNavigationItem,
    ] satisfies HeaderNavigationItem[]
  }, [investMenu, shopMenu, t, discoverMenu])
  const activeMegaContent = useMemo(() => {
    const activeItem = navigation.find((item) => item.id === activeMenu)
    return activeItem?.mega ?? null
  }, [activeMenu, navigation])

  const closeMegaMenu = useCallback(() => setActiveMenu(null), [])

  useEffect(() => {
    setIsClient(true)
  }, [])

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
  const headerStyle = activeMegaContent
    ? {
        ...rest.style,
        backdropFilter: 'blur(34px) saturate(165%)',
        WebkitBackdropFilter: 'blur(34px) saturate(165%)',
      }
    : rest.style

  return (
    <header
      {...rest}
      className={cn(
        'hidden md:block fixed left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out',
        activeMegaContent
          ? 'border-b-0 bg-white/34 backdrop-blur-3xl supports-backdrop-filter:bg-white/20 dark:bg-slate-950/56 dark:supports-backdrop-filter:bg-slate-950/38'
          : 'border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60',
        isVisible ? 'top-0 opacity-100' : '-top-20 opacity-0',
        className,
      )}
      style={headerStyle}
    >
      <div className="w-full max-w-[1920px] relative mx-auto flex h-16 items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <Logo variant="icon" height={40} width={40} className="h-10" />
          <span className="text-xl font-bold text-foreground">Make the Change</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-center md:flex">
          <NavigationMenu
            ref={navigationMenuRef}
            aria-label="Navigation principale"
            className="pointer-events-auto relative z-10 flex items-center"
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
                const label = item.label
                if (item.mega) {
                  const isMegaOpen = activeMenu === item.id
                  return (
                    <NavigationMenuItem key={item.id} value={item.id}>
                      <NavigationMenuTrigger
                        className={cn(
                          'flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
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
                    </NavigationMenuItem>
                  )
                }
                return (
                  <NavigationMenuItem key={item.id}>
                    <Link
                      href={item.href}
                      className={cn(
                        'cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
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
            {activeMegaContent &&
              isClient &&
              createPortal(
                <>
                  <div
                    data-mega-menu-overlay="true"
                    className="fixed inset-x-0 bottom-0 top-16 z-40 bg-background/16 transition-opacity duration-200"
                    onPointerDown={closeMegaMenu}
                    onClick={closeMegaMenu}
                  />
                  <div
                    className="pointer-events-none fixed inset-x-0 top-16 z-[60] isolate"
                    style={{
                      transform: 'translateZ(0)',
                    }}
                  >
                    <MegaMenu
                      content={activeMegaContent}
                      onClose={closeMegaMenu}
                      variant="header-attached"
                    />
                  </div>
                </>,
                document.body,
              )}
          </NavigationMenu>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-11 cursor-pointer gap-2 px-2.5"
              >
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
}
