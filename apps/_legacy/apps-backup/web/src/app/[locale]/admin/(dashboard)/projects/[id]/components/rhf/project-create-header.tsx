'use client';

import { type FC } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

type ProjectCreateHeaderRHFProps = {
  isSubmitting: boolean;
  isDirty: boolean;
  onSubmit: () => void;
};

export const ProjectCreateHeaderRHF: FC<ProjectCreateHeaderRHFProps> = ({
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
          href={`/${locale}/admin/projects`}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('navigation.back', { defaultValue: 'Retour à la liste des projets' })}
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('admin.projects.create.title', { defaultValue: 'Créer un projet' })}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t('admin.projects.create.subtitle', {
              defaultValue:
                'Renseignez les informations ci-dessous pour publier un nouveau projet.',
            })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="text-sm text-muted-foreground">
          {isDirty
            ? t('admin.projects.create.status.dirty', {
                defaultValue: 'Modifications en cours…',
              })
            : t('admin.projects.create.status.pristine', {
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
              {t('admin.projects.create.actions.saving', {
                defaultValue: 'Création…',
              })}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t('admin.projects.create.actions.save', {
                defaultValue: 'Créer le projet',
              })}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

