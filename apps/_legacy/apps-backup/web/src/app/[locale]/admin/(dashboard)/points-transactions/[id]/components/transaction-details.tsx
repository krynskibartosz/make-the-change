'use client';

import {
  FileText,
  Info,
  Link as LinkIcon,
  Calendar,
  Database,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { cn } from '@/app/[locale]/admin/(dashboard)/components/cn';

type TransactionDetailsProps = {
  transaction: any;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Non défini';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

const getReferenceLink = (referenceType: string | null, referenceId: string | null) => {
  if (!referenceType || !referenceId) return null;

  switch (referenceType) {
    case 'order':
      return `/admin/orders/${referenceId}`;
    case 'investment':
      return `/admin/investments/${referenceId}`;
    case 'subscription':
      return `/admin/subscriptions/${referenceId}`;
    default:
      return null;
  }
};

export const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  const t = useTranslations();
  const referenceLink = getReferenceLink(transaction.reference_type, transaction.reference_id);

  return (
    <DetailView variant="sections" className="space-y-6">
      {/* Transaction Information */}
      <DetailView.Section title="Informations de la transaction" icon={Info} span={2}>
        <DetailView.FieldGroup layout="grid-3">
          <DetailView.Field label={t('admin.pointsTransactions.details.transaction_id')}>
            <div className="font-mono text-xs text-foreground/80 break-all">
              {transaction.id}
            </div>
          </DetailView.Field>

          <DetailView.Field label={t('admin.pointsTransactions.columns.type')}>
            <div className="font-medium text-foreground">
              {t(`admin.pointsTransactions.types.${transaction.type}`)}
            </div>
          </DetailView.Field>

          <DetailView.Field label={t('admin.pointsTransactions.columns.amount')}>
            <div
              className={cn(
                'text-lg font-bold',
                transaction.amount > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              )}
            >
              {transaction.amount > 0 && '+'}
              {transaction.amount.toLocaleString()} pts
            </div>
          </DetailView.Field>
        </DetailView.FieldGroup>

        <DetailView.FieldGroup layout="grid-2">
          <DetailView.Field label={t('admin.pointsTransactions.columns.balance')}>
            <div className="text-lg font-semibold text-foreground">
              {transaction.balance_after.toLocaleString()} pts
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Solde après cette transaction
            </p>
          </DetailView.Field>

          {transaction.expires_at && (
            <DetailView.Field label={t('admin.pointsTransactions.details.expires_at')}>
              <div className="font-medium text-foreground">
                {formatDate(transaction.expires_at)}
              </div>
            </DetailView.Field>
          )}
        </DetailView.FieldGroup>
      </DetailView.Section>

      {/* Description */}
      {transaction.description && (
        <DetailView.Section title="Description" icon={FileText} span={2}>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
              {transaction.description}
            </p>
          </div>
        </DetailView.Section>
      )}

      {/* Reference */}
      {transaction.reference_id && transaction.reference_type && (
        <DetailView.Section title="Référence" icon={LinkIcon} span={2}>
          <DetailView.FieldGroup layout="grid-2">
            <DetailView.Field label="Type de référence">
              <div className="font-medium text-foreground">
                {t(`admin.pointsTransactions.references.${transaction.reference_type}`)}
              </div>
            </DetailView.Field>

            <DetailView.Field label="Identifiant">
              <div className="font-mono text-xs text-foreground/80 break-all">
                {transaction.reference_id}
              </div>
            </DetailView.Field>
          </DetailView.FieldGroup>

          {referenceLink && (
            <div className="mt-4">
              <Link
                href={referenceLink}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-4 py-2',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90 transition-colors',
                  'text-sm font-medium'
                )}
              >
                <LinkIcon className="h-4 w-4" />
                {t('admin.pointsTransactions.details.view_reference')}
              </Link>
            </div>
          )}
        </DetailView.Section>
      )}

      {/* Metadata */}
      {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
        <DetailView.Section title="Métadonnées" icon={Database} span={2}>
          <div className="rounded-lg border border-border bg-muted/30 p-4 overflow-x-auto">
            <pre className="text-xs text-foreground/80 font-mono">
              {JSON.stringify(transaction.metadata, null, 2)}
            </pre>
          </div>
        </DetailView.Section>
      )}

      {/* Timestamps */}
      <DetailView.Section title="Horodatage" icon={Clock} span={2}>
        <DetailView.FieldGroup layout="grid-3">
          <DetailView.Field label={t('admin.pointsTransactions.details.created_at')}>
            <div className="text-sm text-foreground">
              {formatDate(transaction.created_at)}
            </div>
          </DetailView.Field>

          {transaction.processed_at && (
            <DetailView.Field label={t('admin.pointsTransactions.details.processed_at')}>
              <div className="text-sm text-foreground">
                {formatDate(transaction.processed_at)}
              </div>
            </DetailView.Field>
          )}

          {transaction.updated_at && (
            <DetailView.Field label="Dernière mise à jour">
              <div className="text-sm text-foreground">
                {formatDate(transaction.updated_at)}
              </div>
            </DetailView.Field>
          )}
        </DetailView.FieldGroup>
      </DetailView.Section>
    </DetailView>
  );
};
