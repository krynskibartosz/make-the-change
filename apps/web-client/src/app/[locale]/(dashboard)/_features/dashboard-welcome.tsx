'use client'

import { Badge } from '@make-the-change/core/ui'
import { Progress } from '@make-the-change/core/ui'
import { Sparkles, TrendingUp } from 'lucide-react'
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
  xpProgress?: number // 0-100
  currentXp?: number
  nextLevelXp?: number
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
  // Fallback for new levels
  graine: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    glow: 'from-amber-200/50',
  },
  germe: {
    badge: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
    glow: 'from-lime-200/50',
  },
  pousse: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    glow: 'from-green-200/50',
  },
  arbre: {
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    glow: 'from-emerald-200/50',
  },
  foret: {
    badge: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    glow: 'from-teal-200/50',
  }
}

// Helper to normalize level key (remove accents, lowercase)
const normalizeLevel = (level: string) => 
  level.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

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
  xpProgress = 0,
  currentXp,
  nextLevelXp
}: DashboardWelcomeProps) => {
  const normalizedLevel = normalizeLevel(userLevel)
  // @ts-ignore - Dynamic access
  const levelStyle = levelColors[normalizedLevel] || levelColors.explorateur
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
          `bg-linear-to-br ${levelStyle.glow} via-transparent to-transparent`,
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

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap gap-2">
              {kycStatus && (
                <Badge
                  variant="outline"
                  className={cn('rounded-full font-medium', kycColors[kycStatus])}
                >
                  KYC: {kycLabel || kycStatus}
                </Badge>
              )}
              <Badge className={cn('rounded-full px-3 py-1 text-sm font-semibold capitalize', levelStyle.badge)}>
                {userLevel}
              </Badge>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        {(currentXp !== undefined && nextLevelXp !== undefined) && (
          <div className="max-w-md space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> XP: {currentXp}
              </span>
              <span>Prochain niveau: {nextLevelXp} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        )}

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
