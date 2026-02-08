'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import type { LucideIcon } from 'lucide-react'
import type { FC } from 'react'
import { memo } from 'react'

export type AdminKpiCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
  tone?: 'default' | 'accent' | 'success' | 'warning' | 'info'
  testId?: string
}

/**
 * Compact KPI card for secondary metrics.
 *
 * Intended to be visually quieter than task cards to keep the “next action”
 * dominant above the fold.
 */
export const AdminKpiCard: FC<AdminKpiCardProps> = memo(
  ({ title, value, icon: Icon, tone = 'default', testId = 'admin-kpi-card' }) => {
    const toneClasses = {
      default: 'text-foreground',
      accent: 'text-primary',
      success: 'text-success',
      warning: 'text-warning',
      info: 'text-info',
    } as const

    return (
      <Card data-testid={testId} className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="truncate">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn('text-2xl font-semibold', toneClasses[tone])}>
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </div>
        </CardContent>
      </Card>
    )
  },
)

AdminKpiCard.displayName = 'AdminKpiCard'
