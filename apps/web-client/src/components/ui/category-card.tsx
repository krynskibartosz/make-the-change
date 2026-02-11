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
          'group relative flex h-24 overflow-hidden rounded-xl border bg-background/70 shadow-sm backdrop-blur transition-all hover:bg-accent/50 hover:shadow-md',
          className,
        )}
      >
        <div className="relative w-24 shrink-0 sm:w-32 h-full">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="relative flex flex-col justify-center p-3">
          {badge && (
            <span className="mb-1 inline-flex w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {badge}
            </span>
          )}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex h-24 overflow-hidden rounded-xl border bg-background/70 shadow-sm backdrop-blur transition-all hover:bg-accent/50 hover:shadow-md',
        className,
      )}
    >
      <div className="relative w-24 shrink-0 sm:w-32 h-full">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="relative flex flex-col justify-center p-3">
        {badge && (
          <span className="mb-1 inline-flex w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {badge}
          </span>
        )}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
      </div>
    </Link>
  )
}
