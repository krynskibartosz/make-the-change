'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type CategoryCardProps = {
  title: string
  description?: string | null
  image: string
  href: string
  onClick?: () => void
  className?: string
}

export const CategoryCard = ({
  title,
  description,
  image,
  href,
  onClick,
  className,
}: CategoryCardProps) => {
  const isExternal = href.startsWith('http')

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={cn(
          'group relative flex min-h-40 h-auto overflow-hidden rounded-xl border bg-background/70 shadow-sm backdrop-blur transition-all hover:bg-accent/50 hover:shadow-md',
          className,
        )}
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
      onClick={onClick}
      className={cn(
        'group relative flex min-h-40 h-auto overflow-hidden rounded-xl border bg-background/70 shadow-sm backdrop-blur transition-all hover:bg-accent/50 hover:shadow-md',
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
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
