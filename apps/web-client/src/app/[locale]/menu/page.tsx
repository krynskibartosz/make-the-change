'use client'

import { Button } from '@make-the-change/core/ui'
import {
  Coins,
  LayoutDashboard,
  Lock,
  PiggyBank,
  ShoppingBag,
  UserPlus,
  ChevronRight,
  Target,
  Users,
  CircleDollarSign,
  Zap,
  BookOpen,
  MessageCircle,
  HelpCircle,
  Mail,
  Heart,
  FileText
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useDiscoverMenu } from '@/components/layout/use-discover-menu'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { asString, isRecord } from '@/lib/type-guards'

function getIconForTitle(href: string) {
  if (href.includes('about')) return <Target className="w-5 h-5 text-muted-foreground" />
  if (href.includes('producers')) return <Users className="w-5 h-5 text-muted-foreground" />
  if (href.includes('pricing')) return <CircleDollarSign className="w-5 h-5 text-muted-foreground" />
  if (href.includes('challenges')) return <Zap className="w-5 h-5 text-muted-foreground" />
  if (href.includes('biodex')) return <BookOpen className="w-5 h-5 text-muted-foreground" />
  if (href.includes('blog')) return <MessageCircle className="w-5 h-5 text-muted-foreground" />
  if (href.includes('faq')) return <HelpCircle className="w-5 h-5 text-muted-foreground" />
  if (href.includes('contact')) return <Mail className="w-5 h-5 text-muted-foreground" />
  return <FileText className="w-5 h-5 text-muted-foreground" />
}

const MenuPage = () => {
  const [user, setUser] = useState<{ id: string; email: string; avatarUrl?: string | null } | null>(
    null,
  )
  const tNav = useTranslations('navigation')
  const tMenu = useTranslations('menu_page')
  const tFooter = useTranslations('footer')

  // Get the shared menu data
  const discoverMenu = useDiscoverMenu()

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileDataRaw } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single()

      const profileData: unknown = profileDataRaw
      const avatarUrl = isRecord(profileData) ? asString(profileData.avatar_url) || null : null
      setUser({
        id: user.id,
        email: user.email || '',
        avatarUrl,
      })
    }
    getUser()
  }, [])

  const initial = (user?.email || '?').trim().charAt(0).toUpperCase()

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="container px-4 py-6 space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">{tMenu('title')}</h1>

        {/* User Profile Section */}
        {user ? (
          <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary ring-2 ring-background">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{initial}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg">Mon Profil</p>
              <p className="text-xs text-muted-foreground break-all">{user.email}</p>
              <Link
                href="/dashboard/profile"
                className="text-sm text-primary hover:underline flex items-center gap-1 mt-1 font-medium"
              >
                {tMenu('user.view_profile')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Button asChild variant="outline" size="lg" className="w-full rounded-2xl">
              <Link href="/login">
                <Lock className="h-4 w-4 mr-2" />
                {tNav('login')}
              </Link>
            </Button>
            <Button asChild size="lg" className="w-full rounded-2xl">
              <Link href="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                {tNav('register')}
              </Link>
            </Button>
          </div>
        )}

        {/* Dashboard Links (if user) */}
        {user && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 ml-2">
              {tMenu('sections.account')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard"
                className="flex flex-col items-start justify-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md"
              >
                <div className="rounded-full bg-blue-500/10 p-2 text-blue-500">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{tNav('dashboard')}</span>
              </Link>

              <Link
                href="/dashboard/investments"
                className="flex flex-col items-start justify-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md"
              >
                <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-500">
                  <PiggyBank className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Mes contributions</span>
              </Link>

              <Link
                href="/dashboard/orders"
                className="flex flex-col items-start justify-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md"
              >
                <div className="rounded-full bg-purple-500/10 p-2 text-purple-500">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{tNav('my_orders')}</span>
              </Link>

              <Link
                href="/dashboard/points"
                className="flex flex-col items-start justify-center gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md"
              >
                <div className="rounded-full bg-amber-500/10 p-2 text-amber-500">
                  <Coins className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{tNav('my_points')}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Featured Section Replaced - Coups de coeur */}
        {discoverMenu.featured && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 ml-2">
              À LA UNE
            </h3>
            <div className="flex flex-col overflow-hidden rounded-2xl border bg-card divide-y shadow-sm">
              <Link
                href={discoverMenu.featured.href}
                className="flex items-center justify-between p-4 active:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-rose-500/10 p-2 text-rose-500">
                    <Heart className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-foreground">Coups de cœur</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              </Link>
            </div>
          </div>
        )}

        {/* Discover Menu Sections (Reusing Mega Menu Data as ListTiles) */}
        {discoverMenu.sections.map((section) => (
          <div key={section.title} className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 ml-2">
              {section.title}
            </h3>
            <div className="flex flex-col overflow-hidden rounded-2xl border bg-card divide-y shadow-sm">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-4 active:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getIconForTitle(item.href)}
                    <span className="font-medium text-foreground items-center">{item.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Settings & Theme */}
        <div className="flex items-center justify-between rounded-2xl border bg-card p-4 shadow-sm mt-8">
          <span className="font-medium">{tMenu('theme')}</span>
          <ThemeToggle />
        </div>

        <div className="text-center text-xs text-muted-foreground pt-6 pb-4">
          <p>{tMenu('version', { version: '1.0.0' })}</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="hover:underline">
              {tFooter('terms')}
            </Link>
            <Link href="/privacy" className="hover:underline">
              {tFooter('privacy')}
            </Link>
            <Link href="/contact" className="hover:underline">
              {tFooter('contact')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuPage
