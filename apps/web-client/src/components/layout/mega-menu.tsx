'use client'

import { Card } from '@make-the-change/core/ui'
import type { FC } from 'react'
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

export type MegaMenuContent = {
  eyebrow?: string
  title: string
  description?: string
  sections: MegaMenuSection[]
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
}

export const MegaMenu: FC<MegaMenuProps> = ({ content, onClose, className }) => {
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
    <div className={cn('absolute left-0 right-0 top-full z-50', className)} onMouseLeave={onClose}>
      <Card className="mx-auto w-full max-w-[90rem] border-t-0 border-x-0 border-b bg-background/75 backdrop-blur-xl p-6 shadow-2xl supports-[backdrop-filter]:bg-background/75">
        <div className="grid gap-6 md:grid-cols-[1fr_240px] lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-6">
              {content.eyebrow && (
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {content.eyebrow}
                </p>
              )}
              <h3 className="text-2xl font-semibold text-foreground">{content.title}</h3>
              {content.description && (
                <p className="mt-2 text-sm text-muted-foreground">{content.description}</p>
              )}
            </div>

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
                  <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  <ul
                    className={cn(
                      'grid gap-3 list-none m-0 p-0',
                      section.items.length > 3 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
                    )}
                  >
                    {section.items.map((item) => (
                      <li key={item.title}>
                        <CategoryCard
                          title={item.title}
                          description={item.description}
                          image={item.image}
                          href={item.href}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {content.featured && (
            <Link
              href={content.featured.href}
              className="group relative flex h-full max-h-[400px] flex-col overflow-hidden rounded-2xl border bg-muted/30"
            >
              <img
                src={content.featured.image}
                alt={content.featured.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="relative mt-auto space-y-3 p-6">
                <h4 className="text-2xl font-semibold text-foreground">{content.featured.title}</h4>
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
      </Card>
    </div>
  )
}
