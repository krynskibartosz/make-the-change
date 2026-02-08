'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@make-the-change/core/ui'
import type { ChangeEvent, FC } from 'react'
import type { Subscription } from '@/lib/types/subscription'

type SubscriptionDetailsEditorProps = {
  subscription: Subscription
  isEditing: boolean
  onChange?: (data: Partial<Subscription>) => void
}

export const SubscriptionDetailsEditor: FC<SubscriptionDetailsEditorProps> = ({
  subscription,
  isEditing,
  onChange,
}) => {
  const handleChange = <K extends keyof Subscription>(key: K, value: Subscription[K]) => {
    onChange?.({ [key]: value })
  }

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0] ?? ''
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="plan_type">
                Plan
              </label>
              {isEditing ? (
                <Select
                  value={subscription.plan_type}
                  onValueChange={(value) => handleChange('plan_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly_standard">Mensuel Standard</SelectItem>
                    <SelectItem value="monthly_premium">Mensuel Premium</SelectItem>
                    <SelectItem value="annual_standard">Annuel Standard</SelectItem>
                    <SelectItem value="annual_premium">Annuel Premium</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {subscription.plan_type || 'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="status">
                Statut
              </label>
              {isEditing ? (
                <Select
                  value={subscription.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="past_due">En retard</SelectItem>
                    <SelectItem value="unpaid">Impayé</SelectItem>
                    <SelectItem value="trialing">Essai</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                    <SelectItem value="incomplete">Incomplet</SelectItem>
                    <SelectItem value="paused">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">{subscription.status || 'Non défini'}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="billing_frequency">
                Fréquence de facturation
              </label>
              {isEditing ? (
                <Select
                  value={subscription.billing_frequency}
                  onValueChange={(value) => handleChange('billing_frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                    <SelectItem value="annual">Annuel</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {subscription.billing_frequency || 'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="monthly_points_allocation">
                Points mensuels
              </label>
              {isEditing ? (
                <Input
                  id="monthly_points_allocation"
                  type="number"
                  value={subscription.monthly_points_allocation ?? 0}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('monthly_points_allocation', Number(e.target.value) || 0)
                  }
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {subscription.monthly_points_allocation ?? 0}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="monthly_price">
                Prix mensuel (€)
              </label>
              {isEditing ? (
                <Input
                  id="monthly_price"
                  type="number"
                  value={subscription.monthly_price ?? 0}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('monthly_price', Number(e.target.value) || 0)
                  }
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{subscription.monthly_price ?? 0}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="annual_price">
                Prix annuel (€)
              </label>
              {isEditing ? (
                <Input
                  id="annual_price"
                  type="number"
                  value={subscription.annual_price ?? 0}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('annual_price', Number(e.target.value) || 0)
                  }
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{subscription.annual_price ?? 0}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="bonus_percentage">
                Bonus (%)
              </label>
              {isEditing ? (
                <Input
                  id="bonus_percentage"
                  max="100"
                  min="0"
                  type="number"
                  value={subscription.bonus_percentage ?? 0}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange('bonus_percentage', Number(e.target.value) || 0)
                  }
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{subscription.bonus_percentage ?? 0}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Période début</label>
              <div className="p-2 bg-muted rounded-md">
                {formatDate(subscription.current_period_start)}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Période fin</label>
              <div className="p-2 bg-muted rounded-md">
                {formatDate(subscription.current_period_end)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
