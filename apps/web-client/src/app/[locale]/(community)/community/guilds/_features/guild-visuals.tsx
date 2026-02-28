import { Avatar, AvatarFallback, AvatarImage } from '@make-the-change/core/ui'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type GuildAvatarProps = {
  name: string
  logoUrl?: string | null
  className?: string
  fallbackClassName?: string
}

type GuildCoverProps = {
  name: string
  bannerUrl?: string | null
  className?: string
  children?: ReactNode
}

const getGuildInitials = (name: string) => {
  const normalized = name.trim()
  if (!normalized) {
    return 'G'
  }

  const parts = normalized.split(/\s+/).filter(Boolean)
  if (parts.length === 1) {
    return (parts[0] || 'G').slice(0, 2).toUpperCase()
  }

  const firstInitial = parts[0]?.charAt(0) || ''
  const secondInitial = parts[1]?.charAt(0) || ''

  return `${firstInitial}${secondInitial}`.toUpperCase() || 'G'
}

export function GuildAvatar({ name, logoUrl, className, fallbackClassName }: GuildAvatarProps) {
  return (
    <Avatar className={cn('h-12 w-12 border border-border/60 bg-background/90', className)}>
      <AvatarImage src={logoUrl || undefined} alt={name} className="object-cover" />
      <AvatarFallback className={cn('font-semibold text-xs', fallbackClassName)}>
        {getGuildInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

export function GuildCover({ name, bannerUrl, className, children }: GuildCoverProps) {
  const hasBanner = !!bannerUrl

  return (
    <div
      aria-label={`${name} cover`}
      role="img"
      className={cn('relative overflow-hidden', className)}
      style={
        hasBanner
          ? {
              backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.78), rgba(15, 118, 110, 0.45)), url(${bannerUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div
        className={cn(
          'absolute inset-0',
          hasBanner
            ? 'bg-gradient-to-r from-slate-950/55 via-emerald-950/20 to-transparent'
            : 'bg-linear-to-r from-emerald-500/15 via-sky-500/10 to-background',
        )}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
