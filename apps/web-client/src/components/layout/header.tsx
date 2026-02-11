'use client'

import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetTrigger,
  Button,
} from '@make-the-change/core/ui'
import {
  ChevronDown,
  FileText,
  HelpCircle,
  Info,
  Leaf,
  Mail,
  Menu,
  ShieldCheck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { MegaMenu } from '@/components/layout/mega-menu'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Logo } from '@/components/ui/logo'
import { CartButton } from '@/features/commerce/cart/cart-button'
import { MainMenuStructure } from '@/features/cms/types'
import { Link, usePathname } from '@/i18n/navigation'
import { getCategoryImage, placeholderImages } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'
import { useScrollHeader } from '@/hooks/use-scroll-header'

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000'

interface HeaderProps {
  user?: { id: string; email: string; avatarUrl?: string | null } | null
  menuData?: MainMenuStructure | null
}

export function Header({ user, menuData }: HeaderProps) {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const { isVisible } = useScrollHeader()

  const navigation = useMemo(() => [
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
      label: 'Découvrir',
      mega: menuData?.discover || {
        title: 'Découvrir Make the Change',
        sections: [
          {
            title: 'Concept',
            items: [
              { title: 'Notre mission', href: '/about', image: placeholderImages.categories.eco },
              { title: 'Comment ça marche', href: '/how-it-works', image: placeholderImages.categories.eco },
              { title: 'Nos producteurs', href: '/producers', image: placeholderImages.categories.eco },
            ],
          },
          {
            title: 'Expérience',
            items: [
              { title: 'Défis', href: '/challenges', image: placeholderImages.categories.bien_etre },
              { title: 'Classement', href: '/leaderboard', image: placeholderImages.categories.bien_etre },
              { title: 'Biodex', href: '/biodex', image: placeholderImages.categories.bien_etre },
            ],
          },
          {
            title: 'Aide & Ressources',
            items: [
              { title: 'Blog', href: '/blog', image: placeholderImages.categories.default },
              { title: 'FAQ', href: '/faq', image: placeholderImages.categories.default },
              { title: 'Contact', href: '/contact', image: placeholderImages.categories.default },
            ],
          },
        ],
      },
    },
  ], [menuData])

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

  // On mobile, if we are in /products, we might want to hide the header completely
  // But generally, the user asked to "not have the header on mobile".
  // So we hide the <header> block on mobile via `hidden md:block` or similar logic.
  // However, the user said "Est je me dis on pourrait ne pas auvoir besoin du header en mobile non ?"
  // This implies removing it for mobile generally or specifically for the shop view.
  // Given the context of improving e-commerce UX (like Uber Eats/Nike apps), they often don't have a traditional website header.
  // Let's hide it on mobile for now as requested.

  return (
    <header 
      className={cn(
        "hidden md:block fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0
      }}
    >
      <nav className="container relative mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Logo variant="icon" height={40} width={40} className="h-10" />
          <span className="text-xl font-bold text-foreground">Make the Change</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const label = item.label ?? t(item.name)
            if (item.mega) {
              return (
                <button
                  key={item.id}
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
              )
            }
            return (
              <Link
                key={item.id}
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
            )
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm" className="h-11 gap-2 px-2.5">
                <Link href="/dashboard" aria-label={t('dashboard')}>
                  <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 ring-1 ring-border">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-primary">{initial}</span>
                    )}
                  </span>
                  <span className="font-medium">{t('dashboard')}</span>
                </Link>
              </Button>
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
