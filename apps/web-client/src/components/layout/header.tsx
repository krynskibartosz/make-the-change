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
import { CartButton } from '@/features/commerce/cart/cart-button'
import { Link, usePathname } from '@/i18n/navigation'
import { getCategoryImage, placeholderImages } from '@/lib/placeholder-images'
import { cn } from '@/lib/utils'

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000'

const megaMenuContent = {
  projects: {
    eyebrow: 'Investir',
    title: 'Projets a impact',
    sections: [
      {
        title: 'Thematique',
        items: [
          {
            title: 'Biodiversite',
            image: placeholderImages.projects[0],
            href: '/projects?status=active',
          },
          {
            title: 'Agriculture durable',
            image: placeholderImages.projects[1],
            href: '/projects?status=active',
          },
        ],
      },
      {
        title: 'Explorer',
        items: [
          {
            title: 'Nouveautes',
            image: placeholderImages.projects[2],
            href: '/projects',
            badge: 'Nouveau',
          },
          {
            title: 'Projets populaires',
            image: placeholderImages.projects[0],
            href: '/projects',
          },
        ],
      },
    ],
    featured: {
      title: 'Investir dans la biodiversite',
      image: placeholderImages.projects[1],
      href: '/projects',
      ctaLabel: 'Voir tous les projets',
    },
  },
  products: {
    eyebrow: 'Boutique',
    title: 'Produits responsables',
    sections: [
      {
        title: 'Categories phares',
        items: [
          {
            title: 'Alimentation',
            image: getCategoryImage('alimentation'),
            href: '/products',
          },
          {
            title: 'Maison',
            image: getCategoryImage('maison'),
            href: '/products',
          },
        ],
      },
      {
        title: 'Inspiration',
        items: [
          {
            title: 'Bien-etre',
            image: getCategoryImage('bien_etre'),
            href: '/products',
            badge: 'Tendance',
          },
          {
            title: 'Eco lifestyle',
            image: getCategoryImage('eco'),
            href: '/products',
          },
        ],
      },
    ],
    featured: {
      title: 'Decouvrez la boutique',
      image: placeholderImages.products[0],
      href: '/products',
      ctaLabel: 'Voir la boutique',
    },
  },
  discover: {
    eyebrow: 'Explorer',
    title: 'Decouvrir Make the Change',
    sections: [
      {
        title: "S'informer",
        items: [
          {
            title: 'Biodex',
            image: placeholderImages.projects[0],
            href: '/biodex',
            badge: 'Nouveau',
          },
          {
            title: 'Comment ça marche',
            image: placeholderImages.projects[0],
            href: '/how-it-works',
          },
          {
            title: 'Blog',
            image: placeholderImages.projects[1],
            href: '/blog',
          },
          {
            title: 'À propos',
            image: placeholderImages.projects[2],
            href: '/about',
          },
        ],
      },
      {
        title: 'Communauté',
        items: [
          {
            title: 'Classement',
            image: getCategoryImage('bien_etre'),
            href: '/leaderboard',
            badge: 'Populaire',
          },
          {
            title: 'Espace Partenaire',
            image: getCategoryImage('eco'),
            href: ADMIN_URL,
          },
        ],
      },
    ],
    featured: {
      title: 'Rejoignez le mouvement',
      image: placeholderImages.profileCovers[0],
      href: '/register',
      ctaLabel: "S'inscrire",
    },
  },
}

const navigation = [
  { id: 'home', name: 'home', href: '/' },
  {
    id: 'projects',
    name: 'projects',
    href: '/projects',
    mega: megaMenuContent.projects,
  },
  {
    id: 'products',
    name: 'products',
    href: '/products',
    mega: megaMenuContent.products,
  },
  {
    id: 'discover',
    name: 'discover',
    href: '#',
    label: 'Découvrir',
    mega: megaMenuContent.discover,
  },
]

interface HeaderProps {
  user?: { id: string; email: string; avatarUrl?: string | null } | null
}

export function Header({ user }: HeaderProps) {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const activeMegaMenu = useMemo(
    () => navigation.find((item) => item.id === activeMenu)?.mega,
    [activeMenu],
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
    <header className="hidden md:block sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container relative mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-bold sm:inline-block">Make the CHANGE</span>
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
