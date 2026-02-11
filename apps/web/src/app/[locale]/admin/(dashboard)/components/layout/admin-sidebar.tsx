'use client'
import { cn } from '@make-the-change/core/shared/utils'
import { Button } from '@make-the-change/core/ui'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  Map as MapIcon,
  Plus,
  Settings,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FC, useCallback, useEffect, useRef, useState } from 'react'
import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context'
import {
  AdminMobileSidebarLink,
  AdminSidebarLink,
} from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-links'
import { useNavigationSections } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-sections'
import { useAdminUiPreferences } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-ui-preferences'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { usePathname } from '@/i18n/navigation'
import { createClient } from '@/supabase/client'

export const AdminSidebar: FC = () => {
  const tSidebar = useTranslations('admin.sidebar')

  return (
    <aside
      aria-label={tSidebar('main_navigation')}
      role="navigation"
      className={cn(
        'hidden md:block md:relative h-full z-10',
        'w-64 lg:w-72 xl:w-80',
        'bg-gradient-to-b from-background/95 via-background/90 to-background/95',
        'dark:from-background/90 dark:via-background/85 dark:to-background/90',
        'backdrop-blur-xl',
        'border-r dark:border-[hsl(var(--border)/0.2)]',
        'shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.05)]',
        'dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.02)]',
      )}
    >
      <AdminSidebarContent />
    </aside>
  )
}

