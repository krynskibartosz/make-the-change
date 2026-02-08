'use client';

import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslationContext } from '../../contexts/translation-context';
import { type SpeciesFormData } from '../../types/species-form.types';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';

type EssentialInfoSectionProps = {
  autoSave: AutoSaveReturn;
};

export const EssentialInfoSection: FC<EssentialInfoSectionProps> = ({ autoSave }) => {
  const t = useTranslations();
  const { currentLanguage } = useTranslationContext();
  const { control, formState } = useFormContext<SpeciesFormData>();

  return (
    <DetailView.Section
      icon={FileText}
      title={t('admin.biodex.sections.essential_info')}
    >
      <DetailView.Field
        label={t('admin.biodex.fields.name')}
        required
        error={formState.errors.name?.message}
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              placeholder={t('admin.biodex.placeholders.name')}
              onBlur={() => {
                field.onBlur();
                void autoSave.saveNow();
              }}
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.biodex.fields.scientific_name')}
        error={formState.errors.scientific_name?.message}
      >
        <Controller
          control={control}
          name="scientific_name"
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              className="italic"
              placeholder={t('admin.biodex.placeholders.scientific_name')}
              onBlur={() => {
                field.onBlur();
                void autoSave.saveNow();
              }}
            />
          )}
        />
      </DetailView.Field>

      <DetailView.Field
        label={t('admin.biodex.fields.description')}
        error={formState.errors.description?.message}
      >
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value ?? ''}
              rows={4}
              placeholder={t('admin.biodex.placeholders.description')}
              onBlur={() => {
                field.onBlur();
                void autoSave.saveNow();
              }}
            />
          )}
        />
      </DetailView.Field>
    </DetailView.Section>
  );
};