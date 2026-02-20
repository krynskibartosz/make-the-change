'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Button } from '@make-the-change/core/ui'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, CheckCircle, Dot, Save, Upload } from 'lucide-react'
import type { SaveStatus } from '@/app/[locale]/(dashboard)/_features/lib/hooks/use-optimistic-auto-save'

type SaveStatusIndicatorProps = {
  status: SaveStatus
  errorMessage?: string | null
  pendingChanges?: number
  onSaveNow?: () => void
  className?: string
}

export const SaveStatusIndicator = ({
  status,
  errorMessage,
  pendingChanges = 0,
  onSaveNow,
  className,
}: SaveStatusIndicatorProps) => {
  type StatusConfigItem = {
    icon: LucideIcon | null
    color: string
    bgColor: string
    show: boolean
    message: string
    animate?: boolean
  }

  const statusConfig = {
    pristine: {
      icon: null,
      color: 'text-muted-foreground',
      bgColor: '',
      show: false,
      message: '',
    },
    pending: {
      icon: Dot,
      color: 'text-client-amber-500',
      bgColor: 'bg-client-amber-50/80 dark:bg-client-amber-950/20',
      show: true,
      message:
        pendingChanges > 0
          ? `${pendingChanges} modification${pendingChanges > 1 ? 's' : ''}`
          : 'Modifications en attente',
    },
    saving: {
      icon: Upload,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      show: true,
      message: 'Sauvegarde...',
      animate: true,
    },
    saved: {
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      show: true,
      message: 'Enregistré',
    },
    error: {
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      show: true,
      message: errorMessage || 'Erreur',
    },
  } satisfies Record<SaveStatus, StatusConfigItem>

  const config = statusConfig[status]

  if (!config || !config.show) return null

  const Icon = config.icon

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border',
        config.bgColor,
        config.color,
        status === 'saved' && 'animate-in fade-in slide-in-from-right-2',
        className,
      )}
    >
      {Icon && <Icon className={cn('shrink-0 h-3.5 w-3.5', config.animate && 'animate-pulse')} />}
      <span className="truncate">{config.message}</span>
      {status === 'pending' && onSaveNow && (
        <Button
          className="ml-1 px-1.5 py-0.5 h-5 text-[10px] hover:bg-client-amber-100 dark:hover:bg-client-amber-900/40"
          size="sm"
          variant="ghost"
          onClick={onSaveNow}
        >
          <Save className="mr-0.5 h-3 w-3" />
          Enregistrer
        </Button>
      )}
    </div>
  )
}
