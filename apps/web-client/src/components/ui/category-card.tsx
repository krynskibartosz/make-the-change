'use client'

import type { FC } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type CategoryCardProps = {
  title: string
  description?: string | null
  image: string
  href: string
  className?: string
  badge?: string
}

export const CategoryCard: FC<CategoryCardProps> = ({
  title,
  description,
  image,
  href,
  className,
  badge,
}) => {
  const isExternal = href.startsWith('http')

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group relative overflow-hidden rounded-2xl border bg-background/70 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl',
          className,
        )}
      >
        <div className="relative h-32 w-full sm:h-36">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>
        <div className="relative space-y-1 p-4">
          {badge && (
            <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {badge}
            </span>
          )}
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-background/70 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl',
        className,
      )}
    >
      <div className="relative h-32 w-full sm:h-36">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      </div>
      <div className="relative space-y-1 p-4">
        {badge && (
          <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {badge}
          </span>
        )}
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
      </div>
    </Link>
  )
}
