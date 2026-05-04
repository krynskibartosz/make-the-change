import type { ComponentPropsWithoutRef } from 'react'
import { Hexagon, Sprout, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCurrencyDesign, type CurrencyKind } from './currency-design'

const CURRENCY_ICONS = {
  Sprout,
  Hexagon,
} as const satisfies Record<ReturnType<typeof getCurrencyDesign>['icon'], LucideIcon>

function formatCurrencyValue(value: number, notation: 'standard' | 'compact') {
  return new Intl.NumberFormat('fr-FR', {
    notation,
    maximumFractionDigits: notation === 'compact' ? 1 : 0,
  }).format(value)
}

type CurrencyIconProps = ComponentPropsWithoutRef<'svg'> & {
  kind: CurrencyKind
}

export function CurrencyIcon({ kind, className, ...props }: CurrencyIconProps) {
  const design = getCurrencyDesign(kind)
  const Icon = CURRENCY_ICONS[design.icon]

  return (
    <Icon
      aria-hidden="true"
      className={cn('shrink-0', design.toneClassName, className)}
      {...props}
    />
  )
}

type CurrencyAmountProps = ComponentPropsWithoutRef<'span'> & {
  kind: CurrencyKind
  value: number
  notation?: 'standard' | 'compact'
  prefix?: string
  showLabel?: boolean
}

export function CurrencyAmount({
  kind,
  value,
  notation = 'standard',
  prefix,
  showLabel = false,
  className,
  ...props
}: CurrencyAmountProps) {
  const design = getCurrencyDesign(kind)
  const formattedValue = formatCurrencyValue(value, notation)

  return (
    <span
      aria-label={`${prefix || ''}${formattedValue} ${design.ariaLabel}`}
      className={cn('inline-flex items-center gap-1 tabular-nums', design.toneClassName, className)}
      {...props}
    >
      <span aria-hidden="true">
        {prefix}
        {formattedValue}
      </span>
      <CurrencyIcon kind={kind} className="h-[1.1em] w-[1.1em]" />
      {showLabel && <span aria-hidden="true">{design.label}</span>}
    </span>
  )
}

type CurrencyBadgeProps = ComponentPropsWithoutRef<'span'> & {
  kind: CurrencyKind
  value?: number
  notation?: 'standard' | 'compact'
  label?: string
}

export function CurrencyBadge({
  kind,
  value,
  notation = 'standard',
  label,
  className,
  ...props
}: CurrencyBadgeProps) {
  const design = getCurrencyDesign(kind)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black',
        design.surfaceClassName,
        className,
      )}
      {...props}
    >
      <CurrencyIcon kind={kind} className="h-3.5 w-3.5" />
      {value !== undefined && (
        <span className="tabular-nums">{formatCurrencyValue(value, notation)}</span>
      )}
      {label && <span>{label}</span>}
    </span>
  )
}
