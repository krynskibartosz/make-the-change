'use client';

import { type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view';
import { Input } from '@/app/[locale]/admin/(dashboard)/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslationContext } from '../../contexts/translation-context';
import type { SpeciesFormData } from '../../types/species-form.types';
import type { AutoSaveReturn } from '@/hooks/use-optimistic-autosave';

type ContentLevelsSectionProps = {
  autoSave: AutoSaveReturn;
};

const LEVELS = [
  { key: 'beginner', label: 'Débutant', color: 'bg-green-50 border-green-200' },
  { key: 'intermediate', label: 'Intermédiaire', color: 'bg-blue-50 border-blue-200' },
  { key: 'advanced', label: 'Avancé', color: 'bg-purple-50 border-purple-200' },
] as const;

export const ContentLevelsSection: FC<ContentLevelsSectionProps> = ({ autoSave }) => {
  const t = useTranslations();
  const { currentLanguage } = useTranslationContext();
  const { control, formState } = useFormContext<SpeciesFormData>();

  return (
    <DetailView.Section
      icon={Layers}
      title={t('admin.biodex.sections.content_levels')}
      className="md:col-span-2"
    >
      <div className="space-y-4">
        {LEVELS.map((level) => (
          <div key={level.key} className={`rounded-lg border p-4 space-y-4 ${level.color}`}>
            <h3 className="font-medium text-sm uppercase tracking-wide">{level.label}</h3>
            
            <DetailView.Field
              label={t('admin.biodex.fields.level_title')}
              required
              error={formState.errors.content_levels?.[level.key]?.title?.message}
            >
              <Controller
                control={control}
                name={`content_levels.${level.key}.title`}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder={t('admin.biodex.placeholders.level_title')}
                    onBlur={() => {
                      field.onBlur();
                      void autoSave.saveNow();
                    }}
                  />
                )}
              />
            </DetailView.Field>

            <DetailView.Field
              label={t('admin.biodex.fields.level_description')}
              required
              error={formState.errors.content_levels?.[level.key]?.description?.message}
            >
              <Controller
                control={control}
                name={`content_levels.${level.key}.description`}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                    rows={3}
                    placeholder={t('admin.biodex.placeholders.level_description')}
                    onBlur={() => {
                      field.onBlur();
                      void autoSave.saveNow();
                    }}
                  />
                )}
              />
            </DetailView.Field>
          </div>
        ))}
      </div>
    </DetailView.Section>
  );
};