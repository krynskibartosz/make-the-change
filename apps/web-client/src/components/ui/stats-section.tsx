'use client'

import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type StatItem = {
  value: number | string
  label: string
  prefix?: string
  suffix?: string
  format?: (value: number) => string
}

type StatsSectionProps = {
  stats: StatItem[]
  className?: string
  variant?: 'default' | 'card' | 'gradient'
}

const variantClasses = {
  default: '',
  card: 'rounded-2xl border bg-muted/40 p-8 md:p-12',
  gradient:
    'rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-client-emerald-50/30 p-8 md:p-12 dark:from-primary/10 dark:to-client-emerald-950/20',
}

const gradients = [
  'from-primary to-client-emerald-500',
  'from-client-emerald-500 to-client-teal-500',
  'from-client-amber-500 to-client-orange-500',
  'from-client-sky-500 to-client-indigo-500',
]

const useCountUp = (target: number, duration = 1200) => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start: number | null = null
    let frameId: number

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setValue(target * progress)
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step)
      }
    }

    frameId = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(frameId)
  }, [target, duration])

  return value
}

const StatValue: FC<{
  value: number | string
  prefix?: string
  suffix?: string
  format?: (value: number) => string
}> = ({ value, prefix, suffix, format }) => {
  const numeric = useMemo(() => {
    if (typeof value === 'number') return value
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }, [value])

  const animated = useCountUp(numeric ?? 0)
  const displayValue =
    numeric === null
      ? value
      : format
        ? format(Math.floor(animated))
        : new Intl.NumberFormat().format(Math.floor(animated))

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

export const StatsSection: FC<StatsSectionProps> = ({ stats, className, variant = 'default' }) => {
  return (
    <dl
      className={cn(
        'grid gap-8 text-center',
        stats.length === 3 && 'md:grid-cols-3',
        stats.length === 4 && 'md:grid-cols-4',
        stats.length === 2 && 'md:grid-cols-2',
        variantClasses[variant],
        className,
      )}
    >
      {stats.map((stat, index) => {
        const gradient = gradients[index % gradients.length]
        return (
          <div key={stat.label} className="group flex flex-col-reverse gap-2">
            <dt className="text-sm text-muted-foreground sm:text-base">{stat.label}</dt>
            <dd
              className={cn(
                'text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105 sm:text-4xl m-0',
                gradient,
              )}
            >
              <StatValue
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                format={stat.format}
              />
            </dd>
          </div>
        )
      })}
    </dl>
  )
}
