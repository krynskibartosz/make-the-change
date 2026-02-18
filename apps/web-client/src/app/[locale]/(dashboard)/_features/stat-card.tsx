'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@make-the-change/core/ui'
import type { FC, ReactNode } from 'react'
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

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = 'default',
  className,
}) => {
  const styles = variantClasses[variant]

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border bg-background/70 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
    >
      {/* Hover Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />

      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl shadow-sm',
            styles.icon,
          )}
        >
          {icon}
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className={cn('text-2xl font-bold', styles.value)}>{value}</div>
        {trend && (
          <p className={cn('mt-1 text-xs', trend.positive ? 'text-success' : 'text-destructive')}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
