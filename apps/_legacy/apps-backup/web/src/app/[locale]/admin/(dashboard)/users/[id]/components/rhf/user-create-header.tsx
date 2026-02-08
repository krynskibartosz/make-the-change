'use client';

import { type FC } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

type UserCreateHeaderRHFProps = {
  isDirty: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export const UserCreateHeaderRHF: FC<UserCreateHeaderRHFProps> = ({
  isDirty,
  isSubmitting,
  onSubmit,
}) => {
  const t = useTranslations();

  return (
    <div className="bg-background/90 supports-[backdrop-filter]:backdrop-blur flex flex-col gap-4 border-b px-6 py-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2">
        <div className="text-muted-foreground text-xs uppercase tracking-wide">
          {t('admin.users.create.breadcrumb', {
            defaultValue: 'Administration / Utilisateurs',
          })}
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('admin.users.create.title', { defaultValue: 'Nouvel utilisateur' })}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t('admin.users.create.subtitle', {
            defaultValue: 'Créez un compte en renseignant les informations clés.',
          })}
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <span className="text-muted-foreground text-sm">
          {isDirty
            ? t('admin.users.create.status.ready', {
                defaultValue: 'Formulaire prêt à être soumis',
              })
            : t('admin.users.create.status.clean', {
                defaultValue: 'Aucune modification en attente',
              })}
        </span>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting || !isDirty}
          onClick={onSubmit}
          type="button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('admin.users.create.actions.creating', {
                defaultValue: 'Création…',
              })}
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              {t('admin.users.create.actions.submit', {
                defaultValue: 'Créer le compte',
              })}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
