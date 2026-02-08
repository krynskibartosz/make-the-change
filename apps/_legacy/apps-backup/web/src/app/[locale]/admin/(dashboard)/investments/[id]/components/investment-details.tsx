'use client';

import { ClipboardList, FileText, MapPin, PiggyBank, User } from 'lucide-react';
import { useMemo } from 'react';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Investment, InvestmentStatus } from '@/lib/types/investment';

const statusOptions: { value: InvestmentStatus; label: string }[] = [
  { value: 'active', label: 'Actif' },
  { value: 'pending', label: 'En attente' },
  { value: 'completed', label: 'Terminé' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'expired', label: 'Expiré' },
  { value: 'defaulted', label: 'En défaut' },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);

const formatPoints = (value: number) =>
  `${value.toLocaleString('fr-FR')} pts`;

const formatPercentage = (value: number | null) =>
  value === null || Number.isNaN(value)
    ? '—'
    : `${Number(value).toFixed(1)} %`;

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Non défini';

type InvestmentDetailsProps = {
  investment: Investment;
  isEditing: boolean;
  onChange: (patch: Partial<Investment>) => void;
};

export const InvestmentDetails = ({
  investment,
  isEditing,
  onChange,
}: InvestmentDetailsProps) => {
  const derived = useMemo(() => {
    const outstanding = Math.max(
      0,
      (investment.amount_points ?? 0) - (investment.returns_received_points ?? 0)
    );

    return {
      outstandingPoints: outstanding,
      expectedReturn: investment.expected_return_rate ?? null,
      createdAt: investment.created_at,
      updatedAt: investment.updated_at,
    };
  }, [investment]);

  const handleStatusChange = (value: InvestmentStatus) => {
    onChange({ status: value } as Partial<Investment>);
  };

  const handleExpectedReturnChange = (value: string) => {
    const parsed = value === '' ? null : Number(value);
    if (Number.isNaN(parsed)) {
      onChange({ expected_return_rate: null } as Partial<Investment>);
      return;
    }
    onChange({ expected_return_rate: parsed } as Partial<Investment>);
  };

  const handleDateChange = (field: keyof Investment, value: string) => {
    onChange({ [field]: value === '' ? null : value } as Partial<Investment>);
  };

  return (
    <DetailView variant="sections" className="space-y-6">
      <DetailView.Section title="Synthèse financière" icon={PiggyBank} span={2}>
        <DetailView.FieldGroup layout="grid-3">
          <DetailView.Field label="Statut">
            {isEditing ? (
              <Select
                value={investment.status ?? 'active'}
                onValueChange={value =>
                  handleStatusChange(value as InvestmentStatus)
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
              <div className="text-foreground font-medium">
                {statusOptions.find(option => option.value === investment.status)?.label ?? 'Actif'}
              </div>
            )}
          </DetailView.Field>

          <DetailView.Field label="Montant investi">
            <div className="text-foreground font-medium">
              {formatCurrency(investment.amount_eur ?? 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatPoints(investment.amount_points ?? 0)}
            </p>
          </DetailView.Field>

          <DetailView.Field label="Retours perçus">
            <div className="text-foreground font-medium">
              {formatPoints(investment.returns_received_points ?? 0)}
            </div>
            <p className="text-muted-foreground text-xs">
              Restant: {formatPoints(derived.outstandingPoints)}
            </p>
          </DetailView.Field>
        </DetailView.FieldGroup>

        <DetailView.FieldGroup layout="grid-3">
          <DetailView.Field label="Rendement attendu">
            {isEditing ? (
              <Input
                min={0}
                placeholder="Ex: 8.5"
                step={0.1}
                type="number"
                value={investment.expected_return_rate ?? ''}
                onChange={e => handleExpectedReturnChange(e.target.value)}
              />
            ) : (
              <div className="text-foreground font-medium">
                {formatPercentage(derived.expectedReturn)}
              </div>
            )}
          </DetailView.Field>

          <DetailView.Field label="Dernier retour">
            {isEditing ? (
              <Input
                type="date"
                value={investment.last_return_date ?? ''}
                onChange={e => handleDateChange('last_return_date', e.target.value)}
              />
            ) : (
              <div className="text-foreground font-medium">
                {formatDate(investment.last_return_date ?? null)}
              </div>
            )}
          </DetailView.Field>

          <DetailView.Field label="Maturité">
            {isEditing ? (
              <Input
                type="date"
                value={investment.maturity_date ?? ''}
                onChange={e => handleDateChange('maturity_date', e.target.value)}
              />
            ) : (
              <div className="text-foreground font-medium">
                {formatDate(investment.maturity_date ?? null)}
              </div>
            )}
          </DetailView.Field>
        </DetailView.FieldGroup>
      </DetailView.Section>

      <DetailView.Section title="Investisseur" icon={User}>
        <DetailView.FieldGroup layout="grid-2">
          <DetailView.Field label="Nom complet">
            <div className="text-foreground font-medium">
              {investment.user
                ? `${investment.user.first_name ?? ''} ${investment.user.last_name ?? ''}`.trim() || 'Nom indisponible'
                : 'Utilisateur inconnu'}
            </div>
          </DetailView.Field>
          <DetailView.Field label="Email">
            <div className="text-foreground font-medium">
              {investment.user?.email ?? 'Non défini'}
            </div>
          </DetailView.Field>
        </DetailView.FieldGroup>
      </DetailView.Section>

      <DetailView.Section title="Projet" icon={MapPin}>
        <DetailView.FieldGroup layout="grid-2">
          <DetailView.Field label="Intitulé">
            <div className="text-foreground font-medium">
              {investment.project?.name ?? 'Projet non attribué'}
            </div>
          </DetailView.Field>
          <DetailView.Field label="Type">
            <div className="text-foreground font-medium">
              {investment.project?.type ?? investment.investment_type ?? 'Non défini'}
            </div>
          </DetailView.Field>
          <DetailView.Field label="Partenaire">
            <div className="text-foreground font-medium">
              {investment.project?.producer?.name ?? 'Non défini'}
            </div>
          </DetailView.Field>
          <DetailView.Field label="Statut projet">
            <div className="text-foreground font-medium">
              {investment.project?.status ?? 'Non défini'}
            </div>
          </DetailView.Field>
        </DetailView.FieldGroup>
      </DetailView.Section>

      <DetailView.Section title="Historique" icon={ClipboardList}>
        <DetailView.FieldGroup layout="grid-3">
          <DetailView.Field label="Créé le">
            <div className="text-foreground font-medium">
              {formatDate(derived.createdAt ?? null)}
            </div>
          </DetailView.Field>
          <DetailView.Field label="Mis à jour le">
            <div className="text-foreground font-medium">
              {formatDate(derived.updatedAt ?? null)}
            </div>
          </DetailView.Field>
          <DetailView.Field label="Nombre de retours">
            <div className="text-foreground font-medium">
              {investment.returns_count}
            </div>
          </DetailView.Field>
        </DetailView.FieldGroup>
      </DetailView.Section>

      <DetailView.Section title="Notes" icon={FileText}>
        {isEditing ? (
          <Textarea
            placeholder="Ajouter une note de suivi..."
            rows={5}
            value={investment.notes ?? ''}
            onChange={e => onChange({ notes: e.target.value } as Partial<Investment>)}
          />
        ) : (
          <div className="text-muted-foreground whitespace-pre-wrap text-sm">
            {investment.notes ?? 'Aucune note enregistrée.'}
          </div>
        )}
      </DetailView.Section>
    </DetailView>
  );
};
