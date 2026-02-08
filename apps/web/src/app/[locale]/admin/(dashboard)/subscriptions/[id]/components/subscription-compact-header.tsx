'use client'

import { cn } from '@make-the-change/core/shared/utils'
import { Button } from '@make-the-change/core/ui'
import { Calendar as _Calendar, CreditCard, Edit, Euro, Save, X } from 'lucide-react'
import type { FC } from 'react'
import type { Subscription } from '@/lib/types/subscription'

type SubscriptionCompactHeaderProps = {
  subscription: Subscription
  isEditing?: boolean
  onEditToggle?: (editing: boolean) => void
  onSave?: () => void
  isSaving?: boolean
  hasChanges?: boolean
}

export const SubscriptionCompactHeader: FC<SubscriptionCompactHeaderProps> = ({
  subscription,
  isEditing = false,
  onEditToggle,
  onSave,
  isSaving = false,
  hasChanges = false,
}) => {
  const getStatusConfig = (status?: string | null) => {
    const configs = {
      active: {
        label: 'Actif',
        color: 'bg-success',
        bgClass: 'from-success/10 to-success/5',
        borderClass: 'border-success/20',
      },
      inactive: {
        label: 'Inactif',
        color: 'bg-muted-foreground',
        bgClass: 'from-muted/10 to-muted/5',
        borderClass: 'border-muted/20',
      },
      cancelled: {
        label: 'Annulé',
        color: 'bg-destructive',
        bgClass: 'from-destructive/10 to-destructive/5',
        borderClass: 'border-destructive/20',
      },
      past_due: {
        label: 'En retard',
        color: 'bg-warning',
        bgClass: 'from-warning/10 to-warning/5',
        borderClass: 'border-warning/20',
      },
      unpaid: {
        label: 'Impayé',
        color: 'bg-destructive',
        bgClass: 'from-destructive/10 to-destructive/5',
        borderClass: 'border-destructive/20',
      },
      trialing: {
        label: 'Essai',
        color: 'bg-primary',
        bgClass: 'from-primary/10 to-primary/5',
        borderClass: 'border-primary/20',
      },
      expired: {
        label: 'Expiré',
        color: 'bg-muted-foreground',
        bgClass: 'from-muted/10 to-muted/5',
        borderClass: 'border-muted/20',
      },
      incomplete: {
        label: 'Incomplet',
        color: 'bg-warning',
        bgClass: 'from-warning/10 to-warning/5',
        borderClass: 'border-warning/20',
      },
      paused: {
        label: 'Suspendu',
        color: 'bg-warning',
        bgClass: 'from-warning/10 to-warning/5',
        borderClass: 'border-warning/20',
      },
    }
    return configs[status as keyof typeof configs] || configs.active
  }

  const statusInfo = getStatusConfig(subscription.status)

  const formatPlan = (plan?: string): string => {
    const labels = {
      monthly_standard: 'Mensuel Standard',
      monthly_premium: 'Mensuel Premium',
      annual_standard: 'Annuel Standard',
      annual_premium: 'Annuel Premium',
    }
    return labels[plan as keyof typeof labels] || plan || 'Non défini'
  }

  const formatFrequency = (frequency?: string): string => {
    const labels = {
      monthly: 'Mensuel',
      annual: 'Annuel',
    }
    return labels[frequency as keyof typeof labels] || frequency || 'Non défini'
  }

  const displayPrice =
    subscription.billing_frequency === 'monthly'
      ? (subscription.monthly_price ?? 0)
      : (subscription.annual_price ?? 0)

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 pb-3 md:pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
        {}
        <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1 min-w-0">
          <div className="p-2 md:p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl border border-primary/20 backdrop-blur-sm flex-shrink-0">
            <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            {}
            <h1 className="text-lg md:text-2xl font-bold text-foreground leading-tight truncate mb-2 md:mb-2">
              {formatPlan(subscription.plan_type || undefined)}
            </h1>

            {}
            <div className="flex md:hidden items-center gap-2 flex-wrap">
              <div
                className={cn(
                  'flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`,
                )}
              >
                <div className={cn('w-2 h-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className="flex items-center gap-1 px-2 py-1 bg-muted/40 rounded-full text-xs font-medium text-muted-foreground">
                <Euro className="h-3 w-3" />
                <span>{displayPrice} €</span>
              </div>
            </div>

            {}
            <div className="hidden md:flex items-center gap-4 flex-wrap">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
                  `bg-gradient-to-r ${statusInfo.bgClass} ${statusInfo.borderClass}`,
                )}
              >
                <div className={cn('w-2 h-2 rounded-full', statusInfo.color)} />
                {statusInfo.label}
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium">
                <_Calendar className="h-3 w-3" />
                {formatFrequency(subscription.billing_frequency ?? undefined)}
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-muted/40 rounded-full text-xs font-medium">
                <Euro className="h-3 w-3" />
                {displayPrice} €
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button
                className="h-8 px-3"
                disabled={isSaving}
                size="sm"
                variant="outline"
                onClick={() => onEditToggle?.(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Annuler
              </Button>
              <Button
                className="h-8 px-3"
                disabled={isSaving || !hasChanges}
                size="sm"
                onClick={onSave}
              >
                {isSaving ? (
                  <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                Sauvegarder
              </Button>
            </div>
          ) : (
            <Button
              className="h-8 px-3"
              size="sm"
              variant="outline"
              onClick={() => onEditToggle?.(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
