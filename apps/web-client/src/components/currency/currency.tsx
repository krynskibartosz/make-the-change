/**
 * Composants de monnaie — R2
 *
 * [CIBLE_VALIDEE] P0-3 : Utiliser exclusivement les CurrencyKind :
 * - 'seeds' pour Graines (progression, Academy, BioDex)
 * - 'impactCredits' pour Credits Impact (soutien producteur, boutique)
 *
 * [DEPRECIE] Ne pas introduire de nouveaux usages de 'points'.
 */

import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import {
  formatCurrencyValue,
  getCurrencyDesign,
  getCurrencyToneClassName,
  type CurrencyKind,
  type CurrencyTone,
} from './currency-design'
import { SeedIcon } from './seed-icon'
import { ImpactCreditIcon } from './impact-credit-icon'

/**
 * Formate une valeur avec notation (standard ou compacte).
 * @deprecated Utiliser formatCurrencyValue depuis currency-design.ts
 */
function formatCurrencyValueWithNotation(value: number, notation: 'standard' | 'compact') {
  return new Intl.NumberFormat('fr-FR', {
    notation,
    maximumFractionDigits: notation === 'compact' ? 1 : 0,
  }).format(value)
}

type CurrencyIconProps = {
  kind: CurrencyKind
  tone?: CurrencyTone
  className?: string
}

export function CurrencyIcon({ kind, tone = 'semantic', className }: CurrencyIconProps) {
  const variant = tone === 'inherit' ? 'mono' : 'color'
  const Icon = kind === 'seeds' ? SeedIcon : ImpactCreditIcon

  return <Icon variant={variant} size={16} className={cn('shrink-0', className)} />
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
