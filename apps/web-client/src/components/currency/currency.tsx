/**
 * Composants de monnaie — Vision A
 *
 * Une seule monnaie restante : 'impactCredits' (Credits Impact).
 * Les Graines ont été supprimées dans Phase 4 du refactor stratégique.
 */

import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import {
  getCurrencyDesign,
  getCurrencyToneClassName,
  type CurrencyKind,
  type CurrencyTone,
} from './currency-design'
import { ImpactCreditIcon } from './impact-credit-icon'

function formatCurrencyValueWithNotation(value: number, notation: 'standard' | 'compact') {
  return new Intl.NumberFormat('fr-FR', {
    notation,
    maximumFractionDigits: notation === 'compact' ? 1 : 0,
  }).format(value)
}

type CurrencyIconProps = {
  kind?: CurrencyKind
  tone?: CurrencyTone
  className?: string
}

export function CurrencyIcon({ tone = 'semantic', className }: CurrencyIconProps) {
  const variant = tone === 'inherit' ? 'mono' : 'color'

  return <ImpactCreditIcon variant={variant} size={16} className={cn('shrink-0', className)} />
}

type CurrencyAmountProps = ComponentPropsWithoutRef<'span'> & {
  kind: CurrencyKind
  value: number
  notation?: 'standard' | 'compact'
  prefix?: string
  showLabel?: boolean
  tone?: CurrencyTone
}

export function CurrencyAmount({
  kind,
  value,
  notation = 'standard',
  prefix,
  showLabel = false,
  tone = 'semantic',
  className,
  ...props
}: CurrencyAmountProps) {
  const design = getCurrencyDesign(kind)
  const formattedValue = formatCurrencyValueWithNotation(value, notation)

  return (
    <span
      aria-label={`${prefix || ''}${formattedValue} ${design.ariaLabel}`}
      className={cn(
        'inline-flex items-center gap-1 tabular-nums',
        getCurrencyToneClassName(kind, tone),
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">
        {prefix}
        {formattedValue}
      </span>
      <CurrencyIcon kind={kind} tone={tone} className="h-[1.1em] w-[1.1em]" />
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
        <span className="tabular-nums">{formatCurrencyValueWithNotation(value, notation)}</span>
      )}
      {label && <span>{label}</span>}
    </span>
  )
}
