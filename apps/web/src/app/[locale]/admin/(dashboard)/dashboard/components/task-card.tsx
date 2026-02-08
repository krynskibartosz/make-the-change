'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import type { FC, ReactNode } from 'react'
import { memo } from 'react'
import { LocalizedLink } from '@/components/localized-link'

export type AdminTaskCardProps = {
  title: string
  description: string
  href: string
  icon: LucideIcon
  metricLabel?: string
  metricValue?: string | number
  tone?: 'default' | 'accent' | 'warning' | 'success'
  footer?: ReactNode
  testId?: string
}

/**
 * Task-first card for the admin dashboard.
 *
 * Uses a single dominant CTA per card to reduce choice overload and improve
 * time-to-task for common admin operations.
 */
export const AdminTaskCard: FC<AdminTaskCardProps> = memo(
  ({
    title,
    description,
    href,
    icon: Icon,
    metricLabel,
    metricValue,
    tone = 'default',
    footer,
    testId = 'admin-task-card',
  }) => {
    const toneClasses = {
      default: 'border-[hsl(var(--border)/0.6)]',
      accent: 'border-primary/20',
      warning: 'border-warning/25',
      success: 'border-success/25',
    } as const

    const metricColor = {
      default: 'text-foreground',
      accent: 'text-primary',
      warning: 'text-warning',
      success: 'text-success',
    } as const

    return (
      <Card data-testid={testId} className={cn('glass-card h-full', toneClasses[tone])}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <span
              className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-2xl',
                'bg-muted/40 border border-[hsl(var(--border)/0.4)]',
              )}
            >
              <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </span>
            <span className="truncate">{title}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

          {metricValue !== undefined && (
            <div className="flex items-baseline justify-between gap-3">
              <div className="text-xs text-muted-foreground">{metricLabel}</div>
              <div className={cn('text-2xl font-semibold', metricColor[tone])}>
                {typeof metricValue === 'number'
                  ? metricValue.toLocaleString('fr-FR')
                  : metricValue}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button
              asChild
              icon={<ArrowRight />}
              size="sm"
              variant={tone === 'accent' ? 'accent' : 'default'}
            >
              <LocalizedLink href={href}>Ouvrir</LocalizedLink>
            </Button>

            {footer}
          </div>
        </CardContent>
      </Card>
    )
  },
)

AdminTaskCard.displayName = 'AdminTaskCard'
