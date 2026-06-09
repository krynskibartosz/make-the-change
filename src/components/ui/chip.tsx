'use client'

import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  Euro,
  FileCheck2,
  Loader2,
  type LucideIcon,
  PlusCircle,
  ShieldAlert,
  XCircle,
} from 'lucide-react'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

export type ClarusStatus =
  | 'draft'
  | 'to_check'
  | 'verified'
  | 'paid'
  | 'supplement'
  | 'blocked'
  | 'billable'
  | 'in_progress'
  | 'done'
  | 'cancelled'

type StatusDefinition = Readonly<{
  icon: LucideIcon
  label: string
  toneClassName: string
}>

const statusDefinitions: Record<ClarusStatus, StatusDefinition> = {
  draft: {
    icon: CircleDashed,
    label: 'Brouillon',
    toneClassName: 'border-border bg-surface-elevated text-muted-foreground',
  },
  to_check: {
    icon: AlertTriangle,
    label: 'A verifier',
    toneClassName: 'border-warning/30 bg-warning/15 text-warning',
  },
  verified: {
    icon: CheckCircle2,
    label: 'Verifie',
    toneClassName: 'border-success/30 bg-success/15 text-success',
  },
  paid: {
    icon: Euro,
    label: 'Paye',
    toneClassName: 'border-paid/30 bg-paid/15 text-paid',
  },
  supplement: {
    icon: PlusCircle,
    label: 'Supplement',
    toneClassName: 'border-billable/30 bg-billable/15 text-billable',
  },
  blocked: {
    icon: ShieldAlert,
    label: 'Bloque',
    toneClassName: 'border-blocked/30 bg-blocked/15 text-blocked',
  },
  billable: {
    icon: FileCheck2,
    label: 'Facturable',
    toneClassName: 'border-billable/30 bg-billable/15 text-billable',
  },
  in_progress: {
    icon: Loader2,
    label: 'En cours',
    toneClassName: 'border-info/30 bg-info/15 text-info',
  },
  done: {
    icon: CheckCircle2,
    label: 'Termine',
    toneClassName: 'border-success/30 bg-success/15 text-success',
  },
  cancelled: {
    icon: XCircle,
    label: 'Annule',
    toneClassName: 'border-border bg-surface-elevated text-muted-foreground',
  },
}

type StatusChipProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> &
  Readonly<{
    label?: string
    status: ClarusStatus
  }>

export const StatusChip = forwardRef<HTMLSpanElement, StatusChipProps>(function StatusChip(
  { className, label, status, ...props },
  ref,
) {
  const definition = statusDefinitions[status]
  const Icon = definition.icon

  return (
    <span
      className={cn(
        'inline-flex min-h-[var(--size-choice)] items-center gap-2 rounded-full border px-3 text-sm font-semibold',
        definition.toneClassName,
        className,
      )}
      ref={ref}
      {...props}
    >
      <Icon aria-hidden="true" className="size-4" />
      <span>{label ?? definition.label}</span>
    </span>
  )
})

type ChoiceChipProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> &
  Readonly<{
    children: ReactNode
    selected?: boolean
  }>

export const ChoiceChip = forwardRef<HTMLButtonElement, ChoiceChipProps>(function ChoiceChip(
  { children, className, selected = false, type = 'button', ...props },
  ref,
) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        'inline-flex min-h-[var(--size-choice)] items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors',
        selected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-surface text-foreground',
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
      {selected ? <span className="sr-only">Selectionne</span> : null}
    </button>
  )
})
