'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Button } from '@make-the-change/core/ui'
import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight, FolderOpen, Layout, LogOut, Package, Receipt, User, Globe } from 'lucide-react'
import { type FC, useState } from 'react'
import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context'
import { ThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/theme-toggle'
import { LocalizedLink } from '@/components/localized-link'
import { useAuth } from '@/hooks/use-auth'
import { usePathname, useRouter } from '@/i18n/navigation'

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3001'

const navigationSections = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: Layout,
    href: '/partner/dashboard',
    isStandalone: true,
  },
  {
    key: 'catalogue',
    label: 'Mon Catalogue',
    icon: Package,
    items: [
      { href: '/partner/products', icon: Package, label: 'Produits' },
      { href: '/partner/projects', icon: FolderOpen, label: 'Projets' },
    ],
  },
  {
    key: 'orders',
    label: 'Commandes',
    icon: Receipt,
    href: '/partner/orders',
    isStandalone: true,
  },
  {
    key: 'profile',
    label: 'Mon Profil',
    icon: User,
    href: '/partner/profile',
    isStandalone: true,
  },
  {
    key: 'client-site',
    label: 'Site Client',
    icon: Globe,
    href: CLIENT_URL,
    isStandalone: true,
  },
]

type SidebarContentProps = {
  onLinkClick?: () => void
}

const SidebarContent: FC<SidebarContentProps> = ({ onLinkClick }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    catalogue: true,
  })
  const { user } = useAuth()

  const handleSectionToggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col h-full min-h-0 text-foreground">
      <header
        className={cn(
          'relative p-8 pb-6 flex-shrink-0',
          'bg-gradient-to-br from-muted/30 via-muted/10 to-transparent',
          'border-b border-[hsl(var(--border)/0.2)]',
        )}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden',
                'bg-gradient-to-br from-primary via-primary to-green-500',
                'shadow-lg shadow-primary/25',
              )}
            >
              <span className="text-white font-bold text-lg tracking-tight">P</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-green-500/30 rounded-2xl blur-xl opacity-60 animate-pulse" />
          </div>
          <div className="flex-1">
            <h1
              className={cn(
                'text-xl font-bold text-foreground tracking-tight',
                'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text',
              )}
            >
              Partner Portal
            </h1>
            <p className="mt-1 text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        <nav className="h-full overflow-y-auto overflow-x-hidden py-6 space-y-4 sidebar-scroll-area">
          {navigationSections.map((section) =>
            section.isStandalone ? (
              <div key={section.key} className="px-6">
                <SidebarLink
                  href={section.href ?? '#'}
                  icon={section.icon}
                  label={section.label}
                  onClick={onLinkClick}
                />
              </div>
            ) : (
              <section key={section.key} className="space-y-2">
                <div className="px-6">
                  <button
                    aria-expanded={openSections[section.key]}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300',
                      'hover:bg-muted/30 active:bg-muted/50',
                      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                      openSections[section.key] ? 'bg-muted/20' : 'bg-muted/10',
                    )}
                    role="button"
                    tabIndex={0}
                    type="button"
                    onClick={() => handleSectionToggle(section.key)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-1.5 h-5 rounded-full transition-all duration-300',
                          openSections[section.key]
                            ? 'bg-gradient-to-b from-primary to-green-500'
                            : 'bg-muted-foreground/30',
                        )}
                      />
                      <span
                        className={cn(
                          'text-sm font-semibold uppercase tracking-wider transition-colors duration-300',
                          openSections[section.key] ? 'text-primary' : 'text-muted-foreground',
                        )}
                      >
                        {section.label}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: openSections[section.key] ? 90 : 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <ChevronRight
                        className={cn(
                          'h-5 w-5 transition-colors duration-300',
                          openSections[section.key] ? 'text-primary' : 'text-muted-foreground/60',
                        )}
                      />
                    </motion.div>
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {openSections[section.key] && (
                    <motion.div
                      animate={{ height: 'auto', opacity: 1 }}
                      className="overflow-hidden space-y-1"
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
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
                          <SidebarLink
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
            ),
          )}
        </nav>
      </div>
      <footer className="p-6 border-t border-[hsl(var(--border)/0.2)] space-y-4 flex-shrink-0 sidebar-footer-shadow">
        <div className="flex justify-center py-2">
          <ThemeToggle />
        </div>
        <SignOutButton />
      </footer>
    </div>
  )
}

type SidebarLinkProps = { href: string; icon: LucideIcon; label: string; onClick?: () => void }

const SidebarLink: FC<SidebarLinkProps> = ({ href, icon: Icon, label, onClick }) => {
  const pathname = usePathname()
  const isActive = href === '/partner/dashboard' ? pathname === href : pathname?.startsWith(href)
  const isExternal = href.startsWith('http')

  const LinkComponent = isExternal ? 'a' : LocalizedLink
  const linkProps = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href }

  return (
    <motion.div
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      whileHover={isActive ? {} : { scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <LinkComponent
        {...linkProps}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group relative flex items-center gap-4 rounded-2xl p-4 transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2',
          isActive
            ? 'bg-gradient-to-r from-primary/12 to-green-500/8 text-foreground font-semibold border border-primary/25 shadow-lg shadow-primary/10'
            : 'text-muted-foreground/80 hover:text-foreground border border-transparent hover:border-[hsl(var(--border)/0.3)] hover:bg-muted/30 hover:shadow-sm',
        )}
        onClick={onClick}
      >
        <div
          className={cn(
            'relative rounded-xl transition-all duration-300 flex items-center justify-center w-11 h-11',
            isActive
              ? 'bg-gradient-to-br from-primary/20 to-green-500/15 text-primary shadow-lg shadow-primary/20'
              : 'bg-muted/30 text-muted-foreground/70 group-hover:bg-muted/50 group-hover:text-muted-foreground',
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className="block font-medium transition-all duration-300 truncate text-base">
          {label}
        </span>
        {isActive && (
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-gradient-to-b from-primary to-green-500 rounded-r-full"
            layoutId="partner-sidebar-active-indicator"
          />
        )}
      </LinkComponent>
    </motion.div>
  )
}

const SignOutButton: FC = () => {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/admin/login')
  }

  return (
    <Button size="full" variant="outline" onClick={handleSignOut}>
      <LogOut className="h-4 w-4" />
      Se déconnecter
    </Button>
  )
}

// Desktop Sidebar
export const PartnerSidebar: FC = () => (
  <aside className="hidden md:flex w-72 flex-col h-screen border-r border-[hsl(var(--border)/0.2)] bg-background/80 backdrop-blur-xl z-30">
    <SidebarContent />
  </aside>
)

// Mobile Sidebar
export const PartnerMobileSidebar: FC = () => {
  const { isMobileOpen, setIsMobileOpen } = useAdminSidebar()

  return (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
          <motion.aside
            animate={{ x: 0 }}
            className="fixed left-0 top-0 h-full w-72 z-50 bg-background border-r border-[hsl(var(--border)/0.2)] md:hidden"
            exit={{ x: '-100%' }}
            initial={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <SidebarContent onLinkClick={() => setIsMobileOpen(false)} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default SidebarContent
