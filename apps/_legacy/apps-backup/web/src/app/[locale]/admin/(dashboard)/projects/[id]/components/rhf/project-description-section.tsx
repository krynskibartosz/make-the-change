'use client';

import { type FC } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';

import type { ProjectFormData } from '@/lib/validators/project';

export const ProjectDescriptionSectionRHF: FC = () => {
  const t = useTranslations();
  const { control, formState } = useFormContext<ProjectFormData>();
  const targetBudget = useWatch({ control, name: 'target_budget' }) ?? 0;
  const longDescription = useWatch({ control, name: 'long_description' }) ?? '';

  return (
    <DetailView.Section
      icon={FileText}
      title={t('admin.projects.edit.sections.description', {
        defaultValue: 'Description du projet',
      })}
    >
      <DetailView.Field
        label={t('admin.projects.edit.fields.description', {
          defaultValue: 'Description courte',
        })}
        error={formState.errors.description?.message}
      >
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextArea
              {...field}
              value={field.value ?? ''}
              rows={3}
              maxLength={500}
              placeholder={t('admin.projects.edit.placeholders.description', {
                defaultValue: 'Résumé du projet…',
              })}
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.projects.edit.fields.long_description', {
          defaultValue: 'Description détaillée',
        })}
        error={formState.errors.long_description?.message}
      >
        <Controller
          control={control}
          name="long_description"
          render={({ field }) => (
            <TextArea
              {...field}
              value={field.value ?? ''}
              rows={6}
              maxLength={5000}
              placeholder={t('admin.projects.edit.placeholders.long_description', {
                defaultValue: 'Détaillez le projet, ses objectifs et son impact…',
              })}
            />
          )}
        />
      </DetailView.Field>

      {targetBudget > 5000 && longDescription.trim().length === 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          ℹ️ {t('admin.projects.edit.messages.long_description_required', {
            defaultValue:
              'Une description détaillée est requise pour les projets avec un budget supérieur à 5000€.',
          })}
        </div>
      )}

      <div className="border-border/40 text-xs text-muted-foreground rounded-md border border-dashed bg-muted/30 px-3 py-2">
        {t('admin.projects.edit.helpers.location_hint', {
          defaultValue:
            'Les informations géographiques avancées (coordonnées GPS, carte) seront gérées dans une future version.',
        })}
      </div>
    </DetailView.Section>
  );
};
