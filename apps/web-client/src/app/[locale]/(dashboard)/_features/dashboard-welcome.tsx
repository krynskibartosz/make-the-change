'use client'

import { Badge } from '@make-the-change/core/ui'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type DashboardWelcomeProps = {
  firstName: string
  userLevel: string
  kycStatus?: string
  kycLabel?: string
  eyebrow?: string
  title?: string
  summary?: Array<{ label: string; value: string }>
  className?: string
}

const levelColors = {
  explorateur: {
    badge: 'bg-muted text-muted-foreground',
    glow: 'from-muted/50',
  },
  protecteur: {
    badge: 'bg-success/15 text-success',
    glow: 'from-success/20',
  },
  ambassadeur: {
    badge: 'bg-warning/15 text-warning',
    glow: 'from-warning/20',
  },
}

type UserLevel = keyof typeof levelColors

const isUserLevel = (value: string): value is UserLevel => Object.hasOwn(levelColors, value)

const kycColors: Record<string, string> = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  light: 'bg-info/10 text-info border-info/20',
  complete: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
}

export const DashboardWelcome = ({
  firstName,
  userLevel,
  kycStatus,
  kycLabel,
  eyebrow = 'Bienvenue',
  title,
  summary,
  className,
}: DashboardWelcomeProps) => {
  const fallbackLevel = levelColors.explorateur
  const level = isUserLevel(userLevel) ? levelColors[userLevel] : fallbackLevel
  const displayTitle = title || `Bonjour, ${firstName} !`

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-accent/10 to-transparent p-6 shadow-sm md:p-8',
        className,
      )}
    >
      {/* Animated Glow */}
      <div
        className={cn(
          'absolute -right-20 -top-20 h-56 w-56 animate-pulse rounded-full blur-3xl',
          `bg-linear-to-br ${level.glow} via-transparent to-transparent`,
        )}
      />
      <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-accent/10 opacity-60" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">{eyebrow}</span>
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">{displayTitle}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {kycStatus && (
              <Badge
                variant="outline"
                className={cn('rounded-full font-medium', kycColors[kycStatus])}
              >
                KYC: {kycLabel || kycStatus}
              </Badge>
            )}
            <Badge className={cn('rounded-full', level.badge)}>
              {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)}
            </Badge>
          </div>
        </div>

        {summary && summary.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {summary.map((item) => (
              <div
                key={item.label}
                className="min-w-45 rounded-2xl border bg-background/70 px-4 py-3 text-left shadow-sm backdrop-blur sm:min-w-0"
              >
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </div>
                <div className="text-lg font-semibold text-foreground">{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
