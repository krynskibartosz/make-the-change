'use client';

import { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslationContext } from '../../contexts/translation-context';
import type { SpeciesFormData } from '../../types/species-form.types';

export const StatusSection: FC = () => {
  const t = useTranslations();
  const { currentLanguage } = useTranslationContext();
  const { control } = useFormContext<SpeciesFormData>();

  const translationPath =
    currentLanguage === 'fr' ? '' : `translations.${currentLanguage}.`;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">
        {t('admin.biodex.sections.status')}
      </h2>

      <div className="space-y-4">
        <FormField
          control={control}
          name={`${translationPath}conservation_status`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.conservation_status')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${translationPath}protection_measures`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.protection_measures')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${translationPath}population_trend`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.population_trend')}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};