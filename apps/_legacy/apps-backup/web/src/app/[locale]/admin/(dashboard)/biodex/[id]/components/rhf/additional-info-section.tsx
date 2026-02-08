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
import { Textarea } from '@/components/ui/textarea';
import { useTranslationContext } from '../../contexts/translation-context';
import type { SpeciesFormData } from '../../types/species-form.types';

export const AdditionalInfoSection: FC = () => {
  const t = useTranslations();
  const { currentLanguage } = useTranslationContext();
  const { control } = useFormContext<SpeciesFormData>();

  const translationPath =
    currentLanguage === 'fr' ? '' : `translations.${currentLanguage}.`;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">
        {t('admin.biodex.sections.additional_info')}
      </h2>

      <div className="space-y-4">
        <FormField
          control={control}
          name={`${translationPath}diet`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.diet')}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${translationPath}reproduction`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.reproduction')}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`${translationPath}interesting_facts`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.biodex.fields.interesting_facts')}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </section>
  );
};