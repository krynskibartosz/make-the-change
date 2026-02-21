'use client'

import { Card } from '@make-the-change/core/ui'
import { useEffect } from 'react'
import { CategoryCard } from '@/components/ui/category-card'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export type MegaMenuItem = {
  title: string
  description?: string
  image: string
  href: string
}

export type MegaMenuSection = {
  title: string
  items: MegaMenuItem[]
}

export type MegaMenuFooterLink = {
  title: string
  href: string
}

export type MegaMenuContent = {
  eyebrow?: string
  title: string
  description?: string
  sections: MegaMenuSection[]
  footerLinks?: MegaMenuFooterLink[]
  featured?: {
    title: string
    description?: string
    image: string
    href: string
    ctaLabel: string
  }
}

export type MegaMenuProps = {
  content: MegaMenuContent
  onClose: () => void
  className?: string
  variant?: 'floating' | 'header-attached'
}

export const MegaMenu = ({ content, onClose, className, variant = 'floating' }: MegaMenuProps) => {
  const isHeaderAttached = variant === 'header-attached'
  const hasIntro =
    (content.eyebrow && content.eyebrow.trim().length > 0) ||
    content.title.trim().length > 0 ||
    (content.description && content.description.trim().length > 0)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className={cn('pointer-events-none w-full', className)}>
      <Card
        data-mega-menu-surface="true"
        className={cn(
          'pointer-events-auto relative isolate overflow-hidden mx-auto w-full p-6 backdrop-blur-3xl',
          isHeaderAttached
            ? 'max-w-none rounded-none border-0 bg-white/34 shadow-[0_24px_55px_-30px_rgba(15,23,42,0.38),inset_0_1px_0_rgba(255,255,255,0.72)] supports-backdrop-filter:bg-white/20 dark:bg-slate-950/56 dark:supports-backdrop-filter:bg-slate-950/38'
            : 'max-w-[82rem] rounded-[1.75rem] border border-white/75 bg-white/52 shadow-[0_32px_90px_-38px_rgba(15,23,42,0.34),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(15,23,42,0.04)] ring-1 ring-white/80 supports-backdrop-filter:bg-white/30 dark:border-white/25 dark:bg-slate-950/40 dark:ring-white/30 dark:supports-backdrop-filter:bg-slate-950/18',
        )}
        style={{
          backdropFilter: 'blur(34px) saturate(165%)',
          WebkitBackdropFilter: 'blur(34px) saturate(165%)',
          transform: 'translateZ(0)',
        }}
      >
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-2xl',
            isHeaderAttached
              ? 'bg-white/22 supports-backdrop-filter:bg-white/10 dark:bg-slate-900/26 dark:supports-backdrop-filter:bg-slate-900/14'
              : 'bg-white/42 supports-backdrop-filter:bg-white/24 dark:bg-slate-900/24 dark:supports-backdrop-filter:bg-slate-900/10',
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit]',
            isHeaderAttached
              ? 'bg-gradient-to-b from-white/42 via-white/16 to-transparent dark:from-white/12 dark:via-white/6 dark:to-transparent'
              : 'bg-gradient-to-br from-white/70 via-white/32 to-transparent dark:from-white/18 dark:via-white/8 dark:to-transparent',
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-20 rounded-t-[inherit] bg-gradient-to-b to-transparent',
            isHeaderAttached
              ? 'from-white/34 dark:from-white/14'
              : 'from-white/62 dark:from-white/20',
          )}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: isHeaderAttached
              ? 'radial-gradient(110% 85% at 0% 0%, rgba(255,255,255,0.48), transparent 55%), radial-gradient(110% 85% at 100% 0%, rgba(255,255,255,0.2), transparent 60%)'
              : 'radial-gradient(120% 90% at 0% 0%, rgba(255,255,255,0.72), transparent 58%), radial-gradient(120% 90% at 100% 100%, rgba(132,204,22,0.1), transparent 64%)',
          }}
        />
        <div
          className={cn(
            'relative',
            isHeaderAttached && 'mx-auto w-full max-w-[1920px] px-4 md:px-8 lg:px-12',
          )}
        >
          <div className="grid gap-6 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">
            <div>
              {hasIntro && (
                <div className="mb-6">
                  {content.eyebrow && (
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {content.eyebrow}
                    </p>
                  )}
                  {content.title.trim().length > 0 && (
                    <h3 className="text-2xl font-semibold text-foreground">{content.title}</h3>
                  )}
                  {content.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{content.description}</p>
                  )}
                </div>
              )}

              <div
                className={cn(
                  'grid gap-4 sm:grid-cols-2',
                  content.sections.length === 3 && content.sections.some((s) => s.items.length > 3)
                    ? 'lg:grid-cols-4 md:grid-cols-2'
                    : content.sections.length >= 3
                      ? 'lg:grid-cols-3 md:grid-cols-2'
                      : 'md:grid-cols-2',
                )}
              >
                {content.sections.map((section) => (
                  <div
                    key={section.title}
                    className={cn(
                      'space-y-3',
                      // Force col-span-2 for sections with many items (Help & Resources) to give them room for their 2-column internal grid
                      section.items.length > 3 && 'col-span-2',
                    )}
                  >
                    {section.title.trim().length > 0 && (
                      <p className="text-sm font-semibold text-foreground">{section.title}</p>
                    )}
                    <ul
                      className={cn(
                        'grid gap-3 list-none m-0 p-0',
                        section.items.length > 3
                          ? 'grid-cols-1 sm:grid-cols-2'
                          : section.items.length === 2
                            ? 'grid-cols-1 md:grid-cols-2'
                            : 'grid-cols-1',
                      )}
                    >
                      {section.items.map((item) => (
                        <li key={item.title}>
                          <CategoryCard
                            title={item.title}
                            image={item.image}
                            href={item.href}
                            onClick={onClose}
                            className={cn(isHeaderAttached && 'border-transparent')}
                            {...(item.description !== undefined
                              ? { description: item.description }
                              : {})}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {content.footerLinks && content.footerLinks.length > 0 && (
                <div
                  className={cn(
                    'mt-5 pt-3',
                    isHeaderAttached
                      ? 'rounded-xl bg-background/65 px-3 py-2 backdrop-blur-md supports-backdrop-filter:bg-background/50'
                      : 'border-t border-border/60',
                  )}
                >
                  <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1 p-0">
                    {content.footerLinks.map((link) => (
                      <li key={`${link.title}-${link.href}`}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-1 text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                            isHeaderAttached ? 'text-foreground/80' : 'text-muted-foreground',
                            isHeaderAttached
                              ? 'hover:bg-foreground/10 hover:text-foreground'
                              : 'hover:bg-accent/60 hover:text-foreground',
                          )}
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {content.featured && (
              <Link
                href={content.featured.href}
                onClick={onClose}
                className={cn(
                  'group relative flex h-full max-h-[400px] flex-col overflow-hidden rounded-2xl bg-muted/30',
                  isHeaderAttached ? 'border-transparent' : 'border',
                )}
              >
                <img
                  src={content.featured.image}
                  alt={content.featured.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                <div className="relative mt-auto space-y-3 p-6">
                  <h4 className="text-2xl font-semibold text-foreground">
                    {content.featured.title}
                  </h4>
                  {content.featured.description && (
                    <p className="text-sm text-muted-foreground">{content.featured.description}</p>
                  )}
                  <span className="inline-flex w-fit items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {content.featured.ctaLabel}
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
