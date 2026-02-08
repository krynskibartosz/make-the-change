'use client'

import { ChevronRight } from 'lucide-react'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@make-the-change/core/shared/utils'
import { LocalizedLink } from '@/components/localized-link'

// --- Header Cover ---

export function HeaderCover({
  children,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('relative w-full bg-muted/30', className)} style={style} {...props}>
      {children}
    </div>
  )
}

export function HeaderCoverOverlay({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('absolute inset-0 bg-gradient-to-b pointer-events-none', className)}
      {...props}
    />
  )
}

// --- Header Breadcrumbs ---

export type BreadcrumbItem = {
  label: string
  href?: string
}

export function HeaderBreadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
              {item.href && !isLast ? (
                <LocalizedLink href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </LocalizedLink>
              ) : (
                <span
                  className={cn(
                    'font-medium',
                    isLast ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// --- Header Avatar ---

const headerAvatarSizes = {
  sm: 'h-20 w-20',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
  xl: 'h-40 w-40',
}

type HeaderAvatarProps = HTMLAttributes<HTMLDivElement> & {
  size?: keyof typeof headerAvatarSizes
}

export function HeaderAvatar({
  children,
  className,
  size = 'lg',
  style,
  ...props
}: HeaderAvatarProps) {
  return (
    <div
      style={style}
      className={cn(
        'border-background relative cursor-pointer rounded-full border-4 shadow-2xl bg-background',
        headerAvatarSizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function HeaderAvatarGroup({
  children,
  className,
  style,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('container relative px-4 md:px-8', className)} style={style} {...props}>
      {children}
    </div>
  )
}
