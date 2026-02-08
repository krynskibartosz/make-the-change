'use client';

import { type FC } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

type PartnerCreateHeaderRHFProps = {
  isSubmitting: boolean;
  isDirty: boolean;
  onSubmit: () => void;
};

export const PartnerCreateHeaderRHF: FC<PartnerCreateHeaderRHFProps> = ({
  isSubmitting,
  isDirty,
  onSubmit,
}) => {
  const t = useTranslations();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'fr';

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-3">
        <Link
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href={`/${locale}/admin/partners`}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('navigation.back', { defaultValue: 'Retour à la liste des partenaires' })}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('admin.partners.create.title', { defaultValue: 'Créer un partenaire' })}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t('admin.partners.create.subtitle', {
              defaultValue:
                'Complétez les informations pour référencer un nouveau partenaire.',
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="text-sm text-muted-foreground">
          {isDirty
            ? t('admin.partners.create.status.dirty', {
                defaultValue: 'Modifications en cours…',
              })
            : t('admin.partners.create.status.pristine', {
                defaultValue: 'Aucune modification en attente',
              })}
        </div>
        <Button
          className="inline-flex items-center gap-2"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <>
              <Save className="h-4 w-4 animate-spin" />
              {t('admin.partners.create.actions.saving', {
                defaultValue: 'Création…',
              })}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t('admin.partners.create.actions.save', {
                defaultValue: 'Créer le partenaire',
              })}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

