'use client';

import { type FC, type ChangeEvent } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/[locale]/admin/(dashboard)/components/ui/select';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';
import type { Subscription } from '@/lib/types/subscription';

type SubscriptionDetailsEditorProps = {
  subscription: Subscription;
  isEditing: boolean;
  onChange?: (data: Partial<Subscription>) => void;
};

const statusOptions: { value: Subscription['status']; label: string }[] = [
  { value: 'active', label: 'Actif' },
  { value: 'paused', label: 'En pause' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'expired', label: 'Expiré' },
];

const tierOptions: { value: Subscription['subscription_tier']; label: string }[] = [
  { value: 'ambassadeur_standard', label: 'Ambassadeur Standard' },
  { value: 'ambassadeur_premium', label: 'Ambassadeur Premium' },
];

const frequencyOptions: { value: Subscription['billing_frequency']; label: string }[] = [
  { value: 'monthly', label: 'Mensuel' },
  { value: 'annual', label: 'Annuel' },
];

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value ?? 0);

const formatDisplayDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Non défini';

const toDateInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

export const SubscriptionDetailsEditor: FC<SubscriptionDetailsEditorProps> = ({
  subscription,
  isEditing,
  onChange,
}) => {
  const handleChange = <K extends keyof Subscription>(key: K, value: Subscription[K]) => {
    onChange?.({ [key]: value });
  };

  const handleNumberChange = (
    key: keyof Subscription,
    event: ChangeEvent<HTMLInputElement>,
    fallback = 0
  ) => {
    const parsed = Number.parseFloat(event.target.value);
    handleChange(key, (Number.isNaN(parsed) ? fallback : parsed) as Subscription[typeof key]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="subscription_tier">
                Type d&apos;abonnement
              </label>
              {isEditing ? (
                <Select
                  value={subscription.subscription_tier}
                  onValueChange={value =>
                    handleChange('subscription_tier', value as Subscription['subscription_tier'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {tierOptions.find(option => option.value === subscription.subscription_tier)?.label ??
                    'Non défini'}
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
                  onValueChange={value =>
                    handleChange('status', value as Subscription['status'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {statusOptions.find(option => option.value === subscription.status)?.label ??
                    'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="billing_frequency">
                Fréquence de facturation
              </label>
              {isEditing ? (
                <Select
                  value={subscription.billing_frequency}
                  onValueChange={value =>
                    handleChange('billing_frequency', value as Subscription['billing_frequency'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {frequencyOptions.find(option => option.value === subscription.billing_frequency)?.label ??
                    'Non défini'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="amount_eur">
                Montant ({subscription.billing_frequency === 'annual' ? '€/an' : '€/mois'})
              </label>
              {isEditing ? (
                <Input
                  id="amount_eur"
                  placeholder="0.00"
                  type="number"
                  value={subscription.amount_eur ?? ''}
                  onChange={event => handleNumberChange('amount_eur', event)}
                />
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {formatCurrency(subscription.amount_eur)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facturation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="next_billing_date">
                Prochaine échéance
              </label>
              {isEditing ? (
                <Input
                  id="next_billing_date"
                  type="date"
                  value={toDateInputValue(subscription.next_billing_date)}
                  onChange={event => handleChange('next_billing_date', event.target.value)}
                />
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {formatDisplayDate(subscription.next_billing_date)}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="auto_renew">
                Renouvellement automatique
              </label>
              {isEditing ? (
                <Select
                  value={String(Boolean(subscription.auto_renew))}
                  onValueChange={value => handleChange('auto_renew', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activé</SelectItem>
                    <SelectItem value="false">Désactivé</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {subscription.auto_renew ? 'Activé' : 'Désactivé'}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="bonus_percentage">
                Bonus Ambassadeur (%)
              </label>
              {isEditing ? (
                <Input
                  id="bonus_percentage"
                  type="number"
                  step="0.1"
                  value={subscription.bonus_percentage ?? ''}
                  onChange={event => handleNumberChange('bonus_percentage', event)}
                />
              ) : (
                <div className="bg-muted rounded-md p-2">
                  {subscription.bonus_percentage ?? 0}%
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="points_total">
                Points mensuels
              </label>
              <div className="bg-muted rounded-md p-2">
                {subscription.points_total ?? 0} points
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dates importantes</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="start_date">
              Date de début
            </label>
            <div className="bg-muted rounded-md p-2">
              {formatDisplayDate(subscription.start_date)}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="end_date">
              Date de fin
            </label>
            <div className="bg-muted rounded-md p-2">
              {formatDisplayDate(subscription.end_date)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes administratives</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <TextArea
              id="admin_notes"
              placeholder="Notes internes sur cet abonnement"
              value={subscription.admin_notes ?? ''}
              rows={4}
              onChange={event => handleChange('admin_notes', event.target.value)}
            />
          ) : (
            <div className="bg-muted min-h-[80px] rounded-md p-3 text-sm text-muted-foreground">
              {subscription.admin_notes?.trim() || 'Aucune note enregistrée'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
