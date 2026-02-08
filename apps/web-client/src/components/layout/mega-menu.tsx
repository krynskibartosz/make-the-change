'use client'

import { Card } from '@make-the-change/core/ui'
import type { FC } from 'react'
import { useEffect } from 'react'
import { CategoryCard } from '@/components/ui/category-card'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type MegaMenuItem = {
  title: string
  description?: string
  image: string
  href: string
  badge?: string
}

type MegaMenuSection = {
  title: string
  items: MegaMenuItem[]
}

type MegaMenuContent = {
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

type MegaMenuProps = {
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
      <div className="absolute inset-0 -z-10 h-full w-full bg-background/80 backdrop-blur" />
      <Card className="mx-auto w-full max-w-6xl border bg-background/80 p-6 shadow-2xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
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

            <div className="grid gap-4 md:grid-cols-2">
              {content.sections.map((section) => (
                <div key={section.title} className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">{section.title}</p>
                  <div className="grid gap-3">
                    {section.items.map((item) => (
                      <CategoryCard
                        key={item.title}
                        title={item.title}
                        description={item.description}
                        image={item.image}
                        href={item.href}
                        badge={item.badge}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {content.featured && (
            <Link
              href={content.featured.href}
              className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl border bg-muted/30"
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
