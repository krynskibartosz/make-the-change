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
}

export const CategoryCard: FC<CategoryCardProps> = ({
  title,
  description,
  image,
  href,
  className,
}) => {
  const isExternal = href.startsWith('http')

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'group relative flex min-h-40 h-auto overflow-hidden rounded-xl border bg-background/70 shadow-sm backdrop-blur transition-all hover:bg-accent/50 hover:shadow-md',
          className,
        )}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
        </div>
        <div className="relative z-10 flex h-full flex-col justify-end p-4">
          <h3 className="text-sm font-bold text-white shadow-sm">{title}</h3>
          {description && (
            <p className="mt-1 text-xs text-gray-200 line-clamp-2 shadow-sm">{description}</p>
          )}
        </div>
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex min-h-40 h-auto overflow-hidden rounded-xl border bg-background/70 shadow-sm backdrop-blur transition-all hover:bg-accent/50 hover:shadow-md',
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end p-4">
        <h3 className="text-sm font-bold text-white shadow-sm">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-gray-200 line-clamp-2 shadow-sm">{description}</p>
        )}
      </div>
    </Link>
  )
}
