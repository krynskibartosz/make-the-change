'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  X,
  ChevronRight,
  Target,
  Building2,
  CreditCard,
  Coins,
  Bug,
  Folder,
  Activity,
  Repeat,
  TrendingUp,
  Gem,
  BookOpen,
  Globe,
  FolderTree,
  Sparkles,
  User,
  Handshake,
  FileText,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback, type FC } from 'react';

import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';
import { useAdminSidebar } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-sidebar-context';
import { ThemeToggle } from '@/app/[locale]/admin/(dashboard)/components/theme/theme-toggle';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Button } from '@/components/ui/button';

import type { LucideIcon } from 'lucide-react';
import LogoImage from '@/../../../assets/logo.png';

const useNavigationSections = () => {
  const tSidebar = useTranslations('admin.sidebar');
  const tProducts = useTranslations('admin.products');
  const tProjects = useTranslations('admin.projects');
  const tOrders = useTranslations('admin.orders');
  const tPartners = useTranslations('admin.partners');
  const tUsers = useTranslations('navigation');
  const tSubscriptions = useTranslations('admin.subscriptions');
  const tInvestments = useTranslations('admin.investments');
  const tBiodex = useTranslations('admin.biodex');
  const tCategories = useTranslations('admin.categories');
  const tPointsTransactions = useTranslations('admin.pointsTransactions');

  return [
    {
      key: 'dashboard',
      label: tSidebar('dashboard.label'),
      icon: LayoutDashboard,
      isStandalone: true,
      href: '/admin',
      description: tSidebar('dashboard.description'),
    },
    {
      key: 'activity',
      label: tSidebar('groups.activity'),
      icon: Activity,
      items: [
        {
          href: '/admin/orders',
          icon: ShoppingCart,
          label: tSidebar('links.orders'),
          description: tOrders('description'),
        },
        {
          href: '/admin/subscriptions',
          icon: Repeat,
          label: tSidebar('links.subscriptions'),
          description: tSubscriptions('title'),
        },
        {
          href: '/admin/investments',
          icon: TrendingUp,
          label: tSidebar('links.investments'),
          description: tInvestments('title'),
        },
        {
          href: '/admin/points-transactions',
          icon: Gem,
          label: tSidebar('links.pointsTransactions'),
          description: tPointsTransactions('title'),
        },
      ],
    },
    {
      key: 'catalog',
      label: tSidebar('groups.catalog'),
      icon: BookOpen,
      items: [
        {
          href: '/admin/products',
          icon: Package,
          label: tSidebar('links.products'),
          description: tProducts('title'),
        },
        {
          href: '/admin/projects',
          icon: Globe,
          label: tSidebar('links.projects'),
          description: tProjects('title'),
        },
        {
          href: '/admin/blog',
          icon: FileText,
          label: 'Blog',
          description: 'Gestion des articles de blog',
        },
        {
          href: '/admin/categories',
          icon: FolderTree,
          label: tSidebar('links.categories'),
          description: tCategories('title'),
        },
        {
          href: '/admin/biodex',
          icon: Sparkles,
          label: tSidebar('links.biodex'),
          description: tBiodex('title'),
        },
      ],
    },
    {
      key: 'community',
      label: tSidebar('groups.community'),
      icon: Users,
      items: [
        {
          href: '/admin/users',
          icon: User,
          label: tSidebar('links.users'),
          description: tUsers('users'),
        },
        {
          href: '/admin/partners',
          icon: Handshake,
          label: tSidebar('links.partners'),
          description: tPartners('description'),
        },
      ],
    },
  ];
};

const stripTrailingSlash = (value: string) => {
  if (value.length <= 1) return value;
  return value.replace(/\/+$/, '');
};

const normalizePathname = (pathname?: string | null) => {
  if (!pathname) return '/';

  const withoutLocale = pathname.replace(
    /^\/([a-zA-Z]{2}(?:-[A-Za-z0-9]+)?)(?=\/|$)/,
    ''
  );

  const withLeadingSlash =
    withoutLocale.length === 0
      ? '/'
      : withoutLocale.startsWith('/')
        ? withoutLocale
        : `/${withoutLocale}`;

  return stripTrailingSlash(withLeadingSlash) || '/';
};

