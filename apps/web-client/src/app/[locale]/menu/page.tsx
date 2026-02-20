'use client'

import { Button } from '@make-the-change/core/ui'
import { Coins, LayoutDashboard, Lock, PiggyBank, ShoppingBag, UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { useDiscoverMenu } from '@/components/layout/use-discover-menu'
import { CategoryCard } from '@/components/ui/category-card'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase/client'
import { asString, isRecord } from '@/lib/type-guards'

export default function MenuPage() {
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
          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary ring-2 ring-background">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold">{initial}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-semibold text-lg">{user.email}</p>
              <Link
                href="/dashboard/profile"
                className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 mt-1"
              >
                {tMenu('user.view_profile')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/login">
                  <Lock className="h-4 w-4 mr-2" />
                  {tNav('login')}
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full">
                <Link href="/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {tNav('register')}
                </Link>
              </Button>
            </div>
            <div className="space-y-1 rounded-xl border bg-card p-1 shadow-sm">
              <Link
                href="/forgot-password"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Lock className="h-5 w-5 text-muted-foreground" />
                {tMenu('auth.forgot_password')}
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard Links (if user) */}
        {user && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
              {tMenu('sections.account')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard"
                className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{tNav('dashboard')}</span>
              </Link>

              <Link
                href="/dashboard/investments"
                className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <PiggyBank className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{tNav('my_investments')}</span>
              </Link>

              <Link
                href="/dashboard/orders"
                className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{tNav('my_orders')}</span>
              </Link>

              <Link
                href="/dashboard/points"
                className="flex flex-col items-start justify-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:bg-accent/50 hover:shadow-md"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Coins className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">{tNav('my_points')}</span>
              </Link>
            </div>
          </div>
        )}

        {/* Discover Menu Sections (Reusing Mega Menu Data) */}
        {discoverMenu.sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
              {section.title}
            </h3>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {section.items.map((item) => (
                <CategoryCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                  href={item.href}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Featured Section */}
        {discoverMenu.featured && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-1">
              {tNav('discover_menu.featured.title')}
            </h3>
            <Link
              href={discoverMenu.featured.href}
              className="group relative flex h-64 flex-col overflow-hidden rounded-2xl border bg-muted/30"
            >
              <img
                src={discoverMenu.featured.image}
                alt={discoverMenu.featured.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="relative mt-auto space-y-2 p-6">
                <h4 className="text-xl font-semibold text-foreground">
                  {discoverMenu.featured.title}
                </h4>
                {discoverMenu.featured.description && (
                  <p className="text-sm text-muted-foreground">
                    {discoverMenu.featured.description}
                  </p>
                )}
                <span className="inline-flex w-fit items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {discoverMenu.featured.ctaLabel}
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Settings & Theme */}
        <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm mt-8">
          <span className="font-medium">{tMenu('theme')}</span>
          <ThemeToggle />
        </div>

        <div className="text-center text-xs text-muted-foreground pt-8 pb-4">
          <p>{tMenu('version', { version: '1.0.0' })}</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="hover:underline">
              {tFooter('terms')}
            </Link>
            <Link href="/privacy" className="hover:underline">
              {tFooter('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
