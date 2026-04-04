'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StatCardProps = {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: string; positive: boolean }
  variant?: 'default' | 'primary' | 'success' | 'warning'
  className?: string
}

const variantClasses = {
  default: {
    icon: 'bg-gradient-to-br from-muted/80 to-muted text-muted-foreground',
    value: 'text-foreground',
  },
  primary: {
    icon: 'bg-gradient-to-br from-primary/20 to-primary/5 text-primary',
    value: 'text-primary',
  },
  success: {
    icon: 'bg-gradient-to-br from-success/20 to-success/5 text-success',
    value: 'text-success',
  },
  warning: {
    icon: 'bg-gradient-to-br from-warning/20 to-warning/5 text-warning',
    value: 'text-warning',
  },
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) => {
  const styles = variantClasses[variant]

  return (
    <div
      className={cn(
        'group relative overflow-hidden bg-white/5 rounded-2xl p-5 border border-white/5 transition-all duration-300 hover:bg-white/10 flex flex-col gap-3',
        className,
      )}
    >
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            styles.icon,
          )}
        >
          {icon}
        </div>
      </div>

      <div>
        <div className={cn('text-2xl font-bold', styles.value)}>{value}</div>
        {trend && (
          <p className={cn('mt-1 text-xs', trend.positive ? 'text-success' : 'text-destructive')}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}