const isHrefActive = (href: string, pathname: string) => {
  const target = stripTrailingSlash(href);
  const current = stripTrailingSlash(pathname);

  if (target === '/admin') {
    return current === target;
  }

  return current === target || current.startsWith(`${target}/`);
};

export const AdminSidebar: FC = () => {
  const tSidebar = useTranslations('admin.sidebar');

  return (
    <aside
      aria-label={tSidebar('main_navigation')}
      role="navigation"
      className={cn(
        'z-10 hidden h-full bg-surface-1/95 md:relative md:block',
        'w-64 lg:w-72 xl:w-80',
        'backdrop-blur-xl transition-colors duration-300',
        'border-r border-border-subtle/80',
        'shadow-glow-md'
      )}
    >
      <AdminSidebarContent />
    </aside>
  );
};

export const AdminMobileSidebar: FC = () => {
  const { isMobileOpen, setIsMobileOpen } = useAdminSidebar();
  const closeMobileMenu = useCallback(
    () => setIsMobileOpen(false),
    [setIsMobileOpen]
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [_isClosing, setIsClosing] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    management: false,
  });
  const rawPathname = usePathname();
  const normalizedPath = normalizePathname(rawPathname);
  const navigationSections = useNavigationSections();
  const tSidebar = useTranslations('admin.sidebar');

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  useEffect(() => {
    const activeSection = navigationSections.find(section => {
      if (section.isStandalone) {
        return isHrefActive(section.href, normalizedPath);
      }

      return section.items?.some(item => isHrefActive(item.href, normalizedPath));
    });

    if (
      activeSection &&
      !activeSection.isStandalone &&
      !openSections[activeSection.key]
    ) {
      setOpenSections(prev => ({
        ...prev,
        [activeSection.key]: true,
      }));
    }
  }, [normalizedPath, openSections]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsClosing(true);
        setTimeout(() => {
          closeMobileMenu();
          setIsClosing(false);
        }, 300);
      }

      if (e.key === 'Tab' && sidebarRef.current) {
        const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
          'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!first || !last) return;

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      sidebarRef.current?.querySelector<HTMLElement>('a,button')?.focus();
    }, 150);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileOpen, closeMobileMenu]);

  const handleOverlayClick = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeMobileMenu();
      setIsClosing(false);
    }, 300);
  };

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
              'absolute top-0 left-0 h-full w-[92vw] max-w-[440px]',
              'flex flex-col',
              'from-surface-1/96 via-surface-1/92 to-surface-1/96 bg-gradient-to-br',
              'dark:from-surface-1/92 dark:via-surface-1/88 dark:to-surface-1/92',
              'backdrop-blur-3xl',
              'border-r border-border-subtle/35',
              'shadow-glow-md'
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
              className={cn(
                'flex flex-shrink-0 items-center justify-between p-7 pb-5',
                'border-b border-border-subtle/30 bg-surface-1/95'
              )}
              transition={{
                delay: 0.1,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {}
              <div className="flex items-center gap-4">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    alt="Make the CHANGE logo"
                    className="h-12 w-12 rounded-3xl object-cover"
                    height={48}
                    priority
                    src={LogoImage}
                    width={48}
                  />
                </motion.div>

                <div>
                  <h1
                    className={cn(
                      'text-foreground text-2xl font-bold tracking-tight',
                      'from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text'
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
                  'rounded-3xl p-3.5 transition-all duration-300',
                  'from-muted/60 to-muted/40 bg-gradient-to-br',
                  'border-border-subtle/25 border backdrop-blur-sm',
                  'text-muted-foreground active:from-muted/80 active:to-muted/60 active:bg-gradient-to-br',
                  'active:text-foreground shadow-lg active:shadow-xl',
                  'focus:ring-primary/25 focus:ring-2 focus:outline-none'
                )}
                onClick={handleOverlayClick}
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.header>

            {}
            <div className="min-h-0 flex-1 overflow-hidden">
              <nav className="sidebar-scroll-area h-full space-y-4 overflow-x-hidden overflow-y-auto py-6">
                {}
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  className="px-4"
                  initial={{ y: 20, opacity: 0 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <AdminMobileSidebarLink
                    description={tSidebar('dashboard.description')}
                    href="/admin"
                    icon={LayoutDashboard}
                    label={tSidebar('dashboard.label')}
                    onClick={closeMobileMenu}
                  />
                </motion.div>

                {}
                <motion.div
                  animate={{ opacity: 1, scaleX: 1 }}
                  className="mx-4"
                  initial={{ opacity: 0, scaleX: 0 }}
                  transition={{
                    delay: 0.35,
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <div className="via-border/30 h-px bg-gradient-to-r from-transparent to-transparent" />
                </motion.div>

                {}
                {navigationSections
                  .filter(section => !section.isStandalone)
                  .map((section, sectionIndex) => {
                    const isOpen = openSections[section.key];
                    const hasActiveItem =
                      section.items?.some(item =>
                        isHrefActive(item.href, normalizedPath)
                      ) ?? false;

                    return (
                      <motion.div
                        key={section.key}
                        animate={{ y: 0, opacity: 1 }}
                        className="space-y-2"
                        initial={{ y: 20, opacity: 0 }}
                        transition={{
                          delay: 0.4 + sectionIndex * 0.1,
                          duration: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                      >
                        {}
                        <div className="px-4">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              'flex w-full items-center justify-between rounded-xl p-3 transition-all duration-300',
                              'active:bg-muted/50 focus:bg-muted/30',
                              'focus:ring-primary/20 focus:ring-2 focus:outline-none',
                              hasActiveItem
                                ? 'from-primary/10 to-accent/5 border-primary/20 border bg-gradient-to-r'
                                : 'bg-muted/10 border-border/10 border'
                            )}
                            onClick={() => toggleSection(section.key)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'h-4 w-1 rounded-full transition-all duration-300',
                                  hasActiveItem
                                    ? 'from-primary to-accent bg-gradient-to-b'
                                    : 'bg-muted-foreground/30'
                                )}
                              />
                              <span
                                className={cn(
                                  'text-xs font-semibold tracking-wider uppercase transition-colors duration-300',
                                  hasActiveItem
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {section.label}
                              </span>
                            </div>

                            {}
                            <motion.div
                              animate={{ rotate: isOpen ? 90 : 0 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              <ChevronRight
                                className={cn(
                                  'h-4 w-4 transition-colors duration-300',
                                  hasActiveItem
                                    ? 'text-primary'
                                    : 'text-muted-foreground'
                                )}
                              />
                            </motion.div>
                          </motion.button>
                        </div>

                        {}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              animate={{ height: 'auto', opacity: 1 }}
                              className="space-y-1 overflow-hidden"
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
                                  className="px-4"
                                  exit={{ x: -20, opacity: 0 }}
                                  initial={{ x: -20, opacity: 0 }}
                                  transition={{
                                    delay: itemIndex * 0.05,
                                    duration: 0.3,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                  }}
                                >
                                  <AdminMobileSidebarLink
                                    description={item.description}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    depth={1}
                                    onClick={closeMobileMenu}
                                  />
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
              </nav>
            </div>

            {}
            <motion.footer
              animate={{ y: 0, opacity: 1 }}
              className="border-border/10 sidebar-footer-shadow flex-shrink-0 space-y-4 border-t p-6 pt-4"
              initial={{ y: 30, opacity: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {}
              <div className="flex flex-col items-stretch gap-3 py-2">
                <LocaleSwitcher />
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>

              {}
              <Button
                className="w-full border border-border/40 bg-muted/20 text-foreground/80 hover:bg-muted/30 hover:text-foreground"
                variant="outline"
                onClick={() => {
                  // TODO: Implement sign out functionality
                }}
              >
                {tSidebar('logout')}
              </Button>
            </motion.footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AdminSidebarContent: FC<{ onLinkClick?: () => void }> = ({
  onLinkClick,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const rawPathname = usePathname();
  const normalizedPath = normalizePathname(rawPathname);
  const navigationSections = useNavigationSections();
  const tSidebar = useTranslations('admin.sidebar');

  const handleSectionToggle = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (href: string) => isHrefActive(href, normalizedPath);

  return (
    <div className="text-foreground flex h-full min-h-0 flex-col">
      {}
      <header
        className={cn(
          'relative flex-shrink-0 p-8 pb-6',
          'from-muted/30 via-muted/10 bg-gradient-to-br to-transparent',
          'border-border/20 border-b'
        )}
      >
        {}
        <div className="flex items-center gap-4">
          <Image
            alt="Make the CHANGE logo"
            className="h-12 w-12 rounded-3xl object-cover"
            height={48}
            priority
            src={LogoImage}
            width={48}
          />

          <div className="flex-1">
            <h1
              className={cn(
                'text-foreground text-2xl font-bold tracking-tight',
                'from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text'
              )}
            >
              Make the CHANGE
            </h1>
          </div>
        </div>
      </header>

      {}
      <div className="min-h-0 flex-1 overflow-hidden">
        <nav className="sidebar-scroll-area h-full space-y-4 overflow-x-hidden overflow-y-auto py-6">
          {}
          <div className="px-6">
            <AdminSidebarLink
              href="/admin"
              icon={LayoutDashboard}
              label={tSidebar('dashboard.label')}
              onClick={onLinkClick}
              depth={0}
            />
          </div>

          {}
          <div className="px-6">
            <div className="via-border/40 relative h-px bg-gradient-to-r from-transparent to-transparent">
              <div className="bg-border/60 absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </div>
          </div>

          {}
          {navigationSections
            .filter(section => !section.isStandalone)
            .map((section, _sectionIndex) => {
              const sectionActive =
                section.items?.some(item => isActive(item.href)) ?? false;
              const isOpen = openSections[section.key] ?? sectionActive;

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
                        'flex w-full items-center justify-between rounded-xl p-4 transition-all duration-300',
                        'hover:bg-muted/30 active:bg-muted/50',
                        'focus:ring-primary/20 focus:ring-2 focus:ring-offset-2 focus:outline-none',
                        sectionActive
                          ? 'from-primary/8 to-accent/5 border-primary/15 border bg-gradient-to-r'
                          : 'bg-muted/10 border-border/10 hover:border-border/20 border'
                      )}
                      onClick={() => handleSectionToggle(section.key)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-5 w-1.5 rounded-full transition-all duration-300',
                            sectionActive
                              ? 'from-primary to-accent bg-gradient-to-b'
                              : 'bg-muted-foreground/30'
                          )}
                        />

                        <div className="text-left">
                          <span
                            className={cn(
                              'text-sm font-semibold transition-colors duration-300',
                              sectionActive
                                ? 'text-primary'
                                : 'text-foreground/80'
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
                            sectionActive
                              ? 'text-primary'
                              : 'text-muted-foreground/60'
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
                        className="space-y-1 overflow-hidden"
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
                            depth={1}
                          />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>
              );
            })}
        </nav>
      </div>
      {}
      <footer className="border-border/20 sidebar-footer-shadow flex-shrink-0 space-y-4 border-t p-6">
        {}
        <div className="flex flex-col items-stretch gap-3 py-2">
          <LocaleSwitcher />
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </div>

        {}
        <Button
          className="w-full border border-border/40 bg-muted/20 text-foreground/80 hover:bg-muted/30 hover:text-foreground"
          variant="outline"
          onClick={() => {
            // TODO: Implement sign out functionality
          }}
        >
          {tSidebar('logout')}
        </Button>
      </footer>
    </div>
  );
};

type AdminSidebarLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  depth?: number;
};

const AdminSidebarLink: FC<AdminSidebarLinkProps> = ({
  href,
  icon: Icon,
  label,
  onClick,
  depth = 0,
}) => {
  const rawPathname = usePathname();
  const normalizedPath = normalizePathname(rawPathname);
  const isActive = isHrefActive(href, normalizedPath);
  const testId = href.replace('/admin', '').replace('/', '') || 'dashboard';
  const isSubItem = depth > 0;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      data-testid={`sidebar-link-${testId}`}
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl border border-transparent px-5 py-3 transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color-mix(in_srgb,var(--brand-primary-end)_70%,transparent)]',
        isSubItem ? 'ml-1 pl-7 pr-5 text-sm' : 'text-base',
        isActive
          ? [
              'bg-[linear-gradient(120deg,var(--brand-primary-start),var(--brand-primary-end))]',
              'text-white shadow-[0_12px_24px_rgba(20,184,166,0.25)]',
            ]
          : [
              'text-foreground/80 hover:text-foreground',
              'hover:bg-muted/20 hover:translate-x-1 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]',
            ]
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200',
          isSubItem ? 'h-9 w-9' : 'h-11 w-11',
          isActive
            ? 'bg-white/10 text-white shadow-inner'
            : 'bg-muted/40 text-muted-foreground/70 group-hover:bg-muted/60 group-hover:text-foreground'
        )}
      >
        <Icon
          className={cn(
            'transition-transform duration-200 group-hover:scale-105',
            isSubItem ? 'h-4 w-4' : 'h-5 w-5'
          )}
        />
      </span>

      <span
        className={cn(
          'min-w-0 flex-1 font-medium leading-snug transition-colors duration-200',
          'whitespace-normal',
          isSubItem && 'text-sm'
        )}
      >
        {label}
      </span>
    </Link>
  );
};

type AdminMobileSidebarProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick?: () => void;
  depth?: number;
};

const AdminMobileSidebarLink: FC<AdminMobileSidebarProps> = ({
  href,
  icon: Icon,
  label,
  description,
  onClick,
  depth = 0,
}) => {
  const rawPathname = usePathname();
  const normalizedPath = normalizePathname(rawPathname);
  const isActive = isHrefActive(href, normalizedPath);
  const isSubItem = depth > 0;

  return (
    <motion.div whileTap={isActive ? { scale: 1 } : { scale: 0.98 }}>
      <Link
        aria-current={isActive ? 'page' : undefined}
        href={href}
        onClick={onClick}
        className={cn(
          'group relative flex items-center gap-4 overflow-hidden rounded-3xl px-5 py-4 transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color-mix(in_srgb,var(--brand-primary-end)_70%,transparent)]',
          isSubItem && 'ml-1 pl-7 text-sm',
          isActive
            ? [
                'bg-[linear-gradient(120deg,var(--brand-primary-start),var(--brand-primary-end))]',
                'text-white shadow-[0_18px_32px_rgba(20,184,166,0.28)]',
              ]
            : [
                'border border-transparent bg-muted/15 text-foreground/80',
                'hover:bg-muted/25 hover:text-foreground hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]',
              ]
        )}
      >
        <span
          className={cn(
            'flex flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-200',
            isSubItem ? 'h-10 w-10' : 'h-12 w-12',
            isActive
              ? 'bg-white/15 text-white shadow-inner'
              : 'bg-muted/30 text-muted-foreground group-hover:bg-muted/45 group-hover:text-foreground'
          )}
        >
          <Icon
            className={cn(
              'transition-transform duration-200 group-hover:scale-105',
              isSubItem ? 'h-5 w-5' : 'h-6 w-6'
            )}
          />
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'font-semibold leading-snug transition-colors duration-200',
              'whitespace-normal',
              isSubItem ? 'text-sm' : 'text-base',
              isActive && 'text-white'
            )}
          >
            {label}
          </p>
          {description && (
            <p
              className={cn(
                'mt-1 text-xs leading-snug transition-colors duration-200',
                'whitespace-normal',
                isActive ? 'text-white/80' : 'text-muted-foreground'
              )}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center">
          {isActive ? (
            <motion.span
              animate={{ scale: 1 }}
              className="h-2 w-2 rounded-full bg-white"
              initial={{ scale: 0.6 }}
            />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-foreground" />
          )}
        </div>
      </Link>
    </motion.div>
  );
};