export const AdminMobileSidebar: FC = () => {
  const { isMobileOpen, setIsMobileOpen } = useAdminSidebar()
  const { workMode, toggleWorkMode } = useAdminUiPreferences()
  const closeMobileMenu = useCallback(() => setIsMobileOpen(false), [setIsMobileOpen])
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [_isClosing, setIsClosing] = useState(false)
  const navigationSections = useNavigationSections()
  const tSidebar = useTranslations('admin.sidebar')

  useEffect(() => {
    if (!isMobileOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsClosing(true)
        setTimeout(() => {
          closeMobileMenu()
          setIsClosing(false)
        }, 300)
      }

      if (e.key === 'Tab' && sidebarRef.current) {
        const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
          'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (!first || !last) return

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    setTimeout(() => {
      sidebarRef.current?.querySelector<HTMLElement>('a,button')?.focus()
    }, 150)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMobileOpen, closeMobileMenu])

  const handleOverlayClick = () => {
    setIsClosing(true)
    setTimeout(() => {
      closeMobileMenu()
      setIsClosing(false)
    }, 300)
  }

  const managementItems =
    navigationSections.find((section) => section.key === 'management')?.items ?? []
  const subscriptionItem = managementItems.find((item) => item.href === '/admin/subscriptions')

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {}
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-xl"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={handleOverlayClick}
          />

          {}
          <motion.div
            ref={sidebarRef}
            animate={{ x: 0, opacity: 1 }}
            aria-label={tSidebar('mobile_navigation_menu')}
            aria-modal="true"
            exit={{ x: '-100%', opacity: 0 }}
            initial={{ x: '-100%', opacity: 0 }}
            role="dialog"
            tabIndex={-1}
            className={cn(
              'absolute left-0 top-0 h-full w-[92vw] max-w-[440px]',
              'flex flex-col',
              'bg-gradient-to-br from-background/96 via-background/92 to-background/96',
              'dark:from-background/92 dark:via-background/88 dark:to-background/92',
              'backdrop-blur-3xl',
              'border-r border-[hsl(var(--border)/0.25)] dark:border-[hsl(var(--border)/0.15)]',
              'shadow-[0_40px_80px_-12px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.08)]',
              'dark:shadow-[0_40px_80px_-12px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.03)]',
            )}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
              duration: 0.5,
            }}
          >
            {}
            <motion.header
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: -30, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                'flex items-center justify-between p-7 pb-5 flex-shrink-0',
                'border-b border-[hsl(var(--border)/0.15)] bg-gradient-to-r from-muted/20 to-muted/10',
              )}
            >
              {}
              <div className="flex items-center gap-4">
                <motion.div className="relative group" whileTap={{ scale: 0.95 }}>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-3xl flex items-center justify-center relative overflow-hidden',
                      'bg-gradient-to-br from-primary via-primary to-accent',
                      'shadow-xl shadow-primary/30',
                    )}
                  >
                    <span className="text-white font-bold text-lg tracking-tight">M</span>

                    {}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-transparent" />
                  </div>

                  {}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-accent/40 rounded-3xl blur-xl opacity-60 animate-pulse motion-reduce:animate-none group-hover:opacity-80 transition-opacity" />
                </motion.div>

                <div>
                  <h1
                    className={cn(
                      'text-2xl font-bold text-foreground tracking-tight',
                      'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text',
                    )}
                  >
                    Make the CHANGE
                  </h1>
                </div>
              </div>

              {}
              <motion.button
                aria-label={tSidebar('close_menu')}
                whileTap={{ scale: 0.9, rotate: 90 }}
                className={cn(
                  'p-3.5 rounded-3xl transition-all duration-300',
                  'bg-gradient-to-br from-muted/60 to-muted/40',
                  'border border-[hsl(var(--border)/0.25)] backdrop-blur-sm',
                  'text-muted-foreground active:bg-gradient-to-br active:from-muted/80 active:to-muted/60',
                  'active:text-foreground shadow-lg active:shadow-xl',
                  'focus:outline-none focus:ring-2 focus:ring-primary/25',
                )}
                onClick={handleOverlayClick}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.header>

            {}
            <div className="flex-1 overflow-hidden min-h-0">
              <nav className="h-full overflow-y-auto overflow-x-hidden py-6 space-y-4 sidebar-scroll-area">
                <div className="px-6 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Raccourcis
                  </p>
                </div>

                <div className="px-4 space-y-2">
                  <AdminMobileSidebarLink
                    isCompact
                    description="Vue d’ensemble"
                    href="/admin/dashboard"
                    icon={LayoutDashboard}
                    label={tSidebar('dashboard.label')}
                    onClick={closeMobileMenu}
                  />

                  {subscriptionItem && (
                    <AdminMobileSidebarLink
                      isCompact
                      description={subscriptionItem.description}
                      href={subscriptionItem.href}
                      icon={subscriptionItem.icon}
                      label={subscriptionItem.label}
                      onClick={closeMobileMenu}
                    />
                  )}

                  <AdminMobileSidebarLink
                    isCompact
                    description="Vue carte"
                    href="/admin/projects/map"
                    icon={MapIcon}
                    label="Carte projets"
                    onClick={closeMobileMenu}
                  />

                  <AdminMobileSidebarLink
                    isCompact
                    description="Gérer les préférences"
                    href="/admin/settings"
                    icon={Settings}
                    label="Configuration"
                    onClick={closeMobileMenu}
                  />
                </div>

                <div className="px-6 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Créer
                  </p>
                </div>

                <div className="px-4 space-y-2">
                  <AdminMobileSidebarLink
                    isCompact
                    href="/admin/products/new"
                    icon={Plus}
                    label="Nouveau produit"
                    onClick={closeMobileMenu}
                  />
                  <AdminMobileSidebarLink
                    isCompact
                    href="/admin/projects/new"
                    icon={Plus}
                    label="Nouveau projet"
                    onClick={closeMobileMenu}
                  />
                  <AdminMobileSidebarLink
                    isCompact
                    href="/admin/partners/new"
                    icon={Plus}
                    label="Nouveau partenaire"
                    onClick={closeMobileMenu}
                  />
                  <AdminMobileSidebarLink
                    isCompact
                    href="/admin/users/new"
                    icon={Plus}
                    label="Nouvel utilisateur"
                    onClick={closeMobileMenu}
                  />
                  <AdminMobileSidebarLink
                    isCompact
                    href="/admin/subscriptions/new"
                    icon={Plus}
                    label="Nouvel abonnement"
                    onClick={closeMobileMenu}
                  />
                </div>
              </nav>
            </div>

            {}
            <motion.footer
              animate={{ y: 0, opacity: 1 }}
              className="p-6 pt-4 border-t border-[hsl(var(--border)/0.1)] space-y-4 flex-shrink-0 sidebar-footer-shadow"
              initial={{ y: 30, opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {}
              <div className="flex flex-col items-stretch gap-3 py-2">
                <LocaleSwitcher />
                <Button
                  aria-label={workMode ? 'Désactiver le mode travail' : 'Activer le mode travail'}
                  aria-pressed={workMode ? 'true' : 'false'}
                  className="w-full justify-center"
                  icon={<Briefcase className="h-4 w-4" />}
                  size="sm"
                  variant={workMode ? 'secondary' : 'outline'}
                  onClick={toggleWorkMode}
                >
                  Mode travail
                </Button>
              </div>

              {}
              <Button
                className="w-full"
                variant="destructive"
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.auth.signOut()
                  window.location.href = '/admin/login'
                }}
              >
                {tSidebar('logout')}
              </Button>
            </motion.footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const AdminSidebarContent: FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => {
  const { workMode, toggleWorkMode } = useAdminUiPreferences()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const pathname = usePathname()
  const navigationSections = useNavigationSections()
  const tSidebar = useTranslations('admin.sidebar')

  const handleSectionToggle = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === href : pathname?.startsWith(href)

  return (
    <div className="flex flex-col h-full min-h-0 text-foreground">
      {}
      <header
        className={cn(
          'relative p-8 pb-6 flex-shrink-0',
          'bg-gradient-to-br from-muted/30 via-muted/10 to-transparent',
          'border-b border-[hsl(var(--border)/0.2)]',
        )}
      >
        {}
        <div className="flex items-center gap-4">
          <div className="relative">
            {}
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden',
                'bg-gradient-to-br from-primary via-primary to-accent',
                'shadow-lg shadow-primary/25',
              )}
            >
              <span className="text-white font-bold text-lg tracking-tight">M</span>

              {}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
            </div>

            {}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/30 rounded-2xl blur-xl opacity-60 animate-pulse motion-reduce:animate-none" />
          </div>

          <div className="flex-1">
            <h1
              className={cn(
                'text-2xl font-bold text-foreground tracking-tight',
                'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text',
              )}
            >
              Make the CHANGE
            </h1>
          </div>
        </div>
      </header>

      {}
      <div className="flex-1 min-h-0 overflow-hidden">
        <nav className="h-full overflow-y-auto overflow-x-hidden py-6 space-y-4 sidebar-scroll-area">
          {}
          <div className="px-6">
            <AdminSidebarLink
              href="/admin/dashboard"
              icon={LayoutDashboard}
              label={tSidebar('dashboard.label')}
              onClick={onLinkClick}
            />
          </div>

          {}
          <div className="px-6">
            <div className="relative h-px bg-gradient-to-r from-transparent via-border/40 to-transparent">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-border/60 rounded-full" />
            </div>
          </div>

          {}
          {navigationSections
            .filter((section) => !section.isStandalone)
            .map((section, _sectionIndex) => {
              const sectionActive = section.items?.some((item) => isActive(item.href)) ?? false
              const isOpen = openSections[section.key] ?? sectionActive

              return (
                <section key={section.key} className="space-y-2">
                  {}
                  <div className="px-6">
                    <button
                      aria-expanded={isOpen}
                      role="button"
                      tabIndex={0}
                      type="button"
                      className={cn(
                        'w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300',
                        'hover:bg-muted/30 active:bg-muted/50',
                        'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                        sectionActive
                          ? 'bg-gradient-to-r from-primary/8 to-accent/5 border border-primary/15'
                          : 'bg-muted/10 border border-[hsl(var(--border)/0.1)] hover:border-[hsl(var(--border)/0.2)]',
                      )}
                      onClick={() => handleSectionToggle(section.key)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-1.5 h-5 rounded-full transition-all duration-300',
                            sectionActive
                              ? 'bg-gradient-to-b from-primary to-accent'
                              : 'bg-muted-foreground/30',
                          )}
                        />

                        <div className="text-left">
                          <span
                            className={cn(
                              'text-sm font-semibold transition-colors duration-300',
                              sectionActive ? 'text-primary' : 'text-foreground/80',
                            )}
                          >
                            {section.label}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <ChevronRight
                          className={cn(
                            'h-5 w-5 transition-colors duration-300',
                            sectionActive ? 'text-primary' : 'text-muted-foreground/60',
                          )}
                        />
                      </motion.div>
                    </button>
                  </div>

                  {}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        animate={{ height: 'auto', opacity: 1 }}
                        className="overflow-hidden space-y-1"
                        exit={{ height: 0, opacity: 0 }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                          opacity: { duration: 0.3 },
                        }}
                      >
                        {section.items?.map((item, itemIndex) => (
                          <motion.div
                            key={item.href}
                            animate={{ x: 0, opacity: 1 }}
                            className="px-6"
                            exit={{ x: -20, opacity: 0 }}
                            initial={{ x: -20, opacity: 0 }}
                            transition={{
                              delay: itemIndex * 0.05,
                              duration: 0.3,
                              ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                          >
                            <AdminSidebarLink
                              href={item.href}
                              icon={item.icon}
                              label={item.label}
                              onClick={onLinkClick}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              )
            })}

          {}
          {navigationSections
            .filter((section) => section.isStandalone && section.key !== 'dashboard')
            .map((section) => (
              <div key={section.key} className="px-6">
                <AdminSidebarLink
                  href={section.href || '#'}
                  icon={section.icon}
                  label={section.label}
                  onClick={onLinkClick}
                />
              </div>
            ))}
        </nav>
      </div>
      {}
      <footer className="p-6 border-t border-[hsl(var(--border)/0.2)] space-y-4 flex-shrink-0 sidebar-footer-shadow">
        <div className="flex flex-col items-stretch gap-3 py-2">
          <LocaleSwitcher />
          <Button
            aria-label={workMode ? 'Désactiver le mode travail' : 'Activer le mode travail'}
            aria-pressed={workMode ? 'true' : 'false'}
            className="w-full justify-center"
            icon={<Briefcase className="h-4 w-4" />}
            size="sm"
            variant={workMode ? 'secondary' : 'outline'}
            onClick={toggleWorkMode}
          >
            Mode travail
          </Button>
        </div>

        <Button
          className="w-full"
          variant="destructive"
          onClick={async () => {
            const supabase = createClient()
            await supabase.auth.signOut()
            window.location.href = '/admin/login'
          }}
        >
          {tSidebar('logout')}
        </Button>
      </footer>
    </div>
  )
}
