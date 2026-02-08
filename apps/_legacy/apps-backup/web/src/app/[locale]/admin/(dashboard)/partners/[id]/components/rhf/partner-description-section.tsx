'use client';

import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { TextArea } from '@/app/[locale]/admin/(dashboard)/components/ui/textarea';

import type { PartnerFormData } from '@make-the-change/api/validators/partner';

export const PartnerDescriptionSectionRHF: FC = () => {
  const t = useTranslations();
  const { control, formState } = useFormContext<PartnerFormData>();

  return (
    <DetailView.Section
      icon={FileText}
      title={t('admin.partners.edit.sections.description', {
        defaultValue: 'Présentation du partenaire',
      })}
    >
      <DetailView.Field
        label={t('admin.partners.edit.fields.description', {
          defaultValue: 'Description détaillée',
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
              rows={6}
              maxLength={2000}
              placeholder={t('admin.partners.edit.placeholders.description', {
                defaultValue: 'Décrivez le partenaire, ses missions et ses engagements…',
              })}
            />
          )}
        />
      </DetailView.Field>
    </DetailView.Section>
  );
};

